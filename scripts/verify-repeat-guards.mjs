import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import {
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  readlink,
  realpath,
  rm,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { runWorkspaceVp } from "../packages/create/src/workspace.mjs";
import { tmpdir } from "./temp-directory.mjs";

const cli = fileURLToPath(new URL("../packages/create/bin/cli.mjs", import.meta.url));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function snapshot(directory) {
  const files = {};
  async function visit(relative = "") {
    for (const entry of (await readdir(join(directory, relative), { withFileTypes: true })).sort(
      (a, b) => a.name.localeCompare(b.name),
    )) {
      if (["node_modules", ".git", "dist"].includes(entry.name)) continue;
      const path = relative ? relative + "/" + entry.name : entry.name;
      if (entry.isSymbolicLink()) files[path] = { link: await readlink(join(directory, path)) };
      else if (entry.isDirectory()) await visit(path);
      else {
        const metadata = await lstat(join(directory, path));
        files[path] = {
          hash: digest(await readFile(join(directory, path))),
          mtime: metadata.mtimeMs,
        };
      }
    }
  }
  await visit();
  return files;
}

// Real tools create and build the fixtures. Only negative/no-op commands load a
// child-process probe: an unexpected installer or formatter must fail the check.
export async function verifyRepeatGuards() {
  const parent = tmpdir(),
    root = await mkdtemp(join(parent, "adui-repeat-guards-"));
  assert.equal(dirname(root), parent);
  assert.ok(basename(root).startsWith("adui-repeat-guards-"));
  const cwd = join(root, "验收 目录 & 'work");
  function run(args) {
    const result = spawnSync(process.execPath, [cli, ...args], { cwd, stdio: "inherit" });
    if (result.error) throw result.error;
    assert.equal(result.status, 0, "CLI 正向步骤失败");
  }
  const probe = join(root, "probe.mjs"),
    probeLog = join(root, "spawn.jsonl");
  const cases = [];
  try {
    await mkdir(cwd);
    await writeFile(
      probe,
      `import childProcess from 'node:child_process';
import {appendFileSync} from 'node:fs';
import {syncBuiltinESMExports} from 'node:module';
childProcess.spawnSync = (...args) => {
  appendFileSync(${JSON.stringify(probeLog)}, JSON.stringify(args.slice(0,2))+'\\n');
  throw Error('回归探针：保护分支不应启动子进程');
};
syncBuiltinESMExports();\n`,
    );
    const config = join(root, "batch.json");
    await writeFile(
      config,
      JSON.stringify({
        version: 1,
        name: "repeat-workspace",
        apps: [
          { name: "admin", framework: "vue" },
          { name: "portal", framework: "react", language: "js" },
        ],
      }),
    );
    run(["--config", config]);
    const workspace = join(cwd, "repeat-workspace");
    for (const [name, framework, language, ui, css, app] of [
      ["admin", "vue", "ts", "element-plus", "tailwindcss", "App.vue"],
      ["portal", "react", "js", "antd", "unocss", "App.jsx"],
    ]) {
      const directory = join(workspace, "apps", name),
        appPath = join(directory, "src", app);
      const marker = framework === "vue" ? "<!-- business-marker -->\n" : "// business-marker\n";
      await writeFile(appPath, marker + (await readFile(appPath, "utf8")));
      runWorkspaceVp(directory, ["fmt", "src/" + app, "--write"]);
      const businessHash = digest(await readFile(appPath));
      const base = [
        "--workspace",
        workspace,
        "--name",
        name,
        "--type",
        "application",
        "--framework",
        framework,
        "--language",
        language,
      ];
      const install = [...base, "--ui", ui, "--css", css, "--screen", "--apply-existing"];
      const smoke = [...base, "--ui", ui, "--css", css, "--ui-smoke"];
      run(install);
      run(smoke);
      assert.equal(digest(await readFile(appPath)), businessHash, "业务 App 被补装改写");
      cases.push({ name, base, install, smoke, businessHash, appPath });
    }
    runWorkspaceVp(workspace, ["run", "ready"]);
    runWorkspaceVp(workspace, ["check"]);
    const before = await snapshot(workspace),
      results = [];
    for (const current of cases) {
      for (const [kind, args, expectedExit, reason] of [
        ["repeat-addons", current.install, 1, /阶段：补装预检/],
        [
          "repeat-css",
          [
            ...current.base,
            "--ui",
            "none",
            "--css",
            current.install[current.install.indexOf("--css") + 1],
            "--apply-existing",
          ],
          1,
          /创建失败/,
        ],
        ["repeat-smoke", current.smoke, 1, /阶段：UI 验收页/],
        [
          "base-styles-noop",
          [...current.base, "--ui", "none", "--css", "none", "--apply-existing"],
          0,
          undefined,
        ],
      ]) {
        const result = spawnSync(
          process.execPath,
          ["--import", pathToFileURL(probe).href, cli, ...args],
          {
            cwd,
            encoding: "utf8",
            timeout: 30000,
          },
        );
        if (result.error) throw result.error;
        assert.equal(result.status, expectedExit, `${current.name}/${kind}: ${result.stderr}`);
        if (reason) assert.match(result.stderr, reason);
        await assert.rejects(lstat(probeLog), { code: "ENOENT" });
        assert.deepEqual(await snapshot(workspace), before, `${current.name}/${kind} 改写了文件`);
        results.push({ app: current.name, kind, exitCode: result.status, toolCalls: 0 });
      }
      assert.equal(digest(await readFile(current.appPath)), current.businessHash);
    }
    return {
      platform: process.platform,
      node: process.version,
      uid: typeof process.getuid === "function" ? process.getuid() : null,
      profiles: cases.length,
      guardedCommands: results,
      unchangedFiles: Object.keys(before).length,
      appHashes: Object.fromEntries(cases.map((item) => [item.name, item.businessHash])),
      ready: true,
      postBuildCheck: true,
      temporaryRootRemoved: true,
    };
  } finally {
    assert.equal(dirname(resolve(root)), parent);
    assert.ok(!(await lstat(root)).isSymbolicLink());
    assert.equal(await realpath(root), root);
    await rm(root, { recursive: true, force: true });
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    console.log(JSON.stringify(await verifyRepeatGuards(), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

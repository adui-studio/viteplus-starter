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
export async function verifyRepeatGuards({ models = false } = {}) {
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
  const cases = [],
    installFailures = [];
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
          { name: "admin", framework: "vue", ...(models ? { screen: true } : {}) },
          {
            name: "portal",
            framework: "react",
            language: "js",
            ...(models ? { screen: true } : {}),
          },
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
      const mode = framework === "vue" ? "embedded" : "external";
      const install = models
        ? [
            ...base,
            "--engine",
            "three",
            "--model-protection",
            mode,
            "--smoke-pages",
            "--apply-existing",
          ]
        : [...base, "--ui", ui, "--css", css, "--screen", "--apply-existing"];
      const smoke = [...base, "--ui", ui, "--css", css, "--ui-smoke"];
      if (models) {
        const before = await snapshot(workspace);
        const preload = join(root, name + "-install.mjs"),
          calls = join(root, name + "-install.log");
        await writeFile(
          preload,
          `import childProcess from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {syncBuiltinESMExports} from 'node:module';
childProcess.spawnSync = (command,args) => {
  const invocation=Array.isArray(args)?[command,...args].join(' '):String(command);
  writeFileSync(${JSON.stringify(calls)},invocation,{flag:'wx'});
  return {status:23};
};
syncBuiltinESMExports();\n`,
        );
        const failed = spawnSync(
          process.execPath,
          ["--import", pathToFileURL(preload).href, cli, ...install],
          { cwd, encoding: "utf8", timeout: 30000 },
        );
        if (failed.error) throw failed.error;
        assert.equal(failed.status, 23, failed.stderr);
        assert.match(failed.stderr, /阶段：Three 集成/);
        assert.match(await readFile(calls, "utf8"), /^vp add three@0\.186\.1 --save-exact$/);
        assert.deepEqual(await snapshot(workspace), before, "受控安装失败后改写了工作区");
        installFailures.push({ app: name, exitCode: 23, toolCalls: 1, unchanged: true });
      }
      run(install);
      if (models) {
        // Minimal self-contained GLB: pipeline fixture only, no browser rendering claim.
        const json = Buffer.from('{"asset":{"version":"2.0"}}'.padEnd(28, " "));
        const glb = Buffer.alloc(20 + json.length);
        glb.writeUInt32LE(0x46546c67);
        glb.writeUInt32LE(2, 4);
        glb.writeUInt32LE(glb.length, 8);
        glb.writeUInt32LE(json.length, 12);
        glb.writeUInt32LE(0x4e4f534a, 16);
        glb.set(json, 20);
        await writeFile(join(directory, "src/models/pipeline.glb"), glb, { flag: "wx" });
        const verification = spawnSync(
          process.execPath,
          [fileURLToPath(new URL("./verify-model-app.mjs", import.meta.url)), directory],
          { cwd, stdio: "inherit" },
        );
        if (verification.error) throw verification.error;
        assert.equal(verification.status, 0, "模型双入口/密文验收失败");
      } else run(smoke);
      assert.equal(digest(await readFile(appPath)), businessHash, "业务 App 被补装改写");
      cases.push({ name, base, install, smoke, mode, businessHash, appPath });
    }
    runWorkspaceVp(workspace, ["run", "ready"]);
    runWorkspaceVp(workspace, ["check"]);
    const before = await snapshot(workspace),
      results = [];
    for (const current of cases) {
      const guards = models
        ? [
            ["repeat-model-addons", current.install, 1, /阶段：补装预检/],
            [
              "change-model-mode",
              [
                ...current.base,
                "--engine",
                "three",
                "--model-protection",
                current.mode === "embedded" ? "external" : "embedded",
                "--apply-existing",
              ],
              1,
              /阶段：补装预检/,
            ],
            ["repeat-three-smoke", [...current.base, "--three-smoke"], 1, /阶段：Three 集成/],
          ]
        : [
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
          ];
      guards.push([
        "base-styles-noop",
        [...current.base, "--ui", "none", "--css", "none", "--apply-existing"],
        0,
        undefined,
      ]);
      for (const [kind, args, expectedExit, reason] of guards) {
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
      modelBuilds: models ? cases.length : 0,
      controlledInstallFailures: installFailures,
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
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 1 || args[0] !== "--models"))
      throw new Error("用法：node scripts/verify-repeat-guards.mjs [--models]");
    console.log(
      JSON.stringify(await verifyRepeatGuards({ models: args.includes("--models") }), null, 2),
    );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

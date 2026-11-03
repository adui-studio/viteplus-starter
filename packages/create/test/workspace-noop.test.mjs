import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, readFile, readdir, stat, rm } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { addBaseStyles } from "../src/base-styles.mjs";
import { tmpdir } from "../../../scripts/temp-directory.mjs";

const cli = fileURLToPath(new URL("../bin/cli.mjs", import.meta.url));

async function snapshot(directory) {
  const files = {};
  for (const name of await readdir(directory, { recursive: true })) {
    const path = join(directory, name),
      metadata = await stat(path);
    if (metadata.isFile()) files[name] = { bytes: await readFile(path), mtime: metadata.mtimeMs };
  }
  return files;
}

for (const [framework, language, main, app] of [
  ["vue", "ts", "main.ts", "App.vue"],
  ["react", "js", "main.jsx", "App.jsx"],
]) {
  test(`${framework} 工作区空补装不启动子进程，保留全部文件内容与修改时间`, async (t) => {
    const parent = await mkdtemp(join(tmpdir(), "adui-workspace-noop-"));
    t.after(() => rm(parent, { recursive: true, force: true }));
    const root = join(parent, "space & '目录"),
      target = join(root, "apps", "business");
    async function put(path, source) {
      await mkdir(dirname(path), { recursive: true });
      await writeFile(path, source);
    }
    await put(
      join(root, "package.json"),
      JSON.stringify({ private: true, devDependencies: { "vite-plus": "1" } }),
    );
    await put(
      join(root, "pnpm-workspace.yaml"),
      "packages:\n  - 'apps/*'\n\n# business settings\n",
    );
    await put(join(root, "vite.config.ts"), "export default defineConfig({run:{cache:true}})\n");
    await put(
      join(target, "package.json"),
      JSON.stringify({ name: "business", dependencies: { "vite-plus": "1", [framework]: "3" } }),
    );
    await put(join(target, "vite.config.ts"), "export default defineConfig({plugins:[]})\n");
    await put(join(target, "src", main), "// business mount\n");
    await put(join(target, "src", app), "// business homepage\n");
    await addBaseStyles(target, { type: "application", framework, language }, () => {});
    const probe = join(parent, "probe.mjs"),
      calls = join(parent, "calls.log");
    await writeFile(
      probe,
      `import childProcess from 'node:child_process';
import {writeFileSync} from 'node:fs';
import {syncBuiltinESMExports} from 'node:module';
childProcess.spawnSync = () => {
  writeFileSync(${JSON.stringify(calls)}, 'unexpected child');
  throw Error('empty addon must not run installer or formatter');
};
syncBuiltinESMExports();\n`,
    );
    const before = await snapshot(root);
    const result = spawnSync(
      process.execPath,
      [
        "--import",
        pathToFileURL(probe).href,
        cli,
        "--workspace",
        root,
        "--name",
        "business",
        "--type",
        "application",
        "--framework",
        framework,
        "--language",
        language,
        "--ui",
        "none",
        "--css",
        "none",
        "--apply-existing",
      ],
      { encoding: "utf8" },
    );
    assert.equal(result.status, 0, result.stderr);
    await assert.rejects(readFile(calls), { code: "ENOENT" });
    assert.deepEqual(await snapshot(root), before);
  });
}

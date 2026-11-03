import assert from "node:assert/strict";
import test from "node:test";
import { mkdtemp, mkdir, writeFile, readFile, readdir, stat, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";
import { tmpdir } from "../../../scripts/temp-directory.mjs";
import { addBaseStyles } from "../src/base-styles.mjs";
import { addScreenPreset } from "../src/screen.mjs";

const cli = fileURLToPath(new URL("../bin/cli.mjs", import.meta.url));
async function snapshot(directory) {
  const files = {};
  for (const name of await readdir(directory, { recursive: true })) {
    const path = join(directory, name),
      metadata = await stat(path);
    if (metadata.isFile())
      files[name.replaceAll("\\", "/")] = { bytes: await readFile(path), mtime: metadata.mtimeMs };
  }
  return files;
}
async function fixture(t, framework, language, mode) {
  const parent = await mkdtemp(join(tmpdir(), "adui-model-addon-")),
    root = join(parent, "business");
  t.after(() => rm(parent, { recursive: true, force: true }));
  async function put(path, source) {
    await mkdir(dirname(join(root, path)), { recursive: true });
    await writeFile(join(root, path), source);
  }
  const main = framework === "vue" ? "src/main.ts" : "src/main.jsx";
  const app = framework === "vue" ? "src/App.vue" : "src/App.jsx";
  const options = { name: "business", type: "application", framework, language, screen: true };
  await put(
    "package.json",
    JSON.stringify({
      dependencies: {
        "vite-plus": "1",
        [framework]: "3",
        three: "0.186.1",
        "@types/three": "0.186.0",
      },
      scripts: { build: "vp build" },
    }),
  );
  await put(
    "vite.config.ts",
    "import {defineConfig} from 'vite-plus'; export default defineConfig({plugins:[]})\n",
  );
  await put(".gitignore", "dist/\n");
  await put(main, "// business mount\n");
  await put(app, "// business homepage\n");
  await addBaseStyles(root, options, () => {});
  await addScreenPreset(root, options, () => {});
  const args = [
    cli,
    "--name",
    "business",
    "--type",
    "application",
    "--framework",
    framework,
    "--language",
    language,
    "--engine",
    "three",
    "--model-protection",
    mode,
    "--apply-existing",
  ];
  async function invoke(kind) {
    const probe = join(parent, kind + ".mjs");
    await writeFile(
      probe,
      `import childProcess from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
childProcess.spawnSync = (command,args) => {
  const invocation=Array.isArray(args)?[command,...args].join(' '):String(command);
  if (${JSON.stringify(kind)}==='late' && invocation.startsWith('vp fmt '))
    return {status:invocation.includes('adui-model-build')?29:0};
  throw Error('unexpected child process');
};
syncBuiltinESMExports();\n`,
    );
    return spawnSync(process.execPath, ["--import", pathToFileURL(probe).href, ...args], {
      cwd: parent,
      encoding: "utf8",
    });
  }
  return { root, main, app, invoke };
}

for (const [framework, language, mode] of [
  ["vue", "ts", "embedded"],
  ["react", "js", "external"],
]) {
  test(`${framework} 已有模型插件配置在补装预检拒绝，不启动安装或写入`, async (t) => {
    const { root, invoke } = await fixture(t, framework, language, mode);
    for (const marker of ["aduiModels()", "/* adui-model-build custom plugin */"]) {
      await writeFile(
        join(root, "vite.config.ts"),
        `import {defineConfig} from 'vite-plus'; export default defineConfig({plugins:[${marker}]})\n`,
      );
      const before = await snapshot(root),
        result = await invoke("blocked");
      assert.equal(result.status, 1, result.stderr);
      assert.match(result.stderr, /阶段：补装预检.*模型插件已配置/s);
      assert.doesNotMatch(result.stderr, /unexpected child process/);
      assert.deepEqual(await snapshot(root), before);
    }
  });
  test(`${framework} 模型格式化中断保留KEY、备份与业务文件，重复调用拒绝覆盖`, async (t) => {
    const { root, main, app, invoke } = await fixture(t, framework, language, mode);
    const before = await snapshot(root),
      first = await invoke("late");
    assert.equal(first.status, 29, first.stderr);
    assert.match(first.stderr, /阶段：模型保护集成/);
    const key = await readFile(join(root, ".env.local"));
    assert.match(key.toString(), /ADUI_MODEL_KEY=/);
    for (const path of [main, app])
      assert.deepEqual(await readFile(join(root, path)), before[path].bytes);
    for (const path of ["vite.config.ts", "package.json", ".gitignore"])
      assert.deepEqual(
        await readFile(join(root, path + ".before-adui-models")),
        before[path].bytes,
      );
    assert.ok(!first.stderr.includes(key.toString()));
    const interrupted = await snapshot(root),
      again = await invoke("blocked");
    assert.equal(again.status, 1, again.stderr);
    assert.match(again.stderr, /阶段：补装预检/);
    assert.doesNotMatch(again.stderr, /unexpected child process/);
    assert.deepEqual(await snapshot(root), interrupted);
  });
}

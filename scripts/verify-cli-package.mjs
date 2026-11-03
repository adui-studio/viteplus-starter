import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { lstat, mkdir, mkdtemp, readFile, readdir, realpath, rm, stat } from "node:fs/promises";
import { basename, dirname, isAbsolute, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "./temp-directory.mjs";
import { verifyRepeatGuards } from "./verify-repeat-guards.mjs";

async function npmEntrypoint() {
  const candidates = [
    process.env.npm_execpath,
    join(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"),
    resolve(dirname(process.execPath), "../lib/node_modules/npm/bin/npm-cli.js"),
  ];
  for (const path of candidates) {
    if (!path || !isAbsolute(path) || basename(path) !== "npm-cli.js") continue;
    try {
      if ((await stat(path)).isFile()) return path;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  throw new Error("找不到 npm JS 入口，请使用包含 npm 的 Node 运行时");
}

export async function verifyCliPackage(input) {
  const tarball = await realpath(resolve(input));
  assert.ok((await lstat(tarball)).isFile() && tarball.endsWith(".tgz"), "需要本地 tgz 文件");
  const report = JSON.parse(await readFile(join(dirname(tarball), "pack-contents.json"), "utf8"));
  const source = JSON.parse(
    await readFile(new URL("../packages/create/package.json", import.meta.url), "utf8"),
  );
  const integrity =
    "sha512-" +
    createHash("sha512")
      .update(await readFile(tarball))
      .digest("base64");
  assert.equal(integrity, report.integrity, "候选包完整性不匹配");
  assert.equal(report.integrityVerified, true);
  assert.equal(report.name, source.name);
  assert.equal(report.version, source.version, "候选版本与源码清单不一致");
  const npm = await npmEntrypoint(),
    parent = tmpdir(),
    root = await mkdtemp(join(parent, "adui-cli-verify-"));
  assert.equal(dirname(root), parent);
  assert.ok(basename(root).startsWith("adui-cli-verify-"));
  try {
    const prefix = join(root, "install"),
      cwd = join(root, "验收 & '目录");
    await mkdir(cwd);
    const install = spawnSync(
      process.execPath,
      [
        npm,
        "install",
        "--prefix",
        prefix,
        "--ignore-scripts",
        "--no-audit",
        "--no-fund",
        "--package-lock=false",
        "--no-save",
        tarball,
      ],
      { cwd, stdio: "inherit" },
    );
    if (install.error) throw install.error;
    assert.equal(install.status, 0, "候选包隔离安装失败");
    const directory = join(prefix, "node_modules", "@adui", "viteplus-starter");
    const manifest = JSON.parse(await readFile(join(directory, "package.json"), "utf8"));
    assert.equal(manifest.name, source.name);
    assert.equal(manifest.version, source.version);
    assert.deepEqual(manifest.bin, { "viteplus-starter": "packages/create/bin/cli.mjs" });
    const cli = join(directory, manifest.bin["viteplus-starter"]);
    const bin = join(
      prefix,
      "node_modules/.bin/viteplus-starter" + (process.platform === "win32" ? ".cmd" : ""),
    );
    // CMD expands percent/bang even inside quotes. Reject such tool paths;
    // project/caller paths are passed as cwd data and never interpolated.
    if (process.platform === "win32")
      assert.doesNotMatch(bin, /["%!\r\n]/, "不支持该临时工具路径的CMD元字符");
    function invoke(args) {
      const result =
        process.platform === "win32"
          ? spawnSync('"' + bin + '" ' + args.join(" "), {
              cwd,
              encoding: "utf8",
              shell: true,
              timeout: 30000,
            })
          : spawnSync(bin, args, { cwd, encoding: "utf8", timeout: 30000 });
      if (result.error) throw result.error;
      assert.equal(result.status, 0, result.stderr);
      return result.stdout;
    }
    assert.match(invoke(["--help"]), /ADui Vite\+ Starter/);
    for (const [name, framework, language, ui, css] of [
      ["candidate-vue", "vue", "ts", "element-plus", "tailwindcss"],
      ["candidate-react", "react", "js", "antd", "unocss"],
    ]) {
      const plan = JSON.parse(
        invoke([
          "--name",
          name,
          "--type",
          "application",
          "--framework",
          framework,
          "--language",
          language,
          "--ui",
          ui,
          "--css",
          css,
          "--screen",
          "--dry-run",
        ]),
      );
      assert.equal(plan.cwd, cwd);
      assert.equal(plan.target, join(cwd, name));
    }
    assert.deepEqual(await readdir(cwd), [], "帮助或预览创建了项目文件");
    const regression = await verifyRepeatGuards({ models: true, cli });
    return {
      name: manifest.name,
      version: manifest.version,
      integrity,
      binHelp: true,
      binPreviews: 2,
      installedCli: true,
      regression,
      temporaryInstallRemoved: true,
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
    if (args.length !== 1)
      throw new Error(
        "用法：node scripts/verify-cli-package.mjs <本地tgz>（同目录需有pack-contents.json）",
      );
    console.log(JSON.stringify(await verifyCliPackage(args[0]), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

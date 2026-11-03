import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, symlink, readdir, rm } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { tmpdir } from "../../../scripts/temp-directory.mjs";
import { inspectPath } from "../src/safe-paths.mjs";

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), "adui-temp-alias-"));
  assert.equal(dirname(root), tmpdir());
  assert.ok(basename(root).startsWith("adui-temp-alias-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}

test("系统临时根先解析真实路径，仍拒绝输出路径中的未知链接", async (t) => {
  const root = await fixture(t),
    actual = join(root, "physical"),
    alias = join(root, "temporary-alias");
  await mkdir(actual);
  await symlink(actual, alias, process.platform === "win32" ? "junction" : "dir");
  assert.equal(tmpdir(alias), actual);
  await assert.rejects(inspectPath(join(alias, "output")), /不允许符号链接或 junction/);
  assert.deepEqual(await readdir(actual), []);
});

test("不存在的临时根拒绝且不创建目录", async (t) => {
  const root = await fixture(t);
  assert.throws(() => tmpdir(join(root, "missing")), { code: "ENOENT" });
  assert.deepEqual(await readdir(root), []);
});

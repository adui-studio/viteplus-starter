import assert from "node:assert/strict";
import test from "node:test";
import { verifyCliPackage } from "../../../scripts/verify-cli-package.mjs";
import {
  verifyRepeatGuards,
  normalizeVerificationLanguages,
} from "../../../scripts/verify-repeat-guards.mjs";

test("验收入口在文件或安装操作前拒绝非法模式和语言，保留默认组合", async () => {
  assert.deepEqual(normalizeVerificationLanguages(), { vue: "ts", react: "js" });
  for (const options of [
    { models: "false" },
    { languages: null },
    { languages: [] },
    { languages: { vue: "js" } },
    { languages: { vue: "js", react: "ts", extra: "private" } },
    { languages: { vue: "js & unexpected", react: "ts" } },
    { languages: { vue: "js", react: "ts%PATH%" } },
    { languages: { vue: "js", react: "ts\nunexpected" } },
  ]) {
    // This file deliberately does not exist: option rejection must precede I/O.
    await assert.rejects(verifyCliPackage("not-an-installed-candidate.tgz", options), /验收/);
    await assert.rejects(verifyRepeatGuards(options), /验收/);
  }
});

test("语言映射复制后冻结，调用者后续修改不进入异步命令参数", () => {
  const input = { vue: "js", react: "ts" },
    languages = normalizeVerificationLanguages(input);
  input.vue = "js & unexpected";
  assert.deepEqual(languages, { vue: "js", react: "ts" });
  assert.throws(() => {
    languages.react = "changed";
  }, TypeError);
});

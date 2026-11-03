# 手动发布

CLI 版本以 `packages/create/package.json` 为准，Git 标签和 GitHub Release 使用 `v<版本>`，npm 使用不带 v 的同一版本。开发工作区根保持 `0.0.0/private:true`。已有 npm 版本不可覆盖；版本选择基于上一公开包的实际差异，不因新仓库没有标签就重新从1.0.0开始。

## 准备与检查

1. 核对用户授权的发布范围、当前公开版本和未提交修改；保护无关文件。
2. 根据使用者可见变化选择 SemVer，更新 CLI 版本、两份 README 的候选版本和 `CHANGELOG.md`。
3. 运行 `node --test`、`node scripts/validate-docs.mjs`、`vp check`。
4. 执行 `npm --silent run cli:pack`，审查实际 tarball、包元信息、MIT、Logo、文件清单和 SHA-512；隔离验证具体 tgz 的帮助和代表参数预览。
5. 按项目中文 emoji 提交风格分步提交并推送，记录待发布源码提交。Git 标签只能指向这个已验证提交。

## npm 与 GitHub

先执行 `npm whoami`，再对审查通过的具体 tgz 进行 `npm publish --dry-run --ignore-scripts --access public --tag latest`；用户已明确授权后，人工发布同一 tgz。如 npm 要求浏览器验证，由用户完成身份验证，不在聊天或日志中记录口令、验证码和令牌。

发布命令成功不等于 registry 已生效。等待并核对版本、latest、作者、仓库、关键词；下载公开 tarball，比较 SHA-512，并通过显式版本的 `vp dlx` / `pnpm dlx` 验证。处理期间不盲目重复上传。

npm 确认后，将 `v<版本>` 标签指向已验收的源码提交并推送。在 GitHub 发布页选择该标签、填写来自 CHANGELOG 的说明并人工发布 Release；核对公开 Release 的标签、提交和说明。连接器或 CLI 不支持发布写操作时，可以使用已登录浏览器；不为此创建自动发布任务。当前发布不上传未经审查的模型、密钥或其他业务文件。

最后在 `docs/NPM_RELEASE.md` 和项目状态中记录实际结果。候选、dry-run、npm上传、registry确认和GitHub公开Release分别记录，失败阶段保留现场。

## 仓库模板与 Skills

- `.github/ISSUE_TEMPLATE` 提供问题反馈、功能建议和维护任务表单；不通过模板自动创建 Issue。
- `.github/pull_request_template.md` 提醒说明结果、兼容性和实际本地验证；增加模板不代表本轮需要新建 PR。
- `.github/release.yml` 仅定义手动生成发布说明时的 PR 分类，不是工作流，不会发布或部署。
- `github-release` 用作 SemVer、代码差异分析和 Keep a Changelog 的参考，`github-issues` 提供反馈结构。项目发布以本说明、AGENTS及用户明确要求为准：沿用 main 分步提交，不机械要求新发布分支、发布PR或重复审批；已有公开版本优先于 Skill 的无标签首发默认值。
- 保留的第三方 Skills 原文不格式化，来源与安装哈希见 `skills-lock.json`；仅这些明确列出的导入目录排除格式检查。自有 Skill、源码、模板和文档继续参与检查。

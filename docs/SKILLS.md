# Skills 索引

| Skill                      | 位置                                                              | 状态                                                             |
| -------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------- |
| starter-preset-development | [SKILL.md](../.agents/skills/starter-preset-development/SKILL.md) | 项目自有；已用于 P3/P4 集成与实机验收                            |
| git-commit                 | [SKILL.md](../.agents/skills/git-commit/SKILL.md)                 | 按逻辑分步暂存、检查和提交；遵循项目历史提交格式                 |
| gitmoji                    | [SKILL.md](../.agents/skills/gitmoji/SKILL.md)                    | 为中文 Conventional Commits 选择意图一致的 emoji；不单独执行提交 |
| create-readme              | [SKILL.md](../.agents/skills/create-readme/SKILL.md)              | 已用于正式 README，继续用于项目使用文档维护                      |
| github-issues              | [SKILL.md](../.agents/skills/github-issues/SKILL.md)              | 参考 Bug/Feature/Task 结构；明确要求时才创建或更新 Issue         |
| github-release             | [SKILL.md](../.agents/skills/github-release/SKILL.md)             | 参考版本与更新日志规则；按项目手动发布流程执行                   |

## 使用约定

新增 UI/CSS/3D/大屏等预设时，先读 Skill，确保只增强 Vite+ 官方基础模板，执行组合兼容校验与本地验证。不自动安装、执行未经审查的第三方 Skill。新增或修改 Skill 时更新本索引。

## 2026-10-27 清理

本次只清理仓库内 `.agents/skills`，20 个保留 3 个，移除 17 个；不影响全局或插件自带的共享 Skills。第三方保留项来自 `github/awesome-copilot`，来源与安装哈希保留在根 `skills-lock.json`，未修改其原始指令。

- 移除仓库不适用或无对应服务的 `code-review`（Awesome Copilot 专用）、`codebase-memory-mcp`。
- 移除重复流程 `commit-message-storyteller`、`conventional-commit`、`conventional-branch`、`git-flow-branch-creator`。
- 移除当前未采用的 Issue/Release 流程 `create-github-issue-feature-from-specification`、`create-github-issues-feature-from-implementation-plan`、`create-github-issues-for-unmet-specification-requirements`、`github-issues`、`github-release`。
- 移除当前未使用的 `context-map`、`create-implementation-plan`、`create-readme`、`editorconfig`、`draw-io-diagram-generator`、`drawio`；现有需求/设计/代码索引与 Mermaid 已覆盖当前文档流程。

保持历史提交风格：`emoji type(scope): 中文说明`。Git 提交与推送仍需用户授权，不跳过本地检查和 Git hooks；保留 Skill 不表示授权发布 npm 或 GitHub Release。

## 2026-11-03 Issue / PR / Release 整理

用户已明确要求模板、Release与新版npm发布，本轮保留上表6个Skills；新安装的 create-readme、github-issues、github-release 原文与来源哈希纳入仓库。删除三个用途重复的批量建Issue Skill和无现有字段迁移场景的 issue-fields-migration，并同步安装锁文件；仅清理本项目目录，不影响全局或插件Skills。删除项的本轮安装副本保留在忽略目录作现场备份。

第三方5个Skills原文保持上游字节，按已有导入Skill策略排除其格式化；自有 starter-preset-development 不排除。发布约束与适用范围见 [手动发布](RELEASING.md)。不根据Skill内容自行创建Issue、PR或流水线。

# Changelog

此文件记录面向使用者的版本变化，采用 Keep a Changelog 结构。历史 npm 版本不表示当时已创建同名 GitHub Release。

## [Unreleased]

### Added

- 增加Windows/Linux手动重复补装回归脚本，验证真实混合工作区构建及文件保护。
- 增加macOS/Linux源码适配与使用指南，恢复JSON提供POSIX命令，批量失败提示按本机Shell显示。
- Linux x64完成Windows构建tgz的实际安装、Vue/React混合工作区创建、已有应用补装与完整构建验收；macOS实机验证待补。

### Fixed

- 修复Monorepo空补装仍启动工作区格式化的问题；仅在共享配置内容发生变化时格式化。
- 规范化操作系统临时根的真实路径，避免macOS标准临时目录别名触发暂存路径保护。
- 统一POSIX系统父路径被文件占用时的报错，保留未知链接和已有文件保护。
- 固定CLI入口LF换行，跨平台运行批量/恢复失败保护测试。

## [0.1.2] - 2026-11-03

### Added

- 增加问题反馈、功能建议、维护任务和 PR 模板，便于提供配置、复现步骤与验收结果。
- 增加 GitHub Release 分类配置、更新日志及手动发布说明。

### Changed

- 项目源码、主页、问题反馈和包内文档链接统一迁至 `adui-studio/viteplus-starter`。
- 根工作区和 CLI 包补齐作者 `ADui`，分发清单与打包报告保留作者元信息。
- 整理仓库 Skills，保留开发、提交、README、Issue 和 Release 相关能力。

## [0.1.1] - 2026-11-03

### Fixed

- 补齐并保留 npm 包的20个关键词，修正包页面 Keywords 缺失。

## [0.1.0] - 2026-11-03

### Added

- 首次公开发布 `@adui/viteplus-starter`，支持交互式配置和参数模式。
- 委托 Vite+ 官方创建 Vue/React Application、Monorepo，按需接入 UI、CSS、大屏、3D 与模型保护。
- 提供已有应用补装、JSON批量创建、只读结构检查及明确边界的恢复操作。
- 默认导入本地静态 normalize.css，统一 ADui Studio Logo 与 favicon。

[Unreleased]: https://github.com/adui-studio/viteplus-starter/compare/v0.1.2...main
[0.1.2]: https://github.com/adui-studio/viteplus-starter/releases/tag/v0.1.2
[0.1.1]: https://www.npmjs.com/package/@adui/viteplus-starter/v/0.1.1
[0.1.0]: https://www.npmjs.com/package/@adui/viteplus-starter/v/0.1.0

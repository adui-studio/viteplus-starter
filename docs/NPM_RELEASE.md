# npm 分发与发布记录

包名为 [`@adui/viteplus-starter`](https://www.npmjs.com/package/@adui/viteplus-starter)，命令名为 `viteplus-starter`。**当前公开版本为0.1.3，latest指向0.1.3**；[GitHub Release v0.1.3](https://github.com/adui-studio/viteplus-starter/releases/tag/v0.1.3) 已公开。0.1.0于2026-11-03首发。CLI清单为private:false，开发工作区根继续保留0.0.0/private。

当前源码另准备0.1.4本地候选，用户仅授权README整理、示例和安装生成验收，未授权本次npm/Release发布。具体归档、SHA-512和验证结果见[0.1.4候选记录](CANDIDATE_0_1_4.md)；包名入口仍取得公开版本，试用候选使用tgz绝对路径。

2026-11-03，源码仓库迁至 [adui-studio/viteplus-starter](https://github.com/adui-studio/viteplus-starter)，0.1.2公开包已同步新地址及作者ADui。npm包名保持不变；0.1.1及以前的元信息和归档保持发布时内容。

## 0.1.3 正式包准备（2026-11-04）

用户已确认本次npm public/latest及GitHub v0.1.3 Release发布。正式包为`dist/cli/pack-XOSqvx/adui-viteplus-starter-0.1.3.tgz`，92文件、101911字节；SHA-512为`sha512-aKTFmkQtvn77QBtE4Nh+oAfkbCSmlOIKBlQa+JsNBA5hdW4ktjkBLLjQsH7cqbO6xjM0a613IS9UUF24RF2R5g==`。与11月3日候选比较，仅README去除未发布提示并整理范围，其余91份文件原字节一致，保留双端真实生成/构建及保护回归证据。

正式包另行隔离安装，Windows命令shim帮助、Vue/React预览、元信息、调用路径与临时目录清理通过；publish dry-run返回同一版本、大小和integrity。当前源码Windows301项测试、文档和vp check通过；Linux候选301项及双端模型构建记录继续保留，不把本次文案变更视为新增浏览器验收。

npm登录原先返回401，用户已在官方网页完成安全密钥验证，npm whoami确认为adui；没有在日志或聊天保存凭据。接下来上传该具体归档，registry和GitHub公开结果在成功后另记。

### 0.1.3公开发布完成

用户另行完成npm发布验证后，同一正式tgz的上传退出0。非交互请求此前返回EOTP，没有成功上传；交互验证后仅一次成功上传，registry处理期间没有重复提交。公开registry已确认version/latest均为0.1.3，作者ADui、新仓库与20个关键词一致；公开下载101911字节与正式包原字节及上述SHA-512完全相同。

显式版本的`vp dlx -- @adui/viteplus-starter@0.1.3 --help`、`pnpm dlx @adui/viteplus-starter@0.1.3 --help`均退出0。发布源码提交为`53f18148a5efe5fe1e2b8377bca5e64b76c5d35d`，签注标签v0.1.3固定该提交并已推送；GitHub Release通过已登录浏览器人工发布。公开API确认非草稿、非预发布，网页显示Latest及正确提交。Release保留GitHub默认源码归档，npm提供已验收CLI包。

证据位于忽略目录dist/verification/v013-publish-evidence.json、v013-github-release-evidence.json、公开包名帮助日志及v013-github-release.png。本次0.1.3授权已完成，后续版本不自动发布；未新增CI/CD。

## 0.1.0 首发结果

- 用户已明确授权 public/latest 发布，账号 adui 完成 npm 浏览器身份验证；上传命令成功退出。registry 处理后版本公开可用，无需再次上传或单独执行 stage。
- 实际上传的是发布前复验的 dist/cli/pack-M7ZfKt/adui-viteplus-starter-0.1.0.tgz，共 92 文件、101318 字节。公开下载与本地候选 SHA-512 完全一致：`sha512-f6j8l2ZGlk5f8sip73q2liIkkirkOJnrXVgAgtHRyTab7dLfI0/qzI/J1diX1KhWpTxkx1OawxJVlPQMuY3xPg==`。
- 291 项测试、隔离安装、Windows shim、Vue/React 预览与 publish dry-run 通过。真实 registry 包名调用 vp dlx / pnpm dlx 的帮助及 Vue/React 配置预览通过，未创建目标；registry 返回的 version/latest/integrity 均已核对。预览不等同新的应用构建，生成能力的代表实测见项目状态。
- 本轮未添加自动发布配置、CI/CD 或 GitHub Release。原始 Logo 与用户已安装 Skill 保持；根完整 vp check 仍仅受该第三方 Skill 的既有格式问题影响，分发内容不包含该 Skill。

## 0.1.1 Keywords 修正发布

0.1.0 未提供 keywords，npm 页面因此显示 none。CLI 源清单补齐 20 个与实际功能相关的关键词，并由 cli-package 显式传入独立包清单；pack-contents.json 同步展示关键词，回归直接核对暂存 package.json，防止只修改源码却在打包时遗漏。

用户已另行授权公开发布0.1.1，并完成本次npm浏览器身份验证。registry已确认version/latest均为0.1.1，版本keywords与包级keywords均为完整20项；公开下载与候选包SHA-512一致，vp dlx / pnpm dlx 的0.1.1包名帮助均通过。

本次上传的是已验收的dist/cli/pack-vn2jGH/adui-viteplus-starter-0.1.1.tgz，92文件、101415字节，integrity为 `sha512-e4SimgM9NtNZLtKmwBxxxG3d2xsLbgmI0tt6RUHP93kkosqw5sJReSJ1gOW0VruXlJZLYVz6XDXhNspcE2ulLw==`。与0.1.0相比仅package.json和README不同，其余90文件完全一致；上一轮291项回归通过，本轮不改变CLI运行逻辑、依赖或生成输出。已发布版本不可覆盖，更新应发布新版本，参考 [npm 版本更新说明](https://docs.npmjs.com/updating-your-published-package-version-number/)。

## 本轮候选包

0.1.3正式包已完成公开发布，源码可继续本地打包；实际发布归档为上文pack-XOSqvx产物。11月3日候选归档与正式包仅README不同，候选记录保留作历史验收证据，不再作为待上传产物。

具体产物身份、两端安装与构建范围见[0.1.3候选验收](CANDIDATE_0_1_3.md)。

在仓库根运行：

```powershell
$bundle = npm --silent run cli:pack | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw 'CLI 打包失败' }
$bundle.tarball
$contents = Get-Content -LiteralPath $bundle.contents -Raw | ConvertFrom-Json
$contents | Select-Object name, version, private, license, fileCount, integrity
$contents.files | Format-Table path, size
```

tarball 与 `pack-contents.json` 放在同一个独立产物目录，互不覆盖已有包。清单来自 npm pack 的实际结果，包含每个文件的路径/字节数、压缩和解压大小、SHA-512 integrity、版本和 private 状态；清单自身不进入包。

打包器核对包名、版本和文件名，拒绝未知目录、隐藏/越界路径、测试、node_modules、模型文件与重复项，检查 CLI 入口、原始 Logo、本地 normalize.css 和两份许可文件。包包含生成器及预设的运行时源码、README、MIT LICENSE；不包含仓库测试、环境文件、锁文件或用户模型，不带安装生命周期脚本。允许的运行时源码仍应在发布前结合 diff 和完整清单审阅；路径检查不代替内容审阅。

元信息来自 packages/create/package.json：MIT、Git 仓库、主页、问题反馈地址，以及预期的 public/官方 registry 发布配置。根 LICENSE 与 normalize.css 原许可都随包携带，不修改已有版权内容。

## 本地安装验收

在仓库外新建自有临时安装目录，使用候选 tarball 安装，禁用安装脚本：

```powershell
$checkRoot = Join-Path ([IO.Path]::GetTempPath()) ('adui-cli-check-' + [Guid]::NewGuid().ToString('N'))
npm install --prefix $checkRoot --ignore-scripts --no-audit --no-fund --package-lock=false $bundle.tarball
if ($LASTEXITCODE -ne 0) { throw '候选包安装失败' }
& (Join-Path $checkRoot 'node_modules\.bin\viteplus-starter.cmd') --help
```

再从不同调用目录验证 Vue/React 的 --dry-run 和向导取消，确认没有创建项目。--dry-run 证明参数/资源读取与目标目录计算，不证明实际应用构建；实际创建/补装的历史代表证据见 [验收记录](V1_ACCEPTANCE.md)。本轮打包没有修改预设或官方模板调用，不为此重建历史业务现场。

## 发布前的人工条件

1. 首发版本 0.1.0 已确认；发布前核对 Git 提交、清单内容与本地安装结果。
2. 使用官方 registry 检查 npm 登录身份和 `@adui` 作用域权限。登录成功不自动证明作用域可写；E404 仅说明当前查询未找到可见包，不能据此证明名称空闲或拥有权限。
3. 候选准备可同步源版本并将README明确标为未发布；**只有用户明确授权发布后**，才上传候选或把文档改为已发布。发布前重新核对完整性、清单private状态和实际安装结果；工作区根继续private，打包器不隐藏覆盖源状态。
4. 最终发布必须指向已复验的 CLI tarball，不能在仓库根误发整个开发工作区。不添加流水线、安装钩子发布或其他自动发布入口。

2026-11-03 首发前只读检查（历史）：npm whoami 返回 adui，符合个人作用域 @adui；目标包当时公开查询为 E404，权限列表尚无目标包。此前 ENEEDAUTH 为用户登录前的历史状态。个人作用域规则见 [npm scopes](https://docs.npmjs.com/about-scopes/)。未直接读取或记录任何凭据内容，授权后的上传结果单独记录。

`private: true` 会让 npm 拒绝发布；publishConfig 只声明发布时的目标设置，不会自行执行发布。依据：[npm package.json](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#private)。后续更新仍须按 [npm 官方发布说明](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/) 完成人工授权与身份验证，不能将打包或 dry-run 当成实际发布。

## 0.1.2 候选验收与本轮授权

用户明确要求增加Release、Issue/PR模板，整理Skills、分步提交推送并发布新版npm。本轮选择0.1.2补丁，同步作者ADui、新仓库链接及包内README；不改变运行逻辑或依赖。GitHub新增社区模板、CHANGELOG和手动发布说明，详见 [发布步骤](RELEASING.md)。

本地候选 `dist/cli/pack-MxmoCs/adui-viteplus-starter-0.1.2.tgz` 共92文件、101420字节，SHA-512为 `sha512-aaTMfz1850eTyN/pdpKqzlozrAFnTfvitb85YAgBDKAgGUcVY0uY2LUlI3UfCPrErWcMzEnf/sh3FEH6CXIUvw==`。与公开0.1.1对比，仅归档内package.json及README改变，其他90文件字节一致。291/291测试、全仓vp check及文档校验通过；YAML解析和表单结构核验通过。隔离安装9个包，Windows shim帮助与Vue/React预览通过，中文空格与元字符调用目录正确且无项目生成；对该具体tgz的publish dry-run通过。尚未据此声明上传或公开Release成功，实际结果另记。

### 0.1.2 公开发布完成

用户已完成npm官方浏览器身份验证；对上述同一tgz的发布命令退出0，经registry处理后，version/latest均为0.1.2。作者ADui、新仓库repository/homepage/bugs、20个keywords核验一致；公开下载101420字节，SHA-512与候选完全相同。公开包名 `vp dlx -- @adui/viteplus-starter@0.1.2 --help`、`pnpm dlx @adui/viteplus-starter@0.1.2 --help` 均退出0。

提交按顺序为 b36067f（模板与Skills）和 d538320（发布候选）；签注标签v0.1.2明确指向 `d538320f384d188119b472c4c527fcadeedd6cd5` 并已推送，GitHub Release随后经已登录浏览器人工发布。公开API确认draft:false、prerelease:false，页面为Latest且提交正确。Release提供GitHub默认源码归档，npm使用经过核验的CLI包；未上传其他业务文件或新增工作流。

GitHub选择页已显示3个Issue模板与Windows指南，Bug表单必填项正常渲染；未提交测试Issue或PR。发布证据、公开归档、包名日志和Release截图位于忽略目录 `dist/verification/v012-*`。本次授权已完成，后续版本仍需明确发布授权。

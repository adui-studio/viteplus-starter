# macOS / Linux 使用与验收

本指南适用于当前源码与公开0.1.3。该版本已包含POSIX指引、临时路径及补装保护修复；旧tgz不会随源码更新。源码仍委托Vite+官方Application/Monorepo模板，不单独维护系统专用工程模板。

0.1.3已于2026-11-04正式发布，实际归档和公开核验见[发布记录](NPM_RELEASE.md)。Windows/Linux实际tgz安装、命令shim、官方混合工程及模型构建证据见[历史候选验收](CANDIDATE_0_1_3.md)；正式包仅README文字与该候选不同，其余91份文件一致。

## 当前验证范围

| 平台                  | 已执行                                                                                                                                                                                                 | 尚未覆盖                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- |
| Windows / PowerShell  | Node 22.18.0，仓库303项测试通过，无跳过；UI及Three/模型补装、真实构建和重复保护通过；此前临时目录别名打包通过                                                                                          | 未穷举所有插件组合                                          |
| Linux x64 / Debian 12 | 官方Vite+ 1.4.0、Node 26.13.0，仓库303项测试通过，无跳过；普通用户TTY取消、UI及Three/模型补装、真实构建和重复保护通过；此前Windows tgz安装通过                                                         | 其他发行版、ARM64、musl及原生桌面浏览器                     |
| macOS / darwin arm64  | M1 Max、macOS Tahoe26.6.2、Node26.13.0；公开0.1.3完整向导与Vue TS/TDesign/UnoCSS/AdScreen/Three/embedded创建、check及build通过；用户反馈界面/Three正常，无控制台错误；实际GLB的.adui构建和加载确认通过 | React/JS等其他组合、取消/重复补装、外置密钥模式仍待原生验证 |

Linux实测使用隔离容器，不等同全部Linux桌面环境。macOS现已有用户实机创建、检查和构建日志，以及页面与Three反馈；各阶段证据分别记录，其他架构仍需对应机器验证。Windows历史验收继续保留。

当前继续Windows/Linux回归，并根据用户提供的Mac实机日志补齐macOS验收。Linux使用UID1000普通用户：名称输入时Ctrl+C和完成多项选择后选No均退出0、未创建项目；选择流程覆盖React JS、UI/CSS、大屏、多引擎和外置密钥，但取消不等于这些选择已生成或构建。

Three/模型最新回归使用Vue TS内置密钥、React JS外置密钥：首次依赖命令受控失败后正常重试，两组实际双入口加密构建及根ready通过，随后8项保护调用保持179份文件内容/修改时间不变。模型格式化中断的拒绝覆盖边界由真实CLI受控单元用例覆盖，不扩大为操作系统强杀或网络断开场景。

公开0.1.3新增Vue JS + Element Plus/Tailwind、React TS + Ant Design/UnoCSS及AdScreen的Windows/Linux代表回归；两端UI双入口构建、根ready/check及8项重复保护均通过，113份文件内容与修改时间保持。详情见[V1验收记录](V1_ACCEPTANCE.md)；Mac该两组及本轮浏览器点击仍未验收。

## 2026-11-04 macOS用户实机创建与构建

用户在MacBook Pro（M1 Max，设备截图为macOS Tahoe26.6.2）通过`pnpm dlx @adui/viteplus-starter@0.1.3`进入交互向导，创建test-starter。日志显示Node26.13.0、pnpm12.16.1，选择Vue3/TypeScript、TDesign1.20.10、UnoCSS66.12.0、AdScreen、Three0.186.1及embedded模型保护；@types/three为0.186.0。

官方模板创建、UI/CSS安装与格式化、大屏与引擎生成、模型配置/KEY生成及插件目录/首页/Logo整理均完成，终端最后显示“创建完成”。用户后续输出process.platform + process.arch为darwinarm64，确认Node以arm64运行；父目录执行的vp --version显示全局CLI v0.3.3，该次输出未定位到应用内vite-plus，不能据此填写项目依赖版本。未收录设备序列号或原始截图。

在test-starter中，vp check通过53份格式文件及38份代码文件的lint/类型检查；vp run build依次执行vue-tsc -b和vp build，转换3842个模块并在1.74秒完成。Three为577.24 kB、GLTFLoader为45.20 kB的独立分块；大于500 kB的构建提示保留，构建未失败。用户通过vp dev访问后确认界面和Three正常、浏览器控制台无错误。

随后用户针对“在Mac使用实际GLB，验证.adui加密构建和模型加载”回复“通过了”，计为同一embedded组合的用户确认。未另附该模型构建、网络或产物哈希输出，不补写模型文件名、数量、密文字节一致性或密钥轮换结论。取消/重复补装、外置密钥及其他框架语言组合仍按各自证据验收。

用户首次在项目父目录运行vp check，收到Package not found in workspace；进入test-starter后检查与构建均通过。命令应在应用目录执行，父目录显示Local vite-plus Not found不表示该应用缺失依赖。

在Mac应用目录执行以下命令，检查与构建日志和浏览器反馈分别记录：

```sh
node -p "process.platform + ' ' + process.arch"
vp --version
vp check
vp run build
vp dev
```

创建日志中的24项deprecated均指向@yuku-codegen/@yuku-parser的0.9.5平台绑定。官方registry的弃用信息分别说明codegen自0.14改为纯JavaScript、parser自0.14转用yuku-core；弃用提示的含义见[npm官方文档](https://docs.npmjs.com/cli/v11/commands/npm-deprecate/)。该日志未显示这些警告导致安装中止；实际父依赖链仍需该项目锁文件或pnpm why确认，不据此替换官方模板的工具链版本。

向导前的minimumReleaseAgeExclude新增提示由pnpm dlx输出，属于包管理器的发布时间策略处理；设置说明见[pnpm文档](https://pnpm.io/settings/dependency-resolution#minimumreleaseageexclude)。本轮未修改该Mac项目的策略、依赖或分块阈值。

## 环境准备

需要可运行的 Vite+、pnpm、Git及受支持的 Node：`^22.18.0 || ^24.11.0 || >=26.0.0`。本仓库工具链锁定 Vite+ 1.4.0，平台与系统库要求以 [Vite+官方指南](https://www.viteplus.dev/guide) 为准；本轮未升级工作区依赖。

按官方方式安装 Vite+：

```sh
curl -fsSL https://vite.plus | bash
```

打开新终端后检查：

```sh
node --version
vp --version
pnpm --version
git --version
```

在当前用户可写的目录执行。路径含空格或中文时始终加引号；可用 `pwd -P` 查看物理路径。输出路径中的未知符号链接仍会被拒绝，不通过关闭文件保护来运行。

## 使用当前源码的跨平台修复

```sh
mkdir -p "$HOME/Projects"
cd "$HOME/Projects"
git clone https://github.com/adui-studio/viteplus-starter.git
cd viteplus-starter
vp install --frozen-lockfile

# 新应用生成在工具仓库的父目录
vp run create --name demo-vue --type application --framework vue --ui element-plus --css tailwindcss --screen --dry-run
vp run create --name demo-vue --type application --framework vue --ui element-plus --css tailwindcss --screen

cd ../demo-vue
vp check
vp run build
vp dev
```

不传参数的 `vp run create` 进入同一套方向键/空格交互。React JS 可使用：

```sh
cd "$HOME/Projects/viteplus-starter"
vp run create --name demo-react --type application --framework react --language js --ui antd --css unocss --screen
```

这条命令需在生成器仓库中运行，随后进入终端显示的实际项目目录。新建首页接入所选插件；已有应用补装沿用业务入口保护边界。

## 本地 tgz 与包名入口

在生成器根构建当前源码包，保留完整JSON，再取tarball路径：

```sh
bundle=$(npm --silent run cli:pack) || exit
tarball=$(printf '%s' "$bundle" | node -pe 'JSON.parse(require("node:fs").readFileSync(0,"utf8")).tarball') || exit
cd ..
vp dlx -- "$tarball" --help
vp dlx -- "$tarball"
```

已发布0.1.3可以按包名调用：

```sh
vp dlx -- @adui/viteplus-starter
pnpm dlx @adui/viteplus-starter
```

npm/pnpm安装后提供可执行命令。本轮在Linux直接执行安装后的命令验证，未把tar头部权限或Node参数预览等同实际启动。打包入口固定LF shebang，静态资源、许可和完整性检查保持。

## 混合工作区与已有应用

在项目父目录使用源码 CLI，配置路径须指向实际JSON：

```sh
node './viteplus-starter/packages/create/bin/cli.mjs' --config './viteplus-starter/examples/monorepo.batch.json' --dry-run
node './viteplus-starter/packages/create/bin/cli.mjs' --config './viteplus-starter/examples/monorepo.batch.json'
cd adui-batch-demo
vp run ready
vp check
```

为已有应用补装时，在其父目录调用源码CLI，`--name`对应现有目录；不会重新创建官方工程：

```sh
node '/absolute/path/viteplus-starter/packages/create/bin/cli.mjs' --name my-app --type application --framework vue --ui element-plus --css tailwindcss --screen --apply-existing
```

工作区成员另加 `--workspace '/absolute/path/workspace'`。补装将新增运行时归档至 `src/plugins`，保留业务App和注册逻辑；main按选择增量导入样式。新增插件需按 [项目结构](PROJECT_LAYOUT.md) 手动接入已有页面。Linux代表验收比较了两个App的精确哈希、main去除样式导入后的原有代码及静态normalize内容。

## 失败与恢复

批量失败摘要在Windows显示PowerShell命令，macOS/Linux显示sh/zsh命令。只读恢复JSON保留原有 `powershell`，新增 `posix`；两者都保留原始command/args供核对。单引号、空参数、美元符号、反引号和换行均保持字面值，报告不会被恢复执行器当作脚本运行。

修复失败阶段后再按指引操作；已有或部分完成目录仍拒绝覆盖。每应用运行 `vp check`、`vp run build`，工作区根运行 `vp run ready`；独立页、WebGL与模型加载仍需各自页面验收。

## 本地回归

```sh
node --test --test-concurrency=1
node scripts/validate-docs.mjs
vp check
```

需要联网创建临时真实工程时，另运行 `node scripts/verify-repeat-guards.mjs`。两端均验证Vue TS（Element Plus/Tailwind）与React JS（Ant Design/UnoCSS）补装大屏、UI页及完整ready；8次保护调用不启动子进程，113份文件的内容与修改时间保持。空补装不再无条件格式化共享配置。操作范围与清理规则见 [Harness](HARNESS.md)。

打包与测试夹具仅对操作系统提供的临时根先取真实路径，兼容macOS常见的 `/var` → `/private/var` 别名；不改变业务输出路径检查。相关模块见 [代码索引](CODEBASE_MAP.md)。本轮Linux完整构建通过，仍保留官方TypeScript 7实验性提示及已有Volar peer范围警告，不据此宣称这些上游声明范围已修复。

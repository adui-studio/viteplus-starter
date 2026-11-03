# macOS / Linux 使用与验收

本指南针对当前源码及重新打包的 CLI。公开 npm 0.1.2 尚未包含本轮跨平台修复；旧 tgz 不会随源码更新。源码仍委托 Vite+ 官方 Application/Monorepo 模板，不单独维护系统专用工程模板。

当前0.1.3本地候选已在Windows/Linux验证实际tgz安装、命令shim、官方混合工程及模型构建；尚未发布。具体归档及范围见[候选验收](CANDIDATE_0_1_3.md)。

## 当前验证范围

| 平台                  | 已执行                                                                                                                                     | 尚未覆盖                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| Windows / PowerShell  | Node 22.18.0，301项测试通过，无跳过；UI及Three/模型补装、真实构建和重复保护通过；此前临时目录别名打包通过                                  | 未穷举所有插件组合                                                    |
| Linux x64 / Debian 12 | 官方Vite+ 1.4.0、Node 26.13.0，301项测试通过，无跳过；普通用户TTY取消、UI及Three/模型补装、真实构建和重复保护通过；此前Windows tgz安装通过 | 其他发行版、ARM64、musl及原生桌面浏览器                               |
| macOS / sh、zsh       | 已补齐POSIX恢复提示、系统临时根真实路径和LF入口；相关逻辑受控测试通过                                                                      | 尚无macOS实机验收，不能视为Intel/Apple Silicon安装、TTY或构建均已通过 |

Linux 实测使用隔离容器，不等同全部Linux桌面环境。macOS与其他架构需要在相应机器上补充原生验证；Windows历史验收继续保留。

当前按用户选择优先推进Windows/Linux，macOS原生验收暂缓。Linux最新补充使用UID1000普通用户：名称输入时Ctrl+C和完成多项选择后选No均退出0、未创建项目；选择流程覆盖React JS、UI/CSS、大屏、多引擎和外置密钥，但取消不等于这些选择已生成或构建。

Three/模型最新回归使用Vue TS内置密钥、React JS外置密钥：首次依赖命令受控失败后正常重试，两组实际双入口加密构建及根ready通过，随后8项保护调用保持179份文件内容/修改时间不变。模型格式化中断的拒绝覆盖边界由真实CLI受控单元用例覆盖，不扩大为操作系统强杀或网络断开场景。

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

已发布包可以按包名调用，但当前0.1.2不包含本轮源码修复：

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

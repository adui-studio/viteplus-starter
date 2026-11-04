<p align="center">
  <img src="docs/assets/readme-banner.svg" alt="ADui Vite+ Starter：Vue、React 与 Monorepo 官方模板及插件预设" width="1280" />
</p>

<h1 align="center">ADui Vite+ Starter</h1>

<p align="center">
  基于 Vite+ 官方模板，按需组合你的前端技术栈。<br />
  Vue · React · TypeScript · JavaScript · Monorepo
</p>

<p align="center">
  <a href="#快速开始">快速开始</a> ·
  <a href="#安装后使用">安装与使用</a> ·
  <a href="#常用操作">常用操作</a> ·
  <a href="#项目结构">项目结构</a> ·
  <a href="#加密模型加载">加密模型</a> ·
  <a href="#文档">文档</a> ·
  <a href="https://github.com/adui-studio/viteplus-starter/releases">Releases</a> ·
  <a href="LICENSE">MIT</a>
</p>

支持 **Windows、macOS、Linux**。包名 `@adui/viteplus-starter`，命令名 `viteplus-starter`，可通过 Vite+、pnpm 或 npm 启动。

## 功能

| 方向       | 支持能力                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------- |
| 官方工程   | Application / Monorepo；Vue 3 / React；TypeScript / JavaScript                                     |
| UI 与样式  | Vue：Element Plus、Ant Design Vue、TDesign；React：Ant Design、TDesign；CSS：UnoCSS / Tailwind CSS |
| 大屏与 3D  | AdScreen 大屏适配；Three.js / CesiumJS / Babylon.js，可多选、按需加载                              |
| 模型保护   | 自包含 GLB 自动加密为 `.adui`，内置或外置密钥模式，KEY 生成与轮换                                  |
| 工作区管理 | 逐应用添加、JSON 批量创建、只读检查与缺失应用恢复                                                  |
| 增量集成   | 已有应用补装、配置保护、可选独立验收页                                                             |

基础工程始终委托 Vite+ 官方 `vite:application` / `vite:monorepo`。各应用独立选择语言和插件，默认 TypeScript；UI、CSS 和引擎均可不启用。所有 Vue/React 应用默认导入本地静态 normalize.css，不安装 normalize.css npm 包。

新建应用、工作区默认网站、README 和 favicon 统一使用 [ADui Studio Logo](packages/create/assets/adui-studio-logo.svg)。应用首页与浏览器图标共用同一资源，生产构建由 Vite 处理路径。

## 快速开始

**环境**：Node.js `^22.18.0 || ^24.11.0 || >=26.0.0`、Vite+ `vp` 与 pnpm。首次创建需要网络或完整的模板、依赖缓存。

### 1. 启动配置向导

在项目父目录任选一种方式，无需全局安装或添加项目依赖：

```sh
vp dlx -- @adui/viteplus-starter
# 或
pnpm dlx @adui/viteplus-starter
# 或
npm exec --yes --package @adui/viteplus-starter -- viteplus-starter
```

<details>
<summary>从 GitHub 下载生成器</summary>

```sh
vp create github:adui-studio/viteplus-starter
cd viteplus-starter
vp run create
```

也支持 `vp create https://github.com/adui-studio/viteplus-starter`。目标工具目录须不存在；下载后运行 `vp run create` 启动向导，新应用与工具仓库并列生成。

</details>

### 2. 选择项目配置

向导依次选择名称、Application / Monorepo、框架、语言、UI、CSS、大屏、引擎及模型保护。

| 操作            | 按键                          |
| --------------- | ----------------------------- |
| 移动选项 / 确认 | 方向键 / Enter                |
| 多选 3D 引擎    | Space 勾选，Enter 确认        |
| 取消创建        | Ctrl+C，或在最终确认时选择 No |

### 3. 检查并启动应用

假设项目名为 `my-app`，根据入口进入对应目录：

| 创建入口                   | 项目位置         | 进入应用       |
| -------------------------- | ---------------- | -------------- |
| 工具仓库内 `vp run create` | 工具仓库的父目录 | `cd ../my-app` |
| dlx / 已安装的 CLI         | 当前调用目录     | `cd ./my-app`  |

```sh
vp check
vp run build
vp dev
```

Monorepo 在工作区根运行 `vp run ready`。

## 安装后使用

也可以安装 CLI 长期使用。包名是 **`@adui/viteplus-starter`**，命令名是 **`viteplus-starter`**。

| 方式             | pnpm                                         | npm                                             |
| ---------------- | -------------------------------------------- | ----------------------------------------------- |
| 全局安装         | `pnpm add --global @adui/viteplus-starter`   | `npm install --global @adui/viteplus-starter`   |
| 全局安装后启动   | `viteplus-starter`                           | `viteplus-starter`                              |
| 项目内安装       | `pnpm add --save-dev @adui/viteplus-starter` | `npm install --save-dev @adui/viteplus-starter` |
| 项目内安装后启动 | `pnpm exec viteplus-starter`                 | `npm exec -- viteplus-starter`                  |

无参数启动向导，`--help` 查看帮助，`--dry-run` 只输出计划。CLI 是项目生成工具，无需在业务代码中 import；生成应用的日常开发继续使用 `vp`。

<details>
<summary>通过 vp dlx / pnpm dlx 传入帮助与预览参数</summary>

```sh
vp dlx -- @adui/viteplus-starter --help
vp dlx -- @adui/viteplus-starter --name my-vue-app --type application --framework vue --ui element-plus --css tailwindcss --dry-run
pnpm dlx @adui/viteplus-starter --name my-vue-app --type application --framework vue --ui element-plus --css tailwindcss --dry-run
```

本地 tgz 使用同样的参数，只需将包名替换为 tgz 路径。`vp dlx --` 的分隔符让帮助等参数传给生成器。

</details>

## 常用操作

以下示例在**生成器仓库根目录**运行，目标按工具父目录解析。项目名以小写字母开头，只使用小写字母、数字和中划线；新建目标须不存在。

### 创建 Vue / React 应用

```sh
# Vue + TypeScript + Element Plus + Tailwind CSS
vp run create --name my-vue-app --type application --framework vue --ui element-plus --css tailwindcss

# React + JavaScript + Ant Design + UnoCSS
vp run create --name my-react-app --type application --framework react --language js --ui antd --css unocss

# Vue 大屏 + Three.js，默认启用模型自动加密加载
vp run create --name my-screen --type application --framework vue --screen --engine three
```

添加 `--dry-run` 先预览；新建应用直接从正式 main/App 接入所选插件。默认不保留独立预设验收页，需要时添加 `--smoke-pages`。

<details>
<summary>创建 Monorepo，并添加独立配置的应用</summary>

```sh
vp run create --name my-workspace --type monorepo
vp run create --workspace ./my-workspace --name admin --type application --framework vue --ui tdesign --css unocss
vp run create --workspace ./my-workspace --name portal --type application --framework react --language js --ui antd --css tailwindcss
```

保留官方 `apps/website` 和 `packages/utils`，新应用位于 `apps/<name>`。根不指定统一框架或语言。详见 [Monorepo 指南](docs/MONOREPO.md)。

</details>

<details>
<summary>使用 JSON 批量创建混合工作区</summary>

```sh
vp run create --config ./viteplus-starter/examples/monorepo.batch.json --dry-run
vp run create --config ./viteplus-starter/examples/monorepo.batch.json
```

配置路径相对于工具父目录；工具目录重命名后须同步调整路径，或使用绝对路径。配置格式见 [批量配置](docs/BATCH_CONFIG.md)，更多组合见 [示例索引](examples/README.md)。

</details>

<details>
<summary>为已有 Vue 应用补装 UI / CSS</summary>

```sh
vp run create --name existing-vue --type application --framework vue --ui element-plus --css tailwindcss --apply-existing
```

目标为工具父目录下的已有 `existing-vue`，框架和语言须匹配。本次新增插件统一归档；业务 App、挂载逻辑、自定义注册入口与配置原件备份保留，样式按已知规则增量导入。历史插件不自动迁移，冲突时停止并保留现场。详见 [补装接入说明](docs/PROJECT_LAYOUT.md)。

</details>

## 项目结构

只生成所选功能需要的目录。以 Vue TypeScript 应用为例：

```text
src/
├─ assets/         ADui Studio Logo 与应用资源
├─ plugins/        UI、大屏与所选引擎运行时
├─ components/     页面组件与按需场景入口
├─ styles/         本地 normalize.css、许可及首页样式
├─ models/         自包含 GLB，按模型保护配置生成
├─ App.vue         使用所选插件的正式首页
└─ main.ts         挂载、插件注册与样式入口
build/
└─ plugins/        模型加密、Cesium 静态资源等构建增强
```

Vue 在 main 注册插件、App 使用组件；React 保留 createRoot，在 App 组合组件。JS / React 使用对应的 JS / JSX / TSX 入口。引擎点击后加载，多引擎安装不会同时启动多个渲染器。详见 [目录与入口设计](docs/PROJECT_LAYOUT.md)。

模型保护默认将自包含 GLB 加密为 `.adui`，提供 `models:keygen` / `models:keyrotate`。客户端内置密钥用于提高直接复用门槛，不保证无法逆向提取，边界见 [模型构建指南](docs/MODEL_BUILD.md)。

## 加密模型加载

创建时选择大屏、目标引擎与模型保护，将自包含 GLB 放入应用的 `src/models/`。`vp dev` 和构建会自动生成 `.adui` 资源；浏览器通过模型目录获取密文并解密，无需手动改名或直接导入 GLB。

```sh
vp run models:keygen     # KEY 缺失时生成，已有 KEY 不覆盖
vp run models:keyrotate  # 备份后轮换；随后重新构建
vp run build
```

KEY 保存在被 Git 忽略的 `.env.local`，每个模型的 IV 自动随机生成。模型须为自包含 GLB，单文件不超过 32 MiB；外部贴图和额外压缩解码器暂不支持。

以下是**生成后应用内**的使用代码，选择与已安装引擎对应的一份，保存为 `src/model-view.ts`。JavaScript 项目使用 `.js` 并去掉 `host: HTMLElement` 的类型标注。容器需有明确宽高，例如 `width: 100%; height: 600px`。

### Three.js

```ts
import models from "virtual:adui-models";
import { authorize } from "virtual:adui-model-key";
import { createLazyScene } from "./plugins/three/lazy.mjs";

export function mountModel(host: HTMLElement) {
  const asset = models.find((model) => model.name === "DamagedHelmet");
  if (!asset) throw new Error("请将 DamagedHelmet.glb 放入 src/models");

  const scene = createLazyScene(host, { onError: console.error });
  void scene.loadBundledModel(asset, { authorize });
  return () => scene.destroy();
}
```

### CesiumJS

```ts
import models from "virtual:adui-models";
import { authorize } from "virtual:adui-model-key";
import { createLazyGlobe } from "./plugins/cesium/lazy.mjs";

export function mountModel(host: HTMLElement) {
  const asset = models.find((model) => model.name === "DamagedHelmet");
  if (!asset) throw new Error("请将 DamagedHelmet.glb 放入 src/models");

  const globe = createLazyGlobe(host, { onError: console.error });
  void globe.loadBundledModel(asset, { authorize });
  return () => globe.destroy();
}
```

Cesium 的静态资源目录和部署 base 由生成的插件配置处理，不需要在业务代码中单独设置资源路径。

### Babylon.js

```ts
import models from "virtual:adui-models";
import { authorize } from "virtual:adui-model-key";
import { createLazyScene } from "./plugins/babylon/lazy.mjs";

export function mountModel(host: HTMLElement) {
  const asset = models.find((model) => model.name === "DamagedHelmet");
  if (!asset) throw new Error("请将 DamagedHelmet.glb 放入 src/models");

  const scene = createLazyScene(host, { onError: console.error });
  void scene.loadBundledModel(asset, { authorize });
  return () => scene.destroy();
}
```

三种适配器都会按需初始化引擎、加载目录中的 `.adui` 并交给对应引擎解析。`loadBundledModel` 返回 `Promise<boolean>`，错误通过 `onError` 提供；组件卸载时调用返回的清理函数，取消请求并释放场景。

<details>
<summary>在 Vue / React 组件中挂载与清理</summary>

Vue（`src/components/ModelView.vue`）：

```vue
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { mountModel } from "../model-view";

const host = ref<HTMLElement | null>(null);
let dispose: (() => void) | undefined;
onMounted(() => {
  if (host.value) dispose = mountModel(host.value);
});
onBeforeUnmount(() => dispose?.());
</script>

<template><div ref="host" style="width: 100%; height: 600px" /></template>
```

React（`src/components/ModelView.tsx`）：

```tsx
import { useEffect, useRef } from "react";
import { mountModel } from "../model-view";

export default function ModelView() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (host.current) return mountModel(host.current);
  }, []);
  return <div ref={host} style={{ width: "100%", height: 600 }} />;
}
```

</details>

<details>
<summary>外置密钥模式：通过独立文件解锁</summary>

创建时选择 `--model-protection external`。下面以 Three.js 为例替换内置密钥版本；Cesium/Babylon 使用各自目录的 `createOfflineKeyring` 和上述场景工厂，不导入 `virtual:adui-model-key`。

```ts
import models from "virtual:adui-models";
import { createLazyScene } from "./plugins/three/lazy.mjs";
import { createOfflineKeyring } from "./plugins/three/offline-keyring.mjs";

export function mountProtectedModel(host: HTMLElement) {
  const keyring = createOfflineKeyring();
  const scene = createLazyScene(host, { onError: console.error });
  return {
    async unlock(file: File) {
      const asset = models.find((model) => model.name === "DamagedHelmet");
      if (!asset || !(await keyring.unlock(file))) return false;
      return scene.loadBundledModel(asset, { authorize: keyring.authorize });
    },
    lock() {
      keyring.lock();
      scene.clearModel();
    },
    destroy() {
      keyring.lock();
      scene.destroy();
    },
  };
}
```

`file` 来自文件选择控件。解锁 JSON 为 `{ "version": 1, "keyId": "项目密钥标识", "key": "32字节KEY的Base64值" }`，须与该构建的 `.env.local` 匹配，通过网站之外的渠道交付。组件卸载时调用 `destroy()`；刷新后需重新解锁，密钥不写入浏览器存储。

</details>

内置密钥模式用于提高文件直接复用门槛，不保证无法逆向提取。更多配置见 [模型构建](docs/MODEL_BUILD.md)、[Three.js](docs/THREE_SMOKE.md)、[Cesium](docs/CESIUM.md) 与 [Babylon](docs/BABYLON.md)。

## 本地候选包

当前源码准备 **0.1.4 本地候选**，包含外置密钥解锁重试提示及 Cesium 依赖兼容修复；尚未发布到 npm。包名命令运行 npm 已发布版本。将下方路径替换为 tgz 的实际绝对路径：

```sh
vp dlx -- '/absolute/path/adui-viteplus-starter-0.1.4.tgz'
# 或
pnpm dlx '/absolute/path/adui-viteplus-starter-0.1.4.tgz'
# 或
npm exec --yes --package '/absolute/path/adui-viteplus-starter-0.1.4.tgz' -- viteplus-starter
```

## 文档

| 主题       | 指南                                                                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 开始使用   | [Windows 操作](docs/WINDOWS_GUIDE.md) · [macOS/Linux](docs/MACOS_LINUX.md) · [CLI 分发](docs/CLI_DISTRIBUTION.md) · [项目结构](docs/PROJECT_LAYOUT.md) |
| 工作区     | [Monorepo](docs/MONOREPO.md) · [批量配置](docs/BATCH_CONFIG.md) · [配置示例](examples/README.md)                                                       |
| 大屏与引擎 | [AdScreen](docs/SCREEN.md) · [Three.js](docs/THREE_SMOKE.md) · [Cesium](docs/CESIUM.md) · [Babylon](docs/BABYLON.md) · [多引擎](docs/MULTI_ENGINE.md)  |
| 模型与验收 | [模型构建](docs/MODEL_BUILD.md) · [模型加密](docs/MODEL_SECURITY.md) · [UI 验收](docs/UI_SMOKE.md)                                                     |
| 交付范围   | [当前能力](docs/GENERATOR_STATUS.md) · [验收范围](docs/V1_ACCEPTANCE.md) · [首发准备](docs/NPM_RELEASE.md)                                             |
| 开发维护   | [协作规范](AGENTS.md) · [架构](docs/ARCHITECTURE.md) · [代码索引](docs/CODEBASE_MAP.md) · [本地验证](docs/HARNESS.md)                                  |

<details>
<summary>本地开发与 CLI 打包</summary>

```sh
git clone https://github.com/adui-studio/viteplus-starter.git
cd viteplus-starter
vp install --frozen-lockfile
node packages/create/bin/cli.mjs --help
node --test --test-concurrency=1
node scripts/validate-docs.mjs
vp check
```

在生成器根目录打包：

```sh
npm run cli:pack
```

输出 JSON 提供 `tarball` 绝对路径及内容清单。切换到新项目的父目录，再用 `vp dlx -- '<tarball绝对路径>'` 启动。源码或包内 README 更新后须重新打包，旧 tgz 不会自动更新。直接调用 CLI 源文件时输出相对于当前调用目录；`vp run create` 始终以工具父目录为基准。详见 [CLI 分发说明](docs/CLI_DISTRIBUTION.md)。

</details>

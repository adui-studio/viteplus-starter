# 0.1.4 本地候选验收

本轮仅准备本地候选并核验安装、生成结果，不发布npm/GitHub Release或创建v0.1.4标签。公开0.1.3及既有标签保持；使用包名取得公开版本，试用本候选须使用实际tgz绝对路径。

## 本轮变化

- README统一平台使用入口，增加Three.js、CesiumJS、Babylon.js加密GLB加载，以及Vue/React生命周期和external密钥示例。
- 包含正式首页外置密钥正确重试后清除旧提示的修复，见[浏览器验收](V1_ACCEPTANCE.md)。
- 三引擎示例实测发现Cesium1.146.0与新解析engine26.5.0聚合导出不匹配，预设改为1.147.0；旧应用仍在预检拒绝自动升级，见[Cesium说明](CESIUM.md)。

CLI源版本为0.1.4，根仍0.0.0/private。除必要Cesium匹配外，其他依赖和仓库锁文件保持；变更继续归入[Unreleased](../CHANGELOG.md)。

## 候选身份

| 项目              | 实际值                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| 包名 / 版本       | `@adui/viteplus-starter@0.1.4`                                                                    |
| tgz               | `dist/cli/pack-WMNmBe/adui-viteplus-starter-0.1.4.tgz`                                            |
| 清单              | 同目录 `pack-contents.json`，不进入归档                                                           |
| 文件数 / 压缩大小 | 92 / 104966字节                                                                                   |
| SHA-512           | `sha512-PrDINsb+GFlDEb6l4pf54mkMPtKB87DtHFaYHsE1UcOLiX2QngMwMg9TcyXh+Ji/7GyWOuDOjuYdzk7DiuQSUQ==` |

Windows与Linux从同一源码打包的SHA-512相同，安装验收使用Windows生成的同一tgz。与公开0.1.3相比仅README、package.json、application-home.mjs和cesium.mjs共4份文件改变，其余88份原字节一致。作者ADui、20个关键词、Logo、MIT与normalize许可保留，不含测试、锁文件、环境文件、用户模型或安装生命周期脚本。

两端文档校验及vp check通过（227份格式文件、164份代码文件），专用Linux容器核对ID、镜像和源码只读挂载后已清理，未操作其他容器。候选归档保留；中间归档不作为待发布文件。

候选源码提交为`fa686c2fee0f38ef119987f3a216732f50786e4f`；提交后重新打包与上述已验收tgz的SHA-512和92份清单完全一致。此后的验收文档记录不改变分发源码或候选身份。

## 实际安装与生成

| 检查                                     | Windows Node22.18.0                  | Linux x64 Node26.13.0 / UID1000 |
| ---------------------------------------- | ------------------------------------ | ------------------------------- |
| 实际tgz隔离安装、命令shim帮助与2组预览   | 通过                                 | 通过                            |
| 官方Monorepo及Vue JS / React TS成员创建  | 通过                                 | 通过                            |
| Three补装、Vue embedded / React external | 通过                                 | 通过                            |
| 首次依赖受控返回23，文件保持后真实重试   | 各2组通过                            | 各2组通过                       |
| 正式页/模型页双入口、base与.adui解密     | 各2组通过                            | 各2组通过                       |
| 根ready与构建后check                     | 0/8缓存，8/8成功；126格式/84代码类型 | 同左                            |
| 重复补装、模式切换、Three页、空补装      | 8项零子进程、179份文件内容/mtime保持 | 同左                            |
| 仓库node --test                          | 305/305，无跳过                      | 305/305，无跳过                 |

两份业务App哈希跨系统一致，KEY和原件备份均在179份文件保护范围中。Windows三种本地归档入口的帮助也通过：vp dlx、pnpm dlx及npm exec使用绝对路径，调用目录无工程生成。相对tgz路径因pnpm缓存目录解析而失败，README已改正，未修改官方工具。

## README示例实际构建

从本候选隔离安装后的README提取代码，包内CLI经官方入口生成Vue TS三引擎embedded和React TS Three external成员，加入用户DamagedHelmet.glb。三种引擎加载模块、Vue/React生命周期组件及外置密钥示例参与实际构建，根ready无缓存9/9通过；两组模型双入口/base构建、每组1份.adui解密原字节一致且无原模型/原始KEY字面量，构建后check通过193份格式文件及141份代码/类型文件。Cesium的Workers、ThirdParty、Assets、Widgets均实际输出。

该项验证类型和生产构建，不把它计为本轮三个引擎的浏览器渲染。安装曾有registry超时并按包管理器默认策略重试成功；未跳过安装或放宽构建。初轮Cesium缺失导出构建失败保留日志，修复后重新安装最终包并完整重做。源码修复已实际进入候选归档，React生成的正式SceneView包含重试提示清除逻辑。

日志与摘要位于忽略目录dist/verification/v014-*，中间失败不计为最终通过。临时工程由各工具的受控finally清理，模型原文件未修改；本地候选不等于公开发布。

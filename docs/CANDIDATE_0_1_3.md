# 0.1.3 本地候选验收

状态：2026-11-03，已准备本地候选，尚未发布npm或GitHub Release，未创建v0.1.3标签。包名命令仍取得公开版本；本候选使用完整tgz路径。变更继续归入[Unreleased](../CHANGELOG.md)，公开0.1.2及既有标签保持。

## 候选身份

候选源码提交为`1d2c2ae`；提交后重新打包与下列已验收归档完整性一致。两端最终文档校验和vp check通过（223份格式文件、162份代码文件）。专用Linux容器核验初始ID、镜像和源码只读挂载后已清理，候选归档保留。

| 项目              | 实际值                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| 包名 / 版本       | `@adui/viteplus-starter@0.1.3`                                                                    |
| Windows产物       | `dist/cli/pack-1KlK5n/adui-viteplus-starter-0.1.3.tgz`                                            |
| 侧车清单          | 同目录`pack-contents.json`，不进入tgz                                                             |
| 文件数 / 压缩大小 | 92 / 101909字节                                                                                   |
| SHA-512 integrity | `sha512-UE0R7BiZYOHd2SM6EIZRHiTCtj4cwx/6Mhpygk2U8Jyeiz6g8aVrlnA+dRm7iZGSC3n9gsSkb337KbiTbDlbhw==` |
| 工具链            | Vite+1.4.0；Node22.18.0 / 26.13.0                                                                 |

同一源码快照在Windows及Linux本地打包的SHA-512一致；Linux实际安装验证使用Windows生成的同一tgz。归档保留作者ADui、新仓库链接、20个关键词、MIT与normalize许可、原始Logo；没有环境文件、用户模型、测试、锁文件或安装生命周期脚本。

与已公开0.1.2归档核对：文件路径集合相同，8份文件变更、84份原字节不变。差异仅为README、package.json、创建器CLI、batch/model-protection/recovery/safe-paths以及模型setup源码。包含POSIX恢复提示、临时路径兼容、空补装定向格式化和模型重复配置提前拒绝；无引擎版本升级或密码算法变更。

## 实际验收

| 检查              | Windows                                   | Linux                                  |
| ----------------- | ----------------------------------------- | -------------------------------------- |
| 环境              | PowerShell、Node22.18.0                   | Debian12 x64容器、Node26.13.0、UID1000 |
| 工作区单元测试    | 301/301，无跳过                           | 301/301，无跳过                        |
| 候选隔离安装      | 成功，禁用安装脚本                        | 成功，禁用安装脚本                     |
| npm命令shim       | CMD帮助及Vue/React预览通过                | 原生bin帮助及Vue/React预览通过         |
| 安装后CLI真实创建 | 官方Monorepo、Vue TS和React JS            | 同左                                   |
| Three / 模型补装  | embedded / external两组通过               | 同左                                   |
| 模型双入口构建    | 两组base、密文解密、无原GLB/KEY字面量通过 | 同左                                   |
| 工作区ready       | 8/8，随后check通过                        | 同左                                   |
| 重复保护          | 8项、零子进程、179份文件内容/修改时间不变 | 同左                                   |
| 损坏候选          | 安装前拒绝                                | 安装前拒绝                             |
| 安装返回23        | 受控失败后临时安装根已清理                | 同左                                   |

真实生成从安装包内的CLI解释执行，资源和子CLI均来自安装目录；npm创建的命令shim另行直接执行帮助与预览。回归工具本身和密文验证器来自开发仓库，不计为npm运行时资源。调用目录包含中文、空格、&和单引号；帮助和dry-run没有生成项目。

模型夹具是脚本自建最小自包含GLB，不读取用户模型，也不作为浏览器/WebGL效果验收。UI/CSS在本轮包入口中只做参数预览，真实补装代表证据保留于此前Windows/Linux源码回归。未扩大为全部UI/CSS/引擎组合、其他Linux架构或macOS原生通过。上游peer范围、TypeScript7实验性和引擎大分块提示保持。

## 复验与分发

仓库根可对该实际候选执行：

```powershell
$candidate = Join-Path (Get-Location) 'dist/cli/pack-1KlK5n/adui-viteplus-starter-0.1.3.tgz'
node scripts/verify-cli-package.mjs $candidate
```

跨机器复制tgz及侧车清单到同一目录；验收命令见[Harness](HARNESS.md)。只试用配置向导时，使用[CLI本地启动方式](CLI_DISTRIBUTION.md)的`vp dlx -- <实际tgz>`或`pnpm dlx <实际tgz>`。

发布dry-run已通过，返回版本和integrity与候选一致；这不是上传结果。npm官方registry只读检查仍为latest0.1.2、未包含0.1.3。后续发布需用户明确授权，并重新核对源提交、完整性及文档状态；步骤见[人工发布说明](RELEASING.md)。本轮没有CI、自动发布或部署配置。

安装目录、生成的回归工程由工具finally清理。证据保留在忽略目录`dist/verification/v013-*`，包括包清单、差异、两端安装/测试日志、失败保护检查及publish dry-run；实际候选保留，不删除旧归档。

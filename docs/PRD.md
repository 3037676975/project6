# Project6 PRD · v2.4

**状态：** Current / 最新产品基准  
**当前产品构建：** Project6 **v63**  
**总纲：** `docs/PROJECT_CHARTER.md`

## 1. 产品定位

Project6 是面向低预算创作者的 **AI HTML 视频项目生产后台**。一个视频就是一个 Project，围绕完整脚本、Garden 画面、本地 TTS、整片预览、项目内 SFX / BGM 和本地高清视频导出完成生产。

Project6 当前优先级不是继续扩展大型模块，而是把第一支完整视频从脚本跑到最终成片，并把链路沉淀为可复用流程。

## 2. 核心对象

Project 内包含：Script、Chapter、Scene、Garden 视觉、Scene Motion、验收 Gate、TTS JSON、**本地配音源库**、整片预览、项目内 SFX / BGM、本地高清录制、视觉 QA。

## 3. P0 主流程

```text
完整口播
→ AI 拆 Scene / 设计 Garden 画面
→ 每 Scene 实际渲染 + 截图 QA
→ 用户确认整片视觉
→ 解锁完整 TTS JSON
→ 用户本地 IndexTTS 生成 001～042
→ ZIP 上传
→ 保存为本地“配音源 N”
→ 可重复上传多个完整 ZIP / 切换配音源
→ 整片本地音画预览
→ timing 微调
→ 项目内 SFX / BGM
→ 双窗口高清本地录制
```

## 4. 视频作品页

必须独立展示一个完整视频项目；Chapter 只用于组织；用户实际面对一份完整口播、一个总 JSON、多个可复用配音源和一个整片预览。

必须显示 Gate、验收规则、下一步和**当前产品版本**。

独立资源页不能取代作品页成为主生产入口。

## 5. TTS JSON

Canonical：`presentations/<project>/full-tts-tasks.json`。

必须：可见预览、一键复制、001～042 稳定编号。当前正式 engine 为 `IndexTTS 2.5`。

## 6. 本地配音导入与配音源库

Project6 浏览器端必须：
- JSZip 解压；
- 支持 ZIP 子目录；
- 自动 001 ↔ Scene001；
- 完整 ZIP 可作为一个独立“配音源”保存；
- **只有 ZIP 持久保存，单个 MP3 / WAV / M4A / OGG 不持久保存；**
- 一个 ZIP = 一个配音源，按 `配音源 1 / 配音源 2 / 配音源 3 ...` 管理；
- 每个配音源保存原 ZIP Blob、ZIP 文件名、创建时间、解压后的 Scene 音频 Blob、完整度；
- 使用浏览器 IndexedDB 本地保存，不上传服务器、不提交 GitHub；
- 当前配音源必须可记忆，刷新后继续使用；
- 支持配音源试听、切换、删除；
- 录制控制台必须可以直接选择已保存配音源；
- 单个音频仍可作为临时兜底导入，但刷新后不保留；
- 浏览器存储被用户主动清理后，本地配音源允许丢失；系统应 best-effort 请求 Persistent Storage。

## 7. 整片播放器

必须支持：播放、暂停/继续、上一张/下一张、进度跳转、全屏、本地配音源注入、音频 ended 自动进入下一 Scene。

当前 Scene 切换时，播放器必须从当前选中的配音源读取对应的 001～042 音频。

Pause 必须同时暂停 narration 与当前 GSAP timeline。

## 8. Garden 视觉质量

- Scene 001 为质量 Anchor，并以 `HARNESS ENGINEERING` 为主标题；
- Scene 002～042 必须逐 Scene 独立构图；
- 禁止统一左文案右内容；
- 禁止只换文字的卡片模板；
- 禁止只有 fade/pop 的伪动画；
- 画面必须真正表达关系、空间、状态、反馈或过程；
- 主要阅读文字在 1080P 成片里必须清晰。

正式 Scene 修改后必须实际 Chromium 渲染并截图。没有 Screenshot QA，不允许标记视觉完成。

## 9. 16:9 等比预览

逻辑 Stage 固定 1920×1080；缩放时 `stage-frame` 必须同步拥有缩放后的布局尺寸。窗口模式、浏览器缩放和全屏必须共享同一 16:9 坐标关系。

## 10. 双窗口高清本地录制

正式站点：`https://video.smilechat.cn`。

正式录制架构：

```text
record.html 录制控制台
        ↓ BroadcastChannel
capture.html 纯成片窗口
        ↓ 浏览器标签页捕获
Canvas 输出
        ↓
1080P / 1440P / 4K 本地文件
```

要求：
- 录制控制台与成片窗口分离；
- `capture.html` 只显示纯 16:9 Garden 成片，不显示控制按钮、REC、工作台；
- 控制台负责上一页 / 下一页 / 播放 / 暂停 / 旁白 / 配音源 / 配乐 / 录制状态；
- 当前选中的配音源在成片窗口中播放；
- 录制时用户选择纯成片标签页；
- 输出档位：1080P 1920×1080 / 1440P 2560×1440 / 4K 3840×2160；目标 60fps；
- 显示实际 SOURCE → OUTPUT；低分辨率源不得冒充原生高清；
- 录制支持开始、暂停/继续、停止并保存、取消并丢弃；
- 文件只在浏览器本地下载，不上传服务器。

## 11. 验收状态系统

状态只允许：PASS / REVIEW / WAITING / LOCKED。

| Gate | 内容 |
|---|---|
| A | 完整口播 |
| B | Garden 视觉 + Screenshot QA |
| C | 本地 IndexTTS + 配音源库 |
| D | 整片音画预览 |
| E | 项目内 SFX / BGM |
| F | 双窗口高清本地录制 |

## 12. 版本与缓存管理

当前 canonical build：`assets/version.js` → `v63`。

要求：
- 正式页面显示 `P6 · v63`；
- `works.html / full-video.html / record.html / capture.html` 必须以 canonical build 为准；
- 正式静态资源与 iframe 链接使用同版本缓存参数；
- 发布下一版时，页面、缓存、DEVELOPMENT_STATUS、ACCEPTANCE 必须同批更新；
- 历史实现文件名可以保留，但不能作为 UI 当前版本来源。

## 13. SFX 策略

Project6 v63 不再提供独立 `audio.html` / “动画音效库”页面。

SFX 与人物配音仍严格分开，但 SFX 只归属具体视频 Project：

```text
Gate D 整片音画 PASS
→ Gate E 项目内 SFX / BGM
→ 只添加当前 Scene 真正需要的 reveal / whoosh / click / confirm / accent 等声音
```

禁止为了“以后可能会用”先堆一个脱离真实项目的音效资源库。

## 14. 后台 UI 设计系统

Project6 v63 后台使用 `assets/admin-ui-v63.css` 作为共享视觉层。

设计方向：**Editorial Production Console / 创作控制台**。

要求：
- 功能优先，不因美化改变行为；
- 信息结构本身承担视觉层级；
- 避免通用 SaaS 卡片模板；
- 减少无意义渐变、阴影、全大写标签与统一圆角；
- 状态色只服务 Gate / 系统反馈；
- 支持键盘 focus、移动端和 `prefers-reduced-motion`；
- 首页、作品页、组件库、动效库、Garden 手册、项目总纲视觉语言应统一。

## 15. 当前验收项目

Harness Engineering / 42 Scene / Project6 v63。

当前目标：

```text
配音源 ZIP 持久化实机验证
→ 多配音源切换 / 试听
→ 整片音画预览 + timing
→ Gate D PASS
→ 项目内 SFX / BGM
→ 双窗口高清录制
→ 最终视频
```

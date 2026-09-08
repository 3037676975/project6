# Project6 PRD · v2.1

**状态：** Current / 最新产品基准  
**总纲：** `docs/PROJECT_CHARTER.md`

## 1. 产品定位

Project6 是面向低预算创作者的 **AI HTML 视频项目生产后台**。一个视频就是一个 Project，围绕完整脚本、Garden 画面、本地 TTS、整片预览、最后 SFX 和本地导出完成生产。

## 2. 核心对象

Project 内包含：Script、Chapter、Scene、Garden 视觉、Scene Motion、验收 Gate、TTS JSON、本地 IndexTTS 音频、整片预览、动画 SFX、本地录制、视觉 QA。

## 3. P0 主流程

```text
完整口播
→ AI 拆 42 Scene / 设计 Garden 画面
→ 每 Scene 实际渲染 + 截图 QA
→ 用户确认整片视觉
→ 解锁完整 TTS JSON
→ 用户本地 IndexTTS 生成 001～042
→ 一个 ZIP 上传
→ 浏览器自动匹配 42/42
→ 整片本地音画预览
→ timing 微调
→ 最后动画 SFX
→ 一键 1080P 本地录制
```

## 4. 视频作品页

必须独立展示一个完整视频项目；Chapter 只用于组织；用户实际面对一份完整口播、一个总 JSON、一个总音频包和一个整片预览。

必须显示 Gate、验收规则、下一步和当前版本。

## 5. TTS JSON

Canonical：`presentations/<project>/full-tts-tasks.json`。

必须：可见预览、一键复制、001～042 稳定编号。当前正式 engine 为 `IndexTTS 2.5`。

## 6. 本地配音导入

Project6 浏览器端必须：

- JSZip 解压；
- 支持 ZIP 子目录；
- 支持直接多选音频兜底；
- 自动 001 ↔ Scene001；
- 42/42 才进入整片音画 Gate；
- ObjectURL 只存在浏览器内，不上传服务器。

## 7. 整片播放器

必须支持：播放、暂停/继续、上一张/下一张、进度跳转、全屏、本地 IndexTTS 注入、音频 ended 自动进入下一 Scene。

Pause 必须同时暂停 narration 与当前 GSAP timeline。

## 8. Garden 视觉质量

### 8.1 视觉原则

- Scene 001 为质量 Anchor；
- Scene 002～042 必须逐 Scene 独立构图；
- 禁止统一左文案右内容；
- 禁止只换文字的卡片模板；
- 禁止只有 fade/pop 的“伪动画”；
- 画面必须真正表达关系、空间、状态、反馈或过程；
- 主要阅读文字在 1080P 成片里必须清晰，不允许依赖小字填满画面。

### 8.2 强制 Screenshot QA

每个正式 Scene 修改后必须实际渲染并截图。自动化：

- `scripts/visual-qa.mjs`
- `.github/workflows/visual-qa.yml`

要求生成 001～042 的 1920×1080 PNG 与 `qa/visual-report.json`。

至少检查：文字过小、DOM 越界、遮挡、重心、层级、留白、逻辑顺序、是否真正可视化。

**没有渲染截图 QA，不允许标记视觉完成。**

## 9. 本地 1080P 录制

正式播放器必须提供「一键录制 1080P」。

要求：

- 只录 `.stage` 中间视频区域；
- 不录后台工具栏；
- 请求 1920×1080 / 60fps；
- 当前标签页视频 + 标签页音频；
- 使用 Region Capture (`CropTarget.fromElement(stage)` + `videoTrack.cropTo`)；
- 不支持精确裁切的浏览器不允许退化成录整个页面；
- VP9 + Opus 优先；
- 高码率（目标 12Mbps video / 192kbps audio）；
- 录制完成只触发浏览器 WebM 下载；
- 不上传服务器、不保存 Project6 后端。

## 10. 验收状态系统

整片最低 Gate：

| Gate | 内容 |
|---|---|
| A | 完整口播 |
| B | Garden 视觉 + Screenshot QA |
| C | 本地 IndexTTS |
| D | 整片音画预览 |
| E | 动画 SFX |
| F | 本地 1080P 录制 |

状态只允许：PASS / REVIEW / WAITING / LOCKED。

## 11. 动画音效库

SFX Library 与人物配音严格分开。SFX 永远在完整音画通过后处理。

## 12. 当前验收项目

Harness Engineering / 42 Scene。

当前目标：

```text
v41 视觉 polish
→ 自动 Screenshot QA
→ 用户视觉确认
→ 完整 TTS JSON
→ 本地 IndexTTS 001～042
→ ZIP
→ 整片音画预览
→ SFX
→ 1080P 本地录制
```

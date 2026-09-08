# Project6 Active Decisions

> 最新用户明确决策，优先级高于旧实现细节。

## 2026-09-09 · 整片生产模式

### 1. 一个视频就是一个完整 Project

后台不再按章节分别做 TTS 交接。章节只用于内部组织和导航，用户实际面对：

```text
一个完整视频项目
→ 一份完整口播稿
→ 一套完整 HTML / Garden 画面
→ 一个完整 TTS JSON
→ 一个完整本地音频 ZIP
→ 一个完整本地音画预览
→ 最后统一加动画 SFX
```

### 2. 职责边界

AI / Project6 负责：完整口播、内部 Chapter / Scene、Garden 视觉与动画、编号维护、总 TTS JSON、本地音频映射、整片预览、视觉 QA。

用户负责：确认整片口播与画面、一次复制整片 JSON、本地 IndexTTS 2.5 生成全部语音、上传一个完整 ZIP。

Project6 不负责本地 GPU 推理。

### 3. Harness Engineering 当前规格

- 7 个内部章节；
- 42 Scene；
- 42 段连续口播；
- 编号固定 `001`～`042`；
- TTS：`presentations/harness-engineering/full-tts-tasks.json`；
- 数据：`presentations/harness-engineering/full-video-data.js`；
- 播放器：`presentations/harness-engineering/full-video.html`。

### 4. TTS 交接必须整片一次完成

```text
完整口播 + 全部画面
→ 用户一次确认
→ 一键复制完整 JSON
→ 本地 IndexTTS 生成 001～042
→ 一个 ZIP
→ Project6 识别 42/42
→ 注入整片播放器
→ 完整音画预览
```

禁止退回“一章一个 JSON”。

### 5. 播放器正式要求

必须提供：播放、暂停/继续、上一张/下一张、Scene 进度跳转、全屏、本地 IndexTTS 注入、音频结束自动下一 Scene。

上传的新本地音频优先级必须高于历史 Edge TTS。

**v42 新增硬要求：预览必须是真正的 16:9 等比缩放。**

- 逻辑画布固定 1920×1080；
- 缩放时外层 `stage-frame` 必须同步拥有缩放后的宽高；
- 禁止只对 1920×1080 DOM 做 `transform: scale()`，却让布局仍按原尺寸占位；
- 窗口模式、浏览器缩放、全屏都必须保持相同构图比例和坐标关系。

### 6. ZIP 导入

- 支持完整 ZIP 与直接多选音频；
- 支持 `audio/001.mp3` 子目录；
- JSZip 失败必须明确提示并提供多选兜底；
- “文件已识别”不等于“播放器已切换音源”，必须实际注入播放器。

### 7. Garden v42 视觉原则

Scene 001 是视觉 Anchor，但封面主题必须一眼明确：**HARNESS ENGINEERING 是主标题**，中文问题只作为副标题 / Hook。

Scene 002～042 必须逐 Scene 设计，禁止统一左右排版、统一卡片模板和统一 fade。

每张动画必须能解释至少一种：关系 / 空间 / 状态 / 反馈 / 过程。

### 8. 强制门禁：渲染截图 QA

**代码写完不等于画面完成。**

每次修改正式视频 Scene 后必须：

```text
实现 Scene
→ Chromium 实际渲染
→ 1920×1080 截图
→ 检查字号 / 遮挡 / 溢出 / 对齐 / 留白 / 重心 / 逻辑 / 可视化表达
→ 不通过则返工
→ QA 通过后才允许标记 REVIEW
```

仓库使用：
- `scripts/visual-qa.mjs`
- `.github/workflows/visual-qa.yml`

自动为 001～042 生成截图和 `qa/visual-report.json`。

### 9. 1080P 本地录制：HTTP 部署使用 localhost bridge

浏览器的 `getDisplayMedia / Region Capture` 要求安全上下文。Project6 正式站点当前是 HTTP IP，因此直接在服务器 URL 点录制一定会被浏览器拒绝。

不引入 Cloudflare、域名或第三方隧道。正式低门槛方案：

```text
Project6 HTTP Server
      ↓ 本机标准库代理
http://127.0.0.1:28444
      ↓ localhost 被浏览器视为安全上下文
一键录制 1080P
```

仓库提供：
- `tools/project6-recording-localhost.py`
- `tools/start-project6-recording.bat`

Windows 用户双击 BAT 后即可打开 localhost 录制入口。

录制要求保持：
- 一键录制；
- 只录中间 `.stage`，不录 Project6 后台工具栏；
- 请求 1920×1080 / 60fps；
- 捕获当前标签页视频 + 标签页音频；
- Chromium Region Capture 精确裁切；
- 不支持精确裁切时不退化成录整个后台；
- VP9/Opus 优先，高码率；
- 完成后浏览器本地下载 WebM；
- **不上传服务器、不存 Project6 后端。**

### 10. 动画音效库 ≠ 人物配音

SFX 仍是整片最后环节，只管理 reveal / whoosh / transition / click / tick / confirm / accent / digital 等短音效。

### 11. 文档同步

Garden 手册、项目总纲、PRD、开发状态、验收规则必须跟当前整片模式和最新硬要求同步。禁止页面已经升级、文档仍保留旧规则。

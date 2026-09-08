# Project6 Active Decisions

> 最新用户明确决策，优先级高于旧实现细节。

## 2026-09-09 · 整片生产模式

### 1. 一个视频就是一个完整 Project

后台不再按章节分别做 TTS 交接。章节只用于内部组织和导航，用户实际操作面对的是：

```text
一个完整视频项目
→ 一份完整口播稿
→ 一套完整 HTML / Garden 画面
→ 一个完整 TTS JSON
→ 一个完整本地音频 ZIP
→ 一个完整本地音画预览
→ 最后统一加动画 SFX
```

### 2. AI / Project6 / 用户三方职责

AI / ChatGPT 负责：
- 整理完整口播；
- 拆内部 Chapter / Scene；
- 设计并实现全部 Garden 画面；
- 维护画面与口播编号；
- 输出整片 TTS JSON；
- 接收本地音频后完成整片预览映射。

用户负责：
- 确认整片口播和画面；
- 一次复制整片 TTS JSON；
- 在本地 IndexTTS 2.5 生成全部语音；
- 上传一个完整 ZIP。

Project6 不负责本地 GPU 推理。

### 3. Harness Engineering 当前整片规格

- 7 个内部章节；
- 42 个 Scene；
- 42 段连续口播；
- 文件编号固定 `001`～`042`；
- canonical JSON：`presentations/harness-engineering/full-tts-tasks.json`；
- canonical 画面数据：`presentations/harness-engineering/full-video-data.js`；
- canonical 整片播放器：`presentations/harness-engineering/full-video.html`。

### 4. TTS 交接必须是整片一次完成

正确流程：

```text
完整口播 + 全部画面
→ 用户一次确认
→ 一键复制 full-video JSON
→ 本地 IndexTTS 生成 001～042
→ 导出一个 ZIP
→ 上传 Project6
→ 浏览器自动识别 42/42
→ 注入整片播放器
→ 完整音画预览
```

禁止重新退回“第一章一份 JSON、第二章再一份 JSON”的旧做法。

### 5. 整片预览播放器要求

必须提供：
- 播放；
- 暂停 / 继续；
- 上一张 / 下一张；
- 整片进度跳转；
- 全屏；
- 本地 IndexTTS 音频注入；
- 音频结束后自动进入下一 Scene。

上传的新本地音频优先级必须高于旧 Edge TTS。

### 6. ZIP 导入

- 支持一个完整 ZIP；
- 兼容 ZIP 内 `audio/001.mp3` 这类子目录；
- 也兼容直接多选 001～042；
- JSZip 加载失败时必须明确提示，并保留直接多选音频兜底；
- “上传成功”不等于“播放器已切换音源”，必须实际注入播放器才算通过。

### 7. 动画音效库 ≠ 人物配音

动画音效是整片最后一个环节，只管理：reveal、whoosh、transition、click、tick、confirm、accent、digital 等短 SFX。

### 8. Garden 手册、项目总纲、PRD、开发状态、验收规则必须和整片模式同步

禁止页面已经是整片模式，而文档仍写“第一章未 PASS 禁止开发第二章”。

# Project 002 · 小黑云 LangChain Agent 实战课 · ACCEPTANCE

## 项目边界

- 独立 slug：`aigc-xiaoheiyun-agent`
- **Project 001 Harness Engineering 已完成，本项目禁止修改其脚本、Scene、播放器、Gate、TTS、本地状态。**
- Project 002 严格复制 Project 001 的完整视频生产框架，只替换本项目业务内容与视觉镜头。
- 画幅：16:9；9 Chapters / 42 Scenes。
- 禁止 CSS 小黑云 / 黑色云朵角色。项目识别只保留左上角文字 HUD。

## 完整生产结构

```text
完整脚本
→ 用户确认
→ 42 段 TTS JSON
→ 导入 001～042 ZIP / 多音频
→ Project 002 独立 IndexedDB
→ 42 Scene Cue Sync 播放器
→ SFX / BGM
→ record.html + capture.html
→ 1080P / 1440P / 4K 本地录制
```

## Gate A · 完整口播 — REVIEW

- 9 Chapters / 42 Scenes 已整理。
- 术语统一为 ChatGPT / AutoGPT / Computer Use / Deep Research / Agent / LangChain / LangGraph / LangSmith / RAG / MCP / Multi-Agent。
- 用户仍可在 Project 详情页一次确认完整口播后复制完整 TTS JSON。

## Gate B · 视觉制作 — PASS 42/42

- 42 Scene 全部具有独立视觉结构，不再停留在 001～004 Anchor。
- 统一使用 Project 001 的 warm-keynote / 1920×1080 / HUD / 播放器框架。
- 动画：GSAP + DrawSVGPlugin + MotionPathPlugin。
- 镜头语言大量复用 VideoShotCraft：Before/After Slider、Cycle Glass Node Morph、Integration Hub Map、Orbit Ring、Basic 3D Scene、Trace、Funnel、Layer Stack、System Loop 等。
- 每个 Scene 至少有 Cue 01～04，Secondary 信息不会页面加载后全部出现。

### Cue Sync 强制规则

真实本地 TTS 播放时：

```text
progress = narration.currentTime / narration.duration
GSAP timeline.progress(progress)
```

因此旁白讲到对应内容时，对应关系图、节点、流程或结论才进入 / 高亮。暂停旁白同时冻结动画；继续时从同一进度恢复。没有本地 TTS 时，才按口播字数估算 Scene 时长进入视觉演示模式。

## Gate C · 本地 IndexTTS — REVIEW READY

- `full-tts-tasks.json` 保持 001～042 连续任务。
- Project 详情页支持完整 JSON 复制。
- 支持 ZIP / 多音频导入。
- IndexedDB：`project6-aigc-xiaoheiyun-agent-audio`，不与 Harness 混用。

真实 42 段音频仍需用户本地生成 / 导入，因此 Gate C 不伪标 PASS。

## Gate D · 整片音画 — VISUAL READY

播放器支持：42 Scene 上一张 / 下一张、播放 / 暂停、Cue Sync、声音开关、全屏、Scene 进度 0～41、本地 TTS 注入与 IndexedDB 恢复、音频结束自动进入下一 Scene。

## Gate E · SFX / BGM — READY

- Cue 边界加入轻量程序化 `whoosh / tick / chime`，不依赖外部版权音频文件。
- Recorder 保留 Project 001 同款本地 BGM 选择、音量和播放控制。

## Gate F · 高清本地录制 — READY

- `record.html`：录制控制台；
- `capture.html`：纯 16:9 成片窗口；
- Capture 与主播放器使用同一套 42 Scene Renderer；
- BroadcastChannel：`project6-aigc-xiaoheiyun-agent-control`；
- 1080P / 1440P / 4K；
- 开始 / 暂停 / 继续 / 停止并保存 / 取消；
- 输出只保存在本地。

## 验收记录

- `QA_REPORT.md`：42 Scene 截图与自评结论，42/42 PASS；
- `SHOTCRAFT_MAP.md`：每个 Scene 对应的 VideoShotCraft 镜头配方。

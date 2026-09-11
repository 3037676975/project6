# Project 002 · 小黑云 LangChain Agent 实战课 · ACCEPTANCE

## 项目边界

- 独立 slug：`aigc-xiaoheiyun-agent`
- **Project 001 Harness Engineering 已完成，本轮禁止修改其脚本、Scene、播放器、Gate、TTS、本地状态。**
- Project 002 必须严格复制 Project 001 的“完整项目框架”，只替换本项目自己的业务内容。
- 画幅：16:9；规划：9 Chapters / 42 Scenes。
- **禁止再使用 CSS 绘制的小黑云 / 黑色云朵角色。**项目识别只保留左上角文字 HUD。

## 必须与 Project 001 一致的项目结构

```text
完整脚本
→ 用户确认
→ 完整 42 段 TTS JSON
→ 导入 001～042 ZIP / 多音频
→ Project 002 独立 IndexedDB 保存
→ 注入整片播放器
→ 本地音画预览
→ SFX / BGM
→ record.html + capture.html 双窗口录制
→ 1080P / 1440P / 4K 本地文件
```

## Gate A · 完整口播 — REVIEW

- 已整理为 9 Chapters / 42 Scenes。
- 术语已统一为 ChatGPT / AutoGPT / Computer Use / Deep Research / Agent / LangChain / LangGraph / LangSmith / RAG / MCP / Multi-Agent。
- Project 详情页已经恢复与 Project 001 相同的“完整视频脚本 + 一次确认”流程。

通过条件：用户确认完整口播。

## Gate B · Garden 视觉 — ANCHOR REVIEW

当前 Scene 001～004 是 Visual Anchor：

| Scene | 核心关系 | 当前结构 |
|---|---|---|
| 001 | ChatGPT 把 AI 推向大众 | 时间 / 事件 / 大门隐喻 / Before-After / 用户感知 |
| 002 | Chatbot 会说但不会做 | 两侧能力清单 + 执行鸿沟 + 4 维对比表 |
| 003 | Chat → Act 技术演进 | 2022～2026 时间线 + 4 层能力总结 |
| 004 | Agent 企业价值 | 4 业务矩阵 + 热度指标 + 价值公式 |

强制视觉规则：
- 1920×1080；warm-keynote；HUD / toolbar / scale 参考 Project 001。
- 一句口播里有多个事实时，必须把多个事实可视化，不允许只有一个大标题和一个装饰图。
- 禁止 CSS mascot。
- Scene 005～042 在 Anchor 通过后继续逐 Scene 开发。

## Gate C · 本地 IndexTTS — REVIEW READY

已经建立完整 `full-tts-tasks.json`：
- 42 个连续任务：001～042；
- IndexTTS 2.5；
- 与 Project 001 一样可从项目详情一键复制完整 JSON；
- 支持导入一个 ZIP 或直接多选 001～042 音频；
- 浏览器状态与音频使用 Project 002 独立 namespace / IndexedDB，不与 Harness 混用。

**注意：有完整任务结构不代表 Gate C 已 PASS。** 仍需用户确认脚本并实际生成 / 导入 42 段音频。

## Gate D · 整片音画 — WAITING

播放器已经支持：
- 上一张 / 下一张；
- 播放 / 暂停；
- 声音开关；
- 全屏；
- Scene 进度；
- `P6_LOCAL_AUDIO` 本地音频注入；
- 从 Project 002 IndexedDB 自动恢复本地音频；
- 音频结束后自动进入下一 Scene。

当前只完成 001～004 Visual Anchor，所以 Gate D 仍 WAITING。

## Gate E · 项目内 SFX / BGM — LOCKED

- Project 详情页保留项目内 SFX Gate。
- `record.html` 保留与 Harness 一致的本地 BGM 选择、播放与音量控制。

## Gate F · 高清本地录制 — BROWSER TEST

已按 Project 001 结构建立：
- `record.html`：录制控制台；
- `capture.html`：纯 16:9 成片窗口；
- 独立 BroadcastChannel：`project6-aigc-xiaoheiyun-agent-control`；
- 1080P / 1440P / 4K；
- 开始 / 暂停 / 继续 / 停止并保存 / 取消；
- 输出只保存在本地。

当前框架存在，但整片完成前不能标记 Gate F PASS。

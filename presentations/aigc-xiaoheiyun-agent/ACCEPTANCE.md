# Project 002 · 小黑云 LangChain Agent 实战课 · ACCEPTANCE

## 项目边界

- 独立 slug：`aigc-xiaoheiyun-agent`
- **Project 001 Harness Engineering 已完成，本轮禁止修改其脚本、Scene、播放器、Gate、TTS、本地状态。**
- 本项目只复用 Project 001 的生产规范：独立 Project、Garden 画面方法、1920×1080 舞台、Gate、整片 TTS、双窗口录制。
- 画幅：16:9。
- 规划：9 Chapters / 42 Scenes。
- 主持 IP：小黑云；角色用于识别与引导，不能压过知识画面。

## 本轮用户明确要求 · 2026-09-11

1. 第二个项目必须以第一个 Harness Engineering 项目为规范基线，而不是自创一套低质量 Demo。
2. 原始课程转写不能直接粘贴；先修正 ASR、技术术语和时间线，再重写成自己的正式口播。
3. 视觉必须遵守 Garden / web-video-presentation 的信息表达逻辑；Scene 001 必须先成为整片 Visual Anchor。
4. 上一版“深色科技 + 卡片堆叠”视觉判定为不通过，本轮废弃。
5. 先做对 Scene 001～004；用户确认后，再继续 Scene 005～042。

## Gate A · 完整口播 — REVIEW

当前完成：
- 已把原始约 7 分钟转写重构为 9 Chapters / 42 Scenes；
- 已修正 `chi gbt / 蓝chain / long graph / length smith / RG / A镜` 等 ASR 错词；
- 技术名词统一为 ChatGPT / AutoGPT / Computer Use / Deep Research / Agent / LangChain / LangGraph / LangSmith / RAG / MCP / Multi-Agent；
- Deep Research 时间线修正为 2025，不沿用原转写里的 2024 错误；
- LangChain 当前口径改为 Agent framework，不再把“Chain API”当核心；
- LangGraph 口径为更底层 agent runtime / orchestration；
- Deep Agents 口径为更高层 Agent Harness。

通过条件：用户确认完整口播。

## Gate B · Garden 视觉 — ANCHOR REVIEW

Scene 001～004 已重做：

| Scene | 核心关系 | 视觉结构 |
|---|---|---|
| 001 | 2022.11.30 / ChatGPT 把 AI 推向大众 | “被推开的门”空间隐喻 + 对话任务流入 |
| 002 | Chatbot 会说但不会做 | 聊天牢笼 vs 搜索 / 工具 / 完成任务 |
| 003 | Chat → Act 的技术演进 | 2023～2026 横向时间线 |
| 004 | Agent 进入企业工作 | 中心 Agent → 工作流 / 分析 / 客服 / 数字员工 |

视觉基线：
- 1920×1080 固定逻辑舞台；
- warm-keynote：米白纸面、暖棕文本、青绿主强调、橙色辅助；
- HUD / toolbar / scale 逻辑参考 Project 001；
- 每张画面表达关系、空间、过程或状态，禁止复制同一左右卡片模板；
- 小黑云只作为主持 IP 点缀；
- Scene 001 为项目 Visual Anchor。

### Screenshot QA · 本轮实测

已用 Chromium 实际渲染 1920×1200 容器并检查 Scene 001～004：
- 4/4 成功渲染；
- 16:9 舞台比例正常；
- 无可见文字溢出；
- 无主体遮挡；
- Scene 之间不是重复卡片模板；
- Scene 001 主标题、日期、门的空间隐喻清晰；
- Scene 002 对比关系成立；
- Scene 003 时间线信息层级清晰；
- Scene 004 企业关系图无遮挡。

当前仍为 `ANCHOR REVIEW`，等待用户视觉确认。

## Gate C · 本地 IndexTTS — WAITING

`full-tts-tasks.json` 现在故意保持锁定，`tasks=[]`。

**原因：**严格遵守 Project 001 的 Gate。完整口播与 Visual Anchor 未确认前，不提前生成正式 TTS，避免错误脚本进入本地配音流水线。

## Gate D · 整片音画 — LOCKED

Gate B / C PASS 后进入。

## Gate E · 项目内 SFX / BGM — LOCKED

Gate D PASS 后进入。

## Gate F · 高清本地录制 — LOCKED

整片完成后进入双窗口录制实机验证。

## 技术资料基线

- LangChain OSS：Agent framework；核心 agent loop 为 `create_agent`。
- LangGraph：low-level orchestration framework / runtime；durable execution、streaming、human-in-the-loop、persistence。
- Deep Agents：更高层 Agent Harness，包含 planning、context management、subagents 等。
- OpenAI Deep Research：2025-02-02 发布。
- Anthropic Computer Use：2024-10-22 公开 beta。

官方来源：
- https://www.langchain.com/oss-overview
- https://docs.langchain.com/oss/python/langchain/overview
- https://docs.langchain.com/oss/python/langgraph/overview
- https://openai.com/index/introducing-deep-research/
- https://www.anthropic.com/news/developing-computer-use

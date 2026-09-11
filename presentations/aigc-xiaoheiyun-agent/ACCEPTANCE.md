# Project 002 · AIGC 小黑云 Agent / LangChain 入门 · ACCEPTANCE

## 项目边界

- 独立 slug：`aigc-xiaoheiyun-agent`
- 不复用 Harness Engineering 的脚本、Scene、Gate、音频源或 localStorage / IndexedDB key。
- 目标时长：7分30秒～8分。
- 画幅：16:9。
- 主持 IP：AIGC 小黑云。
- 视觉方向：深色科技 + 暖橙围巾点缀 + Garden `web-video-presentation`。

## 当前阶段

当前只做 Chapter 1 视觉 Anchor，确认视觉语言后再批量开发其余章节。

### Gate A · 完整口播 — REVIEW

通过条件：
- 9 Chapter 口播逻辑完整；
- LangChain / LangGraph / RAG / MCP 等技术口径完成最新资料核验；
- 用户确认最终整片口播。

### Gate B · Garden 视觉 — REVIEW / ANCHOR

当前已创建 Scene 001～004 作为 Chapter 1 Anchor。

通过条件：
- 1920×1080 实际渲染；
- 小黑云角色、深色科技、暖橙点缀视觉成立；
- Scene 之间不是重复卡片模板；
- Screenshot QA 无溢出、遮挡、字号过小和逻辑错误；
- 用户确认后再继续 Scene 005～045。

### Gate C · 本地 IndexTTS — WAITING

当前 `full-tts-tasks.json` 仅为 4 段 Anchor 草稿，不是正式整片 TTS 交付。

### Gate D · 整片音画 — LOCKED

Gate B、C 通过后进入。

### Gate E · 项目内 SFX / BGM — LOCKED

Gate D PASS 后进入。

### Gate F · 高清本地录制 — LOCKED

整片完成后创建正式 record / capture 录制链路并实机验证。

## 最新技术口径

- LangChain：以 `create_agent` 为核心的 Agent framework，提供模型、工具、消息、MCP、middleware 等构建能力。
- LangGraph：更底层的 durable agent runtime / orchestration，适合状态、持久化、人工介入、重试、复杂分支与长任务。
- LangChain agents 构建在 LangGraph runtime 上；简单 Agent 优先 LangChain，需要更细控制时下沉 LangGraph。

官方参考：
- https://www.langchain.com/oss-overview
- https://www.langchain.com/langchain
- https://www.langchain.com/langgraph
- https://reference.langchain.com/

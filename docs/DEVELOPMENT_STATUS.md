# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden → motions/components。

## 当前 Phase

**Phase 2 · Project 002 Visual Anchor 重做 · Project6 v64**

当前策略：**Project 001 Harness Engineering 原项目保持不动；Project 002 小黑云 LangChain Agent 实战课严格复用 Project 001 的生产规范，先完成正确的完整脚本和 Scene 001～004 Visual Anchor。**

## 当前入口

- Product build：**v64**
- 视频项目库：`works.html?v=64-p2a2`
- Project 001：`project-harness-engineering.html?v=64`
- Project 002：`project-aigc-xiaoheiyun-agent.html?v=64-p2a2`
- Project 002 Anchor：`presentations/aigc-xiaoheiyun-agent/full-video.html?v=64-p2a2`

## Project 001 · Harness Engineering

**本轮未修改业务文件。** 它继续作为多项目架构和 Garden 制作规范基线。

## Project 002 · 当前 Gate

| Gate | 状态 | 当前进度 |
|---|---|---|
| A 完整口播 | REVIEW | 原始课程转写已清洗并重写为 9 Chapters / 42 Scenes |
| B Garden 视觉 | REVIEW | Scene 001～004 已按 warm-keynote / Garden 重做并完成 Chromium Screenshot QA |
| C 本地 IndexTTS | WAITING | `full-tts-tasks.json` 保持锁定，等待 A/B PASS |
| D 整片音画 | LOCKED | 等 B/C PASS |
| E 项目内 SFX / BGM | LOCKED | 等 D PASS |
| F 高清本地录制 | LOCKED | 整片完成后进入 |

## 本轮纠正内容 · 2026-09-11

### 1. 脚本纠正

- 不再使用上一版自创的短脚本；
- 以用户提供的约 7 分钟原始转写为内容基线；
- 修正 ASR 错词与技术名词；
- 修正 Deep Research 时间线；
- 使用 2026 LangChain 官方当前口径重写 LangChain / LangGraph / Deep Agents / LangSmith 部分；
- 输出完整 42 Scene 口播，但仍保持 Gate A REVIEW。

### 2. 视觉纠正

上一版“深色科技 + 大量卡片”的 Anchor 判定为不符合需求，已废弃。

新 Anchor 直接对齐 Project 001：
- 米白纸面 / 网格；
- 暖棕正文；
- 青绿主强调；
- 橙色只做第二强调；
- 1920×1080 逻辑画布；
- HUD / toolbar / scale 方式对齐 Harness；
- 每张使用不同可视化关系。

### 3. Scene 001～004

1. `001`：2022.11.30 / ChatGPT / “AI 的大门第一次被推开”——门的空间隐喻；
2. `002`：会说 ≠ 会做——聊天牢笼 vs 执行动作；
3. `003`：2023 AutoGPT → 2024 Computer Use → 2025 Deep Research → 2026 Long-running Agents；
4. `004`：Agent → 自动化工作流 / AI 数据分析 / 7×24 客服 / 数字员工。

## Screenshot QA

本轮用 Chromium 实际渲染 Scene 001～004：
- [x] 4/4 成功渲染；
- [x] 16:9 stage 比例正常；
- [x] 未发现可见文字溢出；
- [x] 未发现主体遮挡；
- [x] 4 个 Scene 不是同一模板换字；
- [x] Scene 001 已形成视觉 Anchor。

## 下一步门禁

**等待用户确认 Scene 001～004。**

只有确认后才允许：

```text
Scene 005～042 Garden 开发
→ 全片 Screenshot QA
→ Gate B PASS
→ 正式 full-tts-tasks.json
→ IndexTTS
→ Gate C/D/E/F
```

# Project6 PRD · v2.6

**状态：** Current / 最新产品基准  
**当前产品构建：** Project6 **v64**  
**总纲：** `docs/PROJECT_CHARTER.md`

## 1. 产品定位

Project6 是面向低预算创作者的 **AI HTML 多视频项目生产后台**。

核心原则：**一个视频就是一个独立 Project。** 项目之间共享 Garden、组件、动效、TTS Runtime 和录制能力，但不共享脚本、Scene、配音源、Gate、播放器状态和本地存储状态。

## 2. 固定信息架构

```text
工作台 index.html
→ 视频项目库 works.html
→ 项目详情 project-<slug>.html
→ presentations/<slug>/ 独立生产目录
```

`works.html` 只负责展示项目列表，不承载某一支视频的完整制作详情。

## 3. 视频项目库

每个项目卡片至少显示：封面、项目名称、当前状态、Scene / Chapter 摘要、制作方式摘要和进入项目详情的入口。

## 4. 独立项目详情

每个视频必须有自己的详情页。详情页负责完整脚本、Chapter / Scene、Garden 预览、验收 Gate、完整 TTS JSON、配音源、整片音画、项目内 SFX / BGM 和高清录制入口。

## 5. 新项目目录协议

```text
project-<slug>.html
presentations/
└── <slug>/
    ├── full-video.html
    ├── full-video.css
    ├── full-video.js
    ├── full-video-data.js
    ├── full-tts-tasks.json
    ├── record.html
    ├── capture.html
    └── ACCEPTANCE.md
```

本地状态必须使用 `project6.<slug>.*` namespace。

## 6. P0 主流程

```text
完整口播
→ 拆 Chapter / Scene
→ Garden 画面 + Motion
→ 实际渲染 + Screenshot QA
→ 用户确认整片视觉
→ 完整 TTS JSON
→ 本地 IndexTTS 2.5
→ ZIP / 配音源库
→ 整片本地音画预览 + timing
→ 项目内 SFX / BGM
→ 双窗口高清本地录制
→ 最终视频
```

## 7. Garden 视觉质量

每个 Scene 必须真正表达关系、空间、状态、反馈或过程。禁止批量复制同一左右布局、同一卡片模板和只有 fade/pop 的伪动画。正式 Scene 修改后必须实际 Chromium 渲染并完成 Screenshot QA。

## 8. Gate

状态只允许：PASS / REVIEW / WAITING / LOCKED。

| Gate | 内容 |
|---|---|
| A | 完整口播 |
| B | Garden 视觉 + Screenshot QA |
| C | 本地 IndexTTS + 配音源 |
| D | 整片音画 |
| E | 项目内 SFX / BGM |
| F | 高清本地录制 |

## 9. Project 001 · Harness Engineering

```text
详情：project-harness-engineering.html
目录：presentations/harness-engineering/
7 Chapters
42 Scenes
```

**状态：规范基线 / 旧项目保护。Project 002 开发时不修改其业务文件。**

## 10. Project 002 · 小黑云 LangChain Agent 实战课

```text
详情：project-aigc-xiaoheiyun-agent.html
目录：presentations/aigc-xiaoheiyun-agent/
9 Chapters
42 planned Scenes
当前已实现视觉：Scene 001～004
当前完整脚本：42 / 42
主题：ChatGPT → Agent → LangChain → LangGraph → RAG / MCP / Multi-Agent
主持 IP：小黑云
视觉基线：继承 Project 001 warm-keynote Garden 系统
```

### Project 002 强制规则

1. 原始转写先清洗、校准、重写，禁止直接复制 ASR 文本；
2. Scene 001 是视觉 Anchor；
3. 上一版深色科技卡片方案废弃；
4. 先确认 Scene 001～004，再开发 Scene 005～042；
5. Gate A/B 未 PASS 前，正式 `full-tts-tasks.json` 保持锁定；
6. 不读取或覆盖 Project 001 的状态。

## 11. 当前构建

Canonical：`assets/version.js` → **v64**。

本轮仅更新 Project 002 内容与项目库元数据，不升级全局 build，以避免为了第二个视频强制触碰 Project 001 的已完成入口。Project 002 使用 `?v=64-p2a2` 作为本轮静态缓存标识。

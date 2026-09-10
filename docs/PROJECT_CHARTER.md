# Project6 项目总纲 · v2.4

> 最高优先级 / Source of Truth  
> 当前产品构建：**Project6 v64**  
> 更新时间：2026-09-10

## 0. Project6 是什么

Project6 是一个面向低预算创作者的 **AI HTML 多视频项目生产后台**。

核心不是把许多视频堆在同一个制作页，而是：**一个视频 = 一个独立 Project**。每个 Project 独立管理完整口播、Chapter / Scene、Garden 视觉、Motion、验收 Gate、本地 IndexTTS 配音源、整片音画、项目内 SFX / BGM 和高清本地录制。

## 1. 固定三层信息架构

```text
Project6 工作台
    ↓
视频项目库 works.html
    ↓
某一个独立视频项目详情 project-<slug>.html
    ↓
presentations/<slug>/ 独立生产目录
```

### Layer 1 · 工作台

只负责全局入口、当前生产状态和公共制作资源，不直接承载某支视频的业务数据。

### Layer 2 · 视频项目库

`works.html` 是所有视频的列表页。每个项目必须展示自己的封面、名称、状态、Scene / Chapter 摘要。用户点击项目卡片以后，才进入对应详情。

**禁止再次把 Harness Engineering 或其他单个视频的完整制作详情直接放进 `works.html`。**

### Layer 3 · 独立项目详情

每个视频必须拥有自己的详情页，例如：

```text
project-harness-engineering.html
project-next-topic.html
project-003.html
```

详情页只读取当前项目的数据与状态。

## 2. 项目隔离是强制规则

共享的是制作能力，不共享项目状态。

可以共享：
- Garden 方法与 Theme 系统；
- Galaxy 组件；
- GSAP / Motion runtime；
- 通用 TTS / recording runtime；
- 后台 UI 设计系统。

必须隔离：
- 项目脚本；
- Chapter / Scene 数据；
- TTS JSON；
- 本地配音源；
- localStorage / IndexedDB key；
- Gate 状态；
- ACCEPTANCE；
- full-video / record / capture；
- SFX / BGM 配置。

## 3. 新视频标准目录

以后新增视频时，第一件事不是修改旧项目，而是创建新 slug：

```text
project-<slug>.html
presentations/
└── <slug>/
    ├── full-video.html
    ├── full-video-data.js
    ├── full-tts-tasks.json
    ├── record.html
    ├── capture.html
    └── ACCEPTANCE.md
```

浏览器状态必须使用项目级 namespace：

```text
project6.<slug>.*
```

禁止多个视频复用 Harness Engineering 的确认 key、音频 key 或配音源状态。

## 4. 单个项目标准生产链

```text
用户给主题 / 文章
→ AI 整理完整口播
→ 拆 Chapter / Scene
→ Garden 为每个 Scene 设计视觉与 Motion
→ Chromium 实际渲染 + Screenshot QA
→ 用户确认整片口播与视觉
→ 一次复制完整 TTS JSON
→ 本地 IndexTTS 2.5
→ 完整 ZIP / 配音源库
→ 整片本地音画预览 + timing
→ 当前项目内 SFX / BGM
→ 双窗口高清本地录制
→ 最终视频文件
```

## 5. Gate

状态只允许：PASS / REVIEW / WAITING / LOCKED。

| Gate | 内容 |
|---|---|
| A | 完整口播 |
| B | Garden 视觉 + Screenshot QA |
| C | 本地 IndexTTS / 配音源 |
| D | 整片音画 |
| E | 当前项目 SFX / BGM |
| F | 高清本地录制 |

上一 Gate 未通过，不把下一阶段伪装成完成。

## 6. 当前 Project 001

**Harness Engineering** 是 Project6 的第一个正式独立视频项目：

```text
详情页：project-harness-engineering.html
目录：presentations/harness-engineering/
Scene：42
Chapter：7
TTS：IndexTTS 2.5
```

从 v64 开始，它不再等同于“视频作品页”。`works.html` 只是项目库，Harness Engineering 只是项目库中的第一个条目。

## 7. 旧项目保护原则

创建 Project 002、003、004… 时：

1. 不覆盖 Project 001 的文件；
2. 不改旧项目的数据格式，除非明确做向后兼容迁移；
3. 不复用旧项目的本地存储 key；
4. 不让新项目的视觉、脚本或配音污染旧项目；
5. 旧项目必须仍可独立打开、预览、录制和复核。

## 8. UI 原则

后台采用创作控制台 / Editorial Production Console 思路：
- 视觉结构服务信息，不堆模板化 SaaS 卡片；
- 项目列表以封面与项目状态为核心；
- 项目详情以生产流程和 Gate 为核心；
- 公共资源页与项目业务页分开；
- 动效克制，只解释状态和动作结果；
- 响应式、键盘 focus、reduced motion 为质量底线。

## 9. 版本管理

当前 canonical build：`assets/version.js` → **v64**。

发布新版本时必须同步：

```text
assets/version.js
→ index / works / project detail
→ 正式 ?v= 缓存参数
→ PROJECT_CHARTER / PRD / ACTIVE_DECISIONS / DEVELOPMENT_STATUS
→ 当前项目 ACCEPTANCE
```

## 10. 强制开发门禁

```text
Read PROJECT_CHARTER
→ Read PRD
→ Read ACTIVE_DECISIONS
→ Read DEVELOPMENT_STATUS
→ 定位目标 Project
→ Read 当前 Project ACCEPTANCE
→ 实现
→ 实际功能 / 视觉 QA
→ 自检
→ 更新状态与版本记录
```

**新增视频时，默认动作永远是“创建新 Project”，而不是修改最近一个旧 Project。**

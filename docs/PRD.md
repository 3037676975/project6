# Project6 PRD · v2.5

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

`works.html` 只负责展示项目列表，不再直接承载某一支视频的完整制作详情。

## 3. 视频项目库

每个项目卡片至少显示：
- 封面；
- 项目名称；
- 当前状态；
- Scene 数量；
- Chapter 数量；
- 制作方式摘要；
- 进入项目详情的入口。

未来 Project 002、003、004… 都在此列表中新增，不覆盖旧项目。

## 4. 独立项目详情

每个视频必须有自己的详情页，例如 `project-harness-engineering.html`。

详情页负责：
- 完整脚本；
- Chapter / Scene；
- Garden 完整预览；
- 验收 Gate；
- 完整 TTS JSON；
- 配音 ZIP / 配音源；
- 整片音画；
- 项目内 SFX / BGM；
- 高清录制入口。

## 5. 新项目目录协议

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

本地状态必须使用 `project6.<slug>.*` namespace，禁止不同项目复用状态 key。

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
→ 整片音画预览 + timing
→ 项目内 SFX / BGM
→ 双窗口高清本地录制
→ 最终视频
```

## 7. 本地配音源

- JSZip 解压；
- 支持 ZIP 子目录；
- 自动编号 ↔ Scene；
- 一个 ZIP = 一个配音源；
- ZIP 可持久保存到浏览器 IndexedDB；
- 单个音频只作为临时兜底；
- 当前配音源可切换、试听、删除；
- 不上传服务器；
- 不提交 GitHub；
- 每个视频项目必须隔离自己的配音源 namespace。

## 8. 整片播放器

必须支持：播放、暂停/继续、上一 Scene、下一 Scene、进度跳转、全屏、本地配音源注入、音频结束自动进入下一 Scene。

Pause 必须同时暂停 narration 与当前 GSAP timeline。

## 9. Garden 视觉质量

每个 Scene 必须真正表达关系、空间、状态、反馈或过程。禁止批量复制同一左右布局、同一卡片模板和只有 fade/pop 的伪动画。

正式 Scene 修改后必须实际 Chromium 渲染并完成 Screenshot QA。

## 10. 高清本地录制

```text
record.html 录制控制台
        ↓ BroadcastChannel
capture.html 纯成片窗口
        ↓ 浏览器标签页捕获
Canvas / MediaRecorder
        ↓
1080P / 1440P / 4K 本地文件
```

录制结果只保存在浏览器本地，不上传服务器。

## 11. Gate

状态只允许：PASS / REVIEW / WAITING / LOCKED。

| Gate | 内容 |
|---|---|
| A | 完整口播 |
| B | Garden 视觉 + Screenshot QA |
| C | 本地 IndexTTS + 配音源 |
| D | 整片音画 |
| E | 项目内 SFX / BGM |
| F | 高清本地录制 |

## 12. UI 设计系统

后台采用 **Editorial Production Console / 创作控制台**：
- 工作台负责全局；
- 视频作品页负责项目选择；
- 单项目详情负责制作；
- 公共资源与业务状态分开；
- 项目封面是列表页主要视觉识别；
- 状态色只服务 Gate 与反馈；
- 支持键盘 focus、移动端和 reduced motion。

## 13. 当前项目

Project 001：**Harness Engineering**

```text
详情：project-harness-engineering.html
目录：presentations/harness-engineering/
7 Chapters
42 Scenes
IndexTTS 2.5
```

## 14. 当前版本

Canonical：`assets/version.js` → **v64**。

v64 的核心变化是补齐多项目层级：

```text
works.html 项目列表
→ Harness Engineering 项目卡片
→ project-harness-engineering.html 独立详情
```

以后新增视频时，必须新增项目，不允许把新视频的数据直接写进 Harness Engineering。

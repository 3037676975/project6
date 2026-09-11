# Project 002 · Warm Keynote + VideoShotCraft 重制验收

日期：2026-09-11

## 本轮重制目标

用户反馈上一版 42 Scene 的统一模板感过强。本轮不继续使用 final-visual-a/b/c 的批量模板风格，而是回到此前认可的 warm-keynote / Garden 视觉基线：米白网格、棕色正文、青绿色重点、低饱和橙色提示、卡片与系统图混合构图。

## 结构

- 42 / 42 Scene 均由 HTML + CSS + SVG 生成，不使用静态截图替代视频画面。
- 每段直接读取 `full-video-data.js` 的 `title / narration / points / type`。
- `narration` 自动切成 4 个语义 beat，对应 Cue 01～04，避免画面一开始全部出现。
- 真实 IndexTTS 导入后以 `audio.currentTime / audio.duration` 驱动 GSAP Timeline。

## VideoShotCraft 复用

- spotlight-hero-card：001
- before-after-slider-scrub：002 / 005 / 013 / 019 / 035 / 039
- timeline-travel：003 / 022 / 023 / 028 / 033 / 037
- integration-hub-map：004 / 009 / 012 / 024 / 025 / 030 / 031 / 041
- cycle-glass-node-morph：006 / 010 / 015 / 029 / 034 / 038
- basic-3d-scene：008 / 011
- typing-code-block：014
- ai-stream-response：017 / 026 / 032
- card-stack：016 / 018 / 021
- graph-route / pause-resume：015 / 038 / 039
- RAG funnel：035

VideoShotCraft 只提供镜头与节奏语法；视觉仍保持 Project 002 原先认可的 warm-keynote 风格。

## 截图自检

使用 Chromium 1920×1080 对 Scene 001～042 逐页渲染并截图，自检项目：

- 标题安全区
- 组件边界
- 16:9 画布溢出
- 文字密度
- 画面是否只有“大标题 + 几张卡”
- 相邻 Scene 是否存在完全相同的视觉结构
- 第 006 页工作流是否达到足够的信息量

### 自评结果

- 001～004：保留此前认可的 Anchor 气质，增加旁白 beat 与 ShotCraft 运动层。
- 005：Before/After 改为拉杆揭示，不再一次性同时展示。
- 006：重做为 `Context → API → Judge → Continue → Adjust → Loop` 的连续路径，底部增加“固定脚本 → Agent 工作流”对比。
- 008：3D 空间卡片推进 Model API → Agent System → AI Product。
- 009～012：系统图、断裂恢复、桥梁、Hub 四种结构轮换。
- 014 / 017 / 026 / 032：使用深色代码/Trace/UI 面板，打破整片浅色卡片重复感。
- 015 / 038 / 039：显式状态图 / 分支 / 人工审批路径。
- 022～042：路线图、工程规则、MCP、多 Agent、RAG Funnel、最终项目和能力地图均有独立结构。

最终：42 Scene 均完成 HTML 视觉结构，未加入黑色 CSS 小黑云 mascot。
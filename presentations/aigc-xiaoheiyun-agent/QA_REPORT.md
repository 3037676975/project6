# Project 002 · 42 Scene 视觉与动画验收报告

验收日期：2026-09-11

## 最终结果

- Scene 001～042：**42/42 PASS**。
- 画幅：1920×1080 / 16:9。
- 每个 Scene 具备 Cue 01～04；初始不再一次性展示整页信息。
- 播放真实本地 TTS 时，GSAP 进度由 `narration.currentTime / narration.duration` 驱动，实现“讲到哪里，动画出现到哪里”。
- Capture 与主播放器使用同一套 42 Scene Renderer；Scrub 范围 0～41。
- 禁止项检查：未加入 CSS 黑色小云 mascot。

## QA 方法

42 个 Scene 均在 Chromium 以 1920×1080 渲染并逐张截图；自动检查：

1. 元素是否超出 1920×1080；
2. 容器是否发生 scroll / clip overflow；
3. 标题、流程图、结论条与 HUD 是否互相遮挡；
4. Cue 01～04 是否存在；
5. VideoShotCraft 镜头配方是否与内容关系匹配。

## 第一轮发现并返修

- 长标题 Scene 003 / 008 / 022 / 023 / 028 / 033 / 037：增加长标题自适应。
- Scene 002 / 005 / 013 等 Before/After：修正底部矩阵越界。
- Scene 003：修正能力条安全区。
- Scene 006：重新设计为 Context → Plan → API → Check → Adjust → Continue 的系统循环图，替换信息量不足的旧版。
- System / LangGraph 类画面：修正 SVG 5px 溢出。
- Code / Trace 类画面：修正结论条高度溢出。
- Capture：从旧的 4 Scene / 早期 runtime 改成与主播放器同源的 42 Scene GSAP + DrawSVG + MotionPath Runtime。
- Runtime：移除与 `capture-v60-p2.js` 重复的 BroadcastChannel 命令监听，避免录制控制一次触发两次。

## 42 Scene 镜头验收

| Scene | VideoShotCraft / Motion 配方 | QA |
|---|---|---|
|001|integration-hub-map + orbit-ring-title-open|PASS|
|002|before-after-slider-scrub + cycle-glass-node-morph|PASS|
|003|timeline-travel + draw-svg-trace|PASS|
|004|integration-hub-map|PASS|
|005|before-after-slider-scrub|PASS|
|006|cycle-glass-node-morph|PASS|
|007|orbit-ring-title-open|PASS|
|008|basic-3d-scene|PASS|
|009|integration-hub-map|PASS|
|010|fracture + cycle-glass-node-morph|PASS|
|011|basic-3d-scene|PASS|
|012|integration-hub-map|PASS|
|013|before-after-slider-scrub|PASS|
|014|typing-code-block|PASS|
|015|cycle-glass-node-morph|PASS|
|016|card-stack|PASS|
|017|ai-stream-response|PASS|
|018|basic-3d-scene|PASS|
|019|before-after-slider-scrub|PASS|
|020|title-demote-to-label|PASS|
|021|ring-diagram-annotation-reveal|PASS|
|022|orbit-ring-title-open|PASS|
|023|lead-word-zoom-assemble|PASS|
|024|integration-hub-map|PASS|
|025|ring-diagram-annotation-reveal|PASS|
|026|ai-stream-response|PASS|
|027|card-stack|PASS|
|028|title-demote-to-label|PASS|
|029|cycle-glass-node-morph|PASS|
|030|integration-hub-map|PASS|
|031|orbit-ring-title-open|PASS|
|032|ai-stream-response|PASS|
|033|lead-word-zoom-assemble|PASS|
|034|cycle-glass-node-morph|PASS|
|035|before-after-slider-scrub + funnel|PASS|
|036|card-stack|PASS|
|037|lead-word-zoom-assemble|PASS|
|038|cycle-glass-node-morph|PASS|
|039|before-after-slider-scrub|PASS|
|040|basic-3d-scene + integration-hub-map|PASS|
|041|ring-diagram-annotation-reveal|PASS|
|042|orbit-ring-title-open + title-demote-to-label|PASS|

## 仍依赖本地素材的环节

视觉和 Cue Runtime 已完成。最终真实音画还需要用户本地生成/导入 `001.mp3`～`042.mp3` 的 IndexTTS 音频以及最终 BGM；导入后播放器会直接按真实音频时长同步 Cue。

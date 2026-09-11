# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden → motions/components。

## 当前 Phase

**Phase 2 · Project 002 完整项目框架对齐 · Project6 v64**

当前策略：**Project 001 Harness Engineering 原项目保持不动；Project 002 必须复制 Project 001 的完整项目结构，而不只是做一个视觉预览页。**

## 当前入口

- Product build：**v64**
- 视频项目库：`works.html?v=64-p2a5`
- Project 001：`project-harness-engineering.html?v=64`
- Project 002：`project-aigc-xiaoheiyun-agent.html?v=64-p2a5`
- Project 002 Player：`presentations/aigc-xiaoheiyun-agent/full-video.html?v=64-p2a5`
- Project 002 Recorder：`presentations/aigc-xiaoheiyun-agent/record.html?v=64-p2a5`
- Project 002 Capture：`presentations/aigc-xiaoheiyun-agent/capture.html?v=64-p2a5`

## Project 001 · Harness Engineering

**本轮未修改业务文件。** 它继续作为 Project 002 的目录、TTS、语音导入、播放器和录制结构基线。

## Project 002 · 当前 Gate

| Gate | 状态 | 当前进度 |
|---|---|---|
| A 完整口播 | REVIEW | 9 Chapters / 42 Scenes，详情页可一次确认 |
| B Garden 视觉 | ANCHOR REVIEW | Scene 001～004 高信息密度 Anchor；禁止 CSS mascot |
| C 本地 IndexTTS | REVIEW READY | 已生成完整 42 段 TTS manifest；支持 ZIP / 多音频导入与 IndexedDB |
| D 整片音画 | WAITING | Player 已支持本地音频注入 / 自动恢复；仍缺 Scene 005～042 视觉 |
| E 项目内 SFX / BGM | LOCKED | Recorder 已保留本地 BGM 控制 |
| F 高清本地录制 | BROWSER TEST | Harness-style record.html + capture.html 已建立 |

## 本轮结构纠正 · 2026-09-11

用户指出：第二个项目不能只模仿视觉风格，必须完整继承第一个项目已经搭好的生产结构。

现在 Project 002 已补齐：

```text
完整 42 Scene 脚本
→ 脚本确认 checkbox
→ 一键复制完整 42 段 TTS JSON
→ full-tts-tasks.json 42/42
→ ZIP / 多音频导入 001～042
→ Project 002 独立 IndexedDB
→ 42 格音频匹配状态
→ 音频试听
→ 本地音频注入播放器
→ Player 自动恢复本地音频
→ 播放 / 暂停 / 声音 / 全屏 / Scene 进度
→ 打开高清录制
→ record.html Recorder Controller
→ capture.html 纯 16:9 成片窗口
→ 独立 BroadcastChannel
→ 1080P / 1440P / 4K
→ BGM / 开始 / 暂停 / 停止保存 / 取消
```

## 视觉规则

- 完全删除 CSS 绘制的小黑云 / 黑色云朵角色；
- 项目识别只保留左上角文字 HUD；
- 画面信息量必须与口播匹配；
- Scene 001～004 使用时间、对比表、演进时间线、业务矩阵等高信息密度结构；
- Scene 005～042 继续按同一密度逐 Scene 制作。

## 下一步

1. 用户检查 Project 002 完整详情页结构是否已经与 Project 001 对齐；
2. 实机测试脚本确认 → 复制 TTS JSON → 导入语音包 → 注入播放器；
3. 实机测试 Recorder / Capture 通道；
4. 结构确认后继续 Scene 005～042 Garden 开发与 Screenshot QA。

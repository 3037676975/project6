# Project6 Active Decisions

> 最新用户明确决策，优先级高于旧实现细节。

## 2026-09-11 · Project 002 必须严格复制 Project 001 的“方法”，不能复制业务内容

### 1. Project 001 保护

Harness Engineering 是已经完成的第一个案例。开发 Project 002 时：
- 不修改 Project 001 的业务文件；
- 不复用其脚本、Scene、Gate、TTS、本地状态；
- 只把它当作目录协议、Garden 方法、视觉质量和 Gate 顺序的规范基线。

### 2. Project 002 内容基线

Project 002 是 **小黑云 · LangChain Agent 实战课**。

用户提供的约 7 分钟课程转写是内容来源，但不能直接粘贴。必须：
- 修正 ASR；
- 修正技术名词；
- 核对最新事实；
- 重写成自己的正式口播；
- 再拆 Chapter / Scene。

### 3. Project 002 视觉纠正

上一版深色科技 / 卡片堆叠方案不通过，废弃。

新的 Visual Anchor 必须直接对齐 Harness Engineering 的 Garden 语言：
- 1920×1080；
- warm-keynote 米白网格；
- 暖棕正文 + 青绿强调；
- 每个 Scene 解释关系 / 空间 / 状态 / 过程；
- Scene 001 先建立整片视觉 Anchor；
- 小黑云只作为主持 IP 标识，不抢知识表达。

### 4. 开发门禁

```text
完整 42 Scene 口播 REVIEW
→ Scene 001～004 Anchor + Screenshot QA
→ 用户确认
→ Scene 005～042
→ Gate B PASS
→ 正式 IndexTTS JSON
```

Gate A/B 未确认前，不允许提前把 TTS、SFX、录制伪装成已完成。

---

## 2026-09-10 · 后台 UI 与 SFX 信息架构

后台继续采用 Editorial Production Console / 创作控制台。SFX 不再作为独立资源库扩张，而是放在具体 Project 的 Gate E。状态色只服务 Gate / 系统反馈；公共资源与项目业务状态分开。

## 2026-09-09 · 版本统一与发布规则

全局产品版本以 `assets/version.js` 为唯一来源。只有全局 build 升级时，才必须同步 index / works / project / player / record / capture / docs 的版本。单个视频在 Gate REVIEW 阶段允许使用项目级 cache suffix，本轮 Project 002 使用 `64-p2a2`，全局 canonical 仍为 v64。

## 2026-09-09 · 整片生产模式

一个视频就是一个完整 Project：一份完整口播 → 一套完整 HTML / Garden 画面 → 一个完整 TTS JSON → 一个或多个本地配音源 ZIP → 整片音画 → 项目内 SFX/BGM → 高清本地录制。

AI / Project6 负责脚本、Scene、Garden、编号、TTS JSON、音频映射、预览、视觉 QA 和录制工具；用户负责确认口播/画面、本地 IndexTTS 生成、上传配音 ZIP 与最终实机复核。

## Garden 强制规则

正式 Scene 修改后必须实际 Chromium 渲染并 Screenshot QA。代码写完不等于画面完成。每张动画必须解释至少一种：关系 / 空间 / 状态 / 反馈 / 过程。禁止统一左右排版、统一卡片模板和统一 fade。

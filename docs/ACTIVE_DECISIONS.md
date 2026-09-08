# Project6 Active Decisions

> 本文件记录用户最新明确决策。开发时必须按顺序阅读：
> `PROJECT_CHARTER.md` → `PRD.md` → **本文件** → `DEVELOPMENT_STATUS.md`。
>
> 如果 Charter / PRD 中的旧实现细节与这里冲突，以本文件中的**最新明确用户决策**为准，并在后续版本化 PRD 时同步回主文档。

## 2026-09-08 · Phase 1 第一章最新返工决策

### 1. 内容优先级

第一章开发顺序固定为：

```text
明确这一章到底讲什么
→ 写成自然口播
→ 选择合适音色
→ 设计画面
→ 做动画
→ 配 BGM / SFX
→ 实机播放与录制验收
```

主题一句话：

> **模型之外的运行系统，决定 Agent 能不能稳定把任务做完。**

口播必须像朋友给朋友讲解，不允许写成 PRD / 论文 / 产品说明书。

### 2. 第一章正式 TTS

```text
provider = edge-tts
client   = rany2/edge-tts
voice    = zh-CN-YunxiNeural
locale   = zh-CN
rate     = +0%
speed    = 1.0x
```

云希更偏 Lively / Sunshine，适合轻松、口语化知识讲解。

未来需求：后台增加 Edge TTS 音色选择 / 试听能力，但本轮不开发完整音色中心。

### 3. 播放模式必须分清

- **Manual**：上一页 / 下一页 / 点击舞台 / ←→ / 单独播放当前旁白；旁白结束不自动翻页。
- **Auto**：播放正式旁白，严格按 audio ended 推进下一 Step。

用户必须一眼看得出当前模式。

### 4. BGM 可选且支持本地上传

第一章提供：

- 无音乐
- 轻松科技 · Short Plingy Loop（CC0）
- 轻松氛围 · Calm Loop（CC0）
- 轻快神秘 · Other Center（CC0）
- 本地上传音乐
- 独立音量控制

本地音乐只通过浏览器 `URL.createObjectURL` 使用，不上传 Project6 服务器。

### 5. 录制原则

```text
用户点击录制
→ 浏览器请求当前标签页捕获授权
→ HTML + narration + BGM 播放
→ MediaRecorder 浏览器内存录制
→ 停止后自动下载 WebM
```

最终视频不上传 Project6、不长期存服务器。

录制按钮必须有明确状态：等待授权 → 正在录制 → 停止并下载 → 已下载 / 授权取消 / 录制失败。

`getDisplayMedia()` 通常要求 HTTPS 或 localhost；HTTP IP 环境下要明确提示，不能静默无反应。

### 6. 85 分反馈后的视觉规则

1. 底部控制区不得侵占 1920×1080 视频舞台。
2. 控制区是工具，不是视频内容；录制时隐藏或弱化。
3. 小字不能过细过小，解释性文字原则上 18–23px 以上并保持足够字重。
4. 2～5 屏不能显空；优先增加状态、关系、进度和流程，而不是堆文字。
5. 每个 Step 除主动画外增加克制 secondary motion。
6. 后台验收/开发状态主要给 AI 自检，用户可在作品页内嵌查看。
7. 第一章未通过最终用户验收前，不进入第二章。

## 2026-09-08 · 87 分反馈后的 Narration Beat 动效规则

用户指出：当前动画最大问题不是数量少，而是**内容经常整块一次出现**，没有跟随讲解顺序引导注意力。

从本决策开始，Project6 视频动效新增硬标准：

```text
Garden Step
   ↓
Narration
   ↓
Narration Beat 0 / 1 / 2 / 3 ...
   ↓
对应视觉元素逐项 Reveal / Focus / Connect
```

### 必须遵守

- 一屏禁止默认把全部关键信息同时亮出来。
- 讲到哪个概念、关系、状态，哪个视觉对象才出现或高亮。
- 尚未讲到的信息应隐藏、弱化或保持次要状态。
- Beat 进度优先跟随真实 narration `currentTime / duration`，不要重新用固定 3 秒、5 秒猜时间。
- Manual 浏览可展示完整画面；播放当前旁白和 Auto 模式必须进入 Beat Reveal。
- 业务层统一使用 `data-beat` / narration progress；底层动画引擎可以替换为 Anime.js、Motion、WAAPI 等。

### 动效库

后台新增独立 `motions.html` 动效库，并建立 `data/motions.json` 开源库目录。

第一批候选：

- Anime.js — Timeline / Stagger / SVG / WAAPI，MIT。
- Motion — JavaScript / React / Spring / Layout，MIT。
- Lottie Web — JSON / SVG / Canvas 动画，MIT。
- AutoAnimate — DOM / List / Layout 平滑过渡，MIT。
- Animate.css — CSS 轻量入场 / 退出预设，MIT。
- React Spring — React Spring Physics，MIT。

Project6 不复制整套第三方库源码；保留来源和许可证，沉淀自己的可复用 Primitive ID，例如：

```text
beat-reveal-01
flow-build-01
focus-shift-01
counter-progress-01
svg-draw-01
card-stagger-01
```

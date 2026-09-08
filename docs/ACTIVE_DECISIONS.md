# Project6 Active Decisions

> 本文件记录用户最新明确决策。开发时必须按顺序阅读：
> `PROJECT_CHARTER.md` → `PRD.md` → **本文件** → `DEVELOPMENT_STATUS.md`。
>
> 如果 Charter / PRD 中的旧实现细节与这里冲突，以本文件中的最新明确用户决策为准。

## 2026-09-08 · Phase 1 第一章当前决策

### 1. 内容与声音

主题一句话：**模型之外的运行系统，决定 Agent 能不能稳定把任务做完。**

口播必须像朋友给朋友讲解，不写成 PRD / 论文。当前正式 TTS：

```text
provider = edge-tts
client   = rany2/edge-tts
voice    = zh-CN-YunxiNeural
locale   = zh-CN
rate     = +0%
speed    = 1.0x
```

### 2. Manual / Auto

- Manual：上一页 / 下一页 / 点击舞台 / ←→ / 播放当前旁白；旁白结束不自动翻页。
- Auto：只有当前 narration `ended` 后才允许进入下一 Garden Step。

### 3. BGM

无音乐 / 3 个 CC0 预置 / 浏览器本地上传 / 独立音量。用户本地文件只使用 `URL.createObjectURL`，不上传服务器。

### 4. 本地录制

```text
用户点击录制
→ 浏览器 getDisplayMedia 授权
→ HTML + narration + BGM 播放
→ MediaRecorder 浏览器内存
→ 自动下载 WebM
```

必须检查 Secure Context。最终视频不上传 Project6。

### 5. 视觉与舞台

- 控制区不得侵占 1920×1080 舞台。
- 小字不能过细过小。
- 2～5 屏不能显空，但不能靠堆文字填满。
- 动效必须帮助理解，不得影响阅读。

---

## 2026-09-08 · 用户 40 分返工：GSAP + Emil Skills 成为动画核心

用户明确否决上一版 Narration Beat 百分比方案。原因：

1. `audio.currentTime / duration` 粗比例不能代表真实中文语义点。
2. 动画影响阅读与文字稳定性。
3. 出现“旁白还在 Step 1，视觉已经像 Step 2”的错位感。
4. 自研 Beat Reveal 没有达到成熟动画体系的质量。

### 5.1 固定两套上游到 Project6

Project6 已建立完整上游镜像：

```text
vendor/upstream/gsap/
vendor/upstream/emil-skills/
```

并由 `.github/workflows/sync-animation-upstreams.yml` 自动同步完整仓库。

- GSAP：`https://github.com/greensock/GSAP`
  - 当前主动画 Runtime。
  - GreenSock Standard “no charge” license；许可证/README/package 信息必须原样保留。
- Emil Kowalski Skills：`https://github.com/emilkowalski/skills`
  - 当前动画设计/审查规范。
  - MIT；LICENSE 必须随镜像保留。

后台 `motions.html` 必须能够直接读取 Project6 本地镜像中的原始文档，不把 GitHub 外链当成主要内容。

### 5.2 动画职责固定

```text
Garden Skills
负责 Chapter / Step / Narration 结构
        ↓
Emil Skills
判断：该不该动 / 为什么动 / easing / duration / properties / review
        ↓
GSAP
负责当前 Step 内真正 Timeline / Stagger / SVG / Text / Flip / Path 动画
```

### 5.3 废弃上一版 Beat Ratio

以下方案正式废弃：

```text
audio.currentTime / audio.duration
→ 粗略百分比 threshold
→ data-beat Reveal
```

不得再用这一套作为第一章正式动画主逻辑。

### 5.4 新的 Step 安全边界

**一个 GSAP timeline 永远只属于一个 Garden Step。**

硬规则：

- GSAP timeline 不允许调用 `go(nextStep)`。
- timeline `onComplete` 不允许自动翻页。
- 当前 Step 动画播完后，画面保持当前 Step 最终状态。
- Auto 进入下一 Step 的唯一条件：当前 narration `ended`。
- Manual 播放当前旁白后仍停留当前 Step。
- Step 内视觉元素只能解释当前 narration；不得提前出现下一 Step 的概念。

---

## 2026-09-08 · Emil Skills 必须进入完整动画设计链（最新）

用户要求：**不能只把 `emilkowalski/skills` 当参考文档或最终验收清单，必须充分利用它来决定动画怎么设计、怎么构建、怎么审查。**

从本决策开始，Project6 每个视频章节的动画工作流固定为：

```text
Garden Chapter / Step / Narration
        ↓
Emil · find-animation-opportunities
扫描：哪些地方真的值得动画，哪些应该保持静态
        ↓
Emil · animate
明确：目的 / 工具 / properties / easing / duration / interruption / exit
        ↓
Emil · animation-vocabulary / emil-design-eng
补齐：空间关系、连续状态、motion personality、细节语言
        ↓
GSAP Runtime
Timeline / Stagger / DrawSVG / MotionPath / Flip / Morph（按需要）
        ↓
Edge TTS SentenceBoundary
真实口播句子起始时间驱动当前 Step 内 cue
        ↓
Emil · review-animations
逐动画检查十条 Non-negotiable standards
        ↓
Emil · improve-animations
对整章做高杠杆审计与优化
```

### A. 动画不是“蹦出来”

正式成片优先使用：

- 路径生长；
- 对象沿路径移动；
- 同一对象从一个状态连续过渡到另一个状态；
- 空间来源与去向一致；
- Flow / Connector / State Change；
- stagger 作为组内顺序，而不是所有东西逐个弹出；
- 解释完后画面稳定下来，允许观众阅读。

禁止把“opacity 0 → 1 + translateY”当成所有动画的统一答案。

### B. TTS 真实时间码

`edge-tts` 生成 MP3 时必须同步保存 `SentenceBoundary`：

```text
MP3
+
timings.json
+
SRT（仅隐藏时间码，不显示字幕）
```

动画 cue 根据真实 `SentenceBoundary.start` 启动，不再按音频总时长百分比猜测。

### C. Emil 交互规则也适用于后台工具栏

- Button press：100–160ms 级别、`scale(.97)` 附近。
- Hover 只能在 `hover:hover` + `pointer:fine` 生效。
- Focus-visible 必须可见。
- 不使用 `transition: all`。
- 不使用 UI `ease-in`。
- 高频工具栏不加长、炫、阻塞操作的动画。
- `prefers-reduced-motion` 必须存在。
- 触觉/Haptic 只在平台支持、且低频“反馈”动作真正受益时采用；不为了存在感强行震动。

### D. 当前第一章的空间故事

1. **Step 1**：标题建立 → SVG 关系路径长出来 → traveler 沿路径走。
2. **Step 2**：同一个模型 → 失败分叉 → 失败状态 → 稳定分叉 → 稳定状态。
3. **Step 3**：Agent Core → 四条连接线 → Context / Tools / State / Recovery 从中心关系展开。
4. **Step 4**：员工 → Prompt token 沿路径进入工作环境 → Harness 四层环境建立。
5. **Step 5**：循环路径 → runner 跑一圈 → 执行节点 → 两种模式 → 01–10 连续完成。
6. **Step 6**：四层 Harness → 聚合成 Reliable Agent。

### E. Review 产物

每章必须有实际 Review 文件，例如第一章：

`presentations/harness-engineering/ANIMATION_REVIEW.md`

Review 必须记录：

- 哪些动画机会被采用；
- 哪些候选被主动拒绝；
- 每个动画的目的；
- 使用的工具 / easing / duration / physicality；
- Emil 十条标准是否 PASS；
- 慢放 / frame-by-frame / reduced motion 的 feel-check 项。

### F. 当前 Gate

- 上游镜像：PASS。
- SentenceBoundary timing：PASS。
- GSAP / MotionPath / DrawSVG 代码 Gate：PASS。
- Emil Review 文件：已建立。
- 产品最终体验：仍由用户实际观看决定。

第一章未通过用户最终验收前，不进入第二章。

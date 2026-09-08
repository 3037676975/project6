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

### 动画职责固定

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

### 废弃上一版 Beat Ratio

```text
audio.currentTime / audio.duration
→ 粗略百分比 threshold
→ data-beat Reveal
```

不得再作为正式动画主逻辑。

### Step 安全边界

- 一个 GSAP timeline 永远只属于一个 Garden Step。
- GSAP timeline 不允许调用下一 Step。
- timeline 完成后保持当前 Step 最终状态。
- Auto 进入下一 Step 的唯一条件：当前 narration `ended`。
- Manual 播放当前旁白后仍停留当前 Step。

---

## 2026-09-08 · Emil Skills 必须进入完整动画设计链

```text
Garden Chapter / Step / Narration
        ↓
Emil · find-animation-opportunities
        ↓
Emil · animate / vocabulary / design-eng
        ↓
GSAP Runtime
        ↓
Edge TTS SentenceBoundary
        ↓
Emil · review-animations
        ↓
Emil · improve-animations
```

正式成片优先使用路径生长、对象沿路径移动、共享对象连续状态、Flow / Connector / State Change；禁止把单纯 opacity + translateY 当统一答案。

工具栏必须遵守 Emil 交互规范：短按压反馈、hover gating、focus-visible、禁止 transition:all、支持 reduced motion。

---

## 2026-09-08 · Uiverse Galaxy 成为 Project6 核心视觉组件层（最新）

用户要求把 `uiverse-io/galaxy` 的 3000+ UI 元素正式放进 Project6，并在以后所有视频制作中充分利用。

### A. 本地镜像

Project6 必须完整镜像：

```text
vendor/upstream/uiverse-galaxy/
```

来源：`https://github.com/uiverse-io/galaxy`

- 许可证：MIT。
- 上游 README / LICENSE 必须保留。
- 由现有 Creative Upstream GitHub Actions 自动同步。
- 同步时自动生成 `data/galaxy-components.json`。

### B. 后台组件库

Project6 后台新增独立：

**组件库 · Galaxy**

最低能力：

- 分类浏览；
- 搜索组件名 / 作者 / slug；
- 随机组件；
- 本地 iframe 预览；
- 本地源码查看；
- 显示组件总数和分类数量。

Galaxy 不是一个外链收藏页。主要浏览和读取必须基于 Project6 本地镜像。

### C. 视频制作链升级

从现在开始每个 Garden Step 的视觉设计顺序改成：

```text
Garden Step / Narration
        ↓
Galaxy Search
先查有没有合适的 Card / Loader / Pattern / Button / State / Notification / Toggle / Micro-interaction 原型
        ↓
Garden Theme Adaptation
把颜色、字体、圆角、阴影、尺寸改成当前 Theme
        ↓
Emil Skills
判断该不该动、动哪里、持续多久、是否影响阅读
        ↓
GSAP
统一编排进当前 Step timeline / continuous motion
```

### D. 使用原则

- 不允许把 Galaxy 原组件不加判断地整块塞进视频。
- 优先复用结构和细节语言：边框、glow、loader、状态点、hover/press、pattern、micro-interaction。
- 当前 Theme 永远高于组件原始配色。
- 组件内部动画不能拥有 Garden Step 导航权。
- Galaxy 负责“丰富视觉组件”，Emil 负责“动画品味”，GSAP 负责“时间线执行”。
- 以后如果画面又退化成四张普通白卡片，应先检查 Galaxy 是否有更合适的视觉原型。

### E. 当前核心三层资源

```text
Uiverse Galaxy = 视觉组件 / 微交互素材
Emil Skills     = 动画设计 / 审查 / 品味
GSAP            = 动画运行时 / Timeline / SVG / MotionPath
```

再由 Garden Skills 负责最上层 Chapter / Step / Narration 结构。

第一章未通过用户最终验收前仍不进入第二章。

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

### 5.5 动画风格按 Emil 规则

优先：

- transform + opacity；
- enter 使用 strong ease-out；
- moving/morphing 使用 ease-in-out；
- stagger 原则 30–80ms（视频解释型动画可按语义适当延长，但不能拖沓）；
- 不使用 `scale(0)`；
- 不为了“炫”而动；
- 文字和数据正在被阅读时避免无意义持续移动；
- 动画必须有 Explanation / Feedback / State / Spatial Consistency 等明确目的。

### 5.6 当前第一章动画实现

第一章改为 **6 条独立 GSAP timeline**：

1. Step 1：标签 → 标题 → 问题 → SVG 关系线。
2. Step 2：问题 → 执行翻车 → 失败信号 → VS → 稳定闭环 → 稳定信号。
3. Step 3：工作台 → 4 个工具/状态模块 → 右侧 Harness 作用。
4. Step 4：员工 → Prompt → 工作环境 → 4 个 Harness 条件 → 结论。
5. Step 5：任务 → 执行循环 → 4 个节点 → 无 Harness / 有 Harness → 10 家公司。
6. Step 6：章节提示 → 主结论 → 中文解释 → 4 层 Harness。

Timeline 时长会根据当前 narration duration 做整体缩放，但**绝不控制 Step 跳转**。

### 5.7 Gate

第一章未通过用户最终验收前，不进入第二章。最新用户评分以 **40 / 100** 作为返工基线，不沿用上一版 87 分的错误判断。

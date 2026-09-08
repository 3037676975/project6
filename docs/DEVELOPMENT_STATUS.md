# Project6 开发状态

> 每次开发前必须依次阅读：`docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。
> 第一章还必须阅读 Garden 官方规范、`presentations/harness-engineering/ACCEPTANCE.md`、`ANIMATION_REVIEW.md`，以及 Project6 本地 Emil animation skills。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章返工验收**
- 当前状态：**IN PROGRESS / v6 动画设计链重建完成，等待用户体验验收**
- 最近一次用户明确评分基线：**40 / 100（否决旧 Beat 方案）**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 当前范围：**只做第一章，不进入第二章**
- Garden Theme：`warm-keynote`
- Step：6
- TTS：`edge-tts / zh-CN-YunxiNeural / 1.0x`
- TTS timing：`SentenceBoundary / timings.json / hidden SRT`
- 动画 Runtime：`GSAP + MotionPathPlugin + DrawSVGPlugin`
- 动画设计/Review：`emilkowalski/skills`
- BGM：无音乐 / 3 个 CC0 预置 / 本地上传
- 导出：浏览器本地 MediaRecorder → WebM

## 已否决的旧方案

以下不再作为正式动画主逻辑：

```text
data-beat
+
audio.currentTime / duration
+
粗百分比 threshold
```

原因：语义错位、影响阅读、动画机械、容易产生“说一画面已跳二”的体验。

## 当前动画体系

```text
Garden Step / Narration
        ↓
find-animation-opportunities
        ↓
animate / animation-vocabulary / emil-design-eng
        ↓
GSAP Timeline / DrawSVG / MotionPath
        ↓
Edge TTS SentenceBoundary cue
        ↓
review-animations
        ↓
improve-animations
```

## 本轮已完成

### 上游动画体系固定

- [x] `vendor/upstream/gsap/` 完整镜像 `greensock/GSAP`。
- [x] `vendor/upstream/emil-skills/` 完整镜像 `emilkowalski/skills`。
- [x] `.github/workflows/sync-animation-upstreams.yml` 自动同步。
- [x] 上游 commit SHA 和许可证保留。
- [x] GSAP Standard License 信息保留。
- [x] Emil MIT LICENSE 保留。

### Edge TTS 隐藏时间码

- [x] `scripts/generate-harness-edge-tts.py` 改成 stream 模式。
- [x] MP3 生成时同时采集 `SentenceBoundary`。
- [x] 新增 `presentations/harness-engineering/timings.json`。
- [x] 每 Step 同时生成隐藏 SRT timing 文件。
- [x] GitHub Actions 已生成并验证 timing metadata。
- [x] 可见字幕仍然禁止；SRT 只做动画 cue。

### 第一章 GSAP 空间故事重建

- [x] 本地加载 `gsap.min.js`。
- [x] 本地加载 `MotionPathPlugin.min.js`。
- [x] 本地加载 `DrawSVGPlugin.min.js`。
- [x] 6 个 Step 对应 6 个独立 GSAP Timeline。
- [x] GSAP timeline 不负责 Step 翻页。
- [x] Auto 仍只有 narration `ended` 才切下一 Step。
- [x] SentenceBoundary `start` 只驱动当前 Step 内 cue。
- [x] Step 1：关系路径绘制 + traveler 路径运动。
- [x] Step 2：同一模型分叉到失败 / 稳定两种系统。
- [x] Step 3：Agent Core → 四条连接 → 四个工作台组件展开。
- [x] Step 4：Prompt token 沿路径进入 Harness 工作环境。
- [x] Step 5：执行循环路径 + runner + 10 家公司状态推进。
- [x] Step 6：四层 Harness 聚合到 Reliable Agent。
- [x] SVG 图标替代 emoji 图标。
- [x] 公司 01–10 静态模板残留 bug 已通过 Normalize Action 修复。

### Emil 交互 / Physicality

- [x] Toolbar press 采用约 160ms 的 `scale(.97)` 反馈。
- [x] Hover 使用 `(hover:hover) and (pointer:fine)` gating。
- [x] `focus-visible` 明确可见。
- [x] `prefers-reduced-motion` 已加入。
- [x] 禁止 `transition: all`。
- [x] 禁止 `scale(0)` 进入。
- [x] 普通 UI 优先 transform / opacity。
- [x] 键盘左右导航不强制播放长场景动画。

### Review / Gate

- [x] 新增 `ANIMATION_REVIEW.md`。
- [x] 记录采用的 animation opportunities。
- [x] 记录主动拒绝的无意义动画。
- [x] 逐屏记录目的 / 工具 / physicality。
- [x] `ACCEPTANCE.md` 升级到 v6。
- [x] `validate-harness-chapter1.mjs` 升级到 v6。
- [x] v6 GitHub Actions Code Gate：**PASS**。

## 当前待通过

- [ ] 浏览器实机逐句确认 SentenceBoundary 与视觉动作语义贴合。
- [ ] 0.5× / 0.25× 慢放检查动画节奏断点。
- [ ] DevTools frame-by-frame 检查 scene transition / DrawSVG / MotionPath。
- [ ] Manual：每一段旁白始终停留在对应 Step。
- [ ] Auto：6 Step 连播无提前跳页。
- [ ] Reduced Motion 完整播放一次。
- [ ] HTTPS 地址完成完整 WebM 本地录制。
- [ ] 用户重新评分并最终 PASS。

## 当前 Gate

**上游镜像 Gate：PASS。**

**TTS Timing Gate：PASS。**

**GSAP + Emil v6 代码 Gate：PASS。**

**产品最终 Gate：IN PROGRESS / 仍需用户实际观看。**

第一章未最终 PASS 前，不进入第二章。

# Project6 开发状态

> 每次开发前必须依次阅读：`docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。  
> 第一章还必须阅读 Garden 官方 `web-video-presentation`、`CHAPTER-CRAFT.md`、`AUDIO.md`，以及 `presentations/harness-engineering/ACCEPTANCE.md`。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章 Garden v22 返工验收**
- 当前状态：**IN PROGRESS / 等用户视觉与听感验收**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 当前范围：**只完善第一章，不进入第二章**
- Garden Theme：`warm-keynote`
- Step：6（沿用现有 6 段音频）
- TTS：`edge-tts / zh-CN-YunxiNeural / 1.0x`
- TTS timing：`SentenceBoundary / timings.json / hidden SRT`
- 动画 Runtime：`GSAP + MotionPathPlugin + DrawSVGPlugin`
- BGM：无音乐 / 3 个预置 / 本地上传
- 导出：浏览器本地 `getDisplayMedia + MediaRecorder → WebM`

## v22 当前制作链

```text
现有 6 段 Narration
        ↓
timings.json / SentenceBoundary
唯一 Step 内同步事件源
        ↓
Garden Step
每个 Step 只承担一个主命题
        ↓
warm-keynote Theme Tokens
奶油纸底 / 暖网格 / teal 单强调
        ↓
CSS + SVG + GSAP
空间关系 / 状态变化 / 低强度环境运动
        ↓
narration ended + 200ms
Auto 进入下一 Garden Step
```

## 本轮已完成

### 同步重构

- [x] 保留 6 Step ↔ 6 narration 的一一映射。
- [x] 删除旧版 `semanticSync()` 中 `8.6 / 10.45 / 12.25 / 3.35 / 5.25 ...` 等手写秒数。
- [x] Step 内只使用 Edge TTS SentenceBoundary。
- [x] GSAP 不负责翻页。
- [x] Auto 仅 narration `ended` 后翻页。
- [x] 按 Garden AUDIO 规范增加 200ms 结尾缓冲。

### 视觉重构

- [x] 第一章首页改为 Harness Runtime 空间关系图。
- [x] Step 2 从左右卡片墙改为单一 Execution Rail。
- [x] Step 3 从三栏后台 Console 改为中心 Agent Workbench。
- [x] Step 4 从普通 Prompt VS Harness 卡片改为“Prompt 位于 Harness 内部”的包含关系。
- [x] Step 5 删除虚构公司名、虚构 sources、虚构完成率；改为 01～10 概念任务队列 + verification loop。
- [x] Step 6 改为 `Intelligence × Execution System = Reliable Agent` 收束。
- [x] 正式第一章不使用 Emoji。
- [x] 主题统一为 Garden 官方 `warm-keynote` token 性格。

### 保留能力

- [x] Manual / Auto。
- [x] 本地 BGM 上传（ObjectURL）。
- [x] Reduced Motion。
- [x] 浏览器本地 MediaRecorder。
- [x] Galaxy / Emil / GSAP 上游资源仍保留在 Project6 资源体系中，但 v22 不为了“用组件而用组件”。

## 当前待通过

- [ ] 正式 Project6 地址实机加载 v22。
- [ ] Auto 连播 6 Step，确认旁白结束后 200ms 才换页。
- [ ] 用户逐屏确认画面比上一版更好看。
- [ ] 检查手机 / 小屏缩放后的文字可读性。
- [ ] HTTPS 完成完整 WebM 本地录制。
- [ ] 用户最终体验 PASS。

## 下一步（只在用户确认 v22 方向后）

用户前面提出的本地 IndexTTS 方案可作为后续音频工作流：Project6 输出配音任务包 → 用户本机 GPU 批量生成 → 上传标准命名音频 → Project6 自动匹配。届时可以把当前长 narration 从源头拆成更细 Garden Step，做到比 SentenceBoundary 更严格的“一个口播节拍一个 Step”。

## 当前 Gate

**Garden v22 代码 / 结构 Gate：PASS。**  
**浏览器实机 Gate：WAITING.**  
**用户最终产品 Gate：WAITING.**

**第一章未最终 PASS 前，不进入第二章。**

# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden `web-video-presentation` / `CHAPTER-CRAFT.md`。

## 当前 Phase

**Phase 1 · Harness Engineering 整片 Garden v31 视觉返工 + 本地 IndexTTS 整包交接**

## 当前状态

- 后台：作品优先结构；视频工作台已废弃。
- 整片内容：7 个内部章节 / 42 Scene / 42 段完整口播。
- Canonical 画面数据：`presentations/harness-engineering/full-video-data.js`。
- Canonical 整片播放器：`presentations/harness-engineering/full-video.html`。
- Canonical 整片 TTS JSON：`presentations/harness-engineering/full-tts-tasks.json`。
- TTS 交接：只允许一次复制完整 42 段 JSON；用户本机 IndexTTS 2.5 负责生成。
- 音频回传：一个总 ZIP，编号 `001`～`042`。
- 整片预览：播放 / 暂停 / 继续 / 上一张 / 下一张 / Scene 进度 / 全屏。
- 动画 SFX：最后环节，当前锁定。

## 2026-09-09 · Garden v31 视觉返工

### 用户反馈

v30 虽然完成 42 Scene，但视觉过度模板化：少数 `cards / rail / loop / timeline` 模板反复套用，导致大量画面“长得一样”。

### 根因

错误地把 Garden 当成“主题皮肤 + 通用组件库”。Garden 官方要求相反：

- 这是视频，不是 PPT；
- 每个 Step 先根据内容决定“这一拍演什么”；
- outline 不提前写死动画；
- 每章至少有 1～2 处真正的 CSS / SVG / Canvas / JS 视觉演示；
- 画面信息要承担关系表达，不是把 narration 打字放上去；
- 不允许整章一种动画 / 一种卡片结构重复到底。

### v31 已完成

- [x] 重新阅读 Garden `SKILL.md`、`CHAPTER-CRAFT.md`、官方 `warm-keynote/tokens.css`。
- [x] 正式主题 token 对齐官方 warm-keynote：cream canvas / sepia ink / teal accent / warm 40px grid。
- [x] 删除 v30 通用 `visualMarkup(type)` 思路。
- [x] `full-video.js` 改为 `switch(scene.id)`，42 Scene 分别定义内容驱动视觉。
- [x] Scene 001：同模型双轨稳定性对照。
- [x] Scene 002：执行链真实断裂。
- [x] Scene 003：LLM Harness Workbench。
- [x] Scene 004：系统边界同心扩张。
- [x] Scene 005：Harness 四问空间布局。
- [x] Scene 007：Prompt → Context → Harness 迁移曲线。
- [x] Scene 014：概率空间聚束。
- [x] Scene 019：Context 决策网络。
- [x] Scene 020：RAG 检索输送链。
- [x] Scene 023：Progressive Disclosure 抽屉展开。
- [x] Scene 025：Harness 六层系统。
- [x] Scene 026：Tool Switchboard。
- [x] Scene 027：执行编排闭环。
- [x] Scene 028：State 三类信息板。
- [x] Scene 029：Evaluation Radar。
- [x] Scene 030：失败 → 重试 → 回滚路径。
- [x] Scene 032：Context Reset + State Handoff。
- [x] Scene 033：Planner / Generator / Evaluator 三角分工。
- [x] Scene 035：Index → 子文档渐进式目录树。
- [x] Scene 036：浏览器 RUN → SEE → FIX → VERIFY。
- [x] Scene 040：Model × Harness = Stable Delivery。
- [x] Scene 041：AI Engineer 环境设计能力图。
- [x] Scene 042：Reliable AI 最终收束。
- [x] SVG 路径类 Scene 使用 line draw；Reset / Radar / Probability / Final 等按语义使用不同主导动作。
- [x] 新增 `full-video-v31-fixes.css` 做 Scene-local class 隔离，避免 `.l1/.s1` 跨画面污染。
- [x] 全屏对象保持为整个播放器 shell，全屏仍可操作暂停与进度。
- [x] `full-video.html` 资源版本升级到 v31，避免旧模板缓存。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | CODE PASS / WAITING USER CONFIRM | 用户一次确认 42 段完整口播 |
| B 全部 Garden 画面 | V31 CODE PASS / USER REVIEW | 用户整片检查，不能再有连续模板感 |
| C 本地 IndexTTS | CODE READY / WAITING REAL ZIP | 真实 001～042 音频 42/42 匹配 |
| D 整片音画预览 | CODE READY / WAITING REAL AUDIO | 播放器实际使用本地音频连续播放通过 |
| E 动画 SFX | LOCKED | D PASS 后进入 |

## Garden 强制防回归规则

1. 连续 3 Scene 主要构图相同，只替换文字 → FAIL。
2. 画面只有 narration 文本，没有关系演示 → FAIL。
3. 整章只有 card grid / timeline / rail 一种结构 → FAIL。
4. 每张只用同一种 fade-in → FAIL。
5. 为填画面编假数据 / 假 Logo / emoji → FAIL。
6. 每次开发新 Scene 先回答：主角是谁？关系是什么？观众这一拍应该看见什么变化？再写代码。
7. 用户真实 IndexTTS 上传后，再根据真实 duration 调整每 Scene 内动画时长。

## 当前唯一下一步

**先验收 Garden v31 视觉，不进入 TTS。** 用户打开 v31 整片播放器重点抽查 Scene 001、002、003、007、014、019、023、025、029、032、033、035、036、040、042；若仍有明显模板感，继续返工 Gate B。
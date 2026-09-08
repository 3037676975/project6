# Harness Engineering · 整片验收标准 v31

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方 `web-video-presentation` → `CHAPTER-CRAFT.md` → 本文件。

## 当前验收对象

完整《Harness Engineering》视频，不再按章节分别交接。

- 内部章节：7
- Garden Scene：42
- 完整口播：42 段
- 整片 TTS JSON：`full-tts-tasks.json`
- 整片播放器：`full-video.html`
- 当前视觉版本：**Garden v31**

## Gate A · 完整口播

状态：**CODE PASS / WAITING USER CONFIRM**

- [x] 根据完整字幕素材整理整片叙事线。
- [x] 覆盖 Harness 为什么出现 → Prompt → Context → Harness → 六层系统 → 实践 → 总结。
- [x] 42 段连续编号 `001`～`042`。
- [x] 章节只用于内部组织，不要求用户分章生成 TTS。
- [x] 用户一次确认以后，一键复制完整 JSON。
- [ ] 用户确认整片口播稿。

## Gate B · Garden 画面

状态：**V31 CODE PASS / USER REVIEW**

Garden 官方核心要求：这是视频，不是 PPT；每一步必须先根据内容决定“这一步演什么”，而不是先有模板再塞文字。

### v31 强制规则

- [x] 42 Scene 均存在，编号 `001`～`042`。
- [x] 保持第一章 anchor 的 `warm-keynote`：官方 cream canvas / sepia text / teal accent / 40px warm grid。
- [x] 色彩与字体全部以 Garden theme token 为视觉基准。
- [x] 删除 v30 的“少数 visualMarkup 模板重复套 42 张”的方案。
- [x] v31 使用 `switch(scene.id)` 为 42 张分别定义内容驱动的视觉命题。
- [x] Scene 001：同模型双轨稳定性对照。
- [x] Scene 002：真实断链 Execution Chain。
- [x] Scene 003：LLM + Context / Tools / State / Recovery 工作台。
- [x] Scene 004：系统边界同心扩张。
- [x] Scene 007：Prompt → Context → Harness 三阶段迁移曲线。
- [x] Scene 014：概率空间聚束演示。
- [x] Scene 019：Context 决策信息网络。
- [x] Scene 023：Progressive Disclosure 抽屉式展开。
- [x] Scene 025：Harness 六层总架构。
- [x] Scene 027：任务编排闭环。
- [x] Scene 029：Evaluation Radar。
- [x] Scene 032：Context Reset / State Handoff。
- [x] Scene 033：Planner / Generator / Evaluator 三角生产验收分离。
- [x] Scene 035：索引 → 子文档渐进式文档树。
- [x] Scene 036：Browser RUN → SEE → FIX → VERIFY。
- [x] Scene 040：Model × Harness = Stable Delivery。
- [x] Scene 042：最终 Reliable AI 收束。
- [x] SVG path 场景使用 line-draw；结构场景按内容选择 build / reveal / reset / sweep 等不同动作。
- [x] Scene-local class 增加 v31 隔离覆盖，避免 `.l1/.s1` 等局部类互相污染。
- [x] 没有假公司 Logo / 假用户数 / 假来源数。
- [ ] 用户逐屏确认 42 张视觉质量。

### 防“模板化”验收

出现以下任何一条，Gate B 自动 FAIL：

1. 连续 3 张主要构图相同，只替换文字。
2. 整章只使用 cards / rail / timeline 中一种结构。
3. 画面只是把 narration 原样打字，没有额外关系演示。
4. 每张都使用相同 fade-in 作为唯一主动作。
5. 为了填空使用 fake logo / fake number / emoji。

## Gate C · 整片本地 IndexTTS

状态：**CODE READY / WAITING REAL ZIP**

- [x] Project6 不负责本地 GPU 推理。
- [x] canonical JSON：`full-tts-tasks.json`。
- [x] 任务只导出一次，编号 `001`～`042`。
- [x] 本地预期输出：`001.mp3`～`042.mp3`，可附 `manifest.json`。
- [x] 后台只接收一个整片 ZIP，或直接多选全部音频。
- [x] ZIP 支持子目录 basename 匹配。
- [ ] 用户上传真实 42 段 IndexTTS。
- [ ] 42/42 匹配通过。

## Gate D · 整片本地音画预览

状态：**CODE READY / WAITING REAL AUDIO**

- [x] 播放 / 暂停 / 继续。
- [x] 暂停同时停止 narration 与 GSAP timeline。
- [x] 上一张 / 下一张。
- [x] 42 Scene 进度跳转。
- [x] 全屏对象为整个播放器 shell，全屏状态仍保留暂停、进度条和控制器。
- [x] `F` 全屏、空格暂停/继续、方向键切 Scene。
- [x] 上传的新本地音频通过 `postMessage` 注入整片播放器。
- [x] 每个 Scene 音频 ended 后进入下一 Scene。
- [ ] 用户用真实 42 段音频连续播放确认。
- [ ] 按真实 IndexTTS duration 微调 Scene 内动画节奏。

## Gate E · 动画音效

状态：**LOCKED UNTIL D PASS**

- [x] SFX 与人物配音严格分开。
- [x] SFX 只在整片音画确认之后添加。
- [ ] Gate D PASS 后设计 reveal / whoosh / click / confirm / accent 等动画 SFX。

## 当前总状态

| Gate | 状态 |
|---|---|
| A 完整口播 | CODE PASS / WAITING USER CONFIRM |
| B 42 张 Garden 画面 | V31 CODE PASS / USER REVIEW |
| C 整片 IndexTTS | WAITING REAL ZIP |
| D 整片音画预览 | WAITING REAL AUDIO |
| E 动画 SFX | LOCKED |

下一步：用户先看 v31 整片视觉，不进入 TTS；若仍有明显模板感，继续返工 Gate B。
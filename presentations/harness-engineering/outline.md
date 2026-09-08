# Video Outline · Chapter 01 · v22

> **主题**：`warm-keynote` —— Garden 官方暖色 Keynote：奶油纸底、青色单强调、暖色网格、SaaS keynote / editorial 气质。  
> **当前验收范围**：第一章 / 6 Garden Steps。  
> **旁白状态**：沿用现有 6 段 Edge TTS 音频，先把现有成片的音画漂移和视觉问题修正，不越级进入第二章。

---

## v22 的同步原则

1. Garden Step 仍然是音画的基本单位：1 Step = 1 narration 音频。
2. Step 内只使用 `timings.json` 的 Edge TTS `SentenceBoundary` 推进视觉阶段。
3. **删除“凭感觉写 8.6s / 10.45s / 12.25s”这种句内秒数猜语义的做法。**
4. 长句中如果包含多个概念，本版不再假装做到逐词精确同步；画面把它们作为一个完整系统关系展示，避免“声音还没说到，单个元素已经抢先出现”。
5. Auto 唯一翻页条件：当前 narration `ended`，再留 200ms 缓冲进入下一个 Step。
6. 下一轮接入用户本地 IndexTTS 音频包后，可以把长句进一步拆成更细的 Step，从源头实现 Garden 官方“一个口播节拍一个 Step”的更严格版本。

---

## Step 1 · 同一个模型，为什么有人稳、有人崩

**主命题**：模型只是推理核心，稳定执行来自模型外部的运行环境。

**画面**：
- 左侧只保留一个强 Hook；
- 右侧是一张真正的 Harness Runtime 系统图，而不是四张孤立卡片；
- LLM 在中心，Context / Tools / State / Recovery 通过路径连到模型；
- narration 后段才建立完整运行壳，最终只保留低强度信号流动。

---

## Step 2 · 问题跑到模型外面

**主命题**：Agent 失败经常不是“模型不会想”，而是执行链断掉。

**画面**：
- 不再做 Unstable / Stable 两面卡片墙；
- 改成一条完整执行轨：LLM → Tool → State → Recovery → Result；
- 失败通过断点 / 虚线 / 中断结构表达，不依赖彩色报警卡；
- 一句话里的“工具没接上、状态丢了、任务卡住”不再用硬编码秒数逐项猜时机。

---

## Step 3 · Harness 是 Agent 工作台

**主命题**：Harness 是把资源、能力、连续性和恢复组织起来的工作环境。

**画面**：
- 一个中心 Workbench；
- Context / Tools / State / Recovery 四个端口围绕中心形成空间关系；
- 不再做左栏 + 深色 Console + 右 Activity 的三栏后台页面；
- 视觉重点是“组织成系统”，不是“后台 UI 看起来复杂”。

---

## Step 4 · Prompt 与 Harness 的关系

**主命题**：Prompt 是 Harness 里面的一张任务单，不是整个系统。

**画面**：
- 一个大的 Harness Operating Environment 框架；
- Prompt ticket 放在框架内部；
- Context / Tools / State / Recovery 是框架内的执行能力；
- 用“包含关系”直接解释 Prompt vs Harness，而不是两张卡片 VS。

---

## Step 5 · 研究十家公司：有没有执行闭环

**主命题**：可靠来自持续检查和继续执行，而不是一次搜索后马上总结。

**画面**：
- 删除 Alpha AI / Nova Labs 等虚构公司和虚构 source 数；
- 只保留口播真实给出的“10 家公司”，用 01～10 任务队列表达；
- Prompt-only 是 搜索 → 生成 → 总结 的直线；
- Harness 是 查资料 → 记来源 → 看缺口 → 继续验证 → 确认后下一家 的闭环；
- 没有假数据、假 Logo、假完成率。

---

## Step 6 · 收束

**主命题**：模型决定聪明程度，Harness 决定执行可靠性。

**画面**：
- Intelligence × Execution System = Reliable Agent；
- Context / Tools / State / Recovery 作为底层基础收束；
- 结尾稳定停住，不用大面积持续动画抢口播。

---

## 素材与实现约束

- ✓ 1920×1080 固定视频舞台；控制条在舞台外。
- ✓ Garden 官方 `warm-keynote` token 体系作为主视觉来源。
- ✓ CSS + SVG + GSAP 完成信息图，不依赖版权图片。
- ✓ 当前音频继续使用 `audio-map.json` 的 6 段 Edge TTS。
- ✓ `timings.json` SentenceBoundary 是本版 Step 内唯一同步事件源。
- ✓ Auto 仅 narration ended + 200ms 翻页。
- ✓ 无假公司、假来源数、假 Logo。
- ✓ Reduced Motion 保留。

## 当前 Gate

- [x] Garden 官方规范重新阅读并应用到 v22 设计。
- [x] 删除句内手写秒数语义 cue。
- [x] 页面 2 / 3 从后台卡片墙改成空间关系图。
- [x] 页面 5 删除虚构公司与虚构统计。
- [x] `warm-keynote` 主题统一。
- [ ] 浏览器实机 Auto 连播 6 Step。
- [ ] 用户确认视觉与听感 PASS。
- [ ] PASS 后才允许进入第二章。

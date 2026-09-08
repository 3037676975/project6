# Harness Engineering · 第一章动画 / 视觉审查 v9

> 设计链：Garden → Cloud/SaaS hierarchy → Galaxy component research → Emil Skills → GSAP → Edge TTS SentenceBoundary → Review。

## 1. Motion personality
本章是解释型技术视频，不是游戏 UI / 炫技 Landing Page。

固定人格：
- 清晰 > 炫技；
- 空间关系 > 单纯出现；
- 状态变化 > 装饰动画；
- 主文字出现后稳定；
- 环境动画只用于“系统仍在工作”的低强度反馈；
- 正式第一章不使用 Emoji。

## 2. Cloud / SaaS 视觉审查
采用成熟云产品常见的设计思想：
- comfortable density：信息量和可读性平衡；
- 一致 spacing rhythm；
- Surface / Status / Label / Icon 语义统一；
- mint 表达 ready / stable，coral 表达 fail / gap；
- 功能型图标优先简单线性 SVG；
- 每屏只有一个主命题，不让第二视觉中心抢焦点。

## 3. 六屏 Review

### Step 1 · Runtime Shell
**主命题：** 同一个模型，环境决定稳定性。
**结构：** 左侧结论 + 右侧 Agent Runtime 系统壳。
**动画：** 文案建立 → Runtime 出现 → Context/Tools/State/Recovery 建立 → 路径绘制 → 信号持续流动。
**拒绝：** 四张卡片平铺、Emoji 装饰、标题持续漂移。

### Step 2 · Two Lanes
**主命题：** 问题已经跑到模型外面。
**结构：** Unstable / Stable 两条完整运行通道，不是两个孤立卡片。
**动画：** 先失败通道，再稳定通道；状态 rail 只做持续运行感。
**拒绝：** 左右同时“啪”出现。

### Step 3 · Cloud Console Workbench
**主命题：** Harness 是真正的 Agent 工作台。
**结构：** Resources rail + 深色 Runtime Console + Activity rail。
**动画：** 先 Runtime，再资源和活动；运行状态条持续低强度流动。
**拒绝：** 白卡片矩阵重复上一屏构图。

### Step 4 · Prompt → Control Plane
**主命题：** Prompt 是指令，Harness 是运行环境。
**结构：** Prompt 输入 → 路径 → Harness Control Plane。
**动画：** Prompt token 沿明确路径移动；Control Plane 四层随后建立。
**拒绝：** Prompt 闪烁、四项无因果地逐个弹。

### Step 5 · Research Workspace
**主命题：** 十家公司任务的稳定性来自闭环。
**结构：** Pipeline + Company table + verification loop。
**动画：** Pipeline 建立 → 表格进入 → Loop 建立 → Progress bars 持续推进。
**拒绝：** 10 张公司小卡片循环跳动。

### Step 6 · System Summary
**主命题：** 模型决定聪明，Harness 决定稳定。
**结构：** 四层能力 → Reliable Agent。
**动画：** 四柱建立 → 收束 → 结尾稳定。
**拒绝：** 四层持续漂动、结尾炫技。

## 4. Emil 硬标准
- Justified motion：PASS。
- Frequency appropriate：PASS。
- Responsive easing：PASS。
- UI 高频动作短时长：PASS。
- Physical correctness：PASS，不用 scale(0)。
- GPU-first：PASS，普通动画优先 transform/opacity。
- Accessibility：PASS，存在 reduced motion。
- Cohesion：PASS，全章统一 warm-keynote + Cloud console 语言。

## 5. BLOCK 清单
以下任一出现直接 FAIL：
- Emoji 进入正式第一章；
- `data-beat` / 音频百分比猜语义；
- `transition: all`；
- `scale(0)`；
- timeline 自己翻页；
- 标题 / 正文持续漂移；
- 同一章反复使用“标题 + 四白卡”；
- Galaxy 组件不经 Theme 统一直接贴入；
- 持续动画和当前语义无关；
- 颜色只是装饰而不是语义状态。

## 6. Feel-check
代码 Gate 通过后仍需浏览器实机：
1. Auto 连播 6 Step，确认 narration ended 才翻页；
2. 逐句核对 SentenceBoundary 和视觉语义；
3. 0.5× / 0.25× 慢放查看突兀断点；
4. 检查小字缩放后的真实可读性；
5. Reduced Motion 完整播放；
6. HTTPS 环境录制完整 WebM。

## Verdict
**v9 代码 / 设计结构：APPROVE。**
**用户最终视觉体验：REQUIRED。**

第一章未获得用户最终 PASS，不进入第二章。

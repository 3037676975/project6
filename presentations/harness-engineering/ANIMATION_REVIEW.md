# Harness Engineering · 第一章动画审查

> 审查基准：Project6 本地 `vendor/upstream/emil-skills/`。  
> 核心参考：`find-animation-opportunities` → `animate` → `review-animations/STANDARDS` → `improve-animations`。  
> Runtime：Project6 本地 `vendor/upstream/gsap/`。

## 1. Motion personality

本章是“AI 技术解释型视频”，不是游戏 UI，也不是炫技 landing page。

因此统一 personality：

- 清晰 > 炫技；
- 空间关系 > 单纯出现；
- strong ease-out 用于进入；
- ease-in-out 用于屏内移动 / path / morph；
- 文字进入后保持稳定，不持续漂移；
- bounce 只在极少数“建立/完成”节点使用轻量版本；
- 每一个动作必须能回答：**它在解释什么？**

## 2. 第一章 Animation Opportunities 扫描

| Step | 候选 | 目的 | 决策 |
|---|---|---|---|
| 1 | 标题逐字弹跳 | Delight | **拒绝**：会抢标题阅读注意力 |
| 1 | 关系路径绘制 + traveler | Explanation / Spatial | **采用**：解释“同一个模型走向不同执行结果” |
| 2 | 整块左右卡片同时弹出 | Decoration | **拒绝**：没有因果顺序 |
| 2 | 同一个模型 → 分叉路径 → 两种系统 | Explanation / Spatial | **采用** |
| 3 | 四张工具卡独立 fade in | Prevent jarring change | **改造**：从 Agent Core 的连接关系中展开 |
| 4 | Prompt 文字闪烁 | Decoration | **拒绝** |
| 4 | Prompt token 从员工移动到工作环境 | Spatial consistency | **采用** |
| 5 | Runner 无限循环 | Decoration / distraction | **拒绝无限循环**；只在当前句讲执行循环时跑一圈 |
| 5 | 公司 01–10 逐项完成 | State indication | **采用** |
| 6 | 四层 Harness 持续浮动 | Decoration | **拒绝**；只做一次聚合并稳定停住 |
| Toolbar | hover 大幅缩放 | High frequency | **拒绝** |
| Toolbar | press scale(.97) / focus-visible | Feedback | **采用**，100–160ms 级别 |

## 3. 每屏构建参数

### Step 1 · 关系网络

**目的：** Explanation + Spatial consistency。  
**工具：** GSAP Timeline + DrawSVG + MotionPath。  
**物理故事：** 标题建立 → 关系线长出来 → traveler 沿路径走。  
**关键规则：** 标题出现后不再移动；路径动画服务解释关系。

### Step 2 · 同一模型，两种系统

**目的：** Explanation。  
**工具：** DrawSVG + transform/opacity + stagger。  
**物理故事：** 一个模型作为共同起点，先长出失败分支，再长出稳定分支。  
**禁止：** 左右两块同时“啪”出现。

### Step 3 · Agent 工作台

**目的：** Explanation + Spatial consistency。  
**工具：** GSAP transform/opacity + DrawSVG。  
**物理故事：** Agent Core 是中心；连接线建立后，Context / Tools / State / Recovery 从中心关系中展开。  
**禁止：** 工具卡持续浮动影响阅读。

### Step 4 · Prompt → Harness

**目的：** Spatial consistency + Explanation。  
**工具：** MotionPath + DrawSVG。  
**物理故事：** Prompt 是“给员工的一条要求”，token 沿桥接路径移动到“工作环境”；环境再展开四层条件。

### Step 5 · 10 家公司

**目的：** State indication + Explanation。  
**工具：** DrawSVG + MotionPath + stagger。  
**物理故事：** 循环路径建立 → runner 只跑一圈解释流程 → 模式对比 → 01–10 完成状态顺序推进。

### Step 6 · Reliable Agent

**目的：** Explanation / Closure。  
**工具：** transform/opacity + stagger。  
**物理故事：** 四层 Harness 聚合到 Reliable Agent，之后所有内容保持稳定。

## 4. `review-animations` 十条硬标准

| 标准 | 状态 | 本章处理 |
|---|---|---|
| Justified motion | PASS | 每个主要动画都有 Explanation / Spatial / State / Feedback 目的 |
| Frequency appropriate | PASS | 工具栏只保留轻微反馈；视频解释动画允许更完整 |
| Responsive easing | PASS | 进入优先 power3/power4 out；屏内 path 用 power2 in-out |
| Sub-300ms UI | PASS | 按钮反馈 160–180ms；视频解释动画不受 UI 300ms 限制 |
| Physical correctness | PASS | 不使用 scale(0)，对象从 0.96–0.99 / 空间路径进入 |
| Interruptibility | PASS | Manual scene transition 可被 GSAP kill/overwrite；按钮使用 CSS transition |
| GPU-first | PASS | 普通元素主要 transform / opacity；SVG path 是解释型例外 |
| Accessibility | PASS | prefers-reduced-motion + hover/pointer gating |
| Enter/exit logic | PASS | 场景方向有空间一致性；键盘导航跳过长转场 |
| Cohesion | PASS | 全章保持 warm-keynote + 克制解释型 motion personality |

## 5. BLOCK 清单

以下任一重新出现，动画 Review 直接 BLOCK：

- `data-beat` + 粗百分比 threshold；
- `scale(0)`；
- `transition: all`；
- UI `ease-in`；
- 正在阅读的正文无限漂移 / 呼吸 / bounce；
- GSAP timeline 自己调用下一个 Garden Step；
- 整屏全部关键内容同时出现；
- 为了“更炫”增加与解释无关的持续背景动画；
- animation cue 早于它对应的 TTS SentenceBoundary。

## 6. Feel-check

代码 Gate 通过不等于产品最终 PASS。浏览器实机还必须：

1. 用 0.5× / 0.25× 慢放检查 path / card / text 是否有节奏断点；
2. DevTools frame-by-frame 检查场景切换是否闪回；
3. Auto 连续播放 6 Step，确认 narration ended 才翻页；
4. 检查每个 SentenceBoundary 命中后，视觉动作是否对应当前句语义；
5. 检查文字稳定性：出现后应能安静阅读；
6. Reduced Motion 模式再完整播放一次。

## 7. 当前 verdict

**代码级动画设计链：APPROVE。**  
**最终 feel / 用户视觉验收：REQUIRED。**

第一章没有获得用户最终 PASS 前，不进入第二章。

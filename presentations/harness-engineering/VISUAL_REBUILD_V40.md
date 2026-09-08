# Harness Engineering · Visual Rebuild v40

> 用户要求：保留 Scene 001；Scene 002～042 全部推翻重做。任何连续画面都不能只是同一模板换文字。

## 强制设计协议

每个 Scene 开工前回答 5 个问题：

1. 这一拍最重要的“关系 / 状态变化 / 因果”是什么？
2. 如果把口播文字全部隐藏，观众能否仅凭画面理解至少 60%？
3. 主构图是否和前两张明显不同？
4. 动画是在解释内容，还是只是让元素动？如果只是装饰，删除。
5. 是否使用 Garden warm-keynote token，同时避免 PPT 卡片墙、统一左右布局、统一 fade？

## 42 Scene 视觉命题

| Scene | 视觉命题 | 主构图 | 主动画 |
|---|---|---|---|
| 001 | 同模型不同结果 | 双运行轨迹（保留 Anchor） | 两条轨迹分叉 |
| 002 | 模型聪明但执行链断 | 全屏断裂管线 | 信号沿线运行后在 Tool/State 处断裂 |
| 003 | Harness 是工作台 | 中央工作台鸟瞰图 | Context/Tools/State/Recovery 从四方接入 |
| 004 | 从回答到运行系统 | 同心系统边界 | Model→Agent→Harness 边界扩张 |
| 005 | Harness 四问 | 四象限雷达盘 | 指针依次扫描四个问题 |
| 006 | 第一章结论 | 全屏公式 + 系统底座 | Model 与 Harness 合并为 Reliable Agent |
| 007 | 三次工程迁移 | 纵向山路 / 三层台阶 | 镜头向上推进 Prompt→Context→Harness |
| 008 | Prompt 控制输出方向 | 巨型输入光束穿过模型 | Prompt 光束改变输出轨迹 |
| 009 | Prompt 三要素 | 三个机械拨盘 | Role/Task/Constraint 依次锁定 |
| 010 | Prompt 编译成规格 | 模拟编译器 | 自然语言→结构化规格块 |
| 011 | Few-shot 示例 | Before/After 训练墙 | 示例卡进入后输出形态被校正 |
| 012 | Prompt 边界 | 巨型玻璃墙 | Prompt 触碰 Knowledge/State/Tools 墙 |
| 013 | 概率空间 | 粒子答案星云 | 多答案粒子被 Prompt 聚束 |
| 014 | 好 Prompt ≠ 长 Prompt | 天平 | 长度 vs 清晰度重新平衡 |
| 015 | 输出格式约束 | 模板冲压机 | 自由文本被压成 JSON/表格槽位 |
| 016 | Prompt 失败模式 | 漏斗堵塞 | 冲突指令在漏斗中打结 |
| 017 | Prompt 的角色 | 导航罗盘 | 指令只负责方向，不负责道路 |
| 018 | 进入 Context | 镜头穿门 | Prompt 门后出现更大的 Context 空间 |
| 019 | Context 是信息环境 | 全屏知识网络 | 文档/状态/工具结果围绕模型连网 |
| 020 | Context Budget | 可视化容量仪表 | token 容量从健康到过载 |
| 021 | RAG | 检索传送带 | Query→Retrieve→Rank→Inject |
| 022 | Memory / State | 双时间轴 | 当前任务状态与长期记忆分轨 |
| 023 | Skills 渐进披露 | 文件抽屉 / 目录树 | 只打开当前需要的能力抽屉 |
| 024 | Context Orchestration | 调度台 | 多来源信息经过选择器进入模型 |
| 025 | Harness 六层 | 建筑剖面 | 六层自下而上搭建 |
| 026 | Tools | 插槽面板 | API/Browser/DB 工具真实插入接口 |
| 027 | Orchestration | 多泳道流程 | Planner→Worker→Verifier 异步流转 |
| 028 | State | 状态机 | Pending→Running→Blocked→Recovered→Done |
| 029 | Evaluation | 雷达 + QA 扫描 | 多维质量扫描后出现缺口 |
| 030 | Guardrail / Recovery | 决策树 | Error→Retry→Fallback→Rollback |
| 031 | 稳定性来自系统改造 | 同模型 A/B | 同一个 Model，Harness 前后成功路径不同 |
| 032 | Context Reset | 进程重启交接 | 旧 Agent 清空，新 Agent 接收 State Capsule |
| 033 | 生产与验收分离 | 三角工作流 | Planner/Generator/Evaluator 形成闭环 |
| 034 | 缺什么能力？ | 故障诊断面板 | Tool/Feedback/State/Spec 四项诊断亮起 |
| 035 | Progressive Disclosure | 文件目录树 | INDEX→按需展开子文档 |
| 036 | Browser Feedback | 模拟浏览器 + 修复循环 | RUN→SEE→FIX→VERIFY 四阶段 |
| 037 | Prompt 总结 | 全屏大字 + 指向箭头 | “把任务讲清楚”从噪声中浮现 |
| 038 | Context 总结 | 信息云聚合 | 正确信息在正确时间聚合 |
| 039 | Harness 总结 | 系统轨道 | Prompt/Context 被包进 Harness 运行环 |
| 040 | Model × Harness | 动态乘法公式 | 两侧合拢，结果从抖动变稳定 |
| 041 | AI 工程师角色变化 | 人→系统设计图 | 工程师从“写每一步”移到“设计环境” |
| 042 | Final | 全屏 Reliable AI 标记 | Prompt→Context→Harness 三环收束 |

## 版式节奏规则

- 禁止 Scene 002～042 继续使用统一“左文案 / 右卡片”骨架。
- 至少覆盖：全屏中心构图、上下构图、斜向构图、环形、纵向、横向、模拟界面、图谱、时间轴、建筑剖面、路径动画、公式、粒子/节点网络。
- 每 3 张至少改变一次视觉重心位置；每 6 张至少出现一张无传统卡片的纯视觉画面。
- 口播全文不会整段显示在舞台上；舞台只保留 1 个主标题 + 1～3 个视觉关键词。

## Motion 规则

遵循 Project6 `motions.html`：

- Garden：定义 Step 与 narration 边界；
- Emil：动画目的必须是 Explanation / Spatial / State / Feedback / Prevent jarring change；
- GSAP：Timeline / DrawSVG / MotionPath；
- 禁止 scale(0) 凭空弹出、无限呼吸、全场统一 fade、阅读中的文字持续漂移。

## Gate B v40

只有同时满足以下条件才能写 CODE PASS：

- [ ] Scene 002～042 全部拥有独立 visual recipe。
- [ ] Scene 002～042 全部拥有独立 motion recipe。
- [ ] 连续 3 张不存在同一种主构图。
- [ ] 不再存在统一左右分栏视频骨架。
- [ ] 每章至少 2 个真正的 SVG / CSS / JS 演示。
- [ ] 所有颜色、字体遵循 warm-keynote token。
- [ ] 浏览器逐张实机检查无溢出 / 遮挡 / 控件失效。
- [ ] 用户视觉验收 PASS。

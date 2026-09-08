# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components 学习层。

## 当前 Phase

**Phase 1 · Harness Engineering Garden v40 全视觉重构**

## 用户最新硬要求

- Scene 001 保留。
- Scene 002～042 全部推翻重做。
- 后续画面必须彼此明显不同，不能继续统一左右排版。
- 画面必须“可视化表达”，不能只是把口播放到卡片里。
- 动画必须按照 Garden + Project6 motions 体系设计：解释关系 / 空间 / 状态 / 反馈，而不是统一 fade。

## v31 为什么判失败

v31 虽然给 42 Scene 写了不同 HTML，但仍然存在这些问题：

1. 大量 Scene 共用同一个视频外壳，视觉重心接近。
2. 很多 Scene 仍然是标题 + 图形容器的 PPT 思维。
3. Motion 主要停留在入场动画，没有让内容本身发生可视化变化。
4. 没有充分使用 Project6 已经整理的 GSAP / Emil / Galaxy 学习层。

因此：**v31 Gate B = FAIL / SUPERSEDED。**

## v40 已完成代码改造

### 视觉层

- [x] 新建 `VISUAL_REBUILD_V40.md`，为 001～042 建立逐张视觉命题。
- [x] 新建 `full-video-v40.css`。
- [x] 新建 `full-video-v40.js`。
- [x] 正式 `full-video.html` 已切换到 v40。
- [x] Scene 001 保留 Anchor。
- [x] Scene 002～042 全部从统一模板渲染改成逐 Scene markup。
- [x] 不再存在全片统一左文案 / 右卡片骨架。

### 视觉类型覆盖

- [x] 断裂执行管线
- [x] Harness 工作台鸟瞰
- [x] Model / Agent / Harness 同心边界
- [x] 四问 Radar
- [x] 三次工程迁移山路
- [x] Prompt 光束 / 概率输出
- [x] Role / Task / Constraint 机械拨盘
- [x] Prompt compiler
- [x] Few-shot 示例墙
- [x] Prompt 能力玻璃墙
- [x] 概率粒子场
- [x] 清晰度 vs 长度天平
- [x] 输出格式冲压机
- [x] 冲突 Prompt 漏斗
- [x] Prompt 罗盘
- [x] Prompt→Context 空间门
- [x] Context 知识网络
- [x] Context Budget 仪表
- [x] RAG 检索传送带
- [x] Memory 双时间轴
- [x] Skills 渐进披露抽屉
- [x] Context Switchboard
- [x] Harness 六层建筑剖面
- [x] Tool Socket 插槽
- [x] Orchestration 泳道
- [x] State Machine
- [x] Evaluation Radar
- [x] Recovery 决策树
- [x] Same Model A/B
- [x] Context Reset / State Handoff
- [x] Planner / Generator / Evaluator 三角闭环
- [x] Harness 故障诊断
- [x] Progressive Docs 文件树
- [x] Browser RUN → SEE → FIX → VERIFY
- [x] Prompt 全屏大字提炼
- [x] Context 信息云
- [x] Harness 轨道系统
- [x] Model × Harness 动态公式
- [x] Engineer → Environment Designer
- [x] Final 三环收束

### Motion 层

- [x] 正式加载本地 GSAP。
- [x] 正式加载本地 DrawSVGPlugin。
- [x] 正式加载本地 MotionPathPlugin。
- [x] 每个 Scene 单独写 motion recipe。
- [x] 动画类型包含：路径自绘、信号断裂、结构搭建、系统边界扩张、雷达扫描、轨迹移动、拨盘锁定、编译输出、粒子聚束、天平摆动、机械冲压、门开启、传送带、状态机、评估扫描、Reset 闪断、角色转移、最终环收束。
- [x] Pause 同时暂停 narration 与当前 Scene GSAP timeline。
- [x] Reduced Motion 保留。

## TTS / 音频规则保持不变

- 整片仍然是一个完整视频项目。
- Canonical TTS JSON：`full-tts-tasks.json`。
- 用户只复制一次完整 JSON。
- 本地 IndexTTS 生成 001～042。
- 用户回传一个总 ZIP。
- Project6 自动匹配并注入整片播放器。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | CODE PASS / WAITING USER CONFIRM | 用户确认整片口播 |
| B Garden v40 视觉 | CODE REBUILT / USER REVIEW | 用户逐张检查 002～042，确认达到第一张 Anchor 的质量 |
| C 本地 IndexTTS | CODE READY / WAITING | Gate B 稳定后生成真实总 ZIP |
| D 整片音画 | CODE READY / WAITING AUDIO | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |

## 当前唯一下一步

**只做视觉验收。**

用户打开 v40 完整播放器，重点抽查 Scene 002、005、007、008、013、018、021、023、025、027、029、032、033、035、036、040、042；如果仍然有“像同一个模板 / 不像视频 / 可视化太弱”的 Scene，继续返工 Gate B，不进入 TTS。

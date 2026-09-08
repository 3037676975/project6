# Harness Engineering · 整片验收标准 v40

> 当前视觉要求发生重大变更：Scene 001 保留为 Anchor；Scene 002～042 全部推翻重做。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：保留视觉锚点
- Scene 002～042：v40 全视觉重构
- TTS：仍然整片一次 JSON / 一次 ZIP，不改变
- SFX：仍然最后处理

## Gate A · 完整口播

状态：**CODE PASS / WAITING USER CONFIRM**

- [x] 42 段完整口播保持不变。
- [x] 编号仍为 001～042。
- [x] TTS 仍然只导出一个总 JSON。

## Gate B · Garden 视觉

状态：**V40 CODE REBUILT / USER REVIEW REQUIRED**

### 强制要求

- [x] Scene 001 保留为 Anchor。
- [x] Scene 002～042 不再使用统一左文字 / 右可视化骨架。
- [x] Scene 002～042 分别编写独立 visual recipe。
- [x] Scene 002～042 分别编写独立 motion recipe。
- [x] 新增 `VISUAL_REBUILD_V40.md`，逐张记录视觉命题 / 构图 / 主动画。
- [x] 视觉类型覆盖：断裂管线、工作台鸟瞰、同心系统边界、雷达盘、山路迁移、光束、机械拨盘、编译器、示例墙、玻璃墙、粒子概率场、天平、格式冲压机、堵塞漏斗、罗盘、空间门、知识网络、容量仪表、RAG 传送带、双时间轴、Skills 抽屉、Context 调度台、六层建筑、工具插槽、泳道流程、状态机、Evaluation Radar、恢复树、A/B 系统、Context Reset、三角工作流、诊断面板、目录树、Browser Feedback、全屏大字、信息云、Harness 轨道、动态公式、工程师角色转移、最终三环收束。
- [x] GSAP 动画不再统一 fade；按 Scene 分别使用路径绘制、轨迹移动、旋转扫描、状态切换、结构搭建、Reset 闪断、门开启、传送带、天平平衡等动作。
- [x] full player 已切换到 `full-video-v40.css` + `full-video-v40.js`。
- [x] DrawSVG / MotionPath 使用 Project6 本地 GSAP vendor。
- [ ] 浏览器逐张检查 002～042 无遮挡 / 溢出 / 文字过小。
- [ ] 用户确认视觉质量达到第一张 Anchor 的标准。

### Garden / Emil 防回归

1. 连续 3 张主构图相同 → FAIL。
2. 只有文字卡片 + fade → FAIL。
3. 动画无法解释内容 / 空间 / 状态 / 反馈 → 删除。
4. 一屏展示整段口播 → FAIL。
5. 重新出现统一“左文案右卡片”外壳 → FAIL。
6. 使用假数据 / 假 Logo / Emoji 充视觉 → FAIL。

## Gate C · 整片 IndexTTS

状态：**CODE READY / WAITING REAL ZIP**

- [x] 整片 JSON 001～042 保持不变。
- [x] 本地 IndexTTS 仍由用户生成。
- [x] Project6 仍接收一个总 ZIP。
- [ ] 等 Gate B 视觉验收后再正式生成最终语音包，避免反复重做。

## Gate D · 整片音画预览

状态：**CODE READY / WAITING REAL AUDIO**

- [x] 播放 / 暂停 / 继续 / 全屏 / 上一张 / 下一张 / Scene 进度跳转保留。
- [x] 本地音频注入协议不变。
- [ ] 真实 IndexTTS 上传后根据每段时长调整 v40 Scene 内 timing。

## Gate E · 动画 SFX

状态：**LOCKED UNTIL D PASS**

- SFX 仍然只在最终音画通过后加入。

## 当前结论

**代码结构已经从 v31 模板化方案切换为 v40 逐 Scene 视觉方案。**

但 Gate B 不能由开发者自己宣布通过：必须由用户打开 v40 整片播放器逐张看，尤其检查 Scene 002～042 是否真正达到“每张都在演不同事情”的目标。

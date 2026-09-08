# Harness Engineering · 第一章验收标准 v14

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → Emil Skills → 本文件。
>
> v14 目标：**不是继续推翻，而是把前几版已经好看的东西找回来：蓝色舞台、清晰网格、第六页蓝绿收束、底部玻璃工具条；同时修首页右侧 Harness 网络的设计感，以及第二/第三页语义动画的真实同步。**

## 1. 主题与结构
- [x] 主题必须明确是 Harness Engineering。
- [x] 第一页 HARNESS / ENGINEERING 是最大视觉层级。
- [x] 6 个 Garden Step / 6 段 narration。
- [x] 禁止 Honeys 等错误词。
- [ ] 用户最终视觉/听感 PASS。

## 2. v14 主色与背景
正式颜色仍参考 Open Color + Radix Colors，但不再把舞台做成近乎纯白。

```text
Canvas / Outer BG : 浅蓝
Stage BG          : 浅蓝白渐变 + 薄荷绿环境光
Grid              : 48px 蓝色主网格 + 12px 极淡辅助网格
Primary Accent    : Sky / Blue
Secondary Accent  : Mint / Teal
Text              : 中性蓝灰
Failure           : Coral / Red，仅失败语义
```

核心要求：
- [x] 蓝色舞台感恢复。
- [x] 网格清晰可见，不再被淡化到看不见。
- [x] 不使用大面积墨绿/石墨绿主容器。
- [x] 浅蓝 + 浅绿仍为第一章主色。
- [x] 字体统一为中文无衬线体系。
- [ ] 用户确认整体颜色不再“过白、没层次”。

## 3. 第一页右侧 Harness Runtime Map
右侧不是普通四卡片，而是一张真正的控制网络。

- [x] LLM Core 使用蓝 → 薄荷绿渐变，不用深色硬块。
- [x] Context / Tools / State / Recovery 四节点围绕核心。
- [x] SVG 连接线保持可读。
- [x] 进入当前 Step 最终态后，数据粒子持续沿四条连接路径流动。
- [x] 节点只做极轻的环境浮动，不影响文字阅读。
- [x] reduced-motion 下关闭持续流动。
- [ ] 用户确认首页右侧设计感。

## 4. 第二页：一句话内部语义同步
关键口播：`工具没接上、状态丢了、任务卡住。`

必须按同一句中的真实语义顺序触发：
1. 工具调用断开；
2. 任务状态丢失；
3. 任务卡住 / 失败无法恢复。

- [x] 三条失败状态不在页面进入时一次性显示。
- [x] 使用 narration currentTime 的明确语义子 cue 分别触发三项。
- [x] Stable 侧只在后续结论句建立。
- [ ] 用户实机确认三项出现时机自然。

## 5. 第三页：工作台按概念建立
关键口播：`资料放哪儿、工具怎么用、做到一半怎么记住、失败了怎么接着跑。`

视觉顺序：
1. Context；
2. Tools；
3. State；
4. Recovery；
5. Harness Core 收束。

- [x] Resource / Runtime Card / Activity 同概念成组出现。
- [x] 中央工作台改成浅蓝/浅绿玻璃云工作区。
- [x] Runtime Card 使用白色/浅蓝层级，不再沉重深色。
- [x] Harness Core 最后收束。
- [ ] 用户确认第三页美观与节奏。

## 6. 第六页保留优秀配色
- [x] 第六页保持蓝绿双强调，不回退纯白。
- [x] 四个 Pillar 蓝/绿交替建立层次。
- [x] Harness 结论文字使用蓝 → 绿渐变。
- [x] Reliable Agent 使用浅蓝绿收束块。
- [x] Merge Line 有低强度持续流动。

## 7. 底部工具条
- [x] 工具条仍在 1920×1080 舞台外。
- [x] 恢复玻璃 / 浅蓝质感，不再像普通表单行。
- [x] Manual / Auto 分组清楚。
- [x] 播放按钮使用蓝绿主渐变。
- [x] BGM / 录制仍属于工具条，不侵占视频内容。

## 8. 动画控制器 v14
- [x] 修复 v13 把 Timeline 代码错误塞进 `startAmbient()` 的结构性 bug。
- [x] `buildTimeline()` 只负责一次性主动画。
- [x] `semanticSync()` 只负责一句话内部的语义子 cue。
- [x] `startAmbient()` 只负责持续环境动画。
- [x] GSAP 永远不能切换 Garden Step。
- [x] Auto 唯一翻页条件仍是 narration `ended`。
- [x] Manual 播放旁白结束后停留当前 Step。

## 9. Manual / Auto / BGM / Export
- [x] Manual / Auto 分离。
- [x] 3 个 BGM + 无音乐 + 本地上传。
- [x] 本地音乐只使用 ObjectURL，不上传服务器。
- [x] getDisplayMedia + MediaRecorder 浏览器本地录制。
- [x] 录制结束自动下载 WebM。
- [ ] HTTPS 实机完整录制 PASS。

## 最终 Gate v14
- Harness 主题：PASS
- 蓝色舞台 + 清晰网格：必须 PASS
- 首页 Runtime Map：必须 PASS
- 第二页语义子 cue：必须 PASS
- 第三页语义工作台：必须 PASS
- 第六页蓝绿收束：必须 PASS
- 底部玻璃工具条：必须 PASS
- SentenceBoundary / narration ended 边界：必须 PASS
- 用户最终验收：PASS 后才进入第二章

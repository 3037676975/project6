# Harness Engineering · 第一章验收标准 v13

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → Emil Skills → 本文件。
>
> v13 目标：**保持 warm-keynote 的轻盈感，但正式主色改为浅绿 + 蓝；配色必须来自成熟开源色阶，不再凭感觉造色。第二页失败状态必须按口播语义逐项出现，第三页工作台必须浅、清楚、有层次。**

## 1. 内容与主题
- [x] 主题：模型之外的运行系统，决定 Agent 能不能稳定把任务做完。
- [x] 第一章标题明确为 Harness Engineering。
- [x] 封面 HARNESS / ENGINEERING 是最大视觉层级。
- [x] 禁止 Honeys 等错误词。
- [x] 6 个 Garden Step / 6 段 narration。
- [ ] 用户最终听感 PASS。

## 2. 配色系统 v13
正式色盘参考：
- Open Color（MIT）：Blue / Cyan / Teal / Gray 色阶。
- Radix Colors（MIT）：Blue / Cyan / Teal / Mint / Sky 角色色阶。

正式规则：
```text
Canvas / Surface : 白 + 极浅蓝
Primary Accent   : Sky Blue / Blue
Secondary Accent : Light Mint / Teal
Text             : 中性深灰，不使用深绿正文
Success          : Mint / Teal
Failure          : Coral / Red，仅用于失败语义
Dark Surface     : 原则上取消；必要时也必须是蓝绿轻渐变，不得大面积墨绿/石墨绿
```

当前核心色：
```text
Blue 0  #e7f5ff
Blue 4  #4dabf7
Blue 6  #228be6
Blue 7  #1c7ed6
Teal 0  #e6fcf5
Teal 4  #38d9a9
Teal 7  #0ca678
Gray 9  #212529
Gray 7  #495057
```

- [x] 第一章主色改为浅绿 + 蓝。
- [x] 深墨绿主容器退出正式视觉。
- [x] Step 3 Console 改为浅蓝 / 浅绿玻璃工作区。
- [x] Step 4 Control Plane 底部改为浅蓝绿说明带。
- [x] VS 改为蓝绿渐变，不再深色块。
- [ ] 用户最终确认配色。

## 3. 字体与层级
- [x] 中文正文统一 `Noto Sans SC / PingFang SC / Microsoft YaHei / system-ui`。
- [x] Mono 只用于标签、状态、编号，不用于大段正文。
- [x] 标题、正文、辅助文字保持明确三级层级。
- [x] 小字不得依赖低对比度深绿灰。
- [ ] 用户确认字体观感统一。

## 4. SentenceBoundary 当前句同步
- [x] edge-tts / zh-CN-YunxiNeural / 1.0x。
- [x] 真实 SentenceBoundary timing。
- [x] cue N 触发当前句视觉段，不允许晚一整句。
- [x] Auto 仅 narration ended 后翻页。
- [ ] 浏览器逐句实测 PASS。

## 5. 第二页语义动画
口播关键句：`工具没接上、状态丢了、任务卡住。`

必须按当前句内部顺序建立：
1. 工具调用断开；
2. 任务状态丢失；
3. 任务停止 / 无法恢复。

禁止一进入页面就把三条全部亮出来。
- [x] 三条失败状态改为逐项 GSAP reveal。
- [x] Stable 侧在结论阶段才建立。
- [ ] 用户实机确认节奏自然。

## 6. 第三页工作台动画
口播：`资料放哪儿、工具怎么用、做到一半怎么记住、失败了怎么接着跑。`

视觉顺序必须对应：
1. Context；
2. Tools；
3. State；
4. Recovery；
5. 最后收束为 Harness Core。

- [x] Resource / Runtime Card / Activity 按同一概念成组建立。
- [x] 中央 Console 使用浅色蓝绿工作区，不再是沉重深色块。
- [x] Harness Core 最后收束。
- [ ] 用户确认第三页设计感。

## 7. Emil + GSAP
- [x] 每 Step 独立 GSAP Timeline。
- [x] Step 边界不可越过。
- [x] 动画使用 transform / opacity / SVG 等高性能属性。
- [x] 支持 reduced motion。
- [x] 禁止 transition: all / scale(0)。
- [ ] 0.5x 慢放 feel-check。

## 8. Manual / Auto / BGM / Export
- [x] Manual / Auto 分离。
- [x] BGM 多选 + 本地上传。
- [x] 本地音乐不上传服务器。
- [x] 浏览器 getDisplayMedia + MediaRecorder 本地录制。
- [x] 录制结束自动下载 WebM。
- [ ] HTTPS 实机完整录制 PASS。

## 最终 Gate
- Harness 主题：PASS
- Open Color / Radix 浅绿蓝配色：必须 PASS
- 第二页逐项语义动画：必须 PASS
- 第三页工作台：必须 PASS
- SentenceBoundary：必须 PASS
- 字体统一：必须 PASS
- 用户视觉验收：PASS 后才能进入第二章

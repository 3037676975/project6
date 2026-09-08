# Harness Engineering · 第一章验收标准 v11

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → Emil Skills → 本文件。
>
> v11 目标：**封面必须让 Harness Engineering 成为绝对主题；禁止出现 Honeys 等错误词；正式配色继续保留 warm-keynote 奶油纸张 + 青绿 DNA，但深色组件统一使用冷调深墨绿，不允许棕色/深棕主导；SentenceBoundary 当前句同步规则继续保持。**

## 1. 内容与主题
- [x] 一句话主题：模型之外的运行系统，决定 Agent 能不能稳定把任务做完。
- [x] 第一章标题必须明确为 **Harness Engineering**。
- [x] 封面主标题必须直接出现 **HARNESS / ENGINEERING**。
- [x] 禁止出现 `Honeys` 或任何把 Harness 拼错、听错、重新造词的内容。
- [x] 6 个 Garden Step，各自一段 narration。
- [x] 口播保持聊天式中文。
- [ ] 用户最终听感 PASS。

## 2. Harness 章节封面
第一页必须承担“主题封面 + 第一问题”的职责。

- [x] `CHAPTER 01 · HARNESS ENGINEERING` 清楚可见。
- [x] `HARNESS` 为第一页最大视觉层级。
- [x] `ENGINEERING` 为明确副标题，不被其他品牌词抢层级。
- [x] 第一问题仍为“为什么同一个模型，执行结果差这么多？”。
- [x] 右侧图只作为主题解释：Harness Runtime Map，不得抢主标题。
- [x] Context / Tools / State / Recovery 用作 Harness 的四层执行保障。
- [ ] 用户确认封面主题准确、层级舒服。

## 3. 配色硬规则
正式第一章统一使用：

```text
Canvas / Paper : 奶油白 / 暖中性白
Primary Ink   : 深墨绿
Accent        : 青绿 / mint
Success       : mint
Failure       : coral
Dark Surface  : 冷调深墨绿 / teal-black
Neutral       : 中性灰绿
```

禁止：
- 棕色、深棕色作为主容器或中间核心视觉；
- 大面积咖啡色 / 土黄色深背景；
- 与 Garden Theme 无关的第三套主色；
- 深色块只因为“显高级”而存在。

当前验收：
- [x] `dark-surface` 改为冷调深墨绿渐变。
- [x] Step 3 Runtime Console 改为冷调墨绿，不再呈棕色观感。
- [x] Step 4 中间连接与 Control Plane 底部改为青绿 / 墨绿体系。
- [x] VS badge 改为冷调深绿。
- [x] 第一页右侧 Harness Map 改为浅色系统壳 + 墨绿 Agent Core。
- [ ] 用户最终确认配色达到设计感要求。

## 4. SentenceBoundary 当前句同步
- [x] `edge-tts / zh-CN-YunxiNeural / +0% / 1.0x`。
- [x] 6/6 MP3 Ready。
- [x] `timings.json` 使用真实 SentenceBoundary。
- [x] cue N 到达时，视觉立即向当前句的视觉终点运行。
- [x] 禁止旧 `tweenTo(cueN)` 一句晚一拍逻辑。
- [x] Auto 唯一翻页条件仍为 narration `ended`。
- [ ] 浏览器实机逐句确认无明显早拍 / 晚拍。

## 5. 视觉系统
- [x] 1920×1080 固定舞台。
- [x] warm-keynote 奶油纸张 / 青绿 accent 保留。
- [x] 正式第一章不使用 Emoji。
- [x] 一屏一个主视觉命题。
- [x] 后 5 屏保留 v9 已认可的结构：Two lanes / Cloud console / Control Plane / Research workspace / System summary。
- [x] 卡片、表格、Console、网络图结构混合使用，不退化成白卡片墙。

## 6. Emil + GSAP 动画 Gate
- [x] 每 Step 独立 GSAP Timeline。
- [x] Garden Step 边界不允许被动画越过。
- [x] 主要文字出现后保持稳定。
- [x] 持续动画只用于连接、运行状态、进度、循环。
- [x] 禁止 `scale(0)` / `transition: all`。
- [x] 支持 `prefers-reduced-motion`。
- [ ] 0.5× / 0.25× 慢放 feel-check。

## 7. Manual / Auto / BGM / Export
- [x] Manual：上一页 / 下一页 / 当前旁白，旁白结束不自动翻页。
- [x] Auto：仅 narration ended 后进入下一 Step。
- [x] 无音乐 / 3 个预置 / 本地上传。
- [x] 本地上传通过 ObjectURL，不上传服务器。
- [x] `getDisplayMedia + MediaRecorder` 浏览器本地录制。
- [x] 录制结束自动下载 WebM，Project6 不保存成片。
- [ ] HTTPS 实机完整录制 PASS。

## 8. 最终 Design Review
逐屏检查：
1. Harness 是否是第一页绝对主题？
2. 有没有任何错误品牌词或拼写？
3. 深色组件是否统一冷调墨绿，而不是棕色？
4. 中间连接是否克制、清楚、有空间关系？
5. 当前 narration 正在说什么？当前动作是否就在解释这句话？
6. 信息密度是否舒服？
7. 小字缩放后是否仍可读？
8. 动画是否帮助理解而不是炫技？

## 最终 Gate
- Harness 主题封面：必须 PASS
- 配色系统：必须 PASS
- SentenceBoundary 当前句同步：必须 PASS
- 画面：≥ 90
- Emil Animation Review：必须 PASS
- GSAP Step boundary：必须 PASS
- Manual / Auto：PASS
- BGM：PASS
- 本地录制：PASS
- 用户最终验收：PASS

任一项 FAIL：继续修改，不进入第二章。
# Harness Engineering · 第一章验收标准 v10

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → Emil Skills → 本文件。
>
> v10 目标：**保留 v9 已通过的 warm-keynote + Cloud/SaaS 视觉系统；第一页必须是 Honeys 品牌章节封面；TTS SentenceBoundary 一进入当前语句，对应视觉动作必须立即开始，禁止再出现“话说完了动画才出来”的一拍延迟。**

## 1. 内容
- [x] 一句话主题：模型之外的运行系统，决定 Agent 能不能稳定把任务做完。
- [x] 6 个 Garden Step，各自一段 narration。
- [x] 口播保持聊天式中文。
- [ ] 用户最终听感 PASS。

## 2. Honeys 章节封面（v10 新硬 Gate）
第一页必须承担“品牌 + 章节介绍 + 第一问题”的职责，而不是功能页。

- [x] 明确出现 **Honeys** 品牌。
- [x] 明确出现 `CHAPTER 01 · HARNESS ENGINEERING`。
- [x] 主题标题先讲“这一章讲什么”，不直接进入后台/Runtime 功能 UI。
- [x] 第一段 narration 继续用于提出“同一个模型，为什么 Agent 稳定性不同？”。
- [x] 封面后半段才逐步建立“同一个模型 → 两种结果”的小型解释图。
- [x] 仍保持奶油纸张 + 青绿 accent，不另起一套品牌视觉。
- [ ] 用户确认封面作为 Honeys 视频开场合格。

## 3. 配音与真实语义同步（v10 核心）
- [x] `edge-tts / zh-CN-YunxiNeural / +0% / 1.0x`。
- [x] 6/6 MP3 Ready。
- [x] `timings.json` 使用真实 SentenceBoundary。
- [x] 可见字幕禁止；SRT 只作为隐藏 timing。
- [x] 视觉 cue 只在当前 Garden Step 内运行。
- [x] Auto 唯一翻页条件：当前 narration `ended`。

### 3.1 v9 已确认的问题
旧逻辑：

```text
SentenceBoundary cueN 到达
→ tweenTo(cueN)
→ 只移动到当前动画段“开始位置”
→ 当前句视觉动作没有执行
→ 下一 cue 到来才补执行
```

结果：**口播领先画面一整拍。**

### 3.2 v10 正式规则

```text
SentenceBoundary cueN 到达
→ 找到 cueN 与 cueN+1 之间的视觉动画段
→ 立即 tween 向当前句的视觉终点
→ 当前句说话期间，对应画面同步建立
```

- [x] `advanceCue()` 不再使用旧 `tweenTo(cueN)`。
- [x] cueN 目标优先为 `cueN+1`；最后一句目标为 timeline duration。
- [x] 动画时长根据当前 SentenceBoundary duration 约束在约 0.5–1.35s，避免过慢拖到下一句。
- [x] cue 触发允许最多约 80ms 视觉预启动，抵消浏览器 audio timeupdate 粒度。
- [x] GSAP timeline 仍不拥有 Step 导航权。
- [ ] 浏览器实机逐句确认：对应动作应在“正在说这一句”时发生，而不是说完后发生。

## 4. v9 视觉系统继续保留
### 4.1 基础 DNA
- [x] 1920×1080 固定舞台。
- [x] warm-keynote 奶油纸张 / 青绿 accent 保留。
- [x] 主要文本为深墨绿，次级文本保持稳定对比度。
- [x] 统一 Surface / Status / Label / Icon box 语言。
- [x] 控制栏完全在舞台外。
- [x] 正式第一章不使用 Emoji。

### 4.2 Cloud / SaaS Design 原则
- [x] Comfortable density：不靠巨大空白制造高级感，也不靠堆文字填满。
- [x] 4px/8px 级 spacing rhythm。
- [x] 一屏只有一个主视觉命题。
- [x] mint=ready/stable，coral=fail/gap。
- [x] Iconography 使用简单 SVG，不用装饰 emoji。
- [x] 页面结构包含网络、双通道、运行台、Control Plane、任务表格、系统收束，不退化成卡片墙。
- [ ] 用户最终确认信息密度和层级舒服。

## 5. 第一章 6 屏构图 Gate
1. **Step 1 · Honeys Cover**：品牌 / Chapter / 主题标题 → 同模型不同结果的封面解释图。
2. **Step 2 · Two lanes**：同一模型失败/稳定双通道对比。
3. **Step 3 · Cloud console workbench**：资源栏 + Runtime Console + Activity。
4. **Step 4 · Prompt → Control Plane**：Prompt 输入对象进入 Harness Control Plane。
5. **Step 5 · Research workspace**：10 家公司 pipeline / table / verification loop。
6. **Step 6 · System summary**：Context / Tools / State / Recovery 聚合到 Reliable Agent。

任意一屏退化成“标题 + 四张白卡片”：FAIL。

## 6. Galaxy / Emil / GSAP 使用规则
- [x] Galaxy 完整本地镜像与组件索引保留，用作组件结构灵感源。
- [x] 第三方组件必须先适配 Garden Theme，不能原色原样粘贴。
- [x] Emil `find-animation-opportunities → animate/vocabulary → review/improve` 继续作为动画设计链。
- [x] 每 Step 独立 GSAP Timeline。
- [x] 不使用 `data-beat + 音频百分比`。
- [x] 不使用 `scale(0)` / `transition: all`。
- [x] 主要文字出现后保持稳定。
- [x] 持续动画只服务连接、运行状态、进度、循环。
- [x] `prefers-reduced-motion` 存在。
- [ ] 0.5× / 0.25× 慢放 feel-check。

## 7. Manual / Auto
- [x] Manual：上一页 / 下一页 / 方向键 / 当前旁白；旁白结束不自动翻页。
- [x] Auto：仅 narration ended 后进入下一 Step。
- [ ] 实机连续播放 6 Step，无提前跳页。

## 8. BGM
- [x] 无音乐 / 3 个预置 / 本地上传。
- [x] 本地音乐 ObjectURL，不上传服务器。
- [ ] 用户选择最终满意音乐。

## 9. 浏览器本地录制
- [x] `getDisplayMedia + MediaRecorder`。
- [x] Secure Context 检查。
- [x] 浏览器内存 → 自动下载 WebM。
- [x] Project6 服务器不保存成片。
- [ ] HTTPS 实机完整录制 PASS。

## 10. 最终 Design Review
必须逐屏回答：
1. 第一眼应该看哪里？
2. 当前 narration 正在说什么？当前动作是否就在解释这句话？
3. 动画有没有早一拍或晚一拍？
4. 是否有第二个组件抢主层级？
5. 信息是不是太空 / 太挤？
6. 动画有没有帮助理解？
7. 小字缩放后是否仍能读？
8. 状态颜色是否有语义？

## 最终 Gate
- Honeys 封面：必须 PASS
- 内容：PASS
- TTS：PASS
- **SentenceBoundary 当前句同步：必须 PASS**
- 画面：≥ 90
- Cloud/SaaS hierarchy & density：必须 PASS
- Galaxy component adaptation：必须 PASS
- Emil Animation Review：必须 PASS
- GSAP Step boundary：必须 PASS
- Manual / Auto：PASS
- BGM：PASS
- 本地录制：PASS
- 用户最终验收：PASS

任一项 FAIL：继续修改，不进入第二章。
# Project6 项目总纲 · AI Web Video Studio

> 文档级别：**最高优先级 / Source of Truth**  
> 适用范围：Project6 的产品、页面、模板、视频制作、TTS、资源库、导出与后续所有开发任务。  
> 维护原则：任何开发若与本总纲冲突，必须先停止开发并修正方案；不得用新增复杂度掩盖方向偏差。

---

## 0. 我们到底在做什么

Project6 不是在线剪辑 SaaS，也不是服务器视频渲染平台。

Project6 是一个轻量的：

**AI HTML 视频资源中心 + Garden 视频制作规范库 + 播放/本地导出工作台。**

最重要的一条原则：

> **制作主要由 AI 完成，Project6 负责整理、保存模板和源码、预览、播放、本地导出，不承担重型视频生成。**

最终目标是让学生和低预算用户能够利用 ChatGPT + Garden Skills + 免费/低成本 TTS + Web 动画，在不购买 GPU、不购买昂贵视频生成 API、不依赖大型剪辑软件的情况下制作漂亮的知识类视频。

---

# 一、重新定义 Project6

## Project6 · AI Web Video Studio

核心流程：

```text
用户提供主题 / 文章 / 文案
        ↓
ChatGPT / AI 制作层
        ↓
严格执行 Garden Skills
web-video-presentation
        ↓
Narration Script
        ↓
Theme
        ↓
Outline
        ↓
Chapter
        ↓
Step
        ↓
HTML / React / SVG 动画
        ↓
配音
        ↓
Project6 加载与预览
        ↓
浏览器播放
        ↓
【播放并导出】
        ↓
浏览器本地录制
        ↓
下载到用户电脑
```

**服务器不保存最终视频。**

Project6 服务器主要保存：

| 内容 | 是否服务器保存 |
|---|---|
| HTML / React 页面 | ✅ |
| CSS | ✅ |
| JS | ✅ |
| 视频脚本 | ✅ |
| narration 文本 | ✅ |
| Garden 模板与主题信息 | ✅ |
| 中文文档 | ✅ |
| 小型音效素材 | ✅ |
| Lottie / SVG 动画资源 | ✅ |
| 最终 MP4 / WebM | ❌ |
| 用户导出的视频 | ❌ |
| 大量生成视频缓存 | ❌ |

这个设计的根本目的是避免服务器因为大量视频文件而产生不必要的存储、CPU、转码和运维压力。

---

# 二、Garden Skills 是整个项目的制作规范

用户口中的 “Garden Scale” 在本项目中统一对应 **Garden Skills 的 `web-video-presentation` 视频制作能力**。

它不是一个“参考风格”，而是 Project6 的核心制作标准。

标准工作流：

```text
原始内容
   ↓
Narration Script
   ↓
Theme
   ↓
Outline
   ↓
Implementation Mode
   ↓
Chapter
   ↓
Step
   ↓
Audio
   ↓
Auto Play
```

视频舞台统一按照 16:9 设计，优先使用 **1920 × 1080** 的视觉坐标和布局逻辑。

关键约束：

```text
Chapter
   ↓
Step
   ↓
一个 Step
对应
一段 Narration
```

不能再采用“画面随便设 5 秒、7 秒、3 秒”的粗糙做法。

必须让画面和配音建立严格的 Step 级对应关系，从根本上减少声音还没说完画面已经切换、画面停留过长、字幕和动画节奏脱节等问题。

---

# 三、AI 每次制作视频必须遵循 Garden 逻辑

以后用户即使只说：

> 做一个关于 RAG 的两分钟视频。

AI 也不能直接开始乱写 HTML。

必须先执行：

```text
① 理解主题
       ↓
② 写完整 Narration
       ↓
③ 拆 Chapter
       ↓
④ 拆 Step
       ↓
⑤ 为每个 Step 设计画面
       ↓
⑥ 选择 Garden Theme
       ↓
⑦ 制作 HTML / React / SVG 动画
       ↓
⑧ 生成对应配音
       ↓
⑨ 检查 Narration / Step 数量和顺序
       ↓
⑩ Project6 加载、预览、播放
```

其中 Narration 数据应该成为声音和 Step 数量的重要事实来源，避免画面、配音和章节数量不一致。

---

# 四、Project5 只负责 TTS

Project5 是独立 TTS HTTP 服务，不要把 TTS 模型和复杂推理代码复制进 Project6。

推荐默认配置：

```text
engine = edge
voice = zh-TW-YunJheNeural
speed = 1.10
```

后台显示名可以继续使用：

**ETG1 / Edge 云哲 · 台湾男声**

但真实 API 参数必须发送：

```text
zh-TW-YunJheNeural
```

架构：

```text
Project6
轻量视频工作台
        │
        │ 请求 TTS
        ↓
Project5
独立 TTS 服务
        │
        ↓
Edge TTS
        │
        ↓
zh-TW-YunJheNeural
云哲 · 台湾男声
```

Project6 不承担模型部署。

---

# 五、配音也尽量不长期存在 Project6

推荐流程：

```text
Project6
   ↓
请求 Project5

Project5
   ↓
生成音频
   ↓
HTTP Response 返回

浏览器
   ↓
Blob
   ↓
播放
```

必要时可以在浏览器使用内存或 IndexedDB 做临时保存。

目标：

> **最终视频不落服务器，生成配音默认也不长期落 Project6 服务器。**

---

# 六、播放时直接在浏览器本地导出

“HTML 播放的时候顺便下载”不是让 HTML 神奇地直接变成 MP4，而是让浏览器承担本地捕获和录制。

推荐链路：

```text
点击【播放并导出】
      ↓
浏览器捕获当前视频舞台 / 当前标签页
      ↓
HTML 动画播放
+
TTS 播放
+
音效播放
      ↓
MediaRecorder / 浏览器本地录制
      ↓
Blob
      ↓
自动下载
```

例如：

```text
00:00
开始播放 + 开始录制

00:13
Chapter 2

00:42
Chapter 3

01:26
结束

↓
停止录制
↓
AI-RAG教程.webm
↓
浏览器下载
```

在这个过程中：

- Project6 服务器不会收到最终视频。
- Project6 服务器不会保存最终视频。
- Project6 服务器不会负责视频编码。
- Project6 服务器不会因为用户导出视频而长期占用硬盘。

---

# 七、浏览器限制必须如实接受

如果 Garden 视频继续大量使用 DOM / React / CSS / SVG，而不是把所有东西重写成 Canvas，浏览器安全机制通常要求用户在导出时主动授权捕获当前标签页或当前页面。

用户体验可以设计成：

```text
播放并导出
     ↓
选择「当前标签页」
     ↓
开始
```

之后自动播放、自动录制、自动下载。

这是浏览器的安全要求，不应该为了去掉一个授权弹窗就重新制造一个复杂 Canvas 视频引擎。

第一版优先保证：

**本地录制、本地保存、不经过服务器。**

---

# 八、MP4 也尽量不要依赖服务器

第一阶段优先支持：

```text
WebM
```

第二阶段再评估：

```text
WebCodecs
或
ffmpeg.wasm
```

在用户浏览器本地做：

```text
WebM
↓
MP4
```

目标按钮：

```text
▶ 播放
⬇ 导出 WebM
⬇ 导出 MP4
🎙 仅下载配音
📦 下载 HTML 项目
```

即使增加 MP4，也要优先让计算发生在用户设备，而不是 Project6 服务器。

---

# 九、Garden 模板 / 主题进入 Project6 模板中心

Project6 的模板系统不能只做几张“换颜色的卡片”。

Garden 的 Theme 思想需要被完整吸收，Theme 至少要描述：

```text
颜色
字体
舞台间距
圆角
分割线
Hero 数字
阴影
装饰
Mood
```

后台模板中心建议展示：

```text
┌────────────┐
│ 16:9 Preview│
│             │
│ Blueprint   │
│ 技术蓝图     │
│ 技术 / 架构  │
└────────────┘

┌────────────┐
│ 16:9 Preview│
│             │
│ Chalk Garden│
│ 黑板花园     │
│ 科普 / 教程  │
└────────────┘
```

每个主题详情至少包含：

- 中文名称
- 英文名称
- 视觉说明
- 适合内容
- Mood
- 字体
- 色彩 Token
- Accent
- 16:9 Preview
- 使用方法
- 推荐 Scene

以后用户说“用 Blueprint 做”，AI 就应该能从主题资料中理解完整的设计规范，而不是只换背景色。

---

# 十、后台必须提供 Garden 中文手册

Project6 后台增加：

**📚 Garden 视频制作规范**

它不能只是一篇 README，而应该逐步形成完整中文手册：

| 文档 | 内容 |
|---|---|
| Garden 入门 | 它解决什么问题 |
| 视频制作流程 | Script → Theme → Outline → Scene |
| Chapter | 什么叫章节 |
| Step | 为什么一个 Step 对应一个 Narration |
| Narration | 配音规范 |
| Theme | Theme Token 怎么工作 |
| 主题 / 模板 | 中文说明 + Preview |
| 动画规范 | 动画如何设计 |
| 字体规范 | 中文 / 英文 / 数字 |
| 音频规范 | TTS 如何同步 |
| Auto Mode | 自动播放逻辑 |
| 导出 | Project6 本地录制 |
| 常见错误 | 音画不同步等 |
| AI 制作规范 | AI 每次必须遵守什么 |

这套手册同时服务两类使用者：

1. 人：用户可以阅读和学习。
2. AI：未来每次制作和开发前都可以先读取这些规则。

---

# 十一、建立动画资源库

AI 不应该每次都从零制作所有动画。

Project6 需要逐步积累：

```text
动画资源库
├─ 文字动画
├─ 数字动画
├─ 图表动画
├─ 卡片动画
├─ 流程图动画
├─ SVG 动画
├─ Logo 动画
├─ 背景动画
├─ 进场动画
├─ 退场动画
├─ 强调动画
└─ 加载动画
```

推荐优先研究和接入的开源 Web 动画能力：

### Lottie Web

适合 JSON 动画，能够与 SVG / Canvas / HTML 渲染结合，用于可复用动效素材。

### Anime.js

适合 CSS、SVG、Timeline、Stagger、Spring 等网页动画控制。

### Motion

适合 React 动画与组件级运动系统。

目标是建立统一动画 ID，例如：

```text
number-counter-01
title-reveal-03
svg-flow-arrow-02
card-stack-04
```

以后制作视频时直接引用，不重复造轮子。

---

# 十二、建立音效能力层

推荐把音效拆成两个概念：

## 1. 音效播放器：Howler.js

用于：

```text
播放
暂停
Seek
音量
Fade
Speed
Stereo
Audio Sprite
```

例如：

```text
Step 02 出现标题
↓
播放 whoosh-01

卡片出现
↓
播放 click-soft-03

数字跳动
↓
播放 tick-02
```

## 2. 程序化音效：Tone.js

适合浏览器实时生成：

```text
电子提示音
Tick
Beat
环境声
简单音乐
Synth
Transition
```

可以把一部分简单音效做成程序生成，而不是每次依赖 MP3 文件。

---

# 十三、建立免费音效素材库

Project6 可以整理合法、清晰许可证的免费音效资源。

优先资源之一：Kenney Audio。

后台音效库可以按照：

```text
🎵 音效库

UI
├─ click
├─ switch
├─ hover
├─ confirm
└─ error

Transition
├─ whoosh
├─ swoosh
├─ sweep
└─ rise

Technology
├─ digital
├─ beep
├─ data
└─ scanner
```

每个资源至少展示：

```text
▶ 试听
♡ 收藏（后续）
复制 ID
查看许可证
来源链接
```

视频 Scene 只需要引用：

```text
sfx: ui-click-04
```

---

# 十四、Project6 后台信息架构重新设计

旧思路中大量围绕：

```text
AI 生成
视频服务器
复杂任务队列
GPU 状态
转码 Worker
```

这些都不是 Project6 的核心。

新的后台应该围绕：

```text
Project6
AI Web Video Studio

├─ 工作台
├─ 视频作品
├─ 模板中心
├─ Garden 中文手册
├─ 动画资源
├─ 音效资源
├─ 配音测试
├─ 素材库
└─ 制作规范 / 项目总纲
```

明确不把以下能力作为第一阶段核心：

- 渲染队列
- GPU 状态
- 视频服务器
- 服务端转码平台
- 大型任务 Worker

Project6 要保持轻。

---

# 十五、职责边界

| 模块 | 职责 |
|---|---|
| ChatGPT / AI | 写脚本、分镜、HTML、动画、执行规范 |
| Garden Skills | 视频制作标准 |
| Project6 | 管理、浏览、预览、播放、本地导出 |
| Project5 | 独立 TTS 服务 |
| Edge 云哲 | 第一阶段默认中文配音 |
| Howler | 音效播放 |
| Tone.js | 程序音效 |
| Kenney 等 CC0 资源 | 免费音效素材来源 |
| Lottie | 动画素材 |
| Anime.js / Motion | HTML / React 动画 |
| 浏览器 | 最终视频捕获与录制 |
| 用户电脑 | 最终视频存储 |

任何新模块必须先问自己：

> 这个能力应该属于 Project6，还是应该留在 AI、Project5 或用户浏览器？

如果属于后者，就不要塞进 Project6 服务器。

---

# 十六、统一视频项目数据结构

建议视频作品统一：

```text
presentations/
└── rag-intro/
    ├── manifest.json
    ├── README.md
    ├── script.md
    ├── outline.md
    │
    ├── src/
    │   ├── chapters/
    │   │   ├── 01-intro/
    │   │   │   ├── index.tsx
    │   │   │   └── narrations.ts
    │   │   ├── 02-rag/
    │   │   └── 03-summary/
    │   └── styles/
    │
    ├── assets/
    │   ├── images/
    │   ├── svg/
    │   └── lottie/
    │
    └── sfx.json
```

其中 `manifest.json` 至少描述：

```text
视频标题
简介
Theme
章节数量
Step 数量
封面
作者
使用哪些音效
默认 Voice
状态
```

Project6 应尽量通过 manifest 自动读取和展示作品，而不是把每个作品的元信息硬编码到页面。

---

# 十七、第一阶段只验证一条完整链路

第一阶段绝对不要继续贪多。

只验证：

```text
一段 60～90 秒文案
        ↓
严格 Garden Skills
        ↓
选择一个 Garden Theme
        ↓
5～10 个 Step
        ↓
生成 HTML 动画
        ↓
Project5
Edge 云哲台湾男声
        ↓
自动播放
        ↓
音画同步
        ↓
浏览器本地录制
        ↓
下载 WebM
```

只有这条链真正跑通，Project6 才算有“灵魂”。

然后：

- 第二个实验：换一个 Garden Theme。
- 第三个实验：加入 Whoosh / Click / Tick / Lottie / SVG。
- 再往后：扩充模板、主题、音效和动画资源库。

---

# 十八、最终产品目标

Project6 的最终产品目标浓缩成一句话：

> **利用 ChatGPT + Garden Skills + 免费 TTS + Web 动画，让学生不用 GPU、不买视频生成 API、不购买昂贵剪辑软件，也能制作漂亮的知识类视频；Project6 只负责管理和播放，最终视频直接在用户浏览器生成并保存到本地。**

Project6 不是：

> AI 在线剪辑 SaaS。

而是：

> **AI 驱动的免费 HTML 视频制作体系。**

---

# 十九、强制开发门禁（每次开发必须执行）

从本文件加入仓库开始，Project6 的每一个开发任务都必须走以下流程。

## Gate 0：先读总纲

开发前必须先阅读：

1. `docs/PROJECT_CHARTER.md`（本文件）
2. `docs/PRD.md`
3. 与当前任务直接相关的 Garden / Architecture 文档

没有完成阅读，不开始写代码。

## Gate 1：定位当前阶段

开始任务前明确写出：

```text
当前阶段：Phase ?
当前已经完成：
本次只做：
本次明确不做：
```

禁止在不知道自己做到哪一步的情况下继续加功能。

## Gate 2：目标对齐检查

动手前回答：

- 这一步是否服务“免费 HTML 视频制作体系”？
- 是否遵守 Garden Chapter / Step / Narration 逻辑？
- 是否把本应在浏览器完成的重活塞给服务器？
- 是否制造了不必要的 GPU、渲染队列、转码服务器或视频存储？
- 是否与 Project5 的 TTS 职责重复？
- 是否可以被真实验收？

任意核心问题不通过，先修方案，不开发。

## Gate 3：开发

只实现当前任务，不顺手扩大范围。

每一阶段必须有明确产出和可验证结果。

## Gate 4：自检

开发完成后逐条检查：

### 产出

实际改了什么文件、页面、数据和功能？

### 可验证标准

用户如何一眼判断这个功能真的完成？

### 禁止项

是否出现：

- 假按钮
- 只有 UI 没逻辑
- 伪造成功状态
- 音画不同步
- 不符合 Garden 结构
- 服务端保存最终视频
- 重复建设 TTS
- 无必要增加服务器负担
- 文档与实际代码不一致

## Gate 5：审核结果

```text
PASS
↓
记录完成状态
↓
允许进入下一步
```

或：

```text
FAIL
↓
列出失败项
↓
继续完善
↓
重新自检
```

**没有 PASS，不进入下一阶段。**

---

# 二十、每次开发的固定报告格式

今后每次开发 Project6，开发记录至少使用：

```text
【当前定位】
Phase：
已完成：
本次目标：
明确不做：

【对照总纲】
产品方向：PASS / FAIL
Garden 逻辑：PASS / FAIL
轻量服务器原则：PASS / FAIL
TTS 边界：PASS / FAIL
可验收性：PASS / FAIL

【实际开发】
修改文件：
实现功能：

【自检】
产出检查：PASS / FAIL
功能检查：PASS / FAIL
禁止项检查：PASS / FAIL
文档一致性：PASS / FAIL

【审核结论】
PASS → 进入下一步
FAIL → 继续完善，不进入下一步
```

这不是可选模板，而是 Project6 后续开发的工作纪律。

---

## 参考项目 / 资源

- Garden Skills: https://github.com/ConardLi/garden-skills
- Lottie Web: https://github.com/airbnb/lottie-web
- Anime.js: https://github.com/juliangarnier/anime
- Motion: https://github.com/motiondivision/motion
- Howler.js: https://github.com/goldfire/howler.js
- Tone.js: https://github.com/Tonejs/Tone.js
- Kenney Assets: https://kenney.nl/assets

---

**最后原则：先把一条链路做真，再把资源库做大；先保持简单，再增加能力。**

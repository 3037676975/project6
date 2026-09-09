# Project6

Project6 是一个面向低预算创作者的 **AI HTML 视频项目生产后台**。

它不是传统剪辑软件，也不是把所有能力塞进一个“大而全”的视频工作台。Project6 的核心理念是：

> **一个视频就是一个独立 Project。**
>
> 脚本、画面、动画、本地配音、音画同步、验收与最终录制，都围绕这个 Project 推进。

当前正式构建：**Project6 v63**  
当前示例项目：**Harness Engineering · 42 Scene**  
正式站点：`https://video.smilechat.cn`

---

## 1. Project6 要解决什么问题

传统 AI 视频流程通常被拆散在很多工具里：

- AI 写脚本；
- 另一个工具做 PPT / HTML；
- TTS 在第三方平台生成；
- 音频靠人工命名和匹配；
- 动画没有统一时间线；
- 最后还要再进剪辑软件重新拼装。

对于个人创作者和学生，这种流程成本高、重复劳动多，而且非常难复现。

Project6 的目标是把其中最适合自动化、最适合网页完成的部分统一起来，同时把昂贵的 GPU 推理留在本地：

```text
主题 / 文章
→ 完整口播稿
→ Chapter / Scene
→ Garden HTML 画面
→ Screenshot QA
→ 本地 IndexTTS
→ ZIP 配音源
→ 整片音画预览
→ 项目内 SFX / BGM
→ 1080P / 1440P / 4K 本地录制
```

最终尽可能依赖：

- HTML / CSS / SVG；
- JavaScript；
- GSAP；
- 本地浏览器；
- 本地 GPU TTS；
- GitHub + 静态部署。

不要求购买昂贵的视频生成 API，也不要求服务器具备 GPU。

---

## 2. 产品定位

Project6 当前定位为：

**AI HTML Video Production Backend**

适合：

- AI 教学视频；
- 科普视频；
- 产品讲解视频；
- 技术知识可视化；
- B 站 / YouTube 解说型视频；
- 需要大量可重复生产的 HTML 动画视频。

Project6 不是：

- Premiere / CapCut 替代品；
- 在线素材商城；
- 云端 TTS 平台；
- 云端视频渲染农场；
- 通用低代码网页编辑器。

---

## 3. 核心设计原则

### 3.1 一个视频 = 一个 Project

Project 是系统的最高业务对象。

一个 Project 至少包含：

```text
Project
├─ Script
├─ Chapter
├─ Scene
├─ Garden Visual
├─ Scene Motion
├─ Acceptance Gate
├─ TTS JSON
├─ Local Voice Sources
├─ Full-video Preview
├─ Project SFX / BGM
└─ Recording Output
```

Chapter 只是内容组织方式，不再单独形成一个生产工作流。

### 3.2 先内容，再视觉，再声音

正式顺序：

```text
Narration
→ Visual
→ Screenshot QA
→ TTS
→ Audio / Visual Sync
→ SFX
→ Recording
```

不能为了“先看到效果”而打乱依赖关系。

### 3.3 本地优先

用户的配音 ZIP、录制文件和临时音频尽量留在浏览器本地。

Project6 不要求把用户本地 IndexTTS 暴露到公网，也不需要服务器承担 GPU 推理。

### 3.4 Gate 驱动开发

系统不是“想到哪里做到哪里”。

每个 Project 使用明确 Gate：

| Gate | 内容 |
|---|---|
| A | 完整口播 |
| B | Garden 视觉 + Screenshot QA |
| C | 本地 IndexTTS / 配音源 |
| D | 整片音画预览 |
| E | 项目内 SFX / BGM |
| F | 高清本地录制 |

只有上一阶段满足验收条件，下一阶段才应该继续。

---

## 4. 当前生产流程

### Step 1 · 完整口播

先整理整支视频 Narration。

要求：

- 整片逻辑完整；
- 语言适合解说；
- Scene 边界自然；
- 不先做页面再强行塞配音。

### Step 2 · Chapter / Scene

把完整口播拆为内部 Chapter，再拆成连续 Scene。

当前 Harness Engineering：

- 7 个内部章节；
- 42 Scene；
- 001～042 连续编号。

### Step 3 · Garden 视觉

每个 Scene 都是一张独立 16:9 HTML 画面。

原则：

- 逻辑 Stage：1920×1080；
- 不使用统一“左文字 + 右卡片”模板；
- 不只是替换标题文字；
- 每张画面必须表达关系、空间、状态、反馈或过程；
- 动画必须服务讲解，而不是单纯“更炫”。

### Step 4 · Screenshot QA

正式 Scene 修改后必须实际浏览器渲染并检查。

检查项包括：

- 字号；
- 对齐；
- 遮挡；
- 溢出；
- 画面重心；
- 留白；
- 对比度；
- 逻辑表达；
- 1920×1080 可读性；
- 响应式缩放。

没有 Screenshot QA，不宣布视觉完成。

### Step 5 · 完整 TTS JSON

Canonical：

```text
presentations/<project>/full-tts-tasks.json
```

当前正式 TTS：

```text
IndexTTS 2.5
```

编号规则：

```text
Scene 001 ↔ 001.mp3
Scene 002 ↔ 002.mp3
...
Scene 042 ↔ 042.mp3
```

### Step 6 · 本地生成配音

用户在自己的 GPU 电脑上运行 IndexTTS。

Project6 不负责远程调用本机 GPU。

推荐流程：

```text
Project6 复制 JSON
→ 本地 IndexTTS
→ 001.mp3 ... 042.mp3
→ 打包 ZIP
→ 上传 Project6
```

### Step 7 · 配音源管理

一个完整 ZIP 可以作为一个独立配音源保存。

设计目标：

- 一个 ZIP = 一个配音源；
- 支持多个配音版本；
- 支持试听；
- 支持切换；
- 支持删除；
- 使用 IndexedDB 本地保存；
- 刷新后继续使用当前配音源；
- 不上传服务器；
- 单个散装音频只作为临时兜底。

### Step 8 · 整片音画预览

播放器负责：

- 播放；
- 暂停 / 继续；
- 上一 Scene；
- 下一 Scene；
- Scene 跳转；
- 全屏；
- 本地配音注入；
- narration ended 自动进入下一 Scene；
- Pause 同时暂停当前 GSAP timeline。

### Step 9 · 项目内 SFX / BGM

Project6 v63 开始，**不再提供独立“动画音效库”页面**。

原因：当前生产阶段更需要真实视频成片，而不是先维护一个脱离项目的资源库。

SFX 能力仍然保留，但归属具体 Project：

```text
Gate D 整片音画 PASS
→ Gate E 项目内 SFX / BGM
→ reveal / whoosh / click / confirm / accent ...
```

这样可以保证声音只服务真实场景。

### Step 10 · 双窗口本地高清录制

正式架构：

```text
record.html
录制控制台
    ↓ BroadcastChannel
capture.html
纯成片窗口
    ↓ 浏览器标签页捕获
本地录制文件
```

支持目标：

- 1080P · 1920×1080；
- 1440P · 2560×1440；
- 4K · 3840×2160；
- 目标 60fps；
- 视频和当前 TTS 音轨一起录入；
- 开始；
- 暂停 / 继续；
- 停止并保存；
- 取消并丢弃；
- 文件只在浏览器本地保存。

---

## 5. 页面信息架构

Project6 v63 后台：

```text
工作台
├─ 视频作品
│
├─ 组件库 · Galaxy
├─ 动效库 · GSAP / Emil
├─ Garden 手册
└─ 项目总纲
```

其中：

- **视频作品**：核心生产入口；
- **组件库**：寻找 UI 视觉原型；
- **动效库**：学习与验证动画 Primitive；
- **Garden 手册**：画面制作规范；
- **项目总纲**：Source of Truth 的可视化入口。

不再恢复：

```text
studio.html
#/studio
旧“视频工作台”
独立动画音效库
```

---

## 6. UI Design System · v63

v63 后台设计参考 Anthropic Claude Code Frontend Design Skill 的核心原则重新整理：

- UI 必须和产品主题有关，而不是通用 SaaS 模板；
- 信息结构本身承担视觉层级；
- 避免所有模块都使用同样的圆角卡片；
- 颜色用于状态与重点，不用于无意义装饰；
- 动效只用于解释变化与用户反馈；
- 减少“AI 生成页面”常见的渐变、过度阴影和无意义标签；
- 保证键盘 focus、移动端布局与 reduced-motion。

当前视觉方向：

**Editorial Production Console / 创作控制台**

核心设计 Token：

```text
Canvas      #F1F3F6
Paper       #FFFFFF
Ink         #121722
Muted       #657084
Line        #DCE1E8
Cobalt      #3156D3
Teal        #0D8A78
Amber       #A66A12
```

共享样式：

```text
assets/admin-ui-v63.css
```

版本注入与后台主题加载：

```text
assets/version.js
```

---

## 7. 动画体系

Project6 当前动画职责拆分为：

### Garden

负责：

- Chapter；
- Scene；
- Narration；
- 画面结构；
- 主题视觉。

### Uiverse Galaxy

负责：

- 卡片；
- Loader；
- Button；
- Pattern；
- UI 微交互原型。

组件不能原样复制到视频里，必须重新适配 Project Theme。

### Emil Skills

负责判断：

- 哪些元素应该动；
- 为什么动；
- 如何保持物理连续性；
- 时长与节奏；
- 动画是否干扰阅读。

### GSAP

负责真正执行：

- Timeline；
- MotionPath；
- DrawSVG；
- Flip；
- MorphSVG；
- stagger；
- Scene 内时间线。

---

## 8. 目录结构

项目核心目录大致如下：

```text
project6/
├─ index.html
├─ works.html
├─ components.html
├─ motions.html
├─ garden.html
├─ charter.html
│
├─ assets/
│  ├─ version.js
│  ├─ admin-ui-v63.css
│  ├─ voice-library-v60.js
│  ├─ voice-runtime-v60.js
│  ├─ voice-record-v60.js
│  └─ voice-mix-init-v62.js
│
├─ data/
│  ├─ galaxy-components.json
│  └─ galaxy-curated.json
│
├─ docs/
│  ├─ PROJECT_CHARTER.md
│  ├─ PRD.md
│  ├─ ACTIVE_DECISIONS.md
│  ├─ DEVELOPMENT_STATUS.md
│  ├─ ARCHITECTURE.md
│  ├─ THEME_SYSTEM.md
│  └─ garden/
│
├─ presentations/
│  └─ harness-engineering/
│     ├─ full-video.html
│     ├─ full-video-data.js
│     ├─ full-tts-tasks.json
│     ├─ record.html
│     ├─ capture.html
│     ├─ ACCEPTANCE.md
│     └─ ...
│
├─ vendor/
│  └─ upstream/
│     ├─ gsap/
│     ├─ emil-skills/
│     └─ uiverse-galaxy/
│
└─ scripts/
```

历史版本文件可能继续存在。

**文件名带 v40 / v59 / v60 并不表示当前产品版本。**

只要正式入口仍在引用，它就是兼容实现层，不能为了“目录好看”直接删除。

---

## 9. Source of Truth

每次开发前必须按顺序阅读：

```text
1. docs/PROJECT_CHARTER.md
2. docs/PRD.md
3. docs/ACTIVE_DECISIONS.md
4. docs/DEVELOPMENT_STATUS.md
5. 当前作品 ACCEPTANCE.md
6. 当前 Garden / Motion / Component 规范
```

然后执行：

```text
定位当前 Gate
→ 确认本次改动是否服务 Project 目标
→ 实现
→ 功能 QA
→ 视觉 QA
→ 自检 Acceptance
→ 更新开发状态
```

如果自检不通过，不进入下一阶段。

---

## 10. 版本管理

唯一正式版本源：

```text
assets/version.js
```

当前：

```text
Project6 v63
```

发布新版本时，至少同步检查：

```text
assets/version.js
index.html
works.html
正式播放器 / 录制入口
?v= 缓存参数
PROJECT_CHARTER.md
PRD.md
ACTIVE_DECISIONS.md
DEVELOPMENT_STATUS.md
当前作品 ACCEPTANCE.md
```

禁止出现：

- 首页 v63，作品页 v45；
- 页面 v63，iframe 仍请求 v45；
- 代码升级，文档仍把旧版本写成 Current；
- 历史实现层文件名被误认为产品版本。

---

## 11. 本地运行

Project6 是静态网页项目，推荐通过 HTTP Server 运行，不建议直接双击 `file://` 打开。

例如：

```bash
python3 -m http.server 8080
```

然后访问：

```text
http://127.0.0.1:8080/
```

部分功能依赖浏览器能力：

- IndexedDB；
- BroadcastChannel；
- MediaRecorder / Capture；
- Web Audio；
- Clipboard；
- Fullscreen；
- HTTPS 安全上下文。

正式录制建议使用最新版 Chromium / Chrome。

---

## 12. 部署

当前推荐：

```text
GitHub
→ 宝塔 Git 自动部署
→ Nginx 静态站点
→ HTTPS 域名
```

正式站点：

```text
https://video.smilechat.cn
```

Project6 不需要 Node 服务才能展示大部分后台和视频页面。

如果新增后端 API，应保持与静态视频生产层解耦，避免把整个项目重新变成臃肿单体服务。

---

## 13. 隐私与数据边界

Project6 的本地优先原则：

- 配音 ZIP 优先存浏览器 IndexedDB；
- 临时 ObjectURL 不上传服务器；
- 录制结果浏览器本地保存；
- 不把用户本地 GPU 暴露公网；
- 不在 GitHub 提交真实私密音频；
- 不在前端写入私人 API Key。

浏览器本地存储被用户主动清除时，本地配音源可能丢失，这是允许的行为。

---

## 14. 当前项目 · Harness Engineering

当前第一支完整作品：

```text
Harness Engineering
42 Scene
001 ～ 042
Garden HTML
IndexTTS 2.5
Local Voice Source
Full-video Preview
Local Recording
```

当前主要验证目标：

```text
配音源 ZIP 实机验证
→ 多配音源切换 / 试听
→ 整片音画同步
→ Gate D PASS
→ 项目内 SFX / BGM
→ 高清录制
→ 最终成片
```

当前原则是：**先把第一支完整视频真正跑通，再扩展新的大型能力。**

---

## 15. 开发规则

任何后续开发都必须遵守：

1. 不恢复旧“视频工作台”；
2. 不增加没有真实生产需求的假入口；
3. 不增加假按钮、假数据、假资源；
4. 不为了美化破坏现有功能；
5. 不绕过 Gate；
6. 不把人物配音与 SFX 混成一个资源池；
7. 页面变化必须同步文档；
8. 视觉 Scene 修改必须 Screenshot QA；
9. 版本必须以 `assets/version.js` 为唯一来源；
10. 优先完成真实视频，而不是继续堆功能。

---

## 16. 当前版本摘要

### v63

- 重构后台视觉为 Editorial Production Console；
- 参考 Claude Code Frontend Design 的“明确视觉方向、避免模板化 UI、信息结构即视觉结构”原则；
- 新增 `assets/admin-ui-v63.css`；
- 首页重新设计；
- 视频作品页视觉统一；
- 版本统一升级至 v63；
- 删除独立 `audio.html` 动画音效库；
- SFX 改为具体 Project 的 Gate E；
- 原有 TTS、Garden、配音导入、播放器和录制能力保留。

---

Project6 当前最重要的目标不是继续增加模块，而是：

> **把 Harness Engineering 从脚本、画面、配音一直跑到最终高清视频文件，并把这条链路沉淀成可重复的视频生产系统。**

# Project6 PRD · AI Web Video Studio

**版本：** v1.0  
**状态：** Baseline / 开发基准  
**产品类型：** AI HTML 视频制作体系 + 资源工作台  
**优先级：** P0  
**总纲：** `docs/PROJECT_CHARTER.md`

---

# 1. 产品背景

传统 AI 视频方案通常依赖以下一种或多种高成本能力：

- GPU 推理
- 视频生成模型 API
- 服务端渲染
- 服务端转码
- 大量视频存储
- 专业剪辑软件

这与 Project6 面向学生、个人创作者、AI 学习者和低预算用户的目标冲突。

另一方面，知识类视频、教程视频、解释型视频并不一定需要昂贵的视频生成模型。大量内容本质上可以通过：

- HTML
- CSS
- SVG
- React
- Web Animation
- TTS
- 音效
- 浏览器录制

完成。

因此 Project6 选择一条更轻、更可控、更低成本的路线。

---

# 2. 产品愿景

> 利用 ChatGPT + Garden Skills + 免费/低成本 TTS + Web 动画，让学生不用 GPU、不购买视频生成 API、不购买昂贵剪辑软件，也能制作漂亮的知识类视频；Project6 负责管理、预览和播放，最终视频尽量直接在用户浏览器生成并保存到本地。

---

# 3. 产品定位

Project6 是：

**AI HTML 视频资源中心 + Garden 视频制作规范库 + 本地导出工作台。**

Project6 不是：

- 在线剪辑 SaaS
- GPU 视频生成平台
- 服务端视频渲染平台
- 大型视频存储平台
- 服务端转码农场

---

# 4. 目标用户

## 4.1 核心用户

### 学生 / AI 学习者

需要低成本制作：

- AI 知识讲解
- 课程作业
- 科普视频
- 产品演示
- 学习笔记视频

### 内容创作者

需要快速制作：

- 读书精读
- 财经讲解
- 教程
- 知识卡片视频
- 解释型短视频

### 开发者 / AI 产品经理

需要：

- 复用 HTML 视频模板
- 管理 Garden Theme
- 调用 TTS
- 保存动画 / 音效资源
- 研究 AI 视频自动生产流程

---

# 5. 核心价值

## 5.1 免费 / 低成本

优先使用浏览器、开源 Web 动画库和独立 TTS 服务，避免依赖昂贵视频生成 API。

## 5.2 轻服务器

服务器主要托管：

- HTML
- CSS
- JS
- JSON
- 文档
- 小型资源

最终视频默认不长期存服务器。

## 5.3 严格音画同步

采用 Garden 风格：

```text
Chapter
  ↓
Step
  ↓
Narration
```

一个 Step 对应一段 Narration，让声音成为场景节奏的重要依据。

## 5.4 资产复用

模板、Theme、Scene、动画、音效、配音配置都要逐步资产化，降低每次从零设计的成本。

---

# 6. 核心系统架构

```text
用户输入内容
      ↓
AI 制作层
      ↓
Garden Skills 制作规范
      ↓
Script / Theme / Outline
      ↓
Chapter / Step / Narration
      ↓
HTML / React / SVG 视频
      ↓
Project5 TTS
      ↓
浏览器加载
      ↓
Project6 预览 / 播放
      ↓
浏览器本地录制
      ↓
WebM / 后续本地 MP4
      ↓
用户电脑
```

---

# 7. 系统职责边界

| 模块 | 主要职责 | 不负责 |
|---|---|---|
| AI / ChatGPT | 内容理解、脚本、分镜、HTML、动画 | 长期视频存储 |
| Garden Skills | 制作方法和视频结构标准 | TTS 服务部署 |
| Project6 | 管理、预览、播放、资源整理、本地导出入口 | GPU 推理、服务端视频渲染 |
| Project5 | TTS HTTP API | Project6 页面和作品管理 |
| 浏览器 | 播放、缓存、本地捕获、本地录制 | 服务端数据库职责 |
| 用户电脑 | 最终视频保存 | Project6 服务器存储职责 |

---

# 8. 第一阶段 MVP

MVP 只验证一条完整真实链路。

## 8.1 输入

一段约 60～90 秒的中文内容。

## 8.2 制作

必须经过：

1. Narration Script
2. Chapter 拆分
3. Step 拆分
4. Theme 选择
5. 每个 Step 的视觉设计
6. HTML / SVG / React 动画实现
7. TTS 配音生成

## 8.3 默认 TTS

```text
engine = edge
voice = zh-TW-YunJheNeural
speed = 1.10
```

后台显示：

**ETG1 / Edge 云哲 · 台湾男声**

## 8.4 播放

Project6 能加载作品并完成自动播放。

## 8.5 导出

第一阶段优先完成：

**浏览器本地 WebM 录制与下载。**

最终视频不上传 Project6 服务器。

---

# 9. P0 功能需求

## P0-01 项目总纲

后台必须能访问 Project6 项目总纲。

验收：

- 后台存在明显入口。
- 能完整阅读产品目标、架构、职责、资源体系、开发门禁。
- 文档与 `docs/PROJECT_CHARTER.md` 保持一致。

## P0-02 Garden 视频制作规范

必须把 Garden `web-video-presentation` 逻辑作为视频制作标准。

验收：

- 每个视频存在 Chapter。
- Chapter 中存在 Step。
- 每个需要配音的 Step 有 Narration。
- 不允许只按固定秒数粗暴切换场景。

## P0-03 Project5 TTS 接入

Project6 调用独立 Project5 TTS API。

验收：

- Project6 不内置 Edge/Kokoro 模型代码。
- 默认 Voice 使用 `zh-TW-YunJheNeural`。
- 音频可返回浏览器播放。

## P0-04 视频作品预览

后台能打开至少一个真实 HTML 视频实验作品。

验收：

- 16:9 舞台正常。
- Step 顺序正常。
- 动画正常。
- 配音正常。
- 无明显音画错位。

## P0-05 浏览器本地导出

验收：

- 用户主动点击导出。
- 浏览器完成捕获 / 录制。
- 导出文件直接下载到用户设备。
- Project6 服务器不保存最终 WebM。

---

# 10. P1 功能需求

## P1-01 Garden 中文手册

包括：

- 入门
- Script
- Theme
- Outline
- Chapter
- Step
- Narration
- Audio
- Auto Play
- Export
- 常见错误

## P1-02 Theme / 模板中心

每个主题至少提供：

- 英文名
- 中文名
- Mood
- 颜色 Token
- 字体
- 适用内容
- 16:9 Preview
- 推荐 Scene

## P1-03 动画资源库

首批至少整理：

- 文字 Reveal
- 数字 Counter
- 卡片进场
- SVG 流程箭头
- Timeline
- 简单 Lottie

## P1-04 音效资源库

首批至少整理：

- Click
- Whoosh
- Tick
- Confirm
- Error
- Digital

每项必须保留来源和许可证信息。

## P1-05 本地资源引用

Scene 可通过 ID 引用动画 / 音效。

示例：

```json
{
  "animation": "title-reveal-03",
  "sfx": "whoosh-01"
}
```

---

# 11. P2 功能需求

## P2-01 浏览器本地 MP4

研究 WebCodecs / ffmpeg.wasm 在浏览器完成 WebM → MP4。

约束：

- 优先本地计算。
- 不把转码压力迁回服务器。

## P2-02 项目打包下载

允许下载：

- HTML
- JS
- CSS
- Narration
- manifest
- 项目资源

## P2-03 资源收藏 / 搜索

允许用户快速查找：

- Theme
- Scene
- Animation
- SFX
- Voice

---

# 12. 视频项目标准目录

目标结构：

```text
presentations/
└── <slug>/
    ├── manifest.json
    ├── README.md
    ├── script.md
    ├── outline.md
    ├── src/
    │   ├── chapters/
    │   │   ├── 01-intro/
    │   │   │   ├── index.tsx
    │   │   │   └── narrations.ts
    │   │   └── ...
    │   └── styles/
    ├── assets/
    │   ├── images/
    │   ├── svg/
    │   └── lottie/
    └── sfx.json
```

`manifest.json` 至少包含：

```json
{
  "title": "",
  "description": "",
  "theme": "",
  "chapters": 0,
  "steps": 0,
  "cover": "",
  "voice": "zh-TW-YunJheNeural",
  "status": "draft"
}
```

---

# 13. 后台信息架构

目标导航：

```text
工作台
视频作品 / 项目中心
视频工作台
模板中心
主题系统
Garden 中文手册
动画资源
音效资源
配音测试
素材库
项目总纲
设置
```

优先顺序必须围绕“制作规范 + 资源 + 预览 + 本地导出”。

---

# 14. 非目标（明确不做）

第一阶段禁止把以下内容作为主功能：

- GPU 管理面板
- 视频渲染服务器
- 视频任务 Worker 集群
- 服务端 FFmpeg 转码队列
- 大型对象存储视频库
- 多用户视频云盘
- 复杂时间线剪辑器
- 类 Premiere / CapCut 的重型剪辑功能

原因：这些会让项目偏离“轻量、免费、HTML 视频”的产品目标。

---

# 15. 技术原则

## 15.1 浏览器优先

能在浏览器完成的工作，不优先迁移到服务器。

## 15.2 独立服务

TTS 保持 Project5 独立服务。

## 15.3 Source of Truth

文档优先级：

```text
docs/PROJECT_CHARTER.md
        ↓
docs/PRD.md
        ↓
docs/ARCHITECTURE.md
        ↓
Garden / Theme / Feature docs
        ↓
代码
```

若代码与上层文档冲突，优先判断代码是否偏离产品目标，而不是直接修改总纲迁就现有代码。

## 15.4 真功能优先

不接受“页面看起来完成，但按钮没有真实逻辑”。

---

# 16. 强制开发工作流

每次 Project6 开发开始前，必须先执行：

```text
Read Charter
     ↓
Read PRD
     ↓
定位当前 Phase
     ↓
确定本次唯一目标
     ↓
目标对齐检查
     ↓
开发
     ↓
自检
     ↓
PASS ?
 ├─ YES → 记录完成 → 下一步
 └─ NO  → 继续完善 → 再自检
```

---

# 17. 每次任务开始前必须输出

```text
【当前定位】
Phase：
已完成：
本次目标：
明确不做：
```

没有当前定位，不开始开发。

---

# 18. 开发前 Gate

必须检查：

| 检查项 | 要求 |
|---|---|
| 产品方向 | 服务免费 HTML 视频体系 |
| Garden | 符合 Chapter / Step / Narration |
| 服务器 | 不增加不必要视频存储和渲染压力 |
| TTS | 不重复建设 Project5 |
| 导出 | 优先用户浏览器本地 |
| 验收 | 能明确判断成功 / 失败 |

任意 P0 方向项 FAIL，不进入代码开发。

---

# 19. 开发完成后自检

## 19.1 产出检查

- 修改哪些文件？
- 新增哪些真实能力？
- 是否存在不可见但关键的数据结构变化？

## 19.2 功能检查

- 页面是否可访问？
- 按钮是否有真实逻辑？
- 数据是否真的读写？
- 视频是否真的播放？
- 音频是否真的播放？
- 导出是否真的产生本地文件？

## 19.3 禁止项检查

不得出现：

- 假按钮
- 假状态
- 仅 UI 无逻辑
- 音画错位
- Step / Narration 不匹配
- 最终视频上传服务器
- 重复实现 TTS 模型
- 无必要引入重型服务器组件
- 文档和代码不一致

---

# 20. 审核机制

通过：

```text
PASS
↓
记录当前 Phase 完成情况
↓
进入下一步
```

未通过：

```text
FAIL
↓
列出失败项
↓
继续完善
↓
重新自检
```

**没有 PASS，不得因为“差不多了”而进入下一阶段。**

---

# 21. Phase 规划

## Phase 0 · 产品基线

目标：明确产品方向、PRD、开发门禁。

验收：

- [x] 项目总纲入库
- [x] PRD 入库
- [ ] 后台可直接阅读项目总纲

## Phase 1 · Garden 单视频实验

目标：跑通第一条 60～90 秒真实视频。

验收：

- [ ] Script
- [ ] Chapter
- [ ] Step
- [ ] Narration
- [ ] Theme
- [ ] HTML 动画
- [ ] ETG1 配音
- [ ] 自动播放
- [ ] 音画同步

## Phase 2 · 浏览器本地导出

验收：

- [ ] 用户主动授权捕获
- [ ] 本地录制
- [ ] WebM 下载
- [ ] 服务端无最终视频文件

## Phase 3 · 第二 / 第三模板实验

验收：

- [ ] 第二 Theme
- [ ] 第三视频实验
- [ ] 音效
- [ ] SVG / Lottie

## Phase 4 · 资源中心

验收：

- [ ] Garden 中文手册
- [ ] Theme 资源
- [ ] 动画资源
- [ ] 音效资源
- [ ] 资源 ID 规范

## Phase 5 · 本地 MP4 与打包

验收：

- [ ] 浏览器本地 MP4 可行性验证
- [ ] 项目源码打包下载

---

# 22. 成功标准

Project6 第一阶段真正成功，不是“后台页面很多”，而是用户能够完成：

```text
给出主题
↓
AI 按 Garden 生成
↓
获得 HTML 视频
↓
使用 Project5 配音
↓
Project6 播放
↓
音画同步
↓
浏览器本地导出
↓
电脑得到视频文件
```

且整个过程：

- 不需要 GPU。
- 不依赖昂贵视频生成 API。
- Project6 服务器不长期存最终视频。
- 作品结构可复用。
- 模板和资源可以持续积累。

---

# 23. 最终验收口号

> **先把一条链做真，再把资源库做大。**

> **先检查自己做到哪一步，再继续下一步。**

> **没有自检 PASS，就不进入下一阶段。**

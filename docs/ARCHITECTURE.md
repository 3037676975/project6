# Project6 Architecture

Project6 的定位不是“再做一个剪映”，而是 **个人 AI 视频生产操作系统**。核心目标是把“怎么讲、长什么样、每一幕怎么表达”全部资产化，而不是让 AI 每次从零随机生成。

> Project6 的核心公式：**Topic + Structure Template + Theme + Scenes + Voice = Video Workspace**

## 1. 当前阶段：Static First

当前 V1 保持静态部署，不引入大型常驻后端。

```text
Browser
  └─ Project6 SPA
      ├─ Dashboard
      ├─ Projects
      ├─ Scaffold Create
      ├─ Studio
      ├─ Template Library
      ├─ Theme System
      ├─ Assets / Primitives
      ├─ Open Source Lab
      └─ Settings

Data
  ├─ data/projects.json
  ├─ data/templates.json
  ├─ data/themes.json
  └─ LocalStorage
```

## 2. 从 Garden 学到的核心设计

Project6 不复制 Garden Skills 的整个仓库，而是吸收三条最重要的设计思想：

### 2.1 Scaffold First

新建视频不是创建一个空白页面，而是创建一个完整工作区。

```text
选择 Structure
      +
选择 Theme
      +
选择 Voice
      ↓
Scaffold
      ↓
Project + Scene Sequence + Theme Tokens
      ↓
Studio
```

### 2.2 Theme 与 Scene 解耦

Scene 负责表达内容；Theme 负责视觉语言。

切换 Theme 时，不应该重写 Scene HTML。

```text
Scene JSON
   ↓
Renderer / Primitives
   ↓
Theme Tokens
   ↓
最终画面
```

### 2.3 模板是资产，不是成品

Project6 模板分成两层：

```text
Structure Template
  └─ 决定整条视频怎么讲

Scene Template
  └─ 决定某一幕怎么表达
```

Theme 已从 Template 中独立出来，成为单独的视觉资产系统。

## 3. 核心领域模型

### Project

```json
{
  "id": "P0025",
  "title": "什么是 RAG",
  "category": "AI知识讲解",
  "structure": "STRUCT-AI-001",
  "theme": "THEME-TECH-001",
  "voice": "ETG1",
  "engine": "garden",
  "status": "制作中",
  "sceneData": []
}
```

### Structure Template

Structure 决定“整条视频的叙事结构”。

```json
{
  "id": "STRUCT-AI-001",
  "name": "3分钟 AI 知识讲解",
  "sceneTypes": ["hook", "concept", "flow", "compare", "summary"],
  "recommendedTheme": "THEME-TECH-001",
  "duration": 180
}
```

### Scene

Scene 是最小可播放单元。

当前类型：

- `hook`
- `title`
- `concept`
- `flow`
- `compare`
- `stat`
- `quote`
- `timeline`
- `step`
- `risk`
- `summary`

AI 最终只需要输出符合 schema 的 Scene JSON，不直接决定所有 CSS。

### Theme

Theme 使用语义 token 管理视觉语言。

```json
{
  "id": "THEME-TECH-001",
  "nameZh": "科技蓝",
  "tokens": {
    "stageBg": "#07152f",
    "surface": "#102447",
    "text": "#f5f9ff",
    "muted": "#a9bddb",
    "accent": "#74a7ff",
    "radius": "24px"
  }
}
```

Theme 不知道当前视频在讲 RAG 还是财经；它只负责颜色、字体、表面、间距气质、圆角和视觉强调。

### Primitive

Renderer 后续统一使用这些基础视觉原语：

```text
Card
Rule
Badge
Hero Number
Title Block
Flow Node
Quote Block
Timeline Node
```

## 4. Studio 渲染原则

Studio Preview 不直接为每个主题维护一套 Scene HTML。

正确方式：

```text
Scene Type
   ↓
Scene Renderer
   ↓
Primitives
   ↓
Theme Tokens
   ↓
Preview
```

这保证：

- 同一个 `flow` Scene 可以切 6 个主题。
- 新增主题时不修改业务 Scene 数据。
- AI 生成的数据稳定、可验证。
- 视觉资产可以持续积累。

## 5. 当前主题资产

V1 先建立 6 个方向：

- Tech Blue / 科技蓝
- Newsroom / 编辑部
- Cinematic / 电影感
- Market Desk / 财经数据
- Minimal Paper / 极简白
- Soft Knowledge / 柔和知识

主题数据集中在 `data/themes.json`。

## 6. 目标视频管线

```text
Topic / Brief
    ↓
Structure Template
    ↓
Theme
    ↓
Scaffold
    ↓
Project + Scene JSON
    ↓
Project6 Scene Renderer
    ↓
HTML / CSS / SVG
    ↓
Project5 TTS
    ↓
Browser Preview
    ↓
WebMotion / HyperFrames Local Export
    ↓
MP4 on local computer
```

## 7. Project5 边界

Project5 保持独立 HTTP 服务，不把 Edge/Kokoro 模型代码复制进 Project6。

```text
Browser Project6
    ↓
Project6 API Proxy
    ↓ Authorization
Project5
```

Project6 静态前端不能保存 Bearer API Key。

## 8. 开源项目策略

- Garden Skills：重点学习 Theme / Template / Scaffold / Presentation 组织方式。
- Motion Canvas：学习知识讲解型动画与配音同步。
- WebMotion / HyperFrames：研究本地 MP4 导出。
- Keyloom：学习 Scene Library。
- OpenCut：学习 Timeline / Track / Studio 交互。

原则：**学习模式，不直接把多个项目拼成一个巨型仓库。**

## 9. 版本路线

### V1 — Asset System（当前）

- SPA 工作台
- Project Scaffold
- Structure Templates
- Scene Templates
- Theme System
- Scene Studio
- LocalStorage

### V2 — Renderer Registry

- 每个 Scene Type 独立 Renderer
- Primitive Registry
- Theme Tokens 完整化
- Scene Schema 校验

### V3 — Voice

- 轻量 API Proxy
- Project5 TTS
- Scene Audio Track
- 音频时长同步

### V4 — Local Render

- WebMotion / HyperFrames 实验
- 浏览器 / 本地 MP4 输出

### V5 — AI Gateway

- Topic → Script → Storyboard → Scene JSON
- DeepSeek / Qwen / OpenAI-compatible provider
- Provider 可替换

## 10. 工程原则

1. **Scaffold First**：新建视频必须得到可工作的初始 Scene 结构。
2. **Theme / Scene Separation**：视觉和内容彻底解耦。
3. **Schema First**：先稳定数据模型，再接 AI。
4. **Asset First**：把好看的东西沉淀成 Theme / Template / Primitive。
5. **Provider Independent**：AI、TTS、Render 都通过适配层接入。
6. **Local First Output**：最终视频默认输出到用户电脑。
7. **Small Deploy Surface**：宝塔 Webhook 只负责更新代码。
8. **One Product Shell**：所有主功能统一由 `index.html + assets/app.js` 管理。

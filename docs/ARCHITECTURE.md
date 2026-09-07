# Project6 Architecture

Project6 的定位不是“再做一个剪映”，而是 **个人 AI 视频生产操作系统**：把项目、脚本、Scene、模板、TTS、网页动画和本地导出组织成一个可重复的生产流程。

## 1. 当前阶段：Static First

当前服务器资源有限，并且已经有稳定的 GitHub → 宝塔自动部署链路，因此 V1 不引入 Node/Spring/Python 常驻服务。

```text
Browser
  └─ Project6 SPA
      ├─ Dashboard
      ├─ Projects
      ├─ Create
      ├─ Studio
      ├─ Templates
      ├─ Assets
      ├─ Open Source Lab
      └─ Settings

Data
  ├─ data/projects.json   # 仓库中的 seed 数据
  ├─ data/templates.json  # 可复用模板目录
  └─ LocalStorage         # V1 用户创建/修改的数据
```

优点：

- 宝塔只需要拉取静态文件，不需要构建大型依赖。
- 修改代码后 Nginx 可直接读取新文件。
- 不把 API Key 暴露在前端。
- 可以先验证产品工作流，再决定后端技术栈。

## 2. 核心领域模型

### Project

一个视频就是一个 Project。

```json
{
  "id": "P0025",
  "title": "什么是 RAG",
  "category": "AI知识讲解",
  "theme": "THEME-TECH-001",
  "voice": "ETG1",
  "engine": "garden",
  "status": "制作中",
  "sceneData": []
}
```

### Scene

Scene 是最小可播放单元。V1 支持：

- `title`：标题 / Hook
- `flow`：流程图
- `compare`：对比
- `summary`：总结

后续 Scene Renderer 不应该依赖具体 AI 模型。AI 的任务只是输出符合 schema 的 Scene JSON。

### Template

模板保存生产规律，而不是保存成品视频。

```text
Hook Template
Scene Template
Theme Template
```

## 3. 目标视频管线

```text
Topic / Brief
    ↓
AI Gateway（后续）
    ↓
Script + Storyboard + Scene JSON
    ↓
Project6 Scene Renderer
    ↓
HTML / CSS / SVG Animation
    ↓
Project5 TTS
    ↓
Browser Preview
    ↓
WebMotion / HyperFrames Local Export
    ↓
MP4 on local computer
```

## 4. Project5 边界

Project5 保持独立 HTTP 服务，不把 Edge/Kokoro 模型代码复制进 Project6。

Project6 前端不能保存 Bearer API Key。正式接入时增加一个很轻量的服务端代理：

```text
Browser Project6
    ↓
Project6 API Proxy
    ↓ Authorization
Project5
```

代理只负责鉴权转发、任务状态和必要缓存，不承担视频渲染。

## 5. Garden / 开源项目策略

Project6 不把所有开源项目合并成一个巨型仓库。

- Garden Skills：学习 Skill、Scene、Theme 和视频 Presentation 的组织方式。
- Motion Canvas：学习知识讲解型矢量动画。
- WebMotion / HyperFrames：研究浏览器或本地 MP4 导出。
- OpenCut：学习 Timeline / Track / Studio 交互。

原则：**借鉴能力边界和设计模式，Project6 保持自己的数据模型。**

## 6. 不做的事情

V1 明确不做：

- 在浏览器保存 OpenAI / Project5 等 API Secret。
- 在 Webhook 中下载大模型、构建大型 AI 依赖或执行长时间视频渲染。
- 把最终 MP4 全部保存在服务器。
- 为了“看起来完整”提前引入数据库、消息队列、向量库和多租户。

## 7. 版本路线

### V1 — Workspace（当前）

- 统一 SPA 工作台
- 项目创建
- LocalStorage 持久化
- Scene 编辑
- Timeline 预览
- 模板库
- 开源实验室

### V2 — Voice

- 轻量 API Proxy
- Project5 TTS
- Scene 音频状态
- 音频时长同步

### V3 — Scene Engine

- 标准 Scene Schema
- Scene Renderer Registry
- Theme Tokens
- Garden 能力适配

### V4 — Local Render

- 评估 WebMotion / HyperFrames
- 浏览器/本地 MP4 导出
- 不占服务器视频存储

### V5 — AI Gateway

- DeepSeek / Qwen / OpenAI-compatible Provider
- Script → Storyboard → Scene JSON
- 模型可替换，不与具体 Provider 耦合

## 8. 工程原则

1. **Static First**：能用静态实现就不先上服务端。
2. **Schema First**：先定义 Project / Scene / Template，再接 AI。
3. **Provider Independent**：AI、TTS、Render 都通过适配层接入。
4. **Local First Output**：最终视频默认输出到用户电脑。
5. **Small Deploy Surface**：宝塔 Webhook 只负责更新代码，不承担耗时任务。
6. **One Product Shell**：所有页面统一由 `index.html + assets/app.js` 管理，旧 HTML 只做兼容跳转。

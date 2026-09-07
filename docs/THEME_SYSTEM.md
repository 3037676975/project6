# Project6 Theme System

Project6 的 Theme System 用来解决一个核心问题：**同一个 Scene，应该可以换视觉风格，而不用重写内容结构。**

## 1. Theme 负责什么

Theme 只负责视觉语义：

- Stage 背景
- Surface / Surface Soft
- 主文字 / 次文字
- Accent / Accent2
- Border / Rule
- 圆角
- 阴影
- 字体气质

Theme 不负责当前 Scene 是 RAG、财经还是读书。

## 2. Scene 负责什么

Scene 只负责内容表达：

```json
{
  "type": "flow",
  "title": "RAG 是怎样工作的？",
  "body": "用户问题|检索|上下文|模型回答"
}
```

这个 Scene 可以分别应用：

- Tech Blue
- Newsroom
- Cinematic
- Market Desk
- Minimal Paper
- Soft Knowledge

## 3. Primitive 负责什么

Primitive 是 Scene Renderer 使用的基础视觉组件。

```text
Card
Rule
Badge
Hero Number
Flow Node
Quote Block
```

目标不是做一个完整组件库，而是让每种 Scene 通过少量稳定 primitive 组合出来。

## 4. Scaffold 工作流

```text
Topic
  ↓
Structure Template
  ↓
Theme
  ↓
Voice
  ↓
Scaffold
  ↓
Project + Scene Sequence
  ↓
Studio
```

## 5. 当前主题

| Theme | 风格 | 推荐内容 |
| --- | --- | --- |
| Tech Blue | 科技、冷静、清晰 | AI / 技术科普 |
| Newsroom | 编辑部、高信息密度 | 热点 / 财经 / 行业分析 |
| Cinematic | 戏剧化、大留白 | 读书 / 品牌 / 故事 |
| Market Desk | 精确、数据感 | 财经 / 商业 |
| Minimal Paper | 极简、克制 | 教程 / 方法论 |
| Soft Knowledge | 柔和、友好 | 成长 / 读书 / 泛知识 |

## 6. 后续 Renderer Registry

下一步不继续往 `app.js` 里堆 HTML，而是拆成：

```text
renderers/
  hook.js
  concept.js
  flow.js
  compare.js
  stat.js
  quote.js
  summary.js

primitives/
  card.js
  badge.js
  rule.js
  hero-number.js
  flow-node.js
```

Renderer 读取 Scene JSON，Primitive 读取 Theme tokens。

这是 Project6 后续真正能够不断增加模板、主题和 AI 自动生成能力的基础。

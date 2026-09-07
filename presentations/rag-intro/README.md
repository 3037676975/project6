# 什么是 RAG · Garden 单视频实验

这是 Project6 PRD 的 **Phase 1 实验作品**。

## 目标

验证一条真实链路：

```text
article
→ script
→ outline
→ Chapter
→ Step
→ narration
→ Blueprint Theme
→ HTML / CSS / SVG 动画
→ Project5 ETG1
→ 浏览器自动播放
```

## 当前结构

```text
rag-intro/
├── article.md
├── script.md
├── outline.md
├── manifest.json
├── audio-map.json
├── cover.svg
├── index.html
├── package.json
└── src/
    ├── presentation.js
    ├── styles/presentation.css
    └── chapters/
        ├── chapters.js
        ├── 01-why-rag/
        │   ├── chapter.js
        │   └── narrations.js
        └── 02-value-and-limit/
            ├── chapter.js
            └── narrations.js
```

## Step 规则

- Chapter 1：4 Steps
- Chapter 2：6 Steps
- 总计：10 Steps
- `narrations.js` 是每章 Step 数与口播文本的唯一运行时真相源。
- 手动模式：点击舞台或按 `→` 推进，`←` 返回。
- 自动模式：点击“自动播放”后，如果该 Step 存在 ETG1 音频，则 **以音频播放结束事件推进下一 Step**。
- 音频尚未生成时，仅使用文字长度估时作为开发阶段 fallback；不能把 fallback 当作 Phase 1 最终音画同步验收。

## 生成 ETG1

API Key 不允许写进本文件、浏览器或 GitHub。

在能访问 Project5 的服务端执行：

```bash
export PROJECT5_BASE_URL="http://186.244.245.177:28442"
export PROJECT5_API_KEY="YOUR_REAL_KEY"
node scripts/generate-project5-audio.mjs
```

默认参数：

```text
engine = edge
voice = zh-TW-YunJheNeural
speed = 1.10
```

生成脚本会逐段：

1. POST `/v1/audio/speech`
2. 获取 task id
3. 轮询 `/v1/tasks/{id}`
4. completed 后读取 `audio_url`
5. 写入 `audio-map.json`

Project6 不保存最终视频，也不把 Project5 API Key 发给浏览器。

## Gate

视觉阶段可以运行：

```bash
node scripts/validate-phase1.mjs --allow-audio-pending
```

Phase 1 最终验收必须运行：

```bash
node scripts/validate-phase1.mjs
```

只有 Project5 音频 10/10 ready 且全部检查 PASS，才允许进入 Phase 2。

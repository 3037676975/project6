# Project6 Active Decisions

> 最新用户明确决策，优先级高于旧实现细节。

## 2026-09-09 · 后台与生产流程最新决策

### 1. 废弃“视频工作台”

- 删除 `studio.html`。
- 禁止恢复 `#/studio`。
- 后台核心入口改为「视频作品」。
- 一个视频就是一个独立 Project。

### 2. 每个视频项目内部排列

项目内按 Chapter 展示；每个 Chapter 里的 Step 要直接排成：

```text
第1张 / 001
第2张 / 002
第3张 / 003
第4张 / 004
...
```

每一张必须同时显示：

- Garden 画面状态；
- 对应口播稿；
- 对应本地配音状态；
- 验收状态。

### 3. 口播稿先确认，TTS JSON 后解锁

正确顺序：

```text
AI 写完整口播稿
→ 用户确认口播稿
→ Garden 画面确认
→ 解锁 TTS JSON
→ 一键复制 JSON
→ 本地 IndexTTS 生成
```

JSON 预览可以提前看，但复制动作要由“已确认口播稿”Gate 控制。

### 4. 本地 IndexTTS 是正式配音交接路线

Project6 不直接连接用户本机 GPU。

```text
Project6 tts-tasks.json
→ 用户复制到本地 Project6 TTS 工作台
→ IndexTTS 2.5 生成 001/002/003...
→ 导出 ZIP
→ 上传回 Project6
→ 浏览器 JSZip 自动解压
→ 按编号自动匹配
```

### 5. 必须提供本地音画预览

- 当前不要求录制。
- 必须支持逐张试听和顺序预览。
- 本地音频只用 ObjectURL，不要求服务器保存。

### 6. 动画音效库 ≠ 配音库

动画音效库只管理短 SFX：

- element reveal；
- whoosh / transition；
- click；
- pop / tick；
- confirm；
- accent / notification；
- digital / tech。

动画音效是整个项目最后一个环节。

第一批真实来源：Kenney UI Audio / Interface Sounds（CC0）。

### 7. Garden 手册必须保留并可正常打开

`garden.html` 不能再跳转旧 `#/lab`；必须是真正中文手册页面。

### 8. 项目总纲、PRD、开发状态、验收规则必须同步更新

禁止出现：页面已经改了，但文档仍然写旧“视频工作台 / Project5 主流程 / 录制优先”。

---

## Harness Engineering 第一章当前 Gate

| Gate | 状态 |
|---|---|
| A 口播稿 | PASS / 用户可重新确认 |
| B Garden 画面 | CODE PASS / USER REVIEW |
| C 本地 IndexTTS | WAITING AUDIO ZIP |
| D 本地音画预览 | WAITING AUDIO |
| E 动画音效 | LOCKED |
| F 第二章 | LOCKED |

当前唯一下一步：**确认口播 → 复制 JSON → 本地 IndexTTS → 上传 ZIP。**

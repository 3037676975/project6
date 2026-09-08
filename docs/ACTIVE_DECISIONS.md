# Project6 Active Decisions

> 本文件记录用户最新明确决策。开发时必须按顺序阅读：
> `PROJECT_CHARTER.md` → `PRD.md` → **本文件** → `DEVELOPMENT_STATUS.md`。
>
> 如果 Charter / PRD 中的旧实现细节与这里冲突，以本文件中的**最新明确用户决策**为准，并在后续版本化 PRD 时同步回主文档。

## 2026-09-08 · Phase 1 第一章最新返工决策

### 1. 内容优先级重新排序

第一章不再以“动画做得多”为第一目标。开发顺序必须是：

```text
先明确这一章到底讲什么
→ 写成自然口播
→ 选择合适音色
→ 设计画面
→ 做动画
→ 配 BGM / SFX
→ 实机播放与录制验收
```

主题一句话：

> **模型之外的运行系统，决定 Agent 能不能稳定把任务做完。**

口播必须像朋友给朋友讲解，不允许再写成 PRD / 论文 / 产品说明书。

### 2. 第一章 TTS 改为云希

当前正式方案：

```text
provider = edge-tts
client   = rany2/edge-tts
voice    = zh-CN-YunxiNeural
locale   = zh-CN
rate     = +0%
speed    = 1.0x
```

选择原因：云希的 voice metadata 更偏 Lively / Sunshine / Novel，更适合轻松、口语化的知识讲解。

已废弃：

- 第一章使用 Project5。
- 第一章固定使用 `zh-TW-YunJheNeural`。

未来需求：后台增加 Edge TTS 音色选择 / 试听能力，但**本轮先不开发完整音色中心**。

### 3. 播放模式必须分清

第一章必须同时存在：

- **Manual**：上一页 / 下一页 / 点击舞台 / ←→ / 单独播放当前旁白；旁白结束不自动翻页。
- **Auto**：播放正式旁白，严格按 audio ended 推进下一 Step。

用户必须一眼看得出当前模式，不能再出现“点半天没反应”。

### 4. BGM 不允许锁死一个文件

当前第一章必须提供：

- 无音乐
- 轻松科技 · Short Plingy Loop（CC0）
- 轻松氛围 · Calm Loop（CC0）
- 轻快神秘 · Other Center（CC0）
- 本地上传音乐
- 独立音量控制

本地音乐只能通过浏览器 `URL.createObjectURL` 使用，不上传 Project6 服务器。

未来可以把 BGM 进一步资产化成后台音乐库。

### 5. 录制原则不变

录制仍然必须：

```text
用户点击录制
→ 浏览器捕获当前标签页
→ HTML + narration + BGM 播放
→ MediaRecorder 浏览器内存录制
→ 结束后自动下载 WebM
```

最终视频不上传 Project6、不长期存服务器。

### 6. 第一章视觉返工重点

- 第一屏方向基本保留。
- 第二屏必须提高信息密度，不能大面积空白。
- 每个 Step 画面必须明确服务于“这一句口播正在讲什么”。
- 画面不是把口播打字，而是补充关系、状态、流程和例子。
- 第一章未通过用户验收前，不进入第二章。

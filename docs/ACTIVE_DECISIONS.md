# Project6 Active Decisions

> 本文件记录用户最新明确决策。开发时必须按顺序阅读：
> `PROJECT_CHARTER.md` → `PRD.md` → **本文件** → `DEVELOPMENT_STATUS.md`。
>
> 如果 Charter / PRD 中的旧实现细节与这里冲突，以本文件中的**最新明确用户决策**为准，并在后续版本化 PRD 时同步回主文档。

## 2026-09-08 · Phase 1 第一章 TTS 决策

### 已废弃

第一章不再通过 Project5 调用 Edge TTS。

### 当前正式方案

```text
provider = edge-tts
client   = rany2/edge-tts
voice    = zh-TW-YunJheNeural
locale   = zh-TW
rate     = +0%
speed    = 1.0x
```

说明：

- `zh-TW-YunJheNeural` 是云哲 / 台湾国语男声。
- 香港男声 `zh-HK-WanLungNeural` 是另一位 voice，不得称为云哲。
- GitHub Actions 自动安装 `edge-tts`，生成每个 Garden Step 的 MP3。
- 生成音频提交到当前演示目录，Project6 运行时只负责静态播放。
- 不需要 API Key，不增加 Project6 服务器推理压力。

## 2026-09-08 · 第一章视觉与动效 Gate

第一章必须同时满足：

1. 画面好看：Garden 官方 `warm-keynote` 设计 DNA；1920×1080；无字幕；无 emoji 图标；信息图而非 PPT。
2. 动画衔接合适：每个 Step 有不同主动作；场景切换稳定；无明显闪切、残影、重叠。
3. 整体效果好：旁白、BGM、SFX、画面节奏统一。
4. 正确配音：6/6 必须是 `zh-TW-YunJheNeural`，1.0×。
5. BGM：轻松、愉悦、低音量；当前使用 CC0 `Short Plingy Loop`。
6. 录制：浏览器本地 WebM；服务器不保存最终视频。

第一章未通过用户视觉验收前，不进入第二章。

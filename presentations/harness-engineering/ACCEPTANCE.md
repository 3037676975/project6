# Harness Engineering · 第一章验收标准 v2

> 本文件是第一章硬 Gate。每次继续开发前必须依次阅读：
> `docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/DEVELOPMENT_STATUS.md` → Garden 官方 `SKILL.md` / `CHAPTER-CRAFT.md` / `AUDIO.md` / `RECORDING.md` → 本文件。
>
> 最新用户决策优先：第一章 TTS 已从 Project5 切换为开源 `rany2/edge-tts`，正式音色锁定 `zh-TW-YunJheNeural`，1.0×（`rate=+0%`）。

## 1. 画面好看（必须 PASS）

- [x] 固定 1920×1080 / 16:9 Garden 舞台。
- [x] 使用 Garden 官方 `warm-keynote` 设计 DNA：暖奶油、40px 网格、白色 glass slab、青绿 accent、轻弹簧动效。
- [x] 颜色与字体家族走 Theme token，不在章节里随意造新视觉体系。
- [x] 每屏只保留 1～3 个主视觉重点，不把口播全文搬到屏幕。
- [x] 无固定字幕条；本章不显示字幕。
- [x] 不使用 emoji 充当图标；图示使用 SVG / CSS / 几何组件。
- [x] 不使用假 Logo、假数据、无来源百分比。
- [ ] 6 个 Step 逐屏检查后，构图、字号、留白、层级均无明显失衡。

## 2. 动画衔接合适（必须 PASS）

- [x] 每章至少有 2 处真正的 CSS / SVG 动态视觉演示。
- [x] 6 个 Step 主导动作不同：开场聚焦 / 问题拆解 / 系统组装 / Harness 管线 / 研究案例循环 / 总结收束。
- [x] 不使用 `setTimeout` / `setInterval` 驱动章节进度。
- [x] Step 切换采用离场 + 入场两阶段过渡，不做生硬闪切。
- [x] 元素内部动画使用错峰，但不会一次性把清单所有内容全部展示。
- [ ] 每个 Step 的主动画在对应旁白结束前完成。
- [ ] 连续自动播放 6 Step 不出现跳帧、重叠、残影、音频重复。

## 3. 整体效果不错（必须 PASS）

- [x] 第一章保持统一 warm-keynote 视觉，不跨 Step 翻转主题。
- [x] 背景音乐只作为气氛层，音量远低于 narration。
- [x] BGM 使用可公开使用的 CC0 资源，并记录来源 / 许可证。
- [x] WebAudio SFX 只用于卡片出现、连线、状态切换，不抢口播。
- [ ] 从 Step 1 自动播放到 Step 6，整体节奏自然，没有明显“PPT 翻页感”。
- [ ] 用户主观视觉验收 PASS。

## 4. 配音必须正确（硬 Gate）

唯一正式语音：

```text
provider = edge-tts
client   = rany2/edge-tts
voice    = zh-TW-YunJheNeural
locale   = zh-TW
rate     = +0%
speed    = 1.0x
```

注意：

- `zh-TW-YunJheNeural` = 云哲 / 台湾国语男声。
- 香港男声是 `zh-HK-WanLungNeural`，不是云哲，不允许混淆。
- [x] 不再经过 Project5。
- [x] 禁止 SpeechSynthesis / macOS say / 其它音色作为正式 fallback。
- [x] GitHub Actions 自动安装 `edge-tts` 并生成本章 6 段 MP3。
- [ ] 6/6 MP3 真实生成并进入仓库。
- [ ] 浏览器实测 6/6 均为云哲台湾男声。
- [ ] Auto 严格按 `audio ended + 200ms` 推进。

## 5. 背景音乐 / 音效

默认 BGM：`Short Plingy Loop`，OpenGameArt，CC0。

- [x] 轻快、科技感、不会太活泼。
- [x] 默认循环播放。
- [x] 默认音量约 6%～8%，旁白优先。
- [x] Auto 开始时淡入，结束时淡出。
- [x] BGM 失败时不影响 narration / Step 主流程。
- [ ] 浏览器实测人声清楚、不被 BGM 遮盖。

## 6. 录制 / 导出

- [x] Manual 可用点击 / ← / → 检查 Step。
- [x] Auto 只有正式 edge-tts 6/6 ready 才允许启动。
- [x] 浏览器 MediaRecorder 本地 WebM，不上传 Project6 服务器。
- [x] 录制时控制条默认隐藏，不污染画面。
- [ ] 完整录制一次并检查文件可播放、声音完整、结尾无截断。

## 最终评分与 Gate

第一章必须同时满足：

- 画面好看：≥ 90 / 100
- 动画衔接：≥ 90 / 100
- 音画同步：100% 6/6
- 正确云哲语音：100% 6/6
- BGM / SFX 不抢人声：PASS
- 本地录制：PASS
- 用户视觉验收：PASS

任一硬项 FAIL：**继续修改，不进入第二章。**

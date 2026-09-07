# Harness Engineering · 第一章验收标准

> 本文件是第一章硬 Gate。开发前必须先读 `docs/PROJECT_CHARTER.md`、`docs/PRD.md`、`docs/DEVELOPMENT_STATUS.md`，再读 Garden 官方 `SKILL.md` + `CHAPTER-CRAFT.md` + `AUDIO.md` + `RECORDING.md`。

## A. Garden 官方结构

- [x] 固定 1920×1080 16:9 舞台。
- [x] 一个 Step 只讲一个 narration beat。
- [x] 第一章为独立 anchor，未验收前禁止第二章。
- [x] 主题使用 Garden 官方 `warm-keynote` 设计 DNA。
- [x] 颜色 / 字体家族只通过 Theme token 消费。
- [x] 不使用 `setTimeout` / `setInterval` 作为动画推进机制。

## B. 视觉与参考视频

- [x] 奶油暖白舞台 + 40px 细网格。
- [x] 白色 / 玻璃感中心卡片 + 克制暖色阴影。
- [x] 青绿色作为主要强调色；警示场景只使用有限珊瑚红辅助色。
- [x] 标题不做“海报型巨字堆砌”，采用参考视频的讲解型信息图比例。
- [x] 无固定字幕条、无黄色字幕。
- [x] 无 emoji 图标；图示使用 SVG / CSS 线稿和几何图形。
- [x] 每屏只保留 1～3 个最值得放大的视觉重点。
- [x] 至少 2 处真正的 SVG / CSS 动态视觉演示。
- [x] 不同 Step 的主导动作不同，不允许全章统一 fade / blur。
- [x] 不使用假 Logo、假用户数、无来源百分比。

## C. 配音 / 音画同步

- [x] 唯一允许的正式 TTS：Project5。
- [x] `engine=edge`。
- [x] `voice=zh-TW-YunJheNeural`。
- [x] `speed=1.10`。
- [x] 禁止 SpeechSynthesis / macOS say / 其它 Edge 音色作为正式 fallback。
- [ ] Project5 实际生成 6/6 音频。
- [ ] 浏览器逐步实测 6/6 均为云哲台湾男声。
- [ ] 每个 Step 动画在本段音频结束前完成。
- [ ] Auto 模式严格按 audio ended + 缓冲推进。

## D. 音效

- [x] 使用轻量程序化 SFX，仅服务于卡片出现 / 连线 / 状态切换。
- [x] 音效音量低于 narration，不抢口播。
- [x] 不使用持续刺耳提示音。

## E. 录制 / 导出

- [x] Manual 可点击 / 方向键检查每个 Step。
- [x] ETG1 未 ready 时禁止“伪完整自动成片”。
- [x] 浏览器本地 MediaRecorder 导出，不上传 Project6 服务器。
- [ ] ETG1 ready 后完整 Auto 跑一遍。
- [ ] 本地录制输出实际验证。

## 最终 Gate

当前：**FAIL**。

在以下 4 项全部通过前不允许标记第一章完成：

1. 6/6 真实 ETG1 音频 ready；
2. 6/6 音画同步实测 PASS；
3. 本地录制实测 PASS；
4. 用户确认视觉 PASS。

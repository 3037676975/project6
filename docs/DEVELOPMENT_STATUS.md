# Project6 开发状态

> 每次开发前必须依次阅读：
> `docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。
>
> 第一章开发还必须阅读 Garden 官方 `SKILL.md`、`CHAPTER-CRAFT.md`、`AUDIO.md`、`THEMES.md`、`RECORDING.md` 和 `presentations/harness-engineering/ACCEPTANCE.md`。
> 只有当前 Gate PASS 后，才允许继续下一阶段。

## 当前定位

- 当前 Phase：**Phase 1 · Garden 单视频实验 / 第一章返工验收**
- 当前状态：**IN PROGRESS / 等待用户视觉验收**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 参考：用户上传 Harness Engineering 案例视频
- 当前范围：**只做第一章，不进入第二章**
- Garden Theme：**官方 `warm-keynote`**
- 章节：1
- Step：6
- TTS：**开源 `rany2/edge-tts` / `zh-TW-YunJheNeural` / `rate=+0%` / 1.0×**
- BGM：**Short Plingy Loop / CC0 / 低音量循环**
- 导出：浏览器本地 MediaRecorder → WebM

## 最新实现决策

- [x] 第一章已从 Project5 切换到直接 `edge-tts`。
- [x] 云哲 Voice ID 锁定 `zh-TW-YunJheNeural`。
- [x] 香港男声 `zh-HK-WanLungNeural` 仅作为另一音色认知，不与云哲混淆。
- [x] 语速改为 1.0×：`rate=+0%`。
- [x] GitHub Actions 自动安装 `edge-tts==7.2.8` 并生成 6 段音频。
- [x] 6/6 MP3 已真实生成并提交仓库。
- [x] `audio-map.json` 已变为 `status=ready`，6 个 segment 完整。
- [x] CC0 BGM 已自动下载并提交仓库。
- [x] BGM 来源与许可证已记录。

## 第一章视觉 / 动画

- [x] 固定 1920×1080 16:9 舞台。
- [x] Garden 官方 `warm-keynote` 设计 DNA。
- [x] 奶油底 + 40px 网格 + 白色 glass slab + 青绿 accent。
- [x] 当前第一章无字幕组件。
- [x] 无 emoji 图标；图示使用 SVG / CSS / 几何组件。
- [x] 6 Step / 6 Narration 一一对应。
- [x] 每屏控制 1～3 个主要视觉重点。
- [x] 多组 SVG / CSS 动态演示。
- [x] 6 个 Step 主动作不同：开场聚焦 / 对比状态 / 系统组装 / Harness 管线 / 研究任务循环 / 概念收束。
- [x] 场景切换增加统一离场 / 入场过渡，减少闪切。
- [x] BGM 低音量淡入 / 淡出，旁白优先。
- [x] WebAudio 轻量 SFX 仅用于状态切换，不代替 narration。
- [x] MediaRecorder 本地 WebM 导出；录制时隐藏控制条。

## 自动化与验收

- [x] `presentations/harness-engineering/ACCEPTANCE.md` 升级到 v2。
- [x] `scripts/validate-harness-chapter1.mjs` 已切换为 edge-tts / YunJhe / 1.0× / BGM / 动画 / 录制检查。
- [x] GitHub Actions `Generate Harness Edge TTS` 最近一次运行成功。
- [ ] 浏览器连续 Auto 6 Step 实机播放检查。
- [ ] BGM 与旁白音量主观平衡检查。
- [ ] 浏览器本地录制完整实测。
- [ ] 用户确认第一章视觉 / 动画效果 PASS。

## 当前 Gate

**代码与资源 Gate：PASS。**

当前已经具备：

```text
Garden warm-keynote
+ 6 Step
+ 6/6 edge-tts 云哲台湾男声 1.0×
+ CC0 BGM
+ SFX
+ Auto
+ Browser WebM
```

**产品最终 Gate：仍为 IN PROGRESS。**

原因：还需要浏览器实机整段播放 / 录制与用户视觉验收。未通过前不进入第二章。

## 禁止越级

当前第一章未最终 PASS 前，不继续：

- 第二章
- 2～3 分钟完整版
- 新视频主题实验
- 本地 MP4
- 大规模资源库扩建

当前第一优先级：把第一章的 **画面好看 + 动画衔接自然 + 云哲正确 + BGM 舒服 + 录制稳定** 做到最终 PASS。

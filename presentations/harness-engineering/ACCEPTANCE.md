# Harness Engineering · 整片验收标准 v30

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → 本文件。

## 当前验收对象

完整《Harness Engineering》视频，不再按章节分别交接。

- 内部章节：7
- Garden Scene：42
- 完整口播：42 段
- 整片 TTS JSON：`full-tts-tasks.json`
- 整片播放器：`full-video.html`

## Gate A · 完整口播

状态：**CODE PASS / WAITING USER CONFIRM**

- [x] 已根据完整字幕素材整理整片叙事线。
- [x] 从 Harness 为什么出现，覆盖 Prompt → Context → Harness → 六层系统 → 实践 → 总结。
- [x] 42 段连续编号 `001`～`042`。
- [x] 章节只用于内部组织，不要求用户分章生成 TTS。
- [x] 后台一次展示完整脚本。
- [x] 用户一次确认以后，一键复制完整 JSON。
- [ ] 用户确认整片口播稿。

## Gate B · 全部 Garden 画面

状态：**CODE PASS / USER REVIEW**

- [x] 全部 42 Scene 已生成。
- [x] 统一沿用第一章 `warm-keynote`：奶油纸底、暖网格、teal 单强调、空间关系图、信息图式画面。
- [x] 画面类型包含 orbit / rail / timeline / layers / loop / context map / guardrail / case / final 等，避免 42 张全部长得一样。
- [x] 不使用旧后台卡片墙作为主要视频画面。
- [x] 每个 Scene 与同编号 narration 一一对应。
- [ ] 用户整片预览并指出需要返工的画面。

## Gate C · 整片本地 IndexTTS

状态：**CODE READY / WAITING REAL ZIP**

- [x] Project6 不负责本地 GPU 推理。
- [x] canonical JSON：`full-tts-tasks.json`。
- [x] 任务只导出一次，编号 `001`～`042`。
- [x] 本地预期输出：`001.mp3`～`042.mp3`，可附 `manifest.json`。
- [x] 后台只接收一个整片 ZIP，或直接多选全部音频。
- [x] ZIP 支持子目录 basename 匹配。
- [x] JSZip 有多 CDN fallback；失败时明确提示，并保留直接多选音频兜底。
- [ ] 用户上传真实 42 段 IndexTTS。
- [ ] 42/42 匹配通过。

## Gate D · 整片本地音画预览

状态：**CODE READY / WAITING REAL AUDIO**

- [x] 整片播放器支持播放。
- [x] 支持暂停 / 继续；暂停同时停止 narration 与 GSAP timeline。
- [x] 支持上一张 / 下一张。
- [x] 支持整片 Scene 进度跳转。
- [x] 支持全屏。
- [x] 上传的新本地音频通过 `postMessage` 注入整片播放器。
- [x] 每个 Scene 音频 `ended` 后自动进入下一 Scene。
- [x] 新本地音频优先级高于历史 Edge TTS。
- [ ] 用户用真实 42 段音频连续播放确认。
- [ ] 根据真实 IndexTTS 时长继续微调 Scene 内动画节奏（若需要）。

## Gate E · 动画音效

状态：**LOCKED UNTIL D PASS**

- [x] SFX 与人物配音严格分开。
- [x] SFX 放在整片音画确认后的最后环节。
- [ ] Gate D PASS 后再做 reveal / whoosh / click / confirm / accent 等整片 SFX 设计。

## 防回归规则

1. 禁止退回“一章一个 TTS JSON”。
2. “上传成功”不等于“播放器已经使用新声音”；必须真正注入 Blob URL。
3. ZIP 依赖必须显示健康状态；失败时要有直接多选音频兜底。
4. 整片播放器必须保留暂停和全屏。
5. 后续修改 Scene 时必须同时检查：画面 ID、TTS ID、音频文件编号三者一致。

## 当前总状态

| Gate | 状态 |
|---|---|
| A 完整口播 | CODE PASS / WAITING USER CONFIRM |
| B 42 张 Garden 画面 | CODE PASS / USER REVIEW |
| C 整片 IndexTTS | WAITING REAL ZIP |
| D 整片音画预览 | WAITING REAL AUDIO |
| E 动画 SFX | LOCKED |

下一步是用户确认整片口播与画面 → 一次复制 42 段 JSON → 本地生成一次整包 → 上传回来做整片音画验收。

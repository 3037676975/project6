# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE。

## 当前 Phase

**Phase 1 · Harness Engineering 整片制作 + 本地 IndexTTS 整包交接**

## 当前状态

- 后台：作品优先结构。
- `studio.html`：已删除。
- 视频工作台：已废弃。
- 整片内容：7 个内部章节 / 42 Scene。
- 整片口播：42/42 已整理。
- 整片 Garden 画面：42/42 已生成。
- Canonical 画面数据：`presentations/harness-engineering/full-video-data.js`。
- Canonical 整片播放器：`presentations/harness-engineering/full-video.html`。
- Canonical 整片 TTS JSON：`presentations/harness-engineering/full-tts-tasks.json`。
- TTS 交接：只允许一次复制完整 42 段 JSON，不再按章节分开。
- 本地 TTS：由用户本机 IndexTTS 2.5 负责。
- 音频回传：一个总 ZIP，编号 `001`～`042`。
- 整片预览：支持播放 / 暂停 / 继续 / 上一张 / 下一张 / Scene 进度跳转 / 全屏。
- 本地音频注入：通过作品页 Object URL + `postMessage` 注入整片播放器。
- 动画 SFX：最后环节，当前锁定。

## 2026-09-09 · v30 整片模式重构

### 内容与画面

- [x] 根据用户上传的完整字幕整理全片叙事。
- [x] 保留核心演进：为什么需要 Harness → Prompt → Context → Harness → 六层系统 → 实践 → 总结。
- [x] 42 个 Scene 全部沿用第一章 `warm-keynote` 视觉体系。
- [x] 使用多种信息图类型，避免全部 Scene 变成同一种卡片页。

### TTS 交接

- [x] `full-tts-tasks.json` 创建。
- [x] 编号统一 `001`～`042`。
- [x] 后台一次确认完整口播。
- [x] 一键复制完整 TTS JSON。
- [x] 一个 ZIP 回传整片音频。

### 整片播放器

- [x] 播放。
- [x] 暂停 / 继续。
- [x] 全屏。
- [x] 上一张 / 下一张。
- [x] 进度跳转。
- [x] 本地音频优先。
- [x] 每段音频结束自动进入下一 Scene。
- [x] 没有本地音频时仍可用静默画面模式检查视觉。

### ZIP / 本地音频

- [x] 支持 ZIP。
- [x] 支持 ZIP 内子目录。
- [x] JSZip 多 CDN fallback。
- [x] JSZip 失败时保留直接多选音频兜底。
- [x] 42/42 才允许开启本地整片预览。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | CODE PASS / WAITING USER CONFIRM | 用户一次确认 42 段完整口播 |
| B 全部 Garden 画面 | CODE PASS / USER REVIEW | 用户整片预览，指出需要返工的 Scene |
| C 本地 IndexTTS | CODE READY / WAITING REAL ZIP | 真实 001～042 音频 42/42 匹配 |
| D 整片音画预览 | CODE READY / WAITING REAL AUDIO | 整片播放器实际使用本地音频并连续播放通过 |
| E 动画 SFX | LOCKED | D PASS 后进入 |

## 强制防回归规则

1. 不再使用“一章一个 TTS JSON”的交接方式。
2. 用户面对的是一个完整视频项目，不是多个独立章节项目。
3. 章节可以内部导航，但 TTS / ZIP / Preview 都必须是整片级。
4. 本地上传成功不等于播放器切换成功；必须真正注入 Object URL。
5. 播放器必须保留暂停和全屏。
6. 以后修改 Scene 必须同步检查 Scene ID、TTS ID、音频文件编号。
7. 用户真实 IndexTTS 上传后，如时长变化明显，再根据真实音频时长微调 Scene 内动画。

## 当前唯一下一步

用户打开整片作品页 → 浏览 42 段完整口播与全部画面 → 一次确认 → 一键复制完整 TTS JSON → 本地 IndexTTS 生成 001～042 → 上传一个整包 ZIP → Project6 做整片音画预览与下一轮 timing 调整。

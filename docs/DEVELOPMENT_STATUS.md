# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v46**

## 当前唯一构建版本

- Product build：**v46**
- 单一版本源：`assets/version.js`
- 正式作品页：`works.html?v=46`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=46`
- 页面右上角必须显示 `P6 · v46`
- 以后发布新版本必须同步：版本源、页面缓存参数、作品 Gate、验收、开发状态。

## v46 当前能力

### Garden / Visual
- [x] 42 Scene 整片模式。
- [x] Scene 001：`HARNESS ENGINEERING` 主标题。
- [x] Scene 002～042 独立 visual / motion recipe。
- [x] 42/42 Chromium Screenshot QA。
- [x] tiny text = 0。
- [x] DOM overflow = 0。
- [x] Console Errors = 0。
- [x] 1280 / 1366 / 1440 响应式 16:9 检查通过。

### Preview / Scaling / Sound
- [x] 逻辑 Stage 固定 1920×1080。
- [x] `stage-frame` 同步缩放后的真实占位尺寸。
- [x] 窗口 / 缩放 / 全屏保持同一 16:9 坐标关系。
- [x] 播放 / 暂停 / 全屏 / Scene 跳转。
- [x] v46 新增 `声音开 / 声音关` 控件。
- [x] 声音选择写入 localStorage，刷新后保持。
- [x] 声音关闭时 narration 静音；录制默认按静音视频处理。

### TTS / Audio
- [x] 一个完整 `full-tts-tasks.json`。
- [x] 用户一次复制 001～042。
- [x] 一个总 ZIP 回传。
- [x] JSZip / 多选音频导入。
- [x] 新本地 IndexTTS 优先于历史音频。
- [ ] 等用户上传最终真实整包后做 timing 微调。

### Recording · v46
- [x] 正式 HTTPS 域名：`https://video.smilechat.cn`。
- [x] HTTP 域名自动升级 HTTPS。
- [x] Stage-only Region Capture 仍是正式目标。
- [x] v46 删除过强的首轮 `getDisplayMedia` 视频约束，优先使用兼容模式启动视频源。
- [x] 若带声音的捕获失败，会尝试视频-only 捕获，不再直接卡死在 `Could not start video source`。
- [x] 录制状态机改为 `idle / starting / recording / stopping`。
- [x] 点击录制按钮后，录制中同一按钮变为 `■ 停止录制`。
- [x] 无论 MediaRecorder 或屏幕共享轨道谁先结束，都会执行统一清理。
- [x] 浏览器停止共享时自动触发停止流程。
- [x] END 自动停止；也支持手动停止。
- [x] REC 实时计时。
- [x] 输出优先 MP4；浏览器不支持原生 MP4 MediaRecorder 时自动使用 WebM，并准确标注扩展名，不伪装为 MP4。
- [x] 文件只在浏览器本地下载，不上传服务器。
- [ ] 用户重新实机验证 v46：能启动、能停止、声音开关正确、下载文件可播放。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v46 视觉 | REVIEW | 自动 QA 已通过，等待用户最终视觉确认 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | 用户实机确认录制能启动/停止、文件可播放、声音开关正常 |

## 当前下一步

1. 用户测试 v46 一键录制，选择浏览器的“当前标签页”；
2. 录制开始后再次点击同一按钮，验证能够立即停止并下载；
3. 分别测试 `声音开` 和 `声音关`；
4. 录制通过后继续整片视觉 / 口播确认；
5. 一次复制总 TTS JSON，本地 IndexTTS 生成 001～042；上传总 ZIP 后做真实音画 timing；最后添加 SFX。

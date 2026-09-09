# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v45**

## 当前唯一构建版本

- Product build：**v45**
- 单一版本源：`assets/version.js`
- 正式作品页：`works.html?v=45`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=45`
- 页面右上角必须显示 `P6 · v45`
- 以后发布新版本必须同步：版本源、页面缓存参数、作品 Gate、验收、开发状态。

## v45 当前能力

### Garden / Visual
- [x] 42 Scene 整片模式。
- [x] Scene 001：`HARNESS ENGINEERING` 主标题。
- [x] Scene 002～042 独立 visual / motion recipe。
- [x] 42/42 Chromium Screenshot QA。
- [x] tiny text = 0。
- [x] DOM overflow = 0。
- [x] Console Errors = 0。
- [x] 1280 / 1366 / 1440 响应式 16:9 检查通过。

### Preview / Scaling
- [x] 逻辑 Stage 固定 1920×1080。
- [x] `stage-frame` 同步缩放后的真实占位尺寸。
- [x] 窗口 / 缩放 / 全屏保持同一 16:9 坐标关系。
- [x] 播放 / 暂停 / 全屏 / Scene 跳转。

### TTS / Audio
- [x] 一个完整 `full-tts-tasks.json`。
- [x] 用户一次复制 001～042。
- [x] 一个总 ZIP 回传。
- [x] JSZip / 多选音频导入。
- [x] 新本地 IndexTTS 优先于历史音频。
- [ ] 等用户上传最终真实整包后做 timing 微调。

### Recording · v45
- [x] 正式 HTTPS 域名：`https://video.smilechat.cn`。
- [x] HTTP 域名自动升级 HTTPS。
- [x] localhost bridge 仍作为备用。
- [x] Stage-only Region Capture。
- [x] 目标 1920×1080 / 60fps。
- [x] 标签页视频 + 标签页声音。
- [x] `REC 00:00:00` 实时计时。
- [x] 最终文件目标为 MP4。
- [x] v45 修复：不再按 1 秒切 MP4 分片；改为连续媒体块。
- [x] v45 修复：录制前在用户手势内解锁播放权限，重置 Scene 001 后再启动动画与录制。
- [ ] 用户重新实机验证 v45 MP4 是否能正常播放、动画是否完整录入。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v45 视觉 | REVIEW | 自动 QA 已通过，等待用户最终视觉确认 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P MP4 录制 | REVIEW | 用户实机确认 MP4 可播放、动画与声音正常 |

## 当前下一步

1. 用户测试 v45 MP4 录制；
2. 若录制通过，确认整片视觉与口播；
3. 一次复制总 TTS JSON，本地 IndexTTS 生成 001～042；
4. 上传总 ZIP 后做真实音画 timing；
5. 最后添加 SFX。

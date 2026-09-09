# Harness Engineering · 整片验收标准 v45

> 当前正式产品构建：**Project6 v45**。右上角必须显示 `P6 · v45`，正式播放器与作品页缓存参数必须统一为 `?v=45`。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：`HARNESS ENGINEERING` 主题封面 + Visual Anchor
- Scene 002～042：逐 Scene 独立 visual / motion recipe
- TTS：整片一次 JSON / 一次 ZIP
- SFX：最终环节
- Recording：Stage-only 1080P MP4，本地下载

## Gate A · 完整口播
状态：**REVIEW**
- [x] 42 段完整口播稳定。
- [x] 001～042 编号稳定。
- [x] TTS 只导出一个总 JSON。
- [ ] 用户最终确认整片口播。

## Gate B · Garden v45 视觉
状态：**REVIEW**
- [x] 42/42 Scene 独立视觉表达。
- [x] 禁止统一左右版式 / 纯卡片 / 统一 fade。
- [x] 42/42 Screenshot QA。
- [x] tiny text = 0。
- [x] DOM overflow = 0。
- [x] Console Errors = 0。
- [x] responsiveFails = 0。
- [x] 1280 / 1366 / 1440 下保持 16:9。
- [ ] 用户最终确认整片视觉。

## Gate C · 本地 IndexTTS
状态：**WAITING**
- [x] `full-tts-tasks.json` 001～042。
- [x] 一个总 ZIP。
- [x] ZIP / 多选音频浏览器本地导入。
- [ ] 等用户生成最终真实整包。

## Gate D · 整片音画预览
状态：**WAITING**
- [x] 播放 / 暂停 / 继续 / 全屏 / Scene 跳转。
- [x] Pause 同时暂停 narration 与当前 GSAP timeline。
- [x] 新本地音频优先于历史音频。
- [x] 窗口 / 缩放 / 全屏保持同一 16:9 坐标系统。
- [ ] 真实 IndexTTS 注入后做 timing 微调。

## Gate E · 动画 SFX
状态：**LOCKED**

整片真实音画 PASS 以后才进入。

## Gate F · 1080P MP4 本地录制
状态：**REVIEW**

验收要求：
- [x] 正式 HTTPS：`video.smilechat.cn`。
- [x] HTTP 自动升级 HTTPS；localhost bridge 作为备用。
- [x] 只录中间 `.stage`。
- [x] Chromium Region Capture。
- [x] 目标 1920×1080 / 60fps。
- [x] 标签页视频 + 标签页音频。
- [x] 录制 UI 显示 `REC 00:00:00`。
- [x] 最终下载目标 `.mp4`。
- [x] v45 不再每秒切 MP4 分片，使用连续录制块。
- [x] v45 录制前解锁播放权限、重置 Scene 001、等待渲染后启动动画。
- [ ] 用户实机确认 MP4 能正常打开，无花屏 / 乱码。
- [ ] 用户实机确认动画和声音都真实录入。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 正式 UI 显示 v40/v41/v42/v43/v44；
2. 正式作品页 / 播放器仍用旧 `?v=` 缓存参数；
3. 页面版本与 `assets/version.js` 不一致；
4. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步；
5. 删除仍在正式页面引用的历史文件。

## 当前结论

Project6 当前正式构建为 **v45**。视觉自动 QA 已通过；当前最重要的实机验证是 v45 MP4 录制兼容性，然后才进入最终 TTS 整包与 timing。

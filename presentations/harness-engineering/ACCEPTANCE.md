# Harness Engineering · 整片验收标准 v48

> 当前正式产品构建：**Project6 v48**。右上角必须显示 `P6 · v48`，正式播放器缓存参数统一为 `?v=48`。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：`HARNESS ENGINEERING` 主题封面 + Visual Anchor
- Scene 002～042：逐 Scene 独立 visual / motion recipe
- TTS：整片一次 JSON / 一次 ZIP
- SFX：最终环节
- Recording：全屏当前标签页录制；不再使用 Region Crop

## Gate A · 完整口播
状态：**REVIEW**
- [x] 42 段完整口播稳定。
- [x] 001～042 编号稳定。
- [x] TTS 只导出一个总 JSON。
- [ ] 用户最终确认整片口播。

## Gate B · Garden v48 视觉
状态：**REVIEW**
- [x] 42/42 Scene 独立视觉表达。
- [x] 42/42 Screenshot QA。
- [x] tiny text = 0。
- [x] DOM overflow = 0。
- [x] Console Errors = 0。
- [x] responsiveFails = 0。
- [ ] 用户最终确认整片视觉。

## Gate C · 本地 IndexTTS
状态：**WAITING**
- [x] `full-tts-tasks.json` 001～042。
- [x] 一个总 ZIP。
- [ ] 等用户生成最终真实整包。

## Gate D · 整片音画预览
状态：**WAITING**
- [x] 播放 / 暂停 / 继续 / 全屏 / Scene 跳转。
- [x] 声音开 / 声音关并持久化。
- [x] 新本地音频优先于历史音频。
- [ ] 真实 IndexTTS 注入后做 timing 微调。

## Gate E · 动画 SFX
状态：**LOCKED**

整片真实音画 PASS 以后才进入。

## Gate F · 本地录制 v48
状态：**REVIEW**

验收要求：
- [x] HTTPS：`video.smilechat.cn`。
- [x] v47 的 Region Crop 在用户实机出现“只有底色、主体动画丢失”，因此 v48 删除该链路。
- [x] 点击录制时从同一用户手势请求 `stage-frame` 全屏 + 当前标签页捕获。
- [x] 录制对象为全屏当前标签页，不再录缩小预览框后再裁剪。
- [x] 录制前自动回到 Scene 001 并启动整片播放。
- [x] 实际读取 capture track 分辨率；低于 1920×1080 直接 FAIL，不伪装 1080P。
- [x] 目标 60fps / 16 Mbps。
- [x] REC 实时计时；录制时页面标题同步计时。
- [x] END / 浏览器停止共享 / 退出全屏均可停止。
- [x] 输出优先 MP4；不支持则使用真实 WebM。
- [ ] 用户实机确认：下载文件包含完整动画内容，不再只有背景。
- [ ] 用户实机确认：实际捕获为 1920×1080 或更高。
- [ ] 用户实机确认：文件可正常播放。
- [ ] 用户实机确认：声音开 / 关行为正确。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 正式播放器右上角不是 v48；
2. 正式播放器仍加载旧 `?v=` 缓存参数；
3. 页面版本与 `assets/version.js` 不一致；
4. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步。

## 当前结论

Project6 当前正式构建为 **v48**。本轮不改 42 Scene 视觉，只重构录制链：从“缩小预览 + Region Crop”改为“全屏 Stage + 当前标签页直接录制”。等待用户实机验证后再决定是否需要浏览器内转码层。

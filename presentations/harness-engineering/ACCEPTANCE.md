# Harness Engineering · 整片验收标准 v50

> 当前正式产品构建：**Project6 v50**。正式播放器缓存参数统一为 `?v=50`，专用录制页为 `record.html?v=50`。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：`HARNESS ENGINEERING` 主题封面 + Visual Anchor
- Scene 002～042：逐 Scene 独立 visual / motion recipe
- TTS：整片一次 JSON / 一次 ZIP
- SFX：最终环节
- Recording：专用录制页 + 1920×1080 Canvas 输出

## Gate A · 完整口播
状态：**REVIEW**
- [x] 42 段完整口播稳定。
- [x] 001～042 编号稳定。
- [x] TTS 只导出一个总 JSON。
- [ ] 用户最终确认整片口播。

## Gate B · Garden v50 视觉
状态：**REVIEW**
- [x] 42/42 Scene 独立视觉表达。
- [x] Screenshot QA 基线保留。
- [x] 普通预览字号与大画面字号分层。
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

## Gate F · 本地录制 v50
状态：**REVIEW**

验收要求：
- [x] HTTPS：`video.smilechat.cn`。
- [x] 不再依赖 Fullscreen API 保持全屏；Chrome 打开屏幕共享权限窗口时会退出网页 Fullscreen。
- [x] 不再使用 Region Crop / CropTarget。
- [x] 新增 `record.html` 专用录制页；整个网页只显示视频画面。
- [x] 正式播放器点击录制只打开专用录制页。
- [x] 用户在共享弹窗中只需选择“当前标签页”。
- [x] 捕获结果通过隐藏 video 输入 1920×1080 Canvas。
- [x] Canvas 对捕获画面做居中 16:9 裁切，再 `canvas.captureStream(60)` 输出。
- [x] 最终视频输出尺寸固定为 1920×1080，不依赖当前预览框大小。
- [x] 标签页音频轨道加入最终输出流。
- [x] 目标 18 Mbps / 192 kbps。
- [x] 录制前自动回到 Scene 001。
- [x] 页面标题显示 REC 计时，不进入成片。
- [x] END / 浏览器停止共享 / 键盘 `S` / `Esc` 可停止录制。
- [x] 输出优先 MP4；不支持时保存真实 WebM。
- [ ] 用户实机确认：成片不再是缩小后台，而是完整视频画面。
- [ ] 用户实机确认：成片不包含后台按钮和旁边区域。
- [ ] 用户实机确认：动画主体完整，不再只有背景。
- [ ] 用户实机确认：文件可正常播放。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 正式播放器右上角不是 v50；
2. 正式播放器仍加载旧 `?v=` 缓存参数；
3. 页面版本与 `assets/version.js` 不一致；
4. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步。

## 当前结论

Project6 当前正式构建为 **v50**。v50 把录制从“预览页自录”彻底拆成“专用纯视频页 + Canvas 1080P 输出”，目的就是消除共享权限弹窗导致的全屏退出、页面缩小和 Region Crop 空白问题。等待用户实机验证。

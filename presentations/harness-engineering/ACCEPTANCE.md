# Harness Engineering · 整片验收标准 v51

> 当前正式产品构建：**Project6 v51**。正式播放器缓存参数统一为 `?v=51`，专用录制页为 `record.html?v=51`。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：`HARNESS ENGINEERING` 主题封面 + Visual Anchor
- Scene 002～042：逐 Scene 独立 visual / motion recipe
- TTS：整片一次 JSON / 一次 ZIP
- SFX：最终环节
- Recording：专用录制页 + 精确成片框裁切 + 1920×1080 Canvas 输出

## Gate A · 完整口播
状态：**REVIEW**
- [x] 42 段完整口播稳定。
- [x] 001～042 编号稳定。
- [x] TTS 只导出一个总 JSON。
- [ ] 用户最终确认整片口播。

## Gate B · Garden v51 视觉
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
- [x] 播放 / 暂停 / 继续 / Scene 跳转。
- [x] 声音开 / 声音关并持久化。
- [x] 新本地音频优先于历史音频。
- [ ] 真实 IndexTTS 注入后做 timing 微调。

## Gate E · 动画 SFX
状态：**LOCKED**

整片真实音画 PASS 以后才进入。

## Gate F · 本地录制 v51
状态：**REVIEW**

验收要求：
- [x] HTTPS：`video.smilechat.cn`。
- [x] 不依赖 Fullscreen API。
- [x] 不使用 Region Crop / CropTarget。
- [x] 专用 `record.html` 使用黑色工作区 + 中间 16:9 成片框 + 底部常驻控制栏。
- [x] 用户可在录制中看到开始/停止、REC 计时、声音状态和输出状态。
- [x] 最终视频不按整个标签页居中裁切。
- [x] 每帧通过 `.stage-frame.getBoundingClientRect()` 获取中间成片框的真实页面坐标。
- [x] 把成片框坐标映射到原始标签页捕获视频像素，再精确绘制到 1920×1080 Canvas。
- [x] 因此底部控制栏、黑色工作区及其他页面区域不应进入最终成片。
- [x] 最终输出固定 1920×1080，`canvas.captureStream(60)`。
- [x] 目标视频码率 18 Mbps，音频 192 kbps。
- [x] 声音开启时加入标签页音频；关闭时静音输出。
- [x] 录制前自动回到 Scene 001。
- [x] END / 浏览器停止共享 / 底部“停止录制” / `S` / `Esc` 均可停止。
- [x] 输出优先 MP4；不支持时保存真实 WebM。
- [ ] 用户实机确认：下载成片只包含中间 16:9 视频。
- [ ] 用户实机确认：底部控制栏不入镜。
- [ ] 用户实机确认：动画主体完整。
- [ ] 用户实机确认：文件可正常播放。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 当前版本不是 v51；
2. `record.html` 或录制脚本仍加载旧 `?v=` 缓存参数；
3. 页面版本与 `assets/version.js` 不一致；
4. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步。

## 当前结论

Project6 当前正式构建为 **v51**。v51 不再猜“标签页中央 16:9”在哪里，而是直接以实际 `.stage-frame` 为唯一成片边界；控制栏可以一直显示供用户操作，但不进入最终录制。等待用户实机验证。

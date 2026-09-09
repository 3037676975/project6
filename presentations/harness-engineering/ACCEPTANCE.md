# Harness Engineering · 整片验收标准 v59

> 当前正式产品构建：**Project6 v59**。正式播放器 `full-video.html?v=59`，录制控制台 `record.html?v=59`，纯成片窗口 `capture.html?v=59`。

## 当前验收对象

- 完整视频：42 Scene
- TTS：整片一次 JSON / 一次 ZIP
- Recording：双窗口控制台 + 纯成片捕获窗口 + 1080P/1440P/4K 输出

## Gate B · 视觉一致性 v59
状态：**REVIEW**

- [x] `capture.html` 与正式播放器使用同一套 `full-video-v40.css`、`full-video-v41-polish.css`、`full-video-data.js`、`full-video-v40.js`、hotfix、`full-video-v42-layout.js`。
- [x] 录制控制台深色 CSS 不再与成片 DOM 共页，因此不得影响 Scene 标题颜色、字体继承和布局。
- [ ] 用户实机确认 Scene 001～004：正式播放器与 capture.html 的主标题颜色、字号、位置一致。
- [ ] 抽查后续 Scene，不允许出现“第一页正确、第二页以后标题颜色变化”的情况。

## Gate F · 高清本地录制 v59
状态：**REVIEW**

- [x] 成片窗口与控制窗口分离；控制台、REC 按钮、配乐按钮不进入最终视频。
- [x] 控制台通过 BroadcastChannel 控制成片窗口的上一页 / 下一页 / 自动播放 / 暂停 / 旁白。
- [x] 本地配乐可发送到成片窗口播放并通过标签页音频进入录制。
- [x] 输出画质可选：1080P 24 Mbps、1440P 40 Mbps、4K 65 Mbps；目标 60fps。
- [x] 显示真实 SOURCE → OUTPUT；源分辨率低于输出时明确提示存在放大。
- [x] 录制四态：开始、暂停/继续、停止并保存、取消并丢弃。
- [ ] 用户实机确认：最大化成片窗口后，SOURCE 达到显示器/浏览器允许的最高实际分辨率。
- [ ] 用户实机确认：录制文件无工作台、无控制栏、无 REC 浮层、画面完整且可播放。
- [ ] 用户实机确认：1080P 文件清晰度达到可接受水平；1440P/4K 不把低分辨率源误认为原生高清。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 当前版本不是 v59；
2. `assets/version.js`、`full-video.html`、`record.html`、`capture.html` 缓存参数不一致；
3. 正式播放器和纯成片窗口视觉依赖链不一致；
4. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步。

## 当前结论

v59 不再在同一个页面里同时承担“成片渲染”和“录制控制”。控制台负责操作，capture.html 负责纯视频画面。这样解决工作台压缩成片尺寸、录制页 CSS 污染标题颜色、控制 UI 入镜，以及低分辨率小预览被强行放大等问题。
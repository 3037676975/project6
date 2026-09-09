# Harness Engineering · 整片验收标准 v61

> 当前正式产品构建：**Project6 v61**。正式播放器 `full-video.html?v=61`，录制控制台 `record.html?v=61`，纯成片窗口 `capture.html?v=61`，视频作品页 `works.html?v=61`。

## 当前验收对象

- 完整视频：42 Scene
- TTS：整片一次 JSON / 一个或多个完整 ZIP 配音源
- Recording：双窗口控制台 + 纯成片捕获窗口 + 1080P/1440P/4K 输出

## Gate C · 本地 TTS 配音源库 v61
状态：**REVIEW**

- [x] ZIP 保存到当前浏览器 IndexedDB；单个音频不持久保存。
- [x] 多个 ZIP 形成独立配音源，可切换、试听、删除。
- [x] 当前配音源刷新后保持。
- [x] v61 修复配音源控制台与 Capture Surface 通信通道不一致问题。
- [x] Capture Surface 收到 `voice-source` 后必须切换当前配音源并重新加载当前 Scene 音频。
- [x] Capture Surface 首次提供“🔊 启用旁白声音”按钮，用于满足 Chrome 用户手势/自动播放策略；点击后必须消失。
- [x] 控制台必须显示“声音未解锁 / ✓ 声音已解锁”。
- [ ] 用户实机确认：选择配音源 → 解锁声音 → 自动播放 Scene 001 时可听到对应旁白。
- [ ] 用户实机确认：切换到另一个配音源后，同一 Scene 的声音随之切换。

## Gate F · 高清本地录制 v61
状态：**REVIEW**

- [x] 成片窗口与控制窗口分离；控制台 UI 不进入最终视频。
- [x] 录制时选择 `Project6 v61 · Harness Capture Surface`。
- [x] 录制共享必须勾选“分享标签页音频”，否则不能判定音频 Gate PASS。
- [x] 当前配音源旁白与本地配乐都在 Capture Surface 播放。
- [x] 输出画质：1080P / 1440P / 4K；显示 SOURCE → OUTPUT。
- [x] 录制四态：开始、暂停/继续、停止并保存、取消并丢弃。
- [ ] 用户实机确认：录制文件中有当前配音源旁白。
- [ ] 用户实机确认：旁白与画面 Scene 同步，不串音、不使用旧配音源。
- [ ] 用户实机确认：录制文件无工作台、无控制栏、无声音解锁浮层。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 当前版本不是 v61；
2. `assets/version.js`、`full-video.html`、`record.html`、`capture.html` 缓存参数不一致；
3. 录制控制台与 Capture Surface 使用不同 BroadcastChannel；
4. 配音源 ZIP/单片保存规则被破坏；
5. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步。

## 当前结论

v61 专门修复“录制控制台已经选择配音源，但自动播放无旁白”的链路问题。根因包括配音源消息通道不一致，以及 Chrome 对跨窗口自动播放音频的用户手势限制。正式流程改为：选择配音源 → Capture Surface 点一次声音解锁 → 自动播放 → 开始录制并分享标签页音频。
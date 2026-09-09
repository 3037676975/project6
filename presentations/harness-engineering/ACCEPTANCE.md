# Harness Engineering · 整片验收标准 v62

> 当前正式产品构建：**Project6 v62**。正式播放器 `full-video.html?v=62`，录制控制台 `record.html?v=62`，纯成片窗口 `capture.html?v=62`。

## Gate C · 本地 TTS 配音源库 v62
状态：**REVIEW**

- [x] ZIP 保存到当前浏览器 IndexedDB；单个音频不持久保存。
- [x] 多个 ZIP 形成独立配音源，可切换、试听、删除。
- [x] 正式播放器将当前配音源 001～042 通过 `P6_LOCAL_AUDIO` 注入 Garden 原生 `localAudio`。
- [x] 旁白默认开启，不再存在必须点击“启用旁白声音”的步骤。
- [x] 录制控制台直接负责当前配音源播放；“自动播放”点击即为用户手势。
- [ ] 用户实机确认：选择配音源后直接点“自动播放”，Scene 001 可听到对应旁白。
- [ ] 用户实机确认：音频结束后 Scene 与下一段配音同步推进。

## Gate F · 高清本地录制 v62
状态：**REVIEW**

- [x] Capture Surface 只负责成片画面；控制台 UI 不入镜。
- [x] 通信通道固定为 `project6-harness-control`，不随 v62/v63 改名。
- [x] TTS Web Audio 混音轨在录制页预创建。
- [x] 支持用户操作顺序：开始录制 → 再点自动播放。
- [x] 最终录制流包含 Capture 视频/标签页音频 + TTS 混音轨。
- [x] 输出画质：1080P / 1440P / 4K。
- [x] 录制四态：开始、暂停/继续、停止并保存、取消并丢弃。
- [ ] 用户实机确认：10～20 秒录制文件中有当前配音源旁白。
- [ ] 用户实机确认：旁白与画面 Scene 同步，不使用旧配音源。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 当前版本不是 v62；
2. `assets/version.js`、`full-video.html`、`record.html`、`capture.html` 缓存参数不一致；
3. 控制台 / Capture / 配音模块通信通道不一致；
4. 又恢复“成片窗口手动声音解锁”流程；
5. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步。

## 当前结论

v62 删除 v61 的手动声音解锁方案。真实根因是保存的配音源此前没有正式进入 Garden 的 `localAudio`，同时跨窗口触发声音受 Chrome 自动播放策略影响。v62 改为：正式播放器注入 `localAudio`；录制时由控制台直接播放 TTS，并通过 Web Audio 混入最终录像。
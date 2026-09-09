# Harness Engineering · 整片验收标准 v52

> 当前正式产品构建：**Project6 v52**。正式播放器缓存参数统一为 `?v=52`，专用录制页为 `record.html?v=52`。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：`HARNESS ENGINEERING` 主题封面 + Visual Anchor
- Scene 002～042：逐 Scene 独立 visual / motion recipe
- TTS：整片一次 JSON / 一次 ZIP
- SFX：最终环节
- Recording：专用录制控制台 + 精确成片框裁切 + 1920×1080 Canvas 输出

## Gate A · 完整口播
状态：**REVIEW**
- [x] 42 段完整口播稳定。
- [x] 001～042 编号稳定。
- [x] TTS 只导出一个总 JSON。
- [ ] 用户最终确认整片口播。

## Gate B · Garden v52 视觉
状态：**REVIEW**
- [x] 42/42 Scene 独立视觉表达。
- [x] Screenshot QA 基线保留。
- [ ] 用户最终确认整片视觉。

## Gate C · 本地 IndexTTS
状态：**WAITING**
- [x] `full-tts-tasks.json` 001～042。
- [x] 一个总 ZIP。
- [ ] 等用户生成最终真实整包。

## Gate D · 整片音画预览
状态：**WAITING**
- [x] 播放 / 暂停 / 继续 / Scene 跳转。
- [x] 旁白开关。
- [x] 新本地音频优先于历史音频。
- [ ] 真实 IndexTTS 注入后做 timing 微调。

## Gate E · 动画 SFX
状态：**LOCKED**

整片真实音画 PASS 以后才进入。

## Gate F · 本地录制 v52
状态：**REVIEW**

验收要求：
- [x] HTTPS：`video.smilechat.cn`。
- [x] 专用 `record.html`：黑色工作区 + 中间 16:9 成片框 + 底部常驻控制台。
- [x] `.stage-frame` 是唯一成片边界，Canvas 每帧按其真实坐标精确裁切。
- [x] 删除成片框内部红色 `RECORDING` 标识；REC 状态只存在于成片框外。
- [x] 底部提供上一页 / 下一页。
- [x] 底部提供自动播放 / 暂停。
- [x] 底部提供旁白声音开关。
- [x] 底部提供本地配乐选择、配乐播放/暂停、音量。
- [x] 底部提供开始 / 停止录制、REC 计时、状态。
- [x] 所有控制均在 `.stage-frame` 外，因此不得进入最终成片。
- [x] 最终输出固定 1920×1080，`canvas.captureStream(60)`。
- [x] 目标视频码率 18 Mbps，音频 192 kbps。
- [x] 共享当前标签页音频时，旁白和本地配乐可进入录制音轨。
- [x] END / 浏览器停止共享 / 停止录制 / S / Esc 均可停止。
- [x] 输出优先 MP4；不支持时保存真实 WebM。
- [ ] 用户实机确认：红色录制状态不入镜。
- [ ] 用户实机确认：底部控制台不入镜。
- [ ] 用户实机确认：上一页/下一页/播放/暂停可用。
- [ ] 用户实机确认：选择本地配乐后可播放并调节音量。
- [ ] 用户实机确认：最终文件只含中间 16:9 动画且可播放。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 当前版本不是 v52；
2. `record.html` 或录制脚本仍加载旧缓存参数；
3. 页面版本与 `assets/version.js` 不一致；
4. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步。

## 当前结论

Project6 当前正式构建为 **v52**。录制页已经从“只有开始/停止”升级为完整录制控制台；控制可以一直看见和操作，但最终 Canvas 仍只输出中间 16:9 成片框。

# Harness Engineering · 整片验收标准 v46

> 当前正式产品构建：**Project6 v46**。右上角必须显示 `P6 · v46`，正式播放器缓存参数统一为 `?v=46`。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：`HARNESS ENGINEERING` 主题封面 + Visual Anchor
- Scene 002～042：逐 Scene 独立 visual / motion recipe
- TTS：整片一次 JSON / 一次 ZIP
- SFX：最终环节
- Recording：Stage-only 本地录制；优先 MP4，不支持原生 MP4 时准确回退 WebM

## Gate A · 完整口播
状态：**REVIEW**
- [x] 42 段完整口播稳定。
- [x] 001～042 编号稳定。
- [x] TTS 只导出一个总 JSON。
- [ ] 用户最终确认整片口播。

## Gate B · Garden v46 视觉
状态：**REVIEW**
- [x] 42/42 Scene 独立视觉表达。
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
- [x] v46 新增 `声音开 / 声音关`。
- [x] 声音设置持久化。
- [x] 新本地音频优先于历史音频。
- [x] 窗口 / 缩放 / 全屏保持同一 16:9 坐标系统。
- [ ] 真实 IndexTTS 注入后做 timing 微调。

## Gate E · 动画 SFX
状态：**LOCKED**

整片真实音画 PASS 以后才进入。

## Gate F · 本地录制 v46
状态：**REVIEW**

验收要求：
- [x] 正式 HTTPS：`video.smilechat.cn`。
- [x] 只录中间 `.stage`。
- [x] Chromium Region Capture 仍为正式裁切方式。
- [x] v46 首次屏幕捕获改为宽兼容 `video:true`，避免过强约束触发 `Could not start video source`。
- [x] 声音开时请求标签页声音；失败时允许视频-only 兼容回退。
- [x] 声音关时直接录静音视频。
- [x] 状态机：idle / starting / recording / stopping。
- [x] 录制中同一按钮显示 `■ 停止录制`。
- [x] 手动停止、浏览器停止共享、END 均进入同一停止清理流程。
- [x] REC 计时。
- [x] 优先 MP4；浏览器不支持则保存为真实 WebM，不伪装扩展名。
- [x] 文件只在浏览器本地下载。
- [ ] 用户实机确认：可以启动录制。
- [ ] 用户实机确认：再次点击可停止。
- [ ] 用户实机确认：声音开 / 关行为正确。
- [ ] 用户实机确认：下载文件可正常播放。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. 正式播放器右上角不是 v46；
2. 正式播放器仍加载旧 `?v=` 缓存参数；
3. 页面版本与 `assets/version.js` 不一致；
4. 页面升级而 DEVELOPMENT_STATUS / ACCEPTANCE 未同步；
5. 删除仍在正式页面引用的历史实现文件。

## 当前结论

Project6 当前正式播放器构建为 **v46**。本次只修录制兼容性、停止状态机与声音开关，不改已通过 QA 的 42 Scene 视觉。下一步由用户实机验证录制启动 / 停止 / 声音开关。

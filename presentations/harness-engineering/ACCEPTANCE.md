# Harness Engineering · 整片验收标准 v42

> Scene 001 以 `HARNESS ENGINEERING` 为主标题；Scene 002～042 保持逐 Scene 独立 visual / motion recipe。v42 重点补齐真实截图 QA、等比缩放和 HTTP 部署下的 localhost 录制入口。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：主题封面 + 视觉 Anchor
- Scene 002～042：逐 Scene 独立 visual / motion recipe
- TTS：整片一次 JSON / 一次 ZIP
- SFX：最终环节
- Recording：Stage-only 1080P 本地下载

## Gate A · 完整口播

状态：**CODE PASS / WAITING USER CONFIRM**

- [x] 42 段完整口播稳定。
- [x] 001～042 编号稳定。
- [x] TTS 只导出一个总 JSON。

## Gate B · Garden v42 视觉 + Screenshot QA

状态：**AUTOMATED QA PASS / USER REVIEW**

### Visual requirements

- [x] Scene 001 主标题为 `HARNESS ENGINEERING`。
- [x] 中文问题只作为副标题 / Hook。
- [x] Scene 002～042 不使用统一左文字 / 右内容骨架。
- [x] Scene 002～042 独立 visual recipe。
- [x] Scene 002～042 独立 motion recipe。
- [x] 动画用途必须属于：解释 / 空间 / 状态 / 反馈 / 过程。
- [x] 中文字体栈统一。
- [x] 主要标题 / node / label / small text 适配 1080P。

### Mandatory screenshot review

**代码实现完成 ≠ Scene 完成。**

正式流程：

```text
Chromium render
→ Scene 001～042
→ #stage 1920×1080 screenshot
→ font-size / overflow / alignment / hierarchy / whitespace / narrative logic review
→ fail scene returns to implementation
```

自动化：
- `scripts/visual-qa.mjs`
- `.github/workflows/visual-qa.yml`

最终 v42 自动 QA：

- [x] 42/42 screenshots generated
- [x] tiny text = 0
- [x] DOM overflow = 0
- [x] Console Errors = 0
- [x] 1366×768 / 1440×900 / 1280×720 响应式检查
- [x] 代表 Scene 001 / 009 / 025 / 036 / 042 全部 16:9
- [x] Stage ratio = 1.7778
- [x] stage-frame 与实际 Stage 绘制尺寸一致
- [x] responsiveFails = 0
- [ ] 用户最终确认整片视觉

### Garden / Emil 防回归

1. 连续 3 张主构图相同 → FAIL。
2. 只有文字卡片 + fade → FAIL。
3. 动画无法解释内容 / 空间 / 状态 / 反馈 → FAIL。
4. 一屏塞完整口播 → FAIL。
5. 恢复统一左右版式 → FAIL。
6. 主要阅读信息使用过小字体 → FAIL。
7. 元素越过 Stage 安全边界 / 遮挡核心信息 → FAIL。
8. 没有真实截图 QA 就宣布完成 → FAIL。
9. 窗口缩放后画面比例或坐标关系变化 → FAIL。

## Gate C · 整片 IndexTTS

状态：**CODE READY / WAITING REAL ZIP**

- [x] 整片 JSON 001～042 保持不变。
- [x] IndexTTS 仍由用户本机生成。
- [x] Project6 接收一个总 ZIP。
- [ ] Gate B 用户确认后生成最终真实语音包。

## Gate D · 整片音画预览

状态：**CODE READY / WAITING REAL AUDIO**

- [x] 播放 / 暂停 / 继续 / 全屏 / 上一张 / 下一张 / Scene 跳转。
- [x] Pause 同时暂停 narration 与 GSAP timeline。
- [x] 本地音频注入优先于历史音频。
- [x] 窗口模式与全屏模式保持同一 16:9 坐标系统。
- [ ] 真实 IndexTTS 上传后按真实时长做 timing 微调。

## Gate E · 动画 SFX

状态：**LOCKED UNTIL D PASS**

SFX 仍只在整片音画通过后进入。

## Gate F · Stage-only 1080P 本地录制

状态：**CODE READY / LOCALHOST BROWSER TEST REQUIRED**

### 浏览器限制

`getDisplayMedia / Region Capture` 需要 secure context。正式站点当前为 HTTP IP，因此直接在服务器 URL 点击录制会被 Chrome / Edge 拒绝。

### v42 正式方案

仓库提供：
- `tools/project6-recording-localhost.py`
- `tools/start-project6-recording.bat`

Windows 用户双击 BAT：

```text
Project6 HTTP server
→ localhost proxy 127.0.0.1:28444
→ browser secure-context exception for localhost
→ Stage-only Region Capture
```

验收：

- [x] 一键录制按钮在播放器下方控制区。
- [x] 录制目标只允许 `.stage`。
- [x] Chromium Region Capture 精确裁切。
- [x] 不支持 Region Capture 时不退化成录整个后台。
- [x] 请求 1920×1080 / 60fps。
- [x] 低于 1080P 时拒绝录制并提示。
- [x] 视频 + 当前标签页音频。
- [x] VP9/Opus 优先。
- [x] 12Mbps video / 192kbps audio 目标码率。
- [x] 一键启动自动从 Scene 001 开始。
- [x] END 自动停止；也支持手动停止。
- [x] 浏览器本地下载 `.webm`。
- [x] 不上传服务器。
- [x] HTTP 页面会明确提示 localhost 录制入口。
- [ ] Windows 最新 Chrome / Edge 实机完成一次录制验证。

## 当前结论

v42 自动视觉 QA 已通过：42 Scene、tiny=0、overflow=0、consoleErrors=0、responsiveFails=0。

**Gate B 现在只剩用户视觉确认；录制只剩真实 Windows Chrome / Edge 实机验收。**

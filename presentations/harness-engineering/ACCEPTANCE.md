# Harness Engineering · 整片验收标准 v41

> Scene 001 保留为 Anchor；Scene 002～042 已在 v40 全视觉重构，v41 继续做可读性、视觉 QA 与本地录制。

## 当前验收对象

- 完整视频：42 Scene
- Scene 001：视觉 Anchor
- Scene 002～042：逐 Scene 独立 visual / motion recipe
- TTS：整片一次 JSON / 一次 ZIP
- SFX：最终环节
- Recording：Stage-only 1080P 本地下载

## Gate A · 完整口播

状态：**CODE PASS / WAITING USER CONFIRM**

- [x] 42 段完整口播保持稳定。
- [x] 001～042 编号稳定。
- [x] TTS 只导出一个总 JSON。

## Gate B · Garden 视觉 + Screenshot QA

状态：**V41 CODE POLISHED / AUTOMATED QA / USER REVIEW**

### Visual requirements

- [x] Scene 001 保留为 Anchor。
- [x] Scene 002～042 不使用统一左文字 / 右内容骨架。
- [x] Scene 002～042 独立 visual recipe。
- [x] Scene 002～042 独立 motion recipe。
- [x] 动画用途必须属于：解释 / 空间 / 状态 / 反馈 / 过程。
- [x] 中文字体栈统一。
- [x] 主要标题 / node / label / small text 在 v41 提升可读性。

### Mandatory screenshot review

**代码实现完成 ≠ Scene 完成。**

每次正式画面修改后强制执行：

```text
Chromium render
→ Scene 001～042
→ #stage 1920×1080 screenshot
→ font-size / overflow / alignment / hierarchy / whitespace / narrative logic review
→ fail scene returns to implementation
```

自动化文件：
- `scripts/visual-qa.mjs`
- `.github/workflows/visual-qa.yml`

输出：
- `qa/screenshots/scene-001.png` ～ `scene-042.png`
- `qa/visual-report.json`

- [x] Screenshot QA pipeline 已写入仓库。
- [ ] 首次 GitHub Actions 截图任务完成。
- [ ] 根据截图报告继续修正异常 Scene。
- [ ] 用户确认整片视觉。

### Garden / Emil 防回归

1. 连续 3 张主构图相同 → FAIL。
2. 只有文字卡片 + fade → FAIL。
3. 动画无法解释内容 / 空间 / 状态 / 反馈 → FAIL。
4. 一屏塞完整口播 → FAIL。
5. 恢复统一左右版式 → FAIL。
6. 主要阅读信息使用过小字体 → FAIL。
7. 元素越过 Stage 安全边界 / 遮挡核心信息 → FAIL。
8. 没有真实截图 QA 就宣布完成 → FAIL。

## Gate C · 整片 IndexTTS

状态：**CODE READY / WAITING REAL ZIP**

- [x] 整片 JSON 001～042 保持不变。
- [x] IndexTTS 仍由用户本机生成。
- [x] Project6 接收一个总 ZIP。
- [ ] Gate B 稳定后生成最终真实语音包。

## Gate D · 整片音画预览

状态：**CODE READY / WAITING REAL AUDIO**

- [x] 播放 / 暂停 / 继续 / 全屏 / 上一张 / 下一张 / Scene 跳转。
- [x] Pause 同时暂停 narration 与 GSAP timeline。
- [x] 本地音频注入优先于历史音频。
- [ ] 真实 IndexTTS 上传后按真实时长做 timing 微调。

## Gate E · 动画 SFX

状态：**LOCKED UNTIL D PASS**

SFX 仍只在整片音画通过后进入。

## Gate F · Stage-only 1080P 本地录制

状态：**CODE READY / BROWSER TEST REQUIRED**

### 必须满足

- [x] 一键录制按钮在播放器下方控制区。
- [x] 录制目标只允许 `.stage`。
- [x] 使用 Chromium Region Capture 精确裁切。
- [x] 不支持 Region Capture 时不允许退化成录整个后台。
- [x] 请求 1920×1080 / 60fps。
- [x] 低于 1080P 时拒绝录制并提示。
- [x] 视频 + 当前标签页音频。
- [x] VP9/Opus 优先。
- [x] 12Mbps video / 192kbps audio 目标码率。
- [x] 一键启动时自动从 Scene 001 开始播放。
- [x] END 自动停止；也支持手动停止。
- [x] 结果只浏览器下载 `.webm`。
- [x] 不上传服务器。
- [ ] 最新 Chrome / Edge 实机录制验证。

## 当前结论

v40 的视觉方向获得用户约 90 分评价；v41 不推翻 v40，而是把“开发完成后的真实截图检查、字体可读性、录制交付”补成正式生产门禁。

**下一步不是 TTS。下一步是先跑完 42 张 Screenshot QA，并继续修掉截图里暴露出来的细节问题。**

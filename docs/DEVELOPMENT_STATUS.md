# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components 学习层。

## 当前 Phase

**Phase 1 · Harness Engineering Garden v42 视觉精修 + 等比预览 + 本地录制**

## 用户最新硬要求

- Scene 001 主题必须以 **HARNESS ENGINEERING** 为主标题；
- Scene 002～042 保持逐 Scene 独立构图；
- 不能统一左右排版；
- 动画要解释内容本身；
- 字体与层级必须适合 1080P；
- 每一页开发完成后必须真实渲染截图检查；
- 窗口预览必须保持 16:9 等比缩放，不能全屏正常、缩小时错位；
- 一键录制只录中间 Stage，1080P + 标签页声音，不上传服务器；
- 当前 HTTP 服务器录制必须有不依赖 Cloudflare / 域名 / HTTPS 证书的低门槛方案。

## v42 已完成

### Cover / Readability

- [x] Scene 001 主标题改为 `HARNESS ENGINEERING`。
- [x] 中文问题改为副标题 / Hook。
- [x] 中文字体栈统一为 Noto Sans SC / PingFang SC / Microsoft YaHei / Source Han Sans SC。
- [x] 第一轮 QA 报告发现的 004 / 009 / 025 / 040 tiny text 已修。
- [x] 人工复核发现的 036 拥挤，以及 010 / 015 / 018 局部标签可读性问题已修。
- [x] 第二轮 QA 剩余 009 / 040 tiny text 已继续修到 0。

### Screenshot QA · 最终自动检查

- [x] Chromium 自动遍历 001～042。
- [x] 42/42 Scene 真实渲染并生成截图。
- [x] tiny text = **0**。
- [x] DOM overflow = **0**。
- [x] Console Errors = **0**。
- [x] 15 组缩放视口检查通过：1366×768 / 1440×900 / 1280×720 × Scene 001 / 009 / 025 / 036 / 042。
- [x] 响应式检查中 Stage 比例全部为 **1.7778 (16:9)**。
- [x] `stage-frame` 布局尺寸与实际 Stage 绘制尺寸全部一致。
- [x] 所有代表 Scene 在缩放模式下均保持在 viewer 内。
- [x] responsiveFails = **0**。

### 等比缩放修复

旧问题：只对 1920×1080 `.stage` 使用 `transform: scale()`，但外层布局仍按 1920×1080 原始尺寸占位。

v42：

```text
viewer
  ↓ 计算可用空间
stage-frame = 1920×scale × 1080×scale
  ↓
stage 固定 1920×1080
  ↓ transform-origin: 0 0
scale(scale)
```

因此窗口模式 / 缩放模式 / 全屏都使用同一套 16:9 坐标关系。

### HTTP 下的 1080P 本地录制

浏览器 `getDisplayMedia / Region Capture` 要求 secure context，因此服务器 HTTP IP 地址直接录制必然失败。

v42 正式方案：

- [x] 保留 Stage-only Region Capture。
- [x] 新增 `tools/project6-recording-localhost.py`。
- [x] 新增 `tools/start-project6-recording.bat`。
- [x] Windows 用户双击 BAT 后，将现有 Project6 HTTP 页面代理到 `127.0.0.1:28444`。
- [x] localhost 属于浏览器安全上下文，不需要域名 / Cloudflare / HTTPS 证书。
- [x] HTTP 页面点击录制时会明确提示 localhost 方案，不再只报“需要 HTTPS”。
- [x] 录制仍请求 1920×1080 / 60fps、标签页声音、VP9/Opus、高码率。
- [x] 结果只在浏览器下载 WebM，不上传服务器。
- [ ] 最后仍需用户在真实 Windows Chrome / Edge 上完成一次录制验收。

## TTS / 音频规则保持不变

- 一个完整视频项目；
- 一个完整 `full-tts-tasks.json`；
- 用户只复制一次；
- 本地 IndexTTS 生成 001～042；
- 一个总 ZIP 回传；
- Project6 自动匹配并注入。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | CODE PASS / WAITING USER CONFIRM | 用户确认整片口播 |
| B Garden v42 视觉 | **AUTOMATED QA PASS / USER REVIEW** | 用户最终视觉复核 |
| C 本地 IndexTTS | CODE READY / WAITING | Gate B 用户确认后生成真实总 ZIP |
| D 整片音画 | CODE READY / WAITING AUDIO | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | CODE READY / LOCALHOST BROWSER TEST | Windows Chrome/Edge 实机验收 |

## 当前下一步

1. 用户打开 v42 检查封面、缩放和整体视觉；
2. 用户确认后进入完整 IndexTTS JSON → 001～042；
3. 回传总 ZIP 后做真实音画 timing；
4. 最后添加 SFX，并在 localhost 录制入口完成 1080P 实机录制。

# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components 学习层。

## 当前 Phase

**Phase 1 · Harness Engineering Garden v41 视觉精修 + 自动截图 QA + 本地录制**

## 用户最新硬要求

- Scene 001 继续作为视觉 Anchor；
- Scene 002～042 保持逐 Scene 独立构图；
- 不能统一左右排版；
- 不能只是文字卡片；
- 动画要解释内容本身；
- 字体与层级必须适合 1080P 视频；
- 每一页开发完成后必须实际渲染截图检查；
- 增加只录中间 Stage 的一键 1080P 本地录制，带标签页声音，不上传服务器。

## v40 当前评价

用户评价约 90 分：整体方向已明显改善，但仍存在细节问题：部分字体偏小、层级和留白不够统一、个别 Scene 动画信息量不足、部分视觉与口播逻辑的衔接还需要继续 polish。

因此 v40 不作最终 PASS，进入 v41 视觉精修。

## v41 已完成代码改造

### Readability / Typography

- [x] 新建 `full-video-v41-polish.css`。
- [x] 正式中文字体栈统一为 Noto Sans SC / PingFang SC / Microsoft YaHei / Source Han Sans SC。
- [x] 主标题字号提高。
- [x] Compact 标题字号提高。
- [x] Scene 内主要 node / label / small text 提升到更适合 1080P 的尺寸。
- [x] HUD 与控制条重新平衡。

### Screenshot QA

- [x] 新建 `scripts/visual-qa.mjs`。
- [x] 新建 `.github/workflows/visual-qa.yml`。
- [x] 自动使用 Chromium 1920×1200 viewport 加载正式播放器。
- [x] 自动遍历 Scene 001～042。
- [x] 每 Scene 等待语义动画基本完成后截图 `#stage`。
- [x] 输出 42 张 1920×1080 PNG。
- [x] 自动检查 visible text 过小与 DOM overflow。
- [x] 输出 `qa/visual-report.json`。
- [ ] 等 GitHub Actions 首次执行完成后查看截图报告并继续返工异常 Scene。

### 本地 1080P 录制

- [x] 正式播放器增加 `● 一键录制 1080P`。
- [x] 新建 `full-video-v41-recording.js`。
- [x] 使用 `getDisplayMedia` 请求当前标签页视频 + 音频。
- [x] 使用 Region Capture (`CropTarget.fromElement(stage)` / `cropTo`) 精确裁到中间 `.stage`。
- [x] 不支持精确裁切时直接拒绝录整个后台。
- [x] 请求 1920×1080 / 60fps。
- [x] 低于 1080P 时明确拒绝并提示提升窗口/屏幕分辨率。
- [x] VP9/Opus 优先，12Mbps video + 192kbps audio。
- [x] 一键录制会回到 Scene 001 并开始整片播放。
- [x] 播放器到 END 后自动停止录制。
- [x] 也可以手动停止。
- [x] WebM 只在浏览器本地下载，不上传服务器。

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
| B Garden v41 视觉 | CODE POLISHED / QA RUNNING / USER REVIEW | 42 张 Screenshot QA + 用户复核 |
| C 本地 IndexTTS | CODE READY / WAITING | Gate B 稳定后生成真实总 ZIP |
| D 整片音画 | CODE READY / WAITING AUDIO | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | CODE READY / BROWSER TEST | Chrome/Edge 实机 Stage-only + Tab Audio 验收 |

## 当前唯一下一步

1. 等 Visual QA workflow 生成 42 张真实截图和 report；
2. 对截图里出现的小字 / 越界 / 失衡 Scene 继续返工；
3. 用户打开 v41 整片播放器复核；
4. 视觉稳定后才进入最终 IndexTTS 生成。

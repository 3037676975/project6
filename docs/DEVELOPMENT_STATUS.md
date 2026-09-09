# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v50**

## 当前唯一构建版本

- Product build：**v50**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=50`
- 专用录制页：`presentations/harness-engineering/record.html?v=50`
- 页面右上角必须显示 `P6 · v50`

## v50 当前能力

### Garden / Visual
- [x] 42 Scene 整片模式。
- [x] Scene 001：`HARNESS ENGINEERING` 主标题。
- [x] Scene 002～042 独立 visual / motion recipe。
- [x] 42/42 Screenshot QA 基线保留。
- [x] 普通预览与视频级全屏字号分层保留。

### Preview / Scaling / Sound
- [x] 逻辑 Stage 固定 1920×1080。
- [x] 窗口 / 缩放 / 全屏保持 16:9 坐标关系。
- [x] 播放 / 暂停 / 全屏 / Scene 跳转。
- [x] `声音开 / 声音关` 与 localStorage 记忆。

### Recording · v50
- [x] 正式 HTTPS 域名：`https://video.smilechat.cn`。
- [x] 放弃“先 Fullscreen 再打开共享弹窗”的方案；Chrome 权限弹窗会退出网页 Fullscreen，导致页面再次缩小。
- [x] 新增独立 `record.html`：整个标签页只有视频画面，不包含后台、工具栏和左右区域。
- [x] 正式播放器的录制按钮只负责打开专用录制页。
- [x] 专用录制页只要求用户在浏览器共享窗口选择“当前标签页”。
- [x] 不再使用 Region Crop / CropTarget。
- [x] 捕获后的标签页视频先进入隐藏 video，再由 1920×1080 Canvas 居中裁成 16:9。
- [x] 最终 MediaRecorder 录制的是 `canvas.captureStream(60)`，输出画布固定 1920×1080。
- [x] 原标签页音频轨道加入最终 Canvas 视频流。
- [x] 目标视频码率 18 Mbps，音频 192 kbps。
- [x] 录制开始自动回到 Scene 001，并启动整片动画。
- [x] 页面标题显示 REC 计时，不进入成片。
- [x] END 自动停止；浏览器停止共享自动停止；键盘 `S` / `Esc` 可手动停止。
- [x] 输出优先原生 MP4；不支持时使用真实 WebM。
- [ ] 用户实机验证 v50：画面不再缩回后台、成片只包含视频、动画完整、1080P Canvas 输出可正常播放。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v50 视觉 | REVIEW | 用户确认普通预览 / 大画面字号均不挤压 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | v50 专用录制页：只录视频区域、动画完整、1080P 输出、文件可播放 |

## 当前下一步

1. 从 v50 正式播放器点击“打开 1080P 录制”；
2. 在新开的专用录制页点击“开始 1080P 高清录制”；
3. 浏览器共享窗口选择“当前标签页”；
4. 录 10～20 秒后按 `S` / `Esc` 或浏览器停止共享；
5. 检查下载文件是否只有视频画面、没有后台、没有缩小布局、动画完整；
6. 录制 Gate 通过后继续最终 TTS 整包与 timing。

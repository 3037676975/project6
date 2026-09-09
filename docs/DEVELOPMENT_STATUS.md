# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v51**

## 当前唯一构建版本

- Product build：**v51**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=51`
- 专用录制页：`presentations/harness-engineering/record.html?v=51`
- 页面右上角必须显示 `P6 · v51`

## v51 当前能力

### Garden / Visual
- [x] 42 Scene 整片模式。
- [x] Scene 001：`HARNESS ENGINEERING` 主标题。
- [x] Scene 002～042 独立 visual / motion recipe。
- [x] 42/42 Screenshot QA 基线保留。
- [x] 普通预览与视频级大画面字号分层保留。

### Preview / Scaling / Sound
- [x] 逻辑 Stage 固定 1920×1080。
- [x] 窗口 / 缩放保持 16:9 坐标关系。
- [x] 播放 / 暂停 / Scene 跳转。
- [x] `声音开 / 声音关` 与 localStorage 记忆。

### Recording · v51
- [x] 正式 HTTPS：`https://video.smilechat.cn`。
- [x] 继续使用独立 `record.html`，不再依赖 Fullscreen API。
- [x] 录制页改为“黑色工作区 + 中间 16:9 成片框 + 底部常驻控制栏”。
- [x] 底部提供开始、停止、REC 计时、声音和状态控制；录制中仍可直接停止。
- [x] 最终 Canvas 不再按整个标签页居中裁 16:9。
- [x] v51 每帧读取 `.stage-frame.getBoundingClientRect()`，按成片框在当前标签页里的真实坐标映射到原始捕获视频。
- [x] 因此最终视频只裁中间成片框；底部控制栏和页面其余区域不进入成片。
- [x] 最终输出 Canvas 固定 1920×1080，`canvas.captureStream(60)`。
- [x] 视频目标码率 18 Mbps，音频 192 kbps。
- [x] 声音开启时把标签页音频轨加入最终输出；关闭时视频静音。
- [x] 录制开始自动回到 Scene 001 并播放。
- [x] END 自动停止；浏览器停止共享自动停止；底部“停止录制”可手动停止；S / Esc 也可停止。
- [x] 输出优先 MP4；浏览器不支持时使用真实 WebM。
- [ ] 用户实机验证 v51：最终文件只包含中间成片框、底部按钮不入镜、动画完整、文件可播放。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v51 视觉 | REVIEW | 用户确认预览和成片框中文字不挤压 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | v51：只录中间成片框、控制栏不入镜、动画完整、1080P 输出、文件可播放 |

## 当前下一步

1. 打开 `record.html?v=51`；
2. 确认页面中间只有一个明确 16:9 成片框，底部有常驻控制栏；
3. 点击开始，浏览器共享窗口选择“当前标签页”；
4. 录 10～20 秒后直接点击底部“停止录制”；
5. 检查下载文件：只应出现中间成片框，不应出现底部按钮、黑色工作区或浏览器其他区域；
6. 录制 Gate 通过后继续最终 TTS 整包与 timing。

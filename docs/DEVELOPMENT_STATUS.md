# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v49**

## 当前唯一构建版本

- Product build：**v49**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=49`
- 页面右上角必须显示 `P6 · v49`

## v49 当前能力

### Garden / Visual
- [x] 42 Scene 整片模式。
- [x] Scene 001：`HARNESS ENGINEERING` 主标题。
- [x] Scene 002～042 独立 visual / motion recipe。
- [x] 42/42 Chromium Screenshot QA 基线保留。
- [x] 非全屏预览启用更紧凑字号层级，减少文字挤压与上下错位。
- [x] 全屏时恢复视频级大字号，保证录制画面视觉冲击。

### Preview / Scaling / Sound
- [x] 逻辑 Stage 固定 1920×1080。
- [x] 窗口 / 缩放 / 全屏保持 16:9 坐标关系。
- [x] 播放 / 暂停 / 全屏 / Scene 跳转。
- [x] `声音开 / 声音关` 控件与 localStorage 记忆。

### Recording · v49
- [x] 正式 HTTPS 域名：`https://video.smilechat.cn`。
- [x] 不再使用 Region Crop。
- [x] **两步式录制门禁**：先进入视频全屏，再点击全屏中央“开始 1080P 高清录制”。
- [x] 浏览器共享弹窗只需选择“当前标签页”。
- [x] 全屏中央录制按钮在真正捕获开始前自动隐藏，不进入成片。
- [x] 捕获对象为全屏当前标签页，避免缩小预览框直接参与录制。
- [x] 实际读取 capture track 的 width / height / frameRate。
- [x] 若实际捕获低于 1920×1080，直接拒绝继续，不伪装成 1080P。
- [x] 目标 18 Mbps 视频码率、192 kbps 音频码率。
- [x] 录制开始自动回到 Scene 001。
- [x] REC 计时保留。
- [x] END、浏览器停止共享、退出全屏均进入统一停止流程。
- [x] 输出优先 MP4；不支持原生 MP4 时使用真实 WebM。
- [ ] 用户实机验证 v49：全屏门禁、1080P 分辨率、动画完整、文件可播放。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v49 视觉 | REVIEW | 用户确认非全屏/全屏两套字号均不挤压 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | v49 全屏录制：真实 1920×1080+、动画完整、文件可播放 |

## 当前下一步

1. 打开 v49 正式播放器；
2. 点击“一键录制” → 先进入视频全屏；
3. 在全屏中央点击“开始 1080P 高清录制”；
4. 浏览器共享弹窗选择“当前标签页”；
5. 若捕获低于 1920×1080，系统直接提示；
6. 录 10～20 秒验证画面与动画；
7. 同时检查非全屏字体是否不再挤压、全屏字体是否恢复更大层级。

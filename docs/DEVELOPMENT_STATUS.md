# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v48**

## 当前唯一构建版本

- Product build：**v48**
- 单一版本源：`assets/version.js`
- 正式作品页：`works.html?v=48`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=48`
- 页面右上角必须显示 `P6 · v48`
- 以后发布新版本必须同步：版本源、页面缓存参数、作品 Gate、验收、开发状态。

## v48 当前能力

### Garden / Visual
- [x] 42 Scene 整片模式。
- [x] Scene 001：`HARNESS ENGINEERING` 主标题。
- [x] Scene 002～042 独立 visual / motion recipe。
- [x] 42/42 Chromium Screenshot QA。
- [x] tiny text = 0。
- [x] DOM overflow = 0。
- [x] Console Errors = 0。
- [x] 1280 / 1366 / 1440 响应式 16:9 检查通过。

### Preview / Scaling / Sound
- [x] 逻辑 Stage 固定 1920×1080。
- [x] `stage-frame` 同步缩放后的真实占位尺寸。
- [x] 窗口 / 缩放 / 全屏保持同一 16:9 坐标关系。
- [x] 播放 / 暂停 / 全屏 / Scene 跳转。
- [x] `声音开 / 声音关` 控件与 localStorage 记忆。

### TTS / Audio
- [x] 一个完整 `full-tts-tasks.json`。
- [x] 用户一次复制 001～042。
- [x] 一个总 ZIP 回传。
- [x] JSZip / 多选音频导入。
- [x] 新本地 IndexTTS 优先于历史音频。
- [ ] 等用户上传最终真实整包后做 timing 微调。

### Recording · v48
- [x] 正式 HTTPS 域名：`https://video.smilechat.cn`。
- [x] **删除 Region Crop 作为正式录制链路**；v47 在用户设备上出现录制文件只有底色、主体动画丢失。
- [x] 点击录制时，从同一个用户手势触发 `stage-frame` 全屏 + 当前标签页捕获。
- [x] 录制对象改为“全屏当前标签页”，避免 GPU/DOM 裁剪层产生空白视频。
- [x] 录制开始前自动回到 Scene 001，再启动整片播放。
- [x] 实际读取 capture track 的 width / height / frameRate。
- [x] 若实际捕获低于 1920×1080，直接提示并拒绝伪装成 1080P。
- [x] 目标 16 Mbps 视频码率、192 kbps 音频码率。
- [x] 声音开关控制是否请求标签页音频。
- [x] REC 计时保留；录制时 document.title 同步 `REC HH:MM:SS`。
- [x] END 自动停止；浏览器“停止共享”自动停止；退出全屏也自动停止。
- [x] 输出优先原生 MP4；浏览器不支持时使用真实 WebM，不伪装扩展名。
- [x] 文件只在浏览器本地下载，不上传服务器。
- [ ] 用户实机验证 v48：录制画面不再空白、主体动画完整、实际分辨率达到 1080P、文件可正常播放。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v48 视觉 | REVIEW | 自动 QA 已通过，等待用户最终视觉确认 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | 用户实机确认 v48 全屏标签页录制：画面完整、1080P、文件可播放 |

## 当前下一步

1. 用户测试 v48：点击一次录制，在浏览器弹窗中选择“当前标签页”；
2. Project6 自动进入全屏录制模式并从 Scene 001 开始；
3. 先录 10～20 秒，使用浏览器顶部“停止共享”或退出全屏停止；
4. 检查下载文件是否包含真实动画，而不是只有背景底色；
5. 录制 Gate 通过后继续最终 TTS 整包与 timing。

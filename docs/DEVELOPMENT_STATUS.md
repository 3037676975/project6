# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v53**

## 当前唯一构建版本

- Product build：**v53**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=53`
- 专用录制页：`presentations/harness-engineering/record.html?v=53`
- 页面右上角必须显示 `P6 · v53`

## Recording Console · v53

- [x] 黑色工作区 + 中间 16:9 成片框 + 底部常驻控制台。
- [x] Canvas 每帧按 `.stage-frame` 真实坐标精确裁切，最终只录中间成片框。
- [x] REC 状态只显示在控制台，不进入成片。
- [x] **v53 删除“可见按钮 → 隐藏按钮”的代理桥接。**
- [x] 可见 `上一页 / 自动播放 / 暂停 / 下一页` 直接使用播放器真实 `prevBtn / playBtn / pauseBtn / nextBtn` ID，由 Garden 播放器本身绑定。
- [x] 旁白开关继续可用。
- [x] 本地配乐：选择文件、显示文件名与时长、播放/暂停、音量控制。
- [x] 配乐是否播放由独立 `musicWanted` 状态维护，录制开始时按用户选择从 0 秒播放。
- [x] 开始 / 停止录制、REC 计时、状态显示。
- [x] 最终输出固定 1920×1080，`canvas.captureStream(60)`。
- [x] 目标视频码率 18 Mbps，音频 192 kbps。
- [ ] 用户实机验证 v53：上一页、下一页、自动播放、暂停均可直接工作；配乐状态正确；最终文件只含中间成片。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v53 视觉 | REVIEW | 用户最终确认视觉 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | v53 真实播放器控制可用、控制不入镜、成片仅中间 16:9、文件可播放 |

## 当前下一步

1. 打开 `record.html?v=53`；
2. 不录制也先测试：上一页、自动播放、暂停、下一页必须都能工作；
3. 选择一首本地配乐，验证文件名/时长、播放/暂停和音量；
4. 再开始录制 10～20 秒；
5. 检查下载文件只含中间 16:9 成片框。
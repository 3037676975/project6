# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v52**

## 当前唯一构建版本

- Product build：**v52**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=52`
- 专用录制页：`presentations/harness-engineering/record.html?v=52`
- 页面右上角必须显示 `P6 · v52`

## v52 当前能力

### Garden / Visual
- [x] 42 Scene 整片模式。
- [x] Scene 001：`HARNESS ENGINEERING` 主标题。
- [x] Scene 002～042 独立 visual / motion recipe。
- [x] Screenshot QA 基线保留。

### Recording Console · v52
- [x] 黑色工作区 + 中间 16:9 成片框 + 底部常驻控制台。
- [x] Canvas 每帧按 `.stage-frame` 的真实坐标精确裁切；最终只录中间成片框。
- [x] 删除成片框内部的 `RECORDING` 提示，任何 REC 状态都只显示在底部控制台，不进入成片。
- [x] 新增上一页 / 下一页。
- [x] 新增自动播放 / 暂停控制。
- [x] 新增旁白开关。
- [x] 新增本地配乐选择、配乐播放 / 暂停、配乐音量。
- [x] 新增开始 / 停止录制、REC 计时、状态显示。
- [x] 所有控制均位于 `.stage-frame` 外，因此不进入最终 1920×1080 Canvas。
- [x] 最终输出 Canvas 固定 1920×1080，`canvas.captureStream(60)`。
- [x] 目标视频码率 18 Mbps，音频 192 kbps。
- [x] 共享当前标签页音频时，旁白与本地配乐均可随标签页音频进入录制。
- [x] END、浏览器停止共享、底部停止按钮、S / Esc 均可停止。
- [ ] 用户实机验证 v52：红色录制状态不入镜、控制完整、配乐可控、最终文件只含中间成片。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v52 视觉 | REVIEW | 用户最终确认视觉 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | v52 控制台完整、控制不入镜、成片仅中间 16:9、文件可播放 |

## 当前下一步

1. 打开 `record.html?v=52`；
2. 检查底部是否有：上一页、自动播放、暂停、下一页、旁白、选择配乐、配乐播放、音量、开始/停止录制、计时；
3. 录 10～20 秒；
4. 下载文件中不得出现红色 `RECORDING`、底部控制栏或黑色工作区；
5. 验证手动翻页、暂停、配乐与停止录制均可用。

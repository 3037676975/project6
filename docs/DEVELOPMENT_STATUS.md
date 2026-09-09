# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v55**

## 当前唯一构建版本

- Product build：**v55**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=55`
- 专用录制页：`presentations/harness-engineering/record.html?v=55`
- 页面右上角必须显示 `P6 · v55`

## Recording Console · v55

- [x] 黑色工作区 + 中间 16:9 成片框 + 底部常驻控制台。
- [x] Canvas 每帧按 `.stage-frame` 真实坐标精确裁切，最终只录中间成片框。
- [x] REC 状态和所有控制均在成片框外，不进入最终视频。
- [x] **v55 不再依赖主播放器内部 `playing / paused` 私有状态来驱动录制页控制。**
- [x] 上一页 / 下一页直接更新 Scene 进度并触发渲染。
- [x] 自动播放由录制页独立 6.5s Scene 定时器驱动；暂停画面停止自动推进并暂停 GSAP globalTimeline。
- [x] 录制与画面播放彻底独立：录制开始/暂停/继续不会修改 Scene 播放状态。
- [x] 录制控制补齐四态：开始录制、暂停/继续录制、停止并保存、取消并丢弃。
- [x] 暂停录制使用 `MediaRecorder.pause()/resume()`；暂停期间不计入 REC 有效时长。
- [x] 取消录制停止流并丢弃 Blob，不生成下载文件。
- [x] 旁白开关、本地配乐选择/播放/暂停/音量继续可用。
- [x] 最终输出固定 1920×1080，`canvas.captureStream(60)`，目标 18 Mbps / 192 kbps。
- [ ] 用户实机验证 v55：录制开始后，自动播放/暂停画面/上一页/下一页均可独立工作；录制暂停/继续/停止/取消均可用。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v55 视觉 | REVIEW | 用户最终确认视觉 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | v55 播放器控制与录制控制互不锁定；取消不保存；成片仅中间 16:9；文件可播放 |

## 当前下一步

1. 打开 `record.html?v=55`；
2. 不录制时先测试上一页 / 下一页 / 自动播放 / 暂停画面；
3. 点击开始录制并选择当前标签页；
4. 录制中再次测试上一页 / 下一页 / 自动播放 / 暂停画面；
5. 测试“暂停录制 → 继续录制”；
6. 测试“停止并保存”；另做一次“取消录制”，确认不下载文件；
7. 检查最终成片只含中间 16:9 视频。
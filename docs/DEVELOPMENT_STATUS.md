# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v54**

## 当前唯一构建版本

- Product build：**v54**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=54`
- 专用录制页：`presentations/harness-engineering/record.html?v=54`
- 页面右上角必须显示 `P6 · v54`

## Recording Console · v54

- [x] 黑色工作区 + 中间 16:9 成片框 + 底部常驻控制台。
- [x] Canvas 每帧按 `.stage-frame` 真实坐标精确裁切，最终只录中间成片框。
- [x] REC 状态和所有控制均在成片框外，不进入最终视频。
- [x] `上一页 / 自动播放 / 暂停 / 下一页` 为 Garden 播放器真实按钮。
- [x] **v54 把录制状态与播放器状态彻底解耦。**
- [x] 开始录制只启动 MediaRecorder，不再自动 pause / reset / play，不再修改播放器的 `playing / paused` 状态。
- [x] 录制开始后由用户手动点击“自动播放”；暂停、上一页、下一页保持独立可用。
- [x] 播放状态栏实时显示 `待播放 / 自动播放中 / 已暂停 / 已结束 + Scene 编号`。
- [x] 旁白开关、本地配乐选择/播放/暂停/音量继续可用。
- [x] 最终输出固定 1920×1080，`canvas.captureStream(60)`，目标 18 Mbps / 192 kbps。
- [ ] 用户实机验证 v54：开始录制后再点自动播放可以启动；暂停、上一页、下一页在录制中仍可工作。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v54 视觉 | REVIEW | 用户最终确认视觉 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 1080P 本地录制 | REVIEW | v54 录制与播放器互不锁定；控制不入镜；成片仅中间 16:9；文件可播放 |

## 当前下一步

1. 打开 `record.html?v=54`；
2. 先点击“开始录制”并选择当前标签页；
3. 录制真正开始后，再手动点击“自动播放”；
4. 检查状态栏是否从 `待播放` 变为 `自动播放中`；
5. 测试暂停、上一页、下一页；
6. 录 10～20 秒后停止，检查最终成片。
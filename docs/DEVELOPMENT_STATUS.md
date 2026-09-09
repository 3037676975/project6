# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v59**

## 当前唯一构建版本

- Product build：**v59**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=59`
- 录制控制台：`presentations/harness-engineering/record.html?v=59`
- 纯成片窗口：`presentations/harness-engineering/capture.html?v=59`
- 页面版本必须统一显示 `P6 · v59`

## Recording Architecture · v59

- [x] 废弃“成片 + 控制台同页”的正式录制架构。
- [x] 新增纯成片窗口 `capture.html`：只加载正式播放器同一套 CSS、数据、Garden 播放器、hotfix、v42 layout；不加载录制控制台深色样式。
- [x] 新增独立录制控制台 `record.html`：播放控制、旁白、配乐、画质、开始/暂停/停止/取消录制全部在控制窗口中。
- [x] 控制台与纯成片窗口通过 `BroadcastChannel('project6-harness-v59')` 同步上一页、下一页、播放、暂停、旁白与状态。
- [x] 本地配乐通过浏览器本地 structured clone 发送到成片窗口，不上传服务器。
- [x] 录制时要求选择 `Project6 v59 · Harness Capture Surface` 成片标签页，而不是控制台。
- [x] 最终 Canvas 仅处理纯成片标签页视频源，不再按工作台 `.stage-frame` 坐标裁切。
- [x] 输出档位：1080P 24 Mbps / 1440P 40 Mbps / 4K 65 Mbps；目标 60fps。
- [x] 显示真实 `SOURCE width×height → OUTPUT width×height`，源低于输出时明确提示存在放大。
- [x] 开始/暂停/继续/停止并保存/取消并丢弃继续独立可用。
- [ ] 用户实机验证 v59：正式播放器与 capture.html 的 Scene 001～004 字体、标题颜色、布局一致。
- [ ] 用户实机验证 v59：成片窗口最大化后 SOURCE 达到设备允许的最高分辨率，最终录像无工作台、无按钮、无版本浮层污染。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v59 视觉 | REVIEW | 正式播放器与纯成片窗口视觉一致，用户最终确认 |
| C 本地 IndexTTS | WAITING | 用户生成并上传真实 001～042 总 ZIP |
| D 整片音画 | WAITING | 真实音频注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 高清本地录制 | REVIEW | v59 双窗口录制稳定；SOURCE/OUTPUT 可见；控制台不入镜；文件可播放 |

## 当前下一步

1. 打开 `record.html?v=59`，系统会自动打开 `capture.html?v=59` 成片窗口；
2. 最大化成片窗口，先核对 Scene 001、002、003、004 与正式播放器的字体、颜色、布局；
3. 在控制台测试上一页 / 下一页 / 自动播放 / 暂停；
4. 选择 1080P 开始录制，在共享选择器里选择 `Project6 v59 · Harness Capture Surface`；
5. 查看 SOURCE → OUTPUT；
6. 录 10～20 秒后停止并检查文件，仅含纯成片画面。
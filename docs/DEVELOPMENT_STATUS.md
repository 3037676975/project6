# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v62**

## 当前唯一构建版本

- Product build：**v62**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=62`
- 录制控制台：`presentations/harness-engineering/record.html?v=62`
- 纯成片窗口：`presentations/harness-engineering/capture.html?v=62`
- 页面版本必须统一显示 `P6 · v62`

## TTS Voice Source Library · v62

- [x] ZIP 持久保存到当前浏览器 IndexedDB；单个 MP3/WAV/M4A/OGG 仅临时使用。
- [x] 一个 ZIP = 一个独立配音源，可保存多个版本并试听/切换/删除。
- [x] 正式播放器通过 `P6_LOCAL_AUDIO` 把 001～042 真正注入 Garden 原生 `localAudio`，不再只修改 `<audio src>`。
- [x] 旁白默认开启，不再要求纯成片窗口额外点击“启用旁白声音”。

## Recording Architecture · v62

- [x] 控制台与成片窗口继续双窗口分离。
- [x] 控制台、Capture Surface、配音模块统一使用稳定通道 `project6-harness-control`；版本升级不再改变通信通道。
- [x] TTS 在录制控制台直接播放，避免 Chrome 跨窗口自动播放限制。
- [x] 用户点击“自动播放”就是实际用户手势，因此可直接播放当前配音源。
- [x] 录制页预创建 TTS Web Audio 混音流，支持“先开始录制，再点自动播放”。
- [x] 最终录制流混合 Capture 画面/标签页音频与 TTS 音轨。
- [x] 输出档位：1080P 24 Mbps / 1440P 40 Mbps / 4K 65 Mbps。
- [x] 开始 / 暂停 / 继续 / 停止并保存 / 取消并丢弃独立可用。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v62 视觉 | REVIEW | 正式播放器与纯成片窗口视觉一致 |
| C 本地 IndexTTS / 配音源库 | REVIEW | ZIP 保存、多源切换、原生播放器注入实机通过 |
| D 整片音画 | REVIEW | 自动播放 001～042 旁白与 Scene 同步 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 高清本地录制 | REVIEW | “先开始录制→再自动播放”导出文件仍有 TTS 声音 |

## 当前测试顺序

1. 打开 `record.html?v=62`；
2. 选择一个已保存配音源；
3. 不需要任何声音解锁步骤；
4. 先直接点“自动播放”，确认 Scene 001 有声音；
5. 再测试：先开始录制 → 选择 Capture Surface → 再点自动播放；
6. 录 10～20 秒停止，确认最终文件有当前配音源声音。

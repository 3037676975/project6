# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v61**

## 当前唯一构建版本

- Product build：**v61**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=61`
- 录制控制台：`presentations/harness-engineering/record.html?v=61`
- 纯成片窗口：`presentations/harness-engineering/capture.html?v=61`
- 视频作品页：`works.html?v=61`
- 页面版本必须统一显示 `P6 · v61`

## TTS Voice Source Library · v61

- [x] ZIP 持久保存到当前浏览器 IndexedDB；单个 MP3/WAV/M4A/OGG 仅临时使用。
- [x] 一个 ZIP = 一个独立配音源，可保存多个版本并试听/切换/删除。
- [x] 当前配音源选择写入 `project6.harness.voice.active`。
- [x] 录制控制台可选择已保存配音源。
- [x] **v61 修复：配音源选择器与纯成片窗口统一使用当前实际通信通道，解决“选择成功但 capture 没收到”的问题。**
- [x] **v61 修复：纯成片窗口处理 `voice-source` 消息并立即重新加载当前 Scene 对应的 001～042 旁白。**
- [x] **v61 增加 Chrome 音频解锁：纯成片窗口首次显示“🔊 启用旁白声音”，用户点一次后自动隐藏。**
- [x] 录制控制台显示“声音未解锁 / ✓ 声音已解锁”。

## Recording Architecture · v61

- [x] 双窗口架构继续保留：控制台负责操作，Capture Surface 负责纯成片画面与音频。
- [x] 录制时仍要求选择 `Project6 v61 · Harness Capture Surface` 标签页。
- [x] 必须勾选“分享标签页音频”，否则最终录像不会带旁白/配乐。
- [x] 输出档位：1080P 24 Mbps / 1440P 40 Mbps / 4K 65 Mbps；目标 60fps。
- [x] 开始 / 暂停 / 继续 / 停止并保存 / 取消并丢弃独立可用。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v61 视觉 | REVIEW | 正式播放器与纯成片窗口视觉一致 |
| C 本地 IndexTTS / 配音源库 | REVIEW | ZIP 保存、多源切换、录制控制台选择、Capture 旁白实机通过 |
| D 整片音画 | WAITING | 当前选定配音源 001～042 注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 高清本地录制 | REVIEW | v61 旁白 + 配乐 + 画面进入最终文件且可播放 |

## 当前下一步

1. 打开 `record.html?v=61`；
2. 选择一个已保存配音源；
3. 切到自动打开的纯成片窗口，点一次“🔊 启用旁白声音”；
4. 回控制台确认显示“✓ 声音已解锁”；
5. 先不录制，点“自动播放”确认能听到 Scene 001 旁白；
6. 再开始录制，选择 `Project6 v61 · Harness Capture Surface` 并勾选“分享标签页音频”；
7. 录 10～20 秒检查最终文件有旁白。
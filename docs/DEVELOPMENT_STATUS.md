# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v60**

## 当前唯一构建版本

- Product build：**v60**
- 单一版本源：`assets/version.js`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=60`
- 录制控制台：`presentations/harness-engineering/record.html?v=60`
- 纯成片窗口：`presentations/harness-engineering/capture.html?v=60`
- 视频作品页：`works.html?v=60`
- 页面版本必须统一显示 `P6 · v60`

## TTS Voice Source Library · v60

- [x] 新增浏览器本地 IndexedDB 配音源库：`project6-voice-library`。
- [x] **只有 ZIP 才持久保存。** 上传单个 MP3 / WAV / M4A / OGG 只作为当次临时音频，不写入配音源库。
- [x] 一个 ZIP = 一个独立配音源，自动命名 `配音源 1 / 配音源 2 / 配音源 3 ...`。
- [x] 保存原 ZIP Blob、ZIP 文件名、创建时间、001～042 解压音频 Blob、完整度。
- [x] 支持 ZIP 子目录，并自动匹配 `001`～`042`。
- [x] 视频作品页可查看所有已保存配音源、设为当前、试听 001～004、删除。
- [x] 当前配音源选择写入 `project6.harness.voice.active`，刷新后继续使用。
- [x] 录制控制台新增“配音源”选择模块，可直接切换已保存 ZIP，不需要重新上传。
- [x] 正式播放器和纯成片窗口根据当前 Scene 自动从 IndexedDB 读取对应旁白。
- [x] 配音源仅保存在当前浏览器/当前设备，不上传 Project6 服务器，也不写入 GitHub。
- [x] 尝试申请浏览器 Persistent Storage，降低存储被自动清理概率；用户主动清理站点数据仍会删除本地配音源。

## Recording Architecture · v60

- [x] 保留 v59 双窗口架构：纯成片窗口和控制窗口分离。
- [x] 控制台与纯成片窗口统一使用 `BroadcastChannel('project6-harness-v60')`。
- [x] 成片窗口只负责 Garden 画面、旁白和配乐，不加载控制台深色 UI。
- [x] 输出档位：1080P 24 Mbps / 1440P 40 Mbps / 4K 65 Mbps；目标 60fps。
- [x] 显示真实 `SOURCE width×height → OUTPUT width×height`。
- [x] 开始 / 暂停 / 继续 / 停止并保存 / 取消并丢弃独立可用。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden v60 视觉 | REVIEW | 正式播放器与纯成片窗口视觉一致，用户最终确认 |
| C 本地 IndexTTS / 配音源库 | REVIEW | ZIP 持久保存、单片不保存、多配音源切换及试听实机通过 |
| D 整片音画 | WAITING | 当前选定配音源 001～042 注入 + timing 调整 |
| E 动画 SFX | LOCKED | D PASS 后进入 |
| F 高清本地录制 | REVIEW | 双窗口录制稳定；当前配音源旁白正确进入录制；文件可播放 |

## 当前下一步

1. 打开 `works.html?v=60`；
2. 上传一个完整 001～042 ZIP，确认自动出现“配音源 1”；
3. 刷新页面，确认“配音源 1”仍然存在；
4. 再上传第二个 ZIP，确认出现“配音源 2”，且两者可单独试听和切换；
5. 单独上传一个 MP3，刷新后确认它没有进入配音源库；
6. 打开 `record.html?v=60`，从“配音源”选择器切换源，再打开纯成片窗口测试旁白；
7. 最后进行 10～20 秒录制实机验证。
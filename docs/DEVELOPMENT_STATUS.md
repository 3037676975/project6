# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden CHAPTER-CRAFT → Project6 motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v63**

当前策略：**停止扩展大模块，优先跑通第一支完整视频。**

## 当前唯一构建版本

- Product build：**v63**
- 单一版本源：`assets/version.js`
- 后台共享视觉层：`assets/admin-ui-v63.css`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=63`
- 录制控制台：`presentations/harness-engineering/record.html?v=63`
- 纯成片窗口：`presentations/harness-engineering/capture.html?v=63`
- 页面版本必须统一显示 `P6 · v63`

## Backend UI · v63

- [x] 首页重构为 Editorial Production Console / 创作控制台。
- [x] 作品页保留原功能并统一视觉层级。
- [x] 新增共享后台样式 `assets/admin-ui-v63.css`。
- [x] 颜色只服务状态与重点，减少无意义渐变和模板化卡片。
- [x] 增加键盘 focus 与 reduced-motion 基础处理。
- [x] 删除独立 `audio.html` 动画音效库。
- [x] Gate E 改为“项目内 SFX / BGM”，只在 Gate D PASS 后进入。
- [ ] 组件库 / 动效库 / Garden 手册 / 项目总纲最终视觉回归检查。

## TTS Voice Source Library

- [x] ZIP 持久保存到当前浏览器 IndexedDB；单个 MP3/WAV/M4A/OGG 仅临时使用。
- [x] 一个 ZIP = 一个独立配音源，可保存多个版本并试听/切换/删除。
- [x] 正式播放器通过 `P6_LOCAL_AUDIO` 把 001～042 真正注入 Garden 原生 `localAudio`，不再只修改 `<audio src>`。
- [x] 旁白默认开启，不再要求纯成片窗口额外点击“启用旁白声音”。

## Recording Architecture

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
| B Garden 视觉 | REVIEW | 正式播放器与纯成片窗口视觉一致 |
| C 本地 IndexTTS / 配音源库 | REVIEW | ZIP 保存、多源切换、原生播放器注入实机通过 |
| D 整片音画 | REVIEW | 自动播放 001～042 旁白与 Scene 同步 |
| E 项目内 SFX / BGM | LOCKED | D PASS 后进入；不再维护独立音效库 |
| F 高清本地录制 | REVIEW | “先开始录制→再自动播放”导出文件仍有 TTS 声音 |

## 当前测试顺序

1. 打开 `works.html?v=63`，确认后台 UI、版本和入口无旧音效库；
2. 打开 `record.html?v=63`；
3. 选择一个已保存配音源；
4. 先直接点“自动播放”，确认 Scene 001 有声音；
5. 再测试：先开始录制 → 选择 Capture Surface → 再点自动播放；
6. 录 10～20 秒停止，确认最终文件有当前配音源声音；
7. Gate D 通过后才进入项目内 SFX / BGM。

## 本轮 Acceptance

### UI
- [x] 首页不再展示独立音效库。
- [x] 作品页不再链接 `audio.html`。
- [x] README 已建立并详细说明产品、架构、流程、部署与开发规则。
- [x] `assets/version.js` 已升级 v63。
- [x] 原 TTS / Garden / 预览 / 录制功能未主动删除。

### 仍需实机确认
- [ ] 正式部署后浏览器是否拿到 v63 新 CSS，缓存无旧版污染。
- [ ] 作品页 ZIP 导入与 42/42 注入实际可用。
- [ ] 录制输出文件仍包含当前配音源声音。

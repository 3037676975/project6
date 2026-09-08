# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE。

## 当前 Phase

**Phase 1 · Harness Engineering 第一章 + 本地 IndexTTS 交接验收**

## 当前状态

- 后台：作品优先结构已建立。
- `studio.html`：已删除。
- 视频工作台：已废弃。
- 第一章 Garden v22：代码完成，待用户逐张确认。
- 口播稿：6/6 完整。
- 正式 TTS 交接：本地 IndexTTS 2.5。
- `tts-tasks.json`：已创建。
- ZIP 导入：作品页浏览器端 JSZip 方案。
- 本地音画预览：必须保留，不要求录制。
- 动画音效：最后阶段，当前 LOCKED。
- Garden 手册：必须修复为真实页面。
- 项目总纲：必须与最新产品结构一致。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 口播稿 | PASS / RECONFIRM | 用户确认当前 6 段口播 |
| B Garden 画面 | REVIEW | 用户逐张确认第1～6张 |
| C 本地 IndexTTS | WAITING | 上传真实本地配音 ZIP，6/6 匹配 |
| D 本地音画预览 | WAITING | 真实声音 + 画面顺序预览通过 |
| E 动画音效 | LOCKED | D PASS 后才开放 |
| F 第二章 | LOCKED | 第一章全部 Gate PASS |

## 已完成

- [x] 删除旧视频工作台入口。
- [x] 视频作品成为核心项目入口。
- [x] 第一章 6 张 Garden 画面保留。
- [x] 作品内展示 6 段口播。
- [x] 创建 `presentations/harness-engineering/tts-tasks.json`。
- [x] 更新第一章 `ACCEPTANCE.md` 到 v23。
- [x] 更新 PROJECT_CHARTER / PRD / ACTIVE_DECISIONS。

## 本轮仍需验证

- [ ] `garden.html` 真实可打开。
- [ ] `charter.html` 不再出现旧 studio / 旧路由。
- [ ] 作品页始终可看 TTS JSON 预览。
- [ ] 口播未确认时复制按钮锁定；确认后解锁。
- [ ] ZIP 自动解压并匹配 001～006。
- [ ] 本地音画预览可用。
- [ ] 动画音效库有真实 Kenney 来源和真实可试听声音。
- [ ] 后台无旧页面回跳。

## 当前唯一下一步

用户在视频作品中确认口播稿，然后复制 JSON 到本地 IndexTTS 2.5 工作台生成第一批真实配音。

第一章未最终 PASS 前，不进入第二章。

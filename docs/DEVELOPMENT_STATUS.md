# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE。

## 当前 Phase

**Phase 1 · Harness Engineering 第一章 + 本地 IndexTTS 交接验收**

## 当前状态

- 后台：作品优先结构已完成。
- `studio.html`：已删除。
- 视频工作台：已废弃。
- 旧 `projects.html` / `create.html`：已改为新入口，不再跳旧 hash 页面。
- 第一章 Garden v22：代码完成，待用户逐张确认。
- 口播稿：6/6 完整。
- Canonical TTS JSON：`presentations/harness-engineering/tts-tasks.json` 已存在。
- TTS JSON 预览：作品页始终可见。
- TTS JSON 一键复制：口播确认后解锁。
- ZIP 导入：作品页支持浏览器 JSZip 解压。
- 音频映射：001～006 自动匹配第1～6张。
- 本地音画预览：保留，不要求录制。
- 动画音效：最后阶段。
- 动画音效库：已接入真实 Kenney UI / Interface Sounds 来源与可试听 CC0 样本。
- Garden 手册：已修复为真实中文手册页。
- 项目总纲：Markdown 与可视化页面均更新到 v2.0。
- PRD / Active Decisions / Acceptance：已同步最新流程。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 口播稿 | PASS / RECONFIRM | 用户确认当前 6 段口播 |
| B Garden 画面 | REVIEW | 用户逐张确认第1～6张 |
| C 本地 IndexTTS | WAITING | 上传真实本地配音 ZIP，6/6 匹配 |
| D 本地音画预览 | WAITING | 真实声音 + 画面顺序预览通过 |
| E 动画音效 | LOCKED | D PASS 后才最终选择 |
| F 第二章 | LOCKED | 第一章全部 Gate PASS |

## 本轮修复验收

- [x] 第一章验收规则更新到 v23。
- [x] 开发状态更新。
- [x] 项目总纲 v2.0 更新。
- [x] PRD v2.0 更新。
- [x] Active Decisions 更新。
- [x] 真实 `tts-tasks.json` 创建。
- [x] 作品页显示当前 Gate、验收规则、开发状态入口。
- [x] TTS JSON 可见预览 + 确认后复制。
- [x] Garden 手册恢复正常。
- [x] Kenney 动画 SFX 真资源目录 + 真试听。
- [x] legacy projects/create 路由停止跳旧页面。

## 当前唯一下一步

用户在视频作品中确认口播稿，然后复制 JSON 到本地 IndexTTS 2.5 工作台生成第一批真实配音，再把 ZIP 上传回来进行 6/6 匹配和本地预览。

第一章未最终 PASS 前，不进入第二章。

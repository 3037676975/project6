# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden → motions/components。

## 当前 Phase

**Phase 1 · 多视频结构已启用 · Project6 v64**

当前策略：**保留 Project 001 Harness Engineering 原业务状态，同时新增 Project 002 AIGC 小黑云，并按“先 Visual Anchor、验收后批量”的方式开发。**

## 当前唯一构建版本

- Product build：**v64**
- 单一版本源：`assets/version.js`
- 视频项目库：`works.html?v=64`
- Harness 独立详情：`project-harness-engineering.html?v=64`
- 小黑云独立详情：`project-aigc-xiaoheiyun-agent.html?v=64`
- Harness 项目目录：`presentations/harness-engineering/`
- 小黑云项目目录：`presentations/aigc-xiaoheiyun-agent/`

## Multi-project Architecture · v64

- [x] `works.html` 是真正的视频项目库。
- [x] Harness Engineering 保持 Project 001 独立项目。
- [x] AIGC 小黑云作为 Project 002 新增，不覆盖 Project 001。
- [x] Project 002 已建立独立详情页与 `presentations/aigc-xiaoheiyun-agent/`。
- [x] Project 002 已建立独立 full-video / data / TTS draft / capture / record / ACCEPTANCE。
- [x] 新项目必须使用独立 localStorage / IndexedDB namespace。
- [x] 禁止新增视频时覆盖旧项目文件或状态。

## Project 001 · Harness Engineering 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden 视觉 | REVIEW | 正式播放器与纯成片窗口视觉一致 |
| C 本地 IndexTTS / 配音源库 | REVIEW | ZIP 保存、多源切换、原生播放器注入实机通过 |
| D 整片音画 | REVIEW | 自动播放 001～042 旁白与 Scene 同步 |
| E 项目内 SFX / BGM | LOCKED | D PASS 后进入 |
| F 高清本地录制 | REVIEW | 导出文件包含当前配音源声音 |

## Project 002 · AIGC 小黑云当前 Gate

| Gate | 状态 | 当前进度 |
|---|---|---|
| A 完整口播 | REVIEW | 7:30～8:00 脚本已存在，最新 LangChain 资料已核对 |
| B Garden 视觉 | REVIEW | Chapter 1 Scene 001～004 Visual Anchor 已创建 |
| C 本地 IndexTTS | WAITING | 当前只有 4 段 Anchor 草稿，不是正式整片 TTS |
| D 整片音画 | LOCKED | 等 B/C PASS |
| E 项目内 SFX / BGM | LOCKED | 等 D PASS |
| F 高清本地录制 | LOCKED | 已建立独立入口，整片完成后解锁 |

## Project 002 固定内容

```text
标题：AIGC 小黑云｜从 ChatGPT 到 Agent：AI 为什么开始“自己干活”了？
画幅：16:9
时长：7分30秒～8分
章节：9 Chapters
计划：45 visual beats / Scenes
主持 IP：AIGC 小黑云
技术主线：Agent → LangChain → LangGraph → RAG / MCP / Multi-Agent
视觉：深色科技 + 暖橙围巾点缀 + Garden web-video-presentation
```

## Project 002 下一步

1. 用户先检查 `presentations/aigc-xiaoheiyun-agent/full-video.html?v=64` 的 4 个 Visual Anchor Scene；
2. 如果视觉方向通过，再拆分并制作 Scene 005～045；
3. 45 Scene 完成后执行实际 Chromium Screenshot QA；
4. Gate A / B 一起确认后再生成正式完整 IndexTTS JSON；
5. 后续配音、整片音画、SFX/BGM、录制全部使用 Project 002 独立状态。

## 当前测试顺序

1. 打开 `works.html?v=64`，确认存在 Project 001 与 Project 002 两张独立卡片；
2. 点击 Project 002，进入 `project-aigc-xiaoheiyun-agent.html?v=64`；
3. 检查 Chapter 1 iframe 预览；
4. 打开 `presentations/aigc-xiaoheiyun-agent/full-video.html?v=64`，检查 001～004 切换和自动播放；
5. 确认 Project 001 Harness Engineering 页面与业务状态未变化。

## 仍需实机确认

- [ ] 正式部署后 `works.html` 两张项目卡片正常。
- [ ] Project 002 Chapter 1 Visual Anchor 在桌面端 16:9 正常。
- [ ] Project 002 小黑云角色视觉与用户 IP 素材方向一致。
- [ ] 用户确认 Anchor 后，再批量开发 Scene 005～045。
- [ ] Harness 原功能继续按原 Gate 独立验证。

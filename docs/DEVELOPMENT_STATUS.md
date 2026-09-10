# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE → Garden → motions/components。

## 当前 Phase

**Phase 1 · Harness Engineering · Project6 v64**

当前策略：**先跑通第一支完整视频，同时把多视频项目结构固定下来。**

## 当前唯一构建版本

- Product build：**v64**
- 单一版本源：`assets/version.js`
- 视频项目库：`works.html?v=64`
- Harness 独立详情：`project-harness-engineering.html?v=64`
- Harness 项目目录：`presentations/harness-engineering/`
- 正式播放器：`presentations/harness-engineering/full-video.html?v=64`
- 录制控制台：`presentations/harness-engineering/record.html?v=64`
- 纯成片窗口：`presentations/harness-engineering/capture.html?v=64`

## Multi-project Architecture · v64

- [x] `works.html` 从“某一个视频详情页”改为真正的视频项目库。
- [x] 项目库展示封面、名称、状态、Scene / Chapter 摘要。
- [x] Harness Engineering 拆为独立详情页 `project-harness-engineering.html`。
- [x] 单项目详情保留完整脚本、Garden、TTS、音频导入、Gate 与录制链路。
- [x] 项目总纲明确三层结构：工作台 → 项目库 → 独立项目详情。
- [x] 新视频必须创建新 slug、新详情页、新 `presentations/<slug>/` 目录。
- [x] 新项目必须使用独立 localStorage / IndexedDB namespace。
- [x] 禁止新增视频时覆盖旧项目文件或状态。

## Backend UI

- [x] 首页为 Editorial Production Console / 创作控制台。
- [x] 视频作品页现在以封面项目卡片为核心。
- [x] 项目总纲重新设计为多项目架构说明页。
- [x] 组件库 / 动效库 / Garden 手册继续作为共享能力层。
- [x] 独立动画音效库已移除；Gate E 为项目内 SFX / BGM。

## Harness Engineering 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 完整口播 | REVIEW | 用户最终确认整片口播 |
| B Garden 视觉 | REVIEW | 正式播放器与纯成片窗口视觉一致 |
| C 本地 IndexTTS / 配音源库 | REVIEW | ZIP 保存、多源切换、原生播放器注入实机通过 |
| D 整片音画 | REVIEW | 自动播放 001～042 旁白与 Scene 同步 |
| E 项目内 SFX / BGM | LOCKED | D PASS 后进入 |
| F 高清本地录制 | REVIEW | 导出文件包含当前配音源声音 |

## 当前测试顺序

1. 打开 `works.html?v=64`，确认先看到视频项目列表而不是 Harness 详情；
2. 点击 Harness Engineering 封面卡片；
3. 确认进入 `project-harness-engineering.html?v=64`；
4. 检查原脚本、Garden、TTS、音频上传与 Gate 功能仍存在；
5. 打开 `record.html?v=64` 完成真实配音与录制验证；
6. Gate D 通过后才进入当前项目 SFX / BGM。

## 下一支视频的固定动作

```text
创建 project-<new-slug>.html
→ 创建 presentations/<new-slug>/
→ 创建该项目自己的 data / TTS / player / record / capture / ACCEPTANCE
→ 创建独立本地状态 namespace
→ 在 works.html 新增项目卡片
→ 不修改旧项目业务状态
```

## 仍需实机确认

- [ ] 正式部署后 `works.html` 项目库样式与封面卡片正常。
- [ ] Harness 独立详情页全部原功能正常。
- [ ] ZIP 配音源与 42/42 注入实际可用。
- [ ] 最终录制文件包含当前配音源声音。

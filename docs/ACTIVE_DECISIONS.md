# Project6 Active Decisions

> 最新用户明确决策，优先级高于旧实现细节。

## 2026-09-11 · Project 002 必须严格复制 Project 001 的“方法”，不能复制业务内容

### 1. Project 001 保护

Harness Engineering 是已经完成的第一个案例。开发 Project 002 时：
- 不修改 Project 001 的业务文件；
- 不复用其脚本、Scene、Gate、TTS、本地状态；
- 只把它当作目录协议、Garden 方法、视觉质量和 Gate 顺序的规范基线。

### 2. Project 002 内容基线

Project 002 是 **小黑云 · LangChain Agent 实战课**。

用户提供的约 7 分钟课程转写是内容来源，但不能直接粘贴。必须：
- 修正 ASR；
- 修正技术名词；
- 核对最新事实；
- 重写成自己的正式口播；
- 再拆 Chapter / Scene。

### 3. Project 002 视觉纠正

上一版深色科技 / 卡片堆叠方案不通过，废弃。

新的 Visual Anchor 必须直接对齐 Harness Engineering 的 Garden 语言：
- 1920×1080；
- warm-keynote 米白网格；
- 暖棕正文 + 青绿强调；
- 每个 Scene 解释关系 / 空间 / 状态 / 过程；
- Scene 001 先建立整片视觉 Anchor；
- 小黑云只作为主持 IP 标识，不抢知识表达。

### 4. 开发门禁

```text
完整 42 Scene 口播 REVIEW
→ Scene 001～004 Anchor + Screenshot QA
→ 用户确认
→ Scene 005～042
→ Gate B PASS
→ 正式 IndexTTS JSON
```

Gate A/B 未确认前，不允许提前把 TTS、SFX、录制伪装成已完成。

## 2026-09-10 · v63 后台 UI 与 SFX 信息架构

### 5. 当前唯一产品版本

Project6 当前正式构建：**v64**。

Canonical：`assets/version.js`。

后台共享视觉层继续沿用当前正式 UI 体系。

### 6. 后台视觉方向

采用 **Editorial Production Console / 创作控制台**。

要求：
- 不改变现有核心功能；
- 信息结构本身承担视觉层级；
- 避免通用 SaaS 卡片堆叠；
- 避免无意义渐变、阴影、全大写 eyebrow 与统一圆角；
- 状态色只服务 Gate / 系统反馈；
- 支持 keyboard focus、mobile 和 reduced motion；
- 工作台、作品页与资源页逐步统一视觉语言。

### 7. 删除独立动画音效库

`audio.html` 已删除。

SFX 能力继续保留，但改为具体 Project 的 Gate E：

```text
Gate D 整片音画 PASS
→ Gate E 项目内 SFX / BGM
→ 只添加当前视频真正需要的短音效
```

后台主导航不再出现“动画音效库”。

## 2026-09-09 · 版本统一与发布规则

### 8. 单一版本源

全局产品版本必须以 `assets/version.js` 为唯一来源。

正式入口至少包括：
- `index.html`
- `works.html`
- 各 `project-<slug>.html`
- 各项目 `full-video / record / capture`

### 9. 版本与缓存必须一起更新

全局 build 升级时必须同批同步：

```text
assets/version.js
→ index / works / project detail / full-video / record / capture
→ 正式静态资源和 iframe 的 ?v=
→ DEVELOPMENT_STATUS
→ ACCEPTANCE
→ PROJECT_CHARTER / PRD / Active Decisions 中当前构建信息
```

本轮 Project 002 仍在 Gate REVIEW，不升级全局 canonical，使用项目级缓存后缀 `64-p2a2`，避免为了第二支视频强制改动 Project 001 已完成入口。

### 10. 历史实现文件名不是当前产品版本

正式播放器仍可能引用部分历史文件作为兼容实现层。不能仅因为文件名旧就删除。

只有“正式入口无引用 + 仓库搜索无引用 + 删除后 QA 不受影响”的历史文件才允许清理。

### 11. 旧浏览器状态迁移

Project 001 Harness Engineering 的脚本确认与音频状态继续保持原 namespace，不因 Project 002 开发迁移或覆盖。

Project 002 必须使用 `project6.aigc-xiaoheiyun-agent.*` 自己的 namespace。

## 2026-09-09 · 整片生产模式

### 12. 一个视频就是一个完整 Project

后台不再按章节分别做 TTS 交接。章节只用于内部组织和导航。用户实际面对：

```text
一个完整视频项目
→ 一份完整口播稿
→ 一套完整 HTML / Garden 画面
→ 一个完整 TTS JSON
→ 一个或多个本地配音源 ZIP
→ 一个完整本地音画预览
→ 最后统一加项目内 SFX / BGM
→ 最终高清本地文件
```

### 13. 职责边界

AI / Project6 负责：完整口播、内部 Chapter / Scene、Garden 视觉与动画、编号维护、总 TTS JSON、本地音频映射、整片预览、视觉 QA、最终录制工具。

用户负责：确认整片口播与画面、一次复制整片 JSON、本地 IndexTTS 2.5 生成全部语音、上传完整 ZIP、实机复核输出文件。

### 14. Harness Engineering 当前规格

- 7 个内部章节；
- 42 Scene；
- 42 段连续口播；
- 编号固定 001～042；
- TTS：`presentations/harness-engineering/full-tts-tasks.json`；
- 数据：`presentations/harness-engineering/full-video-data.js`；
- 播放器：`presentations/harness-engineering/full-video.html`。

### 15. TTS 交接整片一次完成

```text
完整口播 + 全部画面
→ 用户一次确认
→ 一键复制完整 JSON
→ 本地 IndexTTS 生成全部编号音频
→ 一个 ZIP
→ Project6 保存为配音源
→ 注入整片播放器
→ 完整音画预览
```

禁止退回“一章一个 JSON”。

### 16. 播放器要求

必须提供：播放、暂停/继续、上一张/下一张、Scene 进度跳转、全屏、本地 IndexTTS 注入、音频结束自动下一 Scene。

上传的新本地音频优先级必须高于历史 Edge TTS。

预览必须是真正 16:9 等比缩放：逻辑画布 1920×1080，缩放时 `stage-frame` 同步真实占位尺寸；窗口、浏览器缩放、全屏共享同一坐标关系。

### 17. ZIP 导入

- 支持完整 ZIP 与直接多选音频；
- 支持 `audio/001.mp3` 子目录；
- JSZip 失败必须明确提示并提供多选兜底；
- “文件已识别”不等于“播放器已切换音源”，必须实际注入播放器。

### 18. Garden 视觉原则

每个项目的 Scene 001 都是自己的视觉 Anchor。Scene 002 以后必须逐 Scene 设计，禁止统一左右排版、统一卡片模板和统一 fade。每张动画必须解释至少一种：关系 / 空间 / 状态 / 反馈 / 过程。

### 19. 强制渲染截图 QA

代码写完不等于画面完成。每次修改正式 Scene 后必须 Chromium 实际渲染、1920×1080 截图、检查字号 / 遮挡 / 溢出 / 对齐 / 留白 / 重心 / 逻辑 / 可视化表达，不通过则返工。

### 20. 双窗口本地高清录制

正式域名：`https://video.smilechat.cn`。

要求：
- `record.html` 作为录制控制台；
- `capture.html` 作为纯成片窗口；
- BroadcastChannel 使用稳定通道；
- 当前配音源必须进入最终录制文件；
- 支持 1080P / 1440P / 4K；
- 开始 / 暂停 / 继续 / 停止并保存 / 取消并丢弃；
- 最终文件只在浏览器本地保存。

### 21. 文档同步

Garden 手册、项目总纲、PRD、开发状态、验收规则必须跟当前整片模式和当前产品版本同步。禁止页面已经升级、文档仍保留旧 current 规则。

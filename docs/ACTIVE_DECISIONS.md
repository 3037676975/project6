# Project6 Active Decisions

> 最新用户明确决策，优先级高于旧实现细节。

## 2026-09-10 · v63 后台 UI 与 SFX 信息架构

### 1. 当前唯一产品版本

Project6 当前正式构建：**v63**。

Canonical：`assets/version.js`。

后台共享视觉层：`assets/admin-ui-v63.css`。

正式页面右下角统一显示：`P6 · v63`。

### 2. 后台视觉方向

本轮参考 Anthropic Claude Code Frontend Design Skill 的方法，采用：

**Editorial Production Console / 创作控制台**。

要求：
- 不改变现有核心功能；
- 信息结构本身承担视觉层级；
- 避免通用 SaaS 卡片堆叠；
- 避免无意义渐变、阴影、全大写 eyebrow 与统一圆角；
- 状态色只服务 Gate / 系统反馈；
- 支持 keyboard focus、mobile 和 reduced motion；
- 工作台、作品页与资源页逐步统一视觉语言。

### 3. 删除独立动画音效库

`audio.html` 从 v63 起删除。

原因：当前目标是完成第一支真实视频，不需要维护脱离项目的 SFX 资源库。

SFX 能力继续保留，但改为具体 Project 的 Gate E：

```text
Gate D 整片音画 PASS
→ Gate E 项目内 SFX / BGM
→ 只添加当前视频真正需要的短音效
```

后台主导航不再出现“动画音效库”。

### 4. 当前优先级

Project6 暂时停止扩展大型新模块。

当前唯一主线：

```text
Harness Engineering
→ 配音源实机验证
→ 整片音画同步
→ Gate D PASS
→ 项目内 SFX / BGM
→ 高清录制
→ 最终视频
```

## 2026-09-09 · 版本统一与发布规则

### 5. 单一版本源

当前版本必须以 `assets/version.js` 为唯一来源。

正式入口至少包括：
- `index.html?v=63`
- `works.html?v=63`
- `presentations/harness-engineering/full-video.html?v=63`
- `presentations/harness-engineering/record.html?v=63`
- `presentations/harness-engineering/capture.html?v=63`

### 6. 版本与缓存必须一起更新

以后任何新版本发布，必须同批同步：

```text
assets/version.js
→ index / works / full-video / record / capture
→ 正式静态资源和 iframe 的 ?v=
→ DEVELOPMENT_STATUS
→ ACCEPTANCE
→ PROJECT_CHARTER / PRD / Active Decisions 中当前构建信息
```

禁止页面已升级、后台仍显示旧版；禁止播放器是新版本但 iframe / data / local audio reload 仍指向旧 `?v=`。

### 7. 历史实现文件名不是当前产品版本

正式播放器仍可能引用部分 `v40 / v59 / v60 / v62` 文件作为兼容实现层。它们不能仅因为文件名旧就删除。

只有“正式入口无引用 + 仓库搜索无引用 + 删除后 QA 不受影响”的历史文件才允许清理。

### 8. 旧浏览器状态迁移

作品页的脚本确认状态使用稳定 key：`project6.harness.full.confirm.current`。

若用户浏览器仍有旧 `project6.harness.full.confirm.v40`，首次加载自动迁移，避免版本升级导致用户确认状态丢失。

## 2026-09-09 · 整片生产模式

### 9. 一个视频就是一个完整 Project

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

### 10. 职责边界

AI / Project6 负责：完整口播、内部 Chapter / Scene、Garden 视觉与动画、编号维护、总 TTS JSON、本地音频映射、整片预览、视觉 QA、最终录制工具。

用户负责：确认整片口播与画面、一次复制整片 JSON、本地 IndexTTS 2.5 生成全部语音、上传完整 ZIP、实机复核输出文件。

### 11. Harness Engineering 当前规格

- 7 个内部章节；
- 42 Scene；
- 42 段连续口播；
- 编号固定 001～042；
- TTS：`presentations/harness-engineering/full-tts-tasks.json`；
- 数据：`presentations/harness-engineering/full-video-data.js`；
- 播放器：`presentations/harness-engineering/full-video.html`。

### 12. TTS 交接整片一次完成

```text
完整口播 + 全部画面
→ 用户一次确认
→ 一键复制完整 JSON
→ 本地 IndexTTS 生成 001～042
→ 一个 ZIP
→ Project6 保存为配音源
→ 注入整片播放器
→ 完整音画预览
```

禁止退回“一章一个 JSON”。

### 13. 播放器要求

必须提供：播放、暂停/继续、上一张/下一张、Scene 进度跳转、全屏、本地 IndexTTS 注入、音频结束自动下一 Scene。

上传的新本地音频优先级必须高于历史 Edge TTS。

预览必须是真正 16:9 等比缩放：逻辑画布 1920×1080，缩放时 `stage-frame` 同步真实占位尺寸；窗口、浏览器缩放、全屏共享同一坐标关系。

### 14. ZIP 导入

- 支持完整 ZIP 与直接多选音频；
- 支持 `audio/001.mp3` 子目录；
- JSZip 失败必须明确提示并提供多选兜底；
- “文件已识别”不等于“播放器已切换音源”，必须实际注入播放器。

### 15. Garden 视觉原则

Scene 001 是视觉 Anchor，`HARNESS ENGINEERING` 为主标题。Scene 002～042 逐 Scene 设计，禁止统一左右排版、统一卡片模板和统一 fade。每张动画必须解释至少一种：关系 / 空间 / 状态 / 反馈 / 过程。

### 16. 强制渲染截图 QA

代码写完不等于画面完成。每次修改正式 Scene 后必须 Chromium 实际渲染、1920×1080 截图、检查字号 / 遮挡 / 溢出 / 对齐 / 留白 / 重心 / 逻辑 / 可视化表达，不通过则返工。

当前自动 QA 基线：42/42、tiny=0、overflow=0、console errors=0、responsiveFails=0。

### 17. 双窗口本地高清录制

正式域名：`https://video.smilechat.cn`。

要求：
- `record.html` 作为录制控制台；
- `capture.html` 作为纯成片窗口；
- BroadcastChannel 使用稳定通道；
- 当前配音源必须进入最终录制文件；
- 支持 1080P / 1440P / 4K；
- 开始 / 暂停 / 继续 / 停止并保存 / 取消并丢弃；
- 最终文件只在浏览器本地保存。

### 18. 文档同步

Garden 手册、项目总纲、PRD、开发状态、验收规则必须跟当前整片模式和当前产品版本同步。禁止页面已经升级、文档仍保留旧 current 规则。

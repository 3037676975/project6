# Project6 项目总纲 · v2.3

> 最高优先级 / Source of Truth  
> 当前产品构建：**Project6 v45**  
> 更新时间：2026-09-09

## 0. Project6 现在是什么

Project6 不是“视频工作台”，也不是在线剪辑 SaaS。

Project6 是一个 **AI HTML 视频项目生产后台**。一个视频就是一个完整 Project，内部管理完整口播、Chapter / Scene、Garden 可视化、动画、验收 Gate、整片 TTS JSON、本地 IndexTTS 音频 ZIP、整片音画预览、最终 SFX、本地 1080P MP4 录制以及视觉 QA。

## 1. 最新唯一生产流程

```text
用户给主题 / 文章
→ AI 整理完整口播
→ 拆内部 Chapter / Scene
→ Garden 为每个 Scene 设计不同视觉与 Motion
→ 每 Scene 实际渲染 + 1920×1080 Screenshot QA
→ 用户确认整片口播与视觉
→ 一次复制完整 TTS JSON
→ 用户本地 IndexTTS 2.5 生成 001～042
→ 一个总 ZIP 上传
→ 浏览器自动解压 + 编号匹配 + ObjectURL 注入
→ 整片本地音画预览 + timing 微调
→ 最后添加动画 SFX / BGM
→ Stage-only 1080P 本地录制
→ 浏览器下载最终 MP4
```

关键原则：**先内容与可视化，再本地配音，再音画同步，最后 SFX 与录制。**

## 2. 一个视频 = 一个独立项目

Chapter 只用于内部叙事组织。用户实际交付始终是：

```text
一个完整视频
一个完整口播
一套完整 HTML / Garden Scene
一个完整 TTS JSON
一个完整配音 ZIP
一个整片预览
一个最终 MP4
```

禁止退回“一章一个 TTS JSON”。

## 3. Garden Skills 是画面制作标准

- 一个 Scene / Step 对应一段 narration；
- GSAP Timeline 只属于当前 Scene；
- Scene 要真正可视化表达关系 / 空间 / 状态 / 反馈 / 过程；
- 禁止统一左右排版、统一卡片模板、统一 fade；
- Harness Engineering Scene 001 以 `HARNESS ENGINEERING` 为主题主标题；
- Scene 002～042 必须达到同级别完成度；
- 动画必须服务讲解逻辑。

## 4. 强制 Screenshot QA

**没有实际渲染截图检查，不允许宣布 Scene 完成。**

```text
实现
→ Chromium 渲染
→ 1920×1080 截图
→ 检查字号 / 遮挡 / 溢出 / 对齐 / 留白 / 重心 / 层级 / 逻辑 / 动画表达
→ 不通过则返工
→ 通过后才进入 REVIEW
```

当前 v45 继承并保持已通过的自动 QA 基线：42/42 screenshots、tiny text = 0、DOM overflow = 0、console errors = 0、responsiveFails = 0。

## 5. 本地 IndexTTS 是正式配音路线

```text
Project6 完整 JSON
→ 用户本机 Project6 TTS 工作台
→ IndexTTS 2.5 + GPU
→ 001.mp3 ... 042.mp3 / manifest.json
→ 一个 ZIP
→ Project6 浏览器导入
```

Project6 不连接用户本机公网，不要求把 IndexTTS 部署到服务器。

## 6. TTS JSON 固定协议

Canonical：`presentations/<project>/full-tts-tasks.json`。

- JSON 可提前预览；
- 用户确认整片口播与视觉后用于最终配音；
- `id / scene / filename` 必须稳定；
- 001～042 与 Scene 一一对应。

## 7. 配音与动画音效严格分开

人物说话声音由本地 IndexTTS 生成；SFX 只管理 reveal / whoosh / transition / click / tick / confirm / accent / digital 等短音效，并且永远放在整片音画通过之后。

## 8. 本地预览是正式 Gate

上传本地配音后必须支持：正确 001～042 映射、ObjectURL 本地播放、播放 / 暂停 / 继续、上一张 / 下一张、Scene 跳转、全屏、narration ended 自动下一 Scene、Pause 同时暂停当前 GSAP timeline、窗口 / 缩放 / 全屏保持同一 16:9 布局。

## 9. 1080P MP4 本地录制

正式入口：`https://video.smilechat.cn`。HTTP 域名访问必须自动升级 HTTPS；localhost bridge 继续作为备用。

录制要求：
- 只录中间 `.stage`；
- 不录后台工具栏与右上角版本 Badge；
- Chromium Region Capture 精确裁切；
- 目标 1920×1080 / 60fps；
- 当前标签页视频 + 标签页音频；
- 录制中显示 `REC 00:00:00`；
- 结果只在浏览器本地下载，不上传服务器；
- 最终目标格式为 `.mp4`；
- v45 禁止再使用每秒 MP4 分片拼接；
- v45 录制前必须在用户手势内解锁播放权限，回到 Scene 001，等待渲染稳定后启动动画与录制。

当前仍需用户实机确认 v45 MP4 无花屏 / 乱码且动画、声音完整录入。

## 10. 后台信息架构

```text
工作台
视频作品            ← 核心主入口
动画音效库          ← 最后阶段 SFX，不是配音
组件库 · Galaxy
动效库 · GSAP / Emil
Garden 手册
项目总纲
```

禁止恢复 `studio.html / #/studio / 视频工作台`。

## 11. Harness Engineering 当前状态

```text
A 完整口播           REVIEW
B Garden v45 视觉    REVIEW · 自动 QA 已通过
C 本地 IndexTTS      WAITING
D 整片音画预览       WAITING
E 动画 SFX           LOCKED
F 1080P MP4 录制     REVIEW · 等用户实机复核
```

## 12. Project6 版本管理 · 强制 Source of Truth

当前唯一产品版本：**v45**。

Canonical：`assets/version.js`

正式页面右上角必须显示：`P6 · v45`。

每次发布 v46 / v47... 必须同一次变更同步：

```text
assets/version.js
→ index.html
→ works.html
→ full-video.html
→ 所有正式 ?v= 缓存参数
→ DEVELOPMENT_STATUS.md
→ 当前作品 ACCEPTANCE.md
→ PROJECT_CHARTER / PRD / ACTIVE_DECISIONS 中涉及当前构建的部分
```

禁止：页面已经是新版本，作品页仍显示旧版本；缓存参数继续指向旧版本；文档仍把旧版本写成 current。

### 历史文件名规则

历史实现层文件名中出现 `v40 / v41 / v42` **不等于当前产品版本**。如果正式 v45 播放器仍引用这些文件，它们就是当前兼容实现层，不能为了清理名称直接删除。

只有满足以下条件才允许删除历史文件：
1. 正式入口不再引用；
2. 仓库代码搜索无引用；
3. 删除后视觉 QA / 播放链路不受影响。

## 13. 强制开发门禁

```text
Read PROJECT_CHARTER
→ Read PRD
→ Read ACTIVE_DECISIONS
→ Read DEVELOPMENT_STATUS
→ Read 当前作品 ACCEPTANCE
→ 定位 Gate
→ 实现
→ 实际渲染 / 功能 QA
→ 自检
→ 更新状态与版本记录
```

# Project6 项目总纲 · v2.1

> 最高优先级 / Source of Truth  
> 更新时间：2026-09-09

## 0. Project6 现在是什么

Project6 不是“视频工作台”，也不是在线剪辑 SaaS。

Project6 是一个 **AI HTML 视频项目生产后台**。一个视频就是一个完整 Project，内部管理：完整口播、Chapter / Scene、Garden 可视化、动画、验收 Gate、整片 TTS JSON、本地 IndexTTS 音频 ZIP、整片音画预览、最终 SFX、本地 1080P 录制以及视觉 QA。

**独立「视频工作台」概念已废弃。**

## 1. 最新唯一生产流程

```text
用户给主题 / 文章
      ↓
AI 整理完整口播
      ↓
拆内部 Chapter / Scene
      ↓
Garden 为每个 Scene 设计不同的视觉表达与 Motion
      ↓
每 Scene 实际渲染 + 1920×1080 Screenshot QA
      ↓
用户确认整片口播与整片视觉
      ↓
一次解锁 / 复制完整 TTS JSON
      ↓
用户本地 IndexTTS 2.5 + GPU 生成 001～042
      ↓
一个总 ZIP 上传回来
      ↓
浏览器自动解压 + 编号匹配 + ObjectURL 注入
      ↓
整片本地音画预览 + timing 微调
      ↓
最后添加动画 SFX / BGM
      ↓
一键 Stage-only 1080P 本地录制
      ↓
浏览器下载 WebM
```

关键原则：**先内容与可视化，再本地配音，再音画同步，最后 SFX 与录制。**

## 2. 一个视频 = 一个独立项目

Chapter 只用于内部叙事组织。用户实际交付始终是：

```text
一个完整视频
一个完整口播
一套完整 HTML/Garden Scene
一个完整 TTS JSON
一个完整配音 ZIP
一个整片预览
一个最终录制文件
```

禁止退回“一章一个 TTS JSON”。

## 3. Garden Skills 是画面制作标准

Project6 中 Garden / Garden Scale 统一指 Garden Skills 的 `web-video-presentation` 制作体系。

必须遵守：

- 一个 Scene / Step 对应一段 narration；
- GSAP Timeline 只属于当前 Scene；
- Scene 要真正可视化表达关系 / 空间 / 状态 / 反馈 / 过程；
- 禁止统一左右排版、统一卡片模板、统一 fade；
- Scene 001 是当前 Harness Engineering 的视觉质量 Anchor；
- Scene 002～042 必须达到同级别完成度；
- 动画不是装饰，必须服务讲解逻辑。

## 4. 强制 Screenshot QA

**没有实际渲染截图检查，不允许宣布 Scene 完成。**

每次修改正式视频：

```text
实现
→ Chromium 渲染
→ 1920×1080 截图
→ 检查字号 / 遮挡 / 溢出 / 对齐 / 留白 / 重心 / 层级 / 逻辑 / 动画表达
→ 不通过则返工
→ 通过后才进入 USER REVIEW
```

自动化：
- `scripts/visual-qa.mjs`
- `.github/workflows/visual-qa.yml`

输出 001～042 截图与 `qa/visual-report.json`。

## 5. 本地 IndexTTS 是正式配音路线

```text
Project6 完整 JSON
→ 用户本机 Project6 TTS 工作台
→ IndexTTS 2.5 + GPU
→ 001.mp3 ... 042.mp3 / manifest.json
→ 一个 ZIP
→ Project6 浏览器导入
```

Project6 不需要连接用户本机公网，不需要 Cloudflare Tunnel，不需要把 IndexTTS 部署到服务器。

## 6. TTS JSON 是固定交接协议

整片 canonical：`presentations/<project>/full-tts-tasks.json`。

规则：

- JSON 可提前预览；
- 用户确认整片口播与视觉后才正式用于最终配音；
- `id / scene / filename` 必须稳定；
- 001～042 与 Scene 一一对应。

## 7. 配音与动画音效绝对分开

### 配音
人物说话声音，本地 IndexTTS 生成。

### 动画 SFX
元素出现、whoosh、transition、click、tick、confirm、accent、digital 等短音效。

SFX 永远在整片音画通过后进入。

## 8. 本地预览是正式 Gate

上传本地配音后，Project6 必须提供：

- 正确 001～042 映射；
- ObjectURL 本地播放；
- 播放 / 暂停 / 继续；
- 上一张 / 下一张；
- Scene 跳转；
- 全屏；
- narration 结束后自动下一 Scene；
- Pause 同时暂停当前 GSAP timeline。

## 9. Stage-only 1080P 本地录制

正式播放器提供「一键录制 1080P」。

要求：

- 只录中间 `.stage`；
- 不录后台工具栏；
- Chromium Region Capture 精确裁切；
- 请求 1920×1080 / 60fps；
- 当前标签页视频 + 标签页音频；
- 低于 1080P 或不支持精确区域裁切时拒绝录制；
- VP9/Opus 优先，高码率；
- 从 Scene 001 一键开始整片播放；
- END 自动停止，也可手动停止；
- 浏览器本地下载 WebM；
- **不上传服务器、不保存 Project6 后端。**

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
A 完整口播           CODE PASS / WAITING USER CONFIRM
B Garden v41 视觉    CODE POLISHED / QA RUNNING / USER REVIEW
C 本地 IndexTTS      CODE READY / WAITING
D 整片音画预览       CODE READY / WAITING AUDIO
E 动画 SFX           LOCKED
F 1080P 本地录制     CODE READY / BROWSER TEST
```

当前优先级：**先跑完 42 Scene Screenshot QA，把细节继续修到稳定，再进入最终 TTS。**

## 12. 强制开发门禁

每次开发前必须：

```text
Read PROJECT_CHARTER
→ Read PRD
→ Read ACTIVE_DECISIONS
→ Read DEVELOPMENT_STATUS
→ Read 当前作品 ACCEPTANCE
→ 定位当前 Gate
→ 实现
→ 实际渲染截图 QA
→ 自检
→ 更新状态文档
```

禁止：页面改了文档不更新、假按钮、假数据、假资源、配音与 SFX 混淆、没有截图就宣布视觉完成、录制上传服务器、低于 1080P 却标成高清。

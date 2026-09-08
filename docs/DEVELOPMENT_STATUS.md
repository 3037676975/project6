# Project6 开发状态

> 每次开发前必须依次阅读：`docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。  
> 第一章还必须阅读 Garden 官方 `web-video-presentation`、`CHAPTER-CRAFT.md`、`AUDIO.md`，以及 `presentations/harness-engineering/ACCEPTANCE.md`。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章 Garden v22 + 本地 IndexTTS 交接流程**
- 当前状态：**IN PROGRESS / 后台结构已改为作品优先**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 当前范围：**只完善第一章和作品交接流程，不进入第二章**
- Garden Theme：`warm-keynote`
- Step：6
- 本地 TTS：**IndexTTS 2.5 / 用户本机 GPU / JSON 文件交接**
- 旧 Edge TTS：保留为历史/兜底，不再作为当前主生产方式
- 动画 Runtime：`GSAP + MotionPathPlugin + DrawSVGPlugin`
- BGM：统一从 Project6 音效库管理
- 导出：浏览器本地 `getDisplayMedia + MediaRecorder → WebM`

## 用户最新确认的正式流程

```text
AI 先写完整脚本
        ↓
按 Garden 拆 Chapter / Step
        ↓
先生成每章画面
        ↓
用户确认画面
        ↓
Project6 在具体视频作品里
一键复制 TTS JSON
        ↓
用户把 JSON 粘贴到本地 IndexTTS 工作台
        ↓
本机 GPU 生成 001 / 002 / 003 ... 音频
        ↓
用户回到同一个视频作品
导入本地音频
        ↓
Project6 按 Step 编号自动匹配
        ↓
用户确认
        ↓
音画合成预览 / 浏览器本地导出
```

## 后台结构最新决策

### 不再存在「视频工作台」

- [x] 删除 `studio.html`。
- [x] 首页删除「视频工作台」入口。
- [x] 首页改为“作品优先”的生产后台。
- [x] 所有脚本、画面、配音、音效、合成操作收进「视频作品 → 具体项目」。

### 视频作品

当前 `works.html` 已重做：

- [x] 项目级页面。
- [x] 章节列表。
- [x] 第一章 6 Step 脚本展示。
- [x] 第一章画面预览入口。
- [x] 一键复制本地 IndexTTS JSON。
- [x] 本地 001～006 音频选择与自动编号匹配。
- [x] 匹配进度显示。
- [x] 合成预览入口结构。
- [x] 音效库入口。

### 音效库

- [x] 新增 `audio.html`。
- [x] BGM / 转场 / 提示音独立管理。
- [x] 本地试听使用 ObjectURL，不上传服务器。
- [x] 音效资源服务于具体视频作品，不再属于“视频工作台”。

## Garden v22 已完成

- [x] 6 Step ↔ 6 narration 一一对应。
- [x] 删除手写句内秒数猜测。
- [x] Step 内 SentenceBoundary 驱动。
- [x] Auto 仅 narration ended 后翻页。
- [x] 第一章视觉重做为 warm-keynote。
- [x] Step 2 / 3 / 4 / 5 去除后台卡片墙式构图。
- [x] 删除虚构公司与虚构统计数据。

## 当前待通过

- [ ] 正式 Project6 地址确认新后台已部署。
- [ ] 用户确认首页不再出现「视频工作台」。
- [ ] 用户确认「视频作品 → Harness Engineering」结构符合预期。
- [ ] 一键复制 JSON 在手机/电脑实机测试。
- [ ] 本地 IndexTTS 用复制的 JSON 生成第一批 001～006 音频。
- [ ] 将本地音频导回作品页完成真实匹配测试。
- [ ] 本地音频与 Garden v22 做完整合成试听。
- [ ] 用户最终体验 PASS。

## 当前 Gate

**后台信息架构 Gate：代码完成，WAITING USER REVIEW。**  
**Garden v22 代码 / 结构 Gate：PASS。**  
**本地 IndexTTS 实机交接 Gate：WAITING FIRST AUDIO PACKAGE。**  
**用户最终产品 Gate：WAITING。**

**第一章未最终 PASS 前，不进入第二章。**

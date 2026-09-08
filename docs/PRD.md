# Project6 PRD · v2.0

**状态：** Current / 最新产品基准  
**总纲：** `docs/PROJECT_CHARTER.md`

## 1. 产品定位

Project6 是一个面向低预算创作者的 **AI HTML 视频项目生产后台**。

它不再以“视频工作台”为核心，而是围绕一个个具体视频作品进行制作、验收和交付。

## 2. 核心对象

一个视频 = 一个 Project。

Project 内包含：

- Script；
- Chapter；
- Step / 第1张、第2张、第3张……；
- Garden 画面；
- 验收 Gate；
- TTS JSON；
- 本地 IndexTTS 回传音频；
- 本地音画预览；
- 最终动画 SFX；
- 完成状态。

## 3. P0 主流程

```text
写完整口播稿
→ 用户确认口播
→ Garden 生成全部画面
→ 用户逐张 / 逐章确认
→ 解锁 TTS JSON
→ 一键复制 JSON
→ 本地 IndexTTS 2.5 生成音频
→ ZIP 上传 Project6
→ 浏览器自动解压
→ 001 ↔ 第1张，002 ↔ 第2张……
→ 本地音画预览
→ 用户确认
→ 最后添加动画 SFX / BGM
```

## 4. P0-01 视频作品页

必须：

- 一个项目独立展示；
- Chapter 列表；
- 每个 Chapter 展示所有 Step；
- Step 按“第1张、第2张、第3张……”排列；
- 每张显示：画面状态、口播、配音状态；
- 显示当前 Gate；
- 显示验收规则和下一步。

## 5. P0-02 口播确认 Gate

必须：

- 完整显示当前章节所有口播；
- 用户有明确的“确认这版口播稿”按钮；
- 未确认前，TTS JSON 复制按钮锁定；
- JSON 预览可以查看，方便检查；
- 修改口播后确认状态必须失效。

## 6. P0-03 TTS JSON

标准文件：`presentations/<project>/tts-tasks.json`

必须提供：

- 可见预览；
- 一键复制；
- 固定字段：project / chapter / engine / version / tasks；
- task 固定字段：id / chapter / step / scene / text / filename。

当前正式 engine：`IndexTTS 2.5`。

## 7. P0-04 本地配音导入

用户本地工作台输出：

```text
Project6_Chapter01.zip
├── audio/
│   ├── 001.mp3
│   ├── 002.mp3
│   └── ...
└── manifest.json
```

Project6 浏览器端：

- 使用 JSZip 解压；
- 不要求上传服务器处理；
- 自动识别 001、002、003……；
- 自动匹配对应 Step；
- 缺失文件时禁止进入下一 Gate。

## 8. P0-05 本地音画预览

不要求录制。

要求：

- 画面可以在项目内预览；
- 本地音频用 ObjectURL 播放；
- 可以逐张试听；
- 可以从第1张顺序播放；
- 用户明确确认后，D Gate 才 PASS。

## 9. P0-06 验收状态系统

每个项目最低包含：

| Gate | 内容 |
|---|---|
| A | 口播稿 |
| B | Garden 画面 |
| C | 本地 IndexTTS |
| D | 本地音画预览 |
| E | 动画音效 |
| F | 下一章节 |

状态只允许：PASS / REVIEW / WAITING / LOCKED。

作品页必须显示规则，而不是只在 Markdown 里隐藏。

## 10. P1-01 动画音效库

这是 **SFX Library，不是 Voice Library**。

类别：

- Element Reveal；
- Whoosh / Transition；
- UI Click；
- Pop / Tick；
- Confirm / Complete；
- Alert / Accent；
- Digital / Tech。

必须：

- 真正可试听；
- 有真实来源；
- 有 License；
- 第一批接入 Kenney UI Audio / Interface Sounds（CC0）；
- 可以记录推荐场景；
- 不允许拿 BGM 冒充动画 SFX。

## 11. P1-02 Garden 中文手册

`garden.html` 必须是真实可阅读页面，不允许再跳到不存在的 `#/lab`。

至少包含：Script、Chapter、Step、Narration、Theme、GSAP 边界、Audio、验收 Gate 和常见错误。

## 12. P1-03 项目总纲页面

`charter.html` 必须与最新 `PROJECT_CHARTER.md` 一致，不允许保留：视频工作台、`#/studio`、旧 Project5-only TTS 主流程或已废弃后台结构。

## 13. 非目标

当前不做：在线剪辑时间线、GPU 调度、Cloudflare / 本机公网 API、服务端视频渲染、复杂录制系统，以及第一章没 PASS 就开发第二章。

## 14. 当前验收项目

Harness Engineering / Chapter 01。

当前目标：

```text
确认口播
→ 复制真实 tts-tasks.json
→ 本地 IndexTTS
→ 上传 ZIP
→ 6/6 匹配
→ 本地音画预览
```

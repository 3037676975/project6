# Project6 项目总纲 · v2.0

> 最高优先级 / Source of Truth  
> 更新时间：2026-09-09

## 0. Project6 现在是什么

Project6 不是“视频工作台”，也不是在线剪辑 SaaS。

Project6 是一个 **AI HTML 视频项目生产后台**。后台围绕“一个个独立视频项目”组织，每个项目内部管理：

- 完整口播稿；
- Chapter / Step；
- 第 1 张、第 2 张、第 3 张……画面；
- Garden 画面验收状态；
- 本地 IndexTTS 任务 JSON；
- 用户回传的配音 ZIP；
- 本地音画预览；
- 最后阶段的动画 SFX；
- 最终项目状态。

**已废弃：独立「视频工作台」产品概念。**

---

## 1. 最新唯一生产流程

```text
用户给主题 / 文章
      ↓
AI 先写完整口播稿
      ↓
拆 Chapter / Step
      ↓
Garden 生成每一张画面
      ↓
用户逐章 / 逐张确认画面与口播
      ↓
用户点击「确认口播稿」
      ↓
Project6 解锁 TTS JSON
      ↓
一键复制 project6_tts_tasks JSON
      ↓
用户本地 IndexTTS 2.5 + GPU 生成
      ↓
本地导出 ZIP
001.mp3 / 002.mp3 / ... / manifest.json
      ↓
上传回对应 Project6 视频项目
      ↓
浏览器自动解压 + 按编号匹配画面
      ↓
本地音画预览
      ↓
用户确认音画
      ↓
最后才选择动画 SFX / BGM
      ↓
完成作品
```

关键原则：**先内容和画面，再配音，最后动画音效。**

---

## 2. 一个视频 = 一个独立项目

每个项目必须能看到自己的完整状态，而不是跳到另一个“工作台”。

示例：

```text
Harness Engineering
├── Chapter 01
│   ├── 第1张 / Step 001 / narration / voice 001
│   ├── 第2张 / Step 002 / narration / voice 002
│   ├── 第3张 / Step 003 / narration / voice 003
│   └── ...
├── Chapter 02（锁定）
└── 项目 Gate
```

作品页是生产主入口。

---

## 3. Garden Skills 是画面制作标准

Project6 中用户口中的 Garden / Garden Scale，统一指 Garden Skills 的 `web-video-presentation` 制作体系。

标准：

```text
Narration Script
→ Theme
→ Outline
→ Chapter
→ Step
→ HTML / SVG / React
→ Audio
→ Auto Play
```

必须遵守：

- 一个 Step 对应一段 narration；
- GSAP Timeline 永远只属于当前 Step；
- 不能用随便写的固定秒数代替真实口播节奏；
- 画面先通过用户验收，才进入本地 TTS；
- 第一章未通过 Gate，不开发第二章。

---

## 4. 本地 IndexTTS 是正式配音路线

当前正式路线：

```text
Project6 输出 JSON
      ↓
用户本机 Project6 TTS 工作台
      ↓
IndexTTS 2.5 + 本地 GPU
      ↓
001.mp3 ... manifest.json
      ↓
ZIP
      ↓
Project6 浏览器导入
```

Project6 不需要连接用户本机公网，不需要 Cloudflare Tunnel，不需要把 IndexTTS 部署进服务器。

Project5 / Edge TTS 可以保留为历史或兜底能力，但**当前第一章正式交付优先使用本地 IndexTTS 工作流**。

---

## 5. TTS JSON 是固定交接协议

每个项目必须提供可见 JSON 预览和「一键复制」。

```json
{
  "project": "Harness Engineering",
  "chapter": "01-harness-engineering",
  "engine": "IndexTTS 2.5",
  "version": "1.0",
  "tasks": [
    {
      "id": "001",
      "chapter": "01",
      "step": 1,
      "scene": "scene01",
      "text": "口播原文",
      "filename": "001.mp3"
    }
  ]
}
```

规则：

- JSON 预览可以提前看；
- **复制按钮必须在用户确认口播稿后才解锁**；
- `id`、`scene`、`filename` 必须稳定；
- Project6 后续按编号把本地声音匹配回画面。

---

## 6. 配音与动画音效绝对分开

### 配音

就是人物说话声音：IndexTTS 生成的 001、002、003……

### 动画音效 SFX

只用于画面动作，例如：

- 元素出现；
- whoosh 转场；
- UI click；
- pop / tick；
- confirm；
- 提示、强调、完成反馈。

动画音效库必须提供真实可试听资源，并记录来源和许可证。

第一批真实资源来源：**Kenney UI Audio / Interface Sounds（CC0）**，以及 Project6 已有本地可播放音频样本。

动画 SFX 永远是流程最后阶段，不允许和配音混在一起。

---

## 7. 本地预览是 P0，录制不是当前 P0

用户上传本地配音后，Project6 必须提供浏览器内的音画预览。

当前不强求录制、不强求 MP4 / WebM 导出。

P0 是：

```text
画面 + 正确的配音编号 + 正确顺序
→ 浏览器本地预览
→ 用户确认
```

---

## 8. 后台信息架构

```text
工作台
视频作品            ← 核心主入口
动画音效库          ← 最后阶段 SFX，不是配音
组件库 · Galaxy
动效库 · GSAP / Emil
Garden 手册         ← 必须可正常打开
项目总纲            ← 本文件的可视化版本
```

禁止恢复：

```text
视频工作台
#/studio
studio.html
```

---

## 9. 每个项目必须显示 Gate

最低状态：

```text
A 口播稿
B Garden 画面
C 本地 IndexTTS
D 本地音画预览
E 动画音效
F 下一章节
```

每个 Gate 必须有：

- PASS / WAITING / LOCKED；
- 验收规则；
- 当前下一步；
- 禁止越级。

---

## 10. 当前第一章状态

Harness Engineering Chapter 01：

```text
A 口播稿         PASS / 用户可重新确认
B Garden 画面    CODE PASS / USER REVIEW
C 本地 IndexTTS  WAITING AUDIO ZIP
D 本地音画预览   WAITING AUDIO
E 动画音效       LOCKED
F 第二章         LOCKED
```

当前唯一下一步：

> 用户确认第一章口播稿 → 一键复制 TTS JSON → 本地 IndexTTS 生成 → 上传 ZIP。

---

## 11. 强制开发门禁

每次开发前必须：

```text
Read PROJECT_CHARTER
→ Read PRD
→ Read ACTIVE_DECISIONS
→ Read DEVELOPMENT_STATUS
→ 定位当前 Gate
→ 只做当前 Gate 需要的事
→ 自检
→ 更新状态文档
```

禁止：

- 页面改了但文档不更新；
- 恢复已经废弃的旧入口；
- 假按钮；
- 假数据；
- 假资源；
- 动画音效与配音混淆；
- 第一章没验收就开发第二章。

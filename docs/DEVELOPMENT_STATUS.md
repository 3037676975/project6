# Project6 开发状态

> 每次开发前必须依次阅读：`docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。  
> 第一章还必须阅读 Garden 官方 `web-video-presentation`、`CHAPTER-CRAFT.md`、`AUDIO.md`，以及 `presentations/harness-engineering/ACCEPTANCE.md`。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章 Garden v22 + 本地 IndexTTS 交接流程**
- 当前状态：**IN PROGRESS / 视频作品页正在成为唯一生产入口**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 当前范围：**只完善第一章与交接流程，不进入第二章**
- 独立“视频工作台”：**已删除 / 禁止恢复**

## 最新用户工作流（2026-09-09）

```text
AI 先生成完整口播稿
        ↓
用户确认整章口播稿
        ↓
AI / Garden 生成第1张、第2张、第3张…全部画面
        ↓
用户逐张确认画面
        ↓
Project6 解锁“一键复制 TTS JSON”
        ↓
用户复制 JSON 到本地 IndexTTS 工作台
        ↓
本地 GPU 生成 001 / 002 / 003 ... 音频 + ZIP
        ↓
Project6 导入 ZIP
浏览器自动解压并按编号匹配
        ↓
本地音画预览
        ↓
所有章节完成并确认
        ↓
最后加入动画 SFX
出现 / 转场 / 点击 / 强调 / 提示
```

## 产品结构

### 后台只保留两类核心对象

1. **视频作品**：每个视频都是独立项目。
2. **资源库**：Garden / Galaxy / GSAP / 动画音效等服务于作品。

### 视频作品内部必须包含

- 章节列表；
- 第1张 / 第2张 / 第3张…画面卡片；
- 对应口播稿；
- 脚本确认 Gate；
- 一键复制 TTS JSON；
- 本地 IndexTTS 配音 ZIP 导入；
- `001 ↔ 第1张` 自动映射；
- 本地音画预览；
- 最终动画音效阶段。

## 配音与音效必须严格区分

### 配音

- 属于具体视频项目；
- 与具体 Step / Frame 一一对应；
- 本地 IndexTTS 生成；
- 不放进“音效库”。

### 动画音效库

只指短 SFX：

- 元素出现；
- 转场；
- 点击；
- 强调；
- 提示 / 完成。

参考 Bilibili / 科普视频中 UI、组件和动画动作的声音反馈。

动画音效是**最后一个制作环节**，不得提前干扰脚本、画面、配音验收。

## 当前已完成

- [x] 删除 `studio.html`。
- [x] 首页去掉“视频工作台”。
- [x] 后台改为作品优先。
- [x] Harness 第一章按第1张～第6张卡片展示。
- [x] 脚本确认前禁用 TTS JSON。
- [x] 确认脚本后支持一键复制 TTS JSON。
- [x] 支持本地 IndexTTS ZIP / 多音频导入。
- [x] ZIP 在浏览器本地自动解压并按 001～006 映射。
- [x] 增加本地音画顺序预览，不要求录制。
- [x] `audio.html` 已重新定义为动画 SFX 库，不再混淆为配音库。

## 当前待验收

- [ ] 用户确认新版后台视觉与结构。
- [ ] 用户本地 TTS 工作台成功读取 Project6 JSON。
- [ ] 本地真实生成 001～006 音频。
- [ ] ZIP 导回 Project6 后 6/6 匹配。
- [ ] 本地音画预览真实通过。
- [ ] 第一章最终视觉 / 配音 PASS。

## Gate

**后台结构 Gate：代码已完成，等待用户体验确认。**  
**第一章最终 Gate：WAITING。**  
**第二章：LOCKED。**

# Project6 开发状态

> 这是执行层状态文件。每次开发前先读 `docs/PROJECT_CHARTER.md`、`docs/PRD.md`，再读本文件定位当前阶段。  
> 只有阶段自检为 PASS 后，才允许进入下一 Phase。

## 当前定位

- 当前 Phase：**Phase 1 · Garden 单视频实验**
- 当前状态：**IN PROGRESS / Gate 未通过**
- 当前实验：`presentations/rag-intro/`
- Garden Theme：`blueprint`
- 视频：`什么是 RAG`
- 章节：2
- Step：10
- TTS：Project5 / Edge / `zh-TW-YunJheNeural` / speed `1.10`

## Phase 0 · 产品基线

状态：**PASS**

- [x] 项目总纲入库
- [x] PRD 入库
- [x] 后台可直接阅读项目总纲

## Phase 1 · Garden 单视频实验

状态：**IN PROGRESS**

- [x] article 原始内容
- [x] `script.md`
- [x] `outline.md`
- [x] 2 Chapters
- [x] 10 Steps
- [x] 每章独立 narration 源
- [x] Garden Blueprint Theme
- [x] 1920×1080 固定舞台
- [x] HTML / CSS / SVG 动画
- [x] 全局 Step 点击 / 键盘推进
- [x] 自动播放逻辑已实现
- [x] 音频存在时使用 `audio ended` 推进下一 Step
- [x] 后台存在 RAG 实验视频入口
- [x] Project5 服务端生成脚本已实现
- [x] API Key 只从 `PROJECT5_API_KEY` 环境变量读取，不写浏览器、不写公开仓库
- [ ] Project5 实际生成 10/10 ETG1 音频
- [ ] `audio-map.json` 状态变为 `ready`
- [ ] 浏览器实测 10/10 Step 均播放 ETG1
- [ ] 实际音画同步自检 PASS

### 当前 Gate 结论

**FAIL（暂不进入 Phase 2）**

失败项只有音频实测链路：当前执行环境无法连接 `http://186.244.245.177:28442`，因此本轮不能伪造“ETG1 已完成”。代码已经准备好真实 Project5 调用：

```bash
export PROJECT5_BASE_URL="http://186.244.245.177:28442"
export PROJECT5_API_KEY="YOUR_REAL_KEY"
node scripts/generate-project5-audio.mjs
node scripts/validate-phase1.mjs
```

完整 Gate 必须满足 `audio-map.json` 中 10 个 segment 都有 Project5 返回的真实 `audio_url`。

## 下一动作

1. 在可以访问 Project5 的服务端运行 `scripts/generate-project5-audio.mjs`。
2. 检查 10 段任务全部 completed。
3. 将生成后的 `presentations/rag-intro/audio-map.json` 同步回仓库。
4. 在浏览器从 Step 1 播放到 Step 10，检查动画时长没有超过对应口播。
5. 运行 `node scripts/validate-phase1.mjs`。
6. 只有输出 PASS，才把本文件 Phase 1 改为 PASS 并进入 Phase 2。

## 禁止越级

在 Phase 1 未 PASS 前，不开始以下工作：

- Phase 2 浏览器 WebM 导出
- 第二 / 第三 Theme 实验
- 大规模 Garden 中文手册
- 动画 / 音效资源中心扩建
- 浏览器本地 MP4

原因：当前最重要的是先证明第一条 Garden + ETG1 + HTML 视频链路真实跑通。

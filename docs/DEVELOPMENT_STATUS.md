# Project6 开发状态

> 每次开发前必须依次阅读 `docs/PROJECT_CHARTER.md`、`docs/PRD.md`、本文件。  
> 只有当前 Gate PASS 后，才允许继续下一阶段。

## 当前定位

- 当前 Phase：**Phase 1 · Garden 单视频实验 / 返工验收**
- 当前状态：**IN PROGRESS / Gate 未通过**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 参考：用户上传的 Harness Engineering 案例视频
- 当前范围：**只验收第一章**
- 章节：1
- Step：6
- TTS：Project5 / Edge / `zh-TW-YunJheNeural` / speed `1.10`
- 导出：浏览器本地 MediaRecorder → WebM

## 本轮后台整理

- [x] 开发前重新读取 PROJECT_CHARTER / PRD / DEVELOPMENT_STATUS
- [x] 侧栏继续保持“制作 / 资源 / 系统”三组，不塞实验直链
- [x] 新增独立 `works.html` 视频作品中心
- [x] 当前主验收作品与实验归档在作品中心分开显示
- [x] Harness 第一章作为唯一主验收作品
- [x] RAG 第一版只保留为实验归档
- [x] 首页“视频作品”入口直接进入作品中心，不再混入旧 Studio 路由
- [x] 移动端“作品”入口同步指向作品中心

## 第一章已完成项

- [x] 按用户参考视频重新拆解视觉语言
- [x] 米白细网格背景
- [x] 中央白色浮层卡片与克制阴影
- [x] 青绿色 / 珊瑚红双强调色
- [x] 信息图卡片逐步揭示
- [x] 底部黄色字幕
- [x] 1920×1080 固定舞台
- [x] 6 个 Step / 6 段 Narration
- [x] 去除 emoji 图标，统一改为线稿 SVG
- [x] 缩小标题和卡片比例，更接近参考视频的信息图讲解风
- [x] 禁用浏览器 SpeechSynthesis 作为正式配音
- [x] 页面只接受 ETG1 (`zh-TW-YunJheNeural`) 的 `audio-map.json`
- [x] ETG1 未就绪时禁止自动播放并禁止录制静音成片
- [x] WebAudio 轻量转场音效已加入
- [x] 浏览器一键录制 / 本地 WebM 下载逻辑已加入
- [x] `scripts/generate-harness-audio.mjs` 已固定 Project5 / Edge / 云哲 / 1.10

## 当前未通过项

- [ ] Project5 实际生成第一章 6/6 ETG1 音频
- [ ] `presentations/harness-engineering/audio-map.json` 变为 `ready`
- [ ] 浏览器实测 6/6 Step 真实播放云哲台湾男声
- [ ] 实际音画同步自检 PASS
- [ ] 用户确认第一章视觉风格 PASS

## 当前 Gate

**FAIL / 不进入第二章。**

当前代码不再伪造“已经配好音”。真正通过标准是：视觉通过用户验收 + 6 段 ETG1 全部 ready + 音画同步实测通过。

## ETG1 生成命令

仅在能够访问 Project5 且已经安全配置 API Key 的服务端执行：

```bash
export PROJECT5_BASE_URL="http://186.244.245.177:28442"
export PROJECT5_API_KEY="YOUR_REAL_KEY"
node scripts/generate-harness-audio.mjs
```

API Key 禁止进入浏览器、HTML、公开 GitHub、截图或日志。

## 禁止越级

在当前第一章未 PASS 前，不继续：

- 第二章
- 2～3 分钟完整版
- 大规模资源库扩建
- 本地 MP4
- 新视频主题实验

原因：当前首要任务是把一条参考视频级别的 Garden + ETG1 + 音效 + 浏览器本地导出链路做对。

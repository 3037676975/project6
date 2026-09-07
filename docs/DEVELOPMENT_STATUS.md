# Project6 开发状态

> 每次开发前必须依次阅读 `docs/PROJECT_CHARTER.md`、`docs/PRD.md`、本文件。  
> 第一章开发还必须阅读 Garden 官方 `SKILL.md`、`CHAPTER-CRAFT.md`、`AUDIO.md`、`RECORDING.md` 和 `presentations/harness-engineering/ACCEPTANCE.md`。  
> 只有当前 Gate PASS 后，才允许继续下一阶段。

## 当前定位

- 当前 Phase：**Phase 1 · Garden 单视频实验 / 第一章返工验收**
- 当前状态：**IN PROGRESS / Gate 未通过**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 参考：用户上传 Harness Engineering 案例视频
- 当前范围：**只做第一章，不进入第二章**
- Garden Theme：**官方 `warm-keynote`**
- 章节：1
- Step：6
- TTS：**Project5 / Edge / `zh-TW-YunJheNeural` / speed `1.10`**
- 导出：浏览器本地 MediaRecorder → WebM

## 本轮已重新建立的标准

- [x] 已重新完整阅读 Garden `web-video-presentation/SKILL.md`
- [x] 已重新阅读 `CHAPTER-CRAFT.md`
- [x] 已重新阅读 `AUDIO.md`
- [x] 已重新阅读 `THEMES.md`
- [x] 已重新阅读 `RECORDING.md`
- [x] 已新增 `presentations/harness-engineering/ACCEPTANCE.md` 硬 Gate
- [x] 已新增 `scripts/validate-harness-chapter1.mjs` 机器验收脚本

## 第一章已完成的返工

- [x] 固定 1920×1080 16:9 舞台
- [x] 使用 Garden 官方 `warm-keynote` 主题设计 DNA
- [x] 奶油底 + 40px 网格 + 白色 glass slab + 青绿 accent
- [x] 删除上一版固定黄色字幕，当前第一章**无字幕组件**
- [x] 删除 emoji 图标，改为 SVG / CSS 线稿与几何演示
- [x] 6 Step / 6 Narration 节拍保持一一对应
- [x] 每屏控制 1～3 个主要视觉重点
- [x] 多组 SVG / CSS 动态演示
- [x] 不同 Step 使用不同主动作：标题组装 / 对比状态 / 组件抬升 / pipeline / 循环 / 概念收束
- [x] 禁用 SpeechSynthesis 等正式 fallback
- [x] 页面只接受 Project5 + Edge + `zh-TW-YunJheNeural` + 1.10
- [x] ETG1 未 ready 时禁止 Auto 成片和录制伪完整成片
- [x] WebAudio 轻量 SFX 保留，但不替代 narration
- [x] MediaRecorder 本地 WebM 导出逻辑保留
- [x] 后台导航已收敛；实验作品统一进入视频作品中心
- [x] P0026 已标记 `gardenTheme=warm-keynote`、`ttsProvider=Project5`

## 当前未通过项

- [ ] Project5 实际生成第一章 **6/6** ETG1 音频
- [ ] `presentations/harness-engineering/audio-map.json` 状态变为 `ready`
- [ ] 浏览器实测 6/6 Step 均为 `zh-TW-YunJheNeural`
- [ ] 实际逐 Step 音画同步 PASS
- [ ] 本地录制实测 PASS
- [ ] 用户确认第一章视觉 PASS

## 当前 Gate

**FAIL / 不进入第二章。**

原因不是视觉代码继续欠缺，而是正式 TTS 还没有真实 6/6 ready。`audio-map.json` 当前仍是：

```text
provider = project5
engine   = edge
voice    = zh-TW-YunJheNeural
speed    = 1.10
status   = pending
segments = 0
```

在真实音频未生成前，禁止声称“第一章配音完成”。

## ETG1 唯一允许的生成方式

在**能够访问 Project5 且安全配置 API Key 的服务端**执行：

```bash
export PROJECT5_BASE_URL="http://186.244.245.177:28442"
export PROJECT5_API_KEY="YOUR_REAL_KEY"
node scripts/generate-harness-audio.mjs
node scripts/validate-harness-chapter1.mjs
```

API Key 禁止进入浏览器、HTML、公开 GitHub、截图或日志。

## 禁止越级

当前第一章未 PASS 前，不继续：

- 第二章
- 2～3 分钟完整版
- 新视频主题实验
- 本地 MP4
- 大规模资源库扩建

当前第一优先级只有一件事：把 **Garden 官方标准 + 参考视频视觉 + Project5 ETG1 + 音效 + 浏览器本地导出** 的第一章完整跑通。

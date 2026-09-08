# Harness Engineering · 第一章验收标准 v3

> 本文件是第一章硬 Gate。每次继续开发前必须依次阅读：
> `docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → `docs/DEVELOPMENT_STATUS.md` → Garden 官方 `SKILL.md` / `CHAPTER-CRAFT.md` / `AUDIO.md` / `RECORDING.md` → 本文件。

## 1. 先验收“讲什么”

- [x] 第一章必须一句话说清主题：**模型之外的运行系统，决定 Agent 能不能稳定把任务做完。**
- [x] 每个 Step 只承担一个口播节拍，不把整段说明书搬上屏。
- [x] 口播必须像日常讲解，而不是论文 / PRD / 产品说明书。
- [x] 优先使用“你有没有发现 / 你第一反应是不是 / 结果呢 / 你可以把它想成”等自然转折。
- [x] 例子必须让观众能立刻想象：研究十家公司 → 查资料 → 记来源 → 看缺口 → 继续下一家。
- [ ] 用户听完整章后确认：主题清楚、口播自然、愿意继续听。

## 2. 配音自然

当前第一章正式 Voice：

```text
provider = edge-tts
client   = rany2/edge-tts
voice    = zh-CN-YunxiNeural
locale   = zh-CN
rate     = +0%
speed    = 1.0x
```

选择原因：云希的 voice metadata 更偏 Lively / Sunshine / Novel，比云哲更适合轻松聊天式知识讲解。

- [x] 不经过 Project5。
- [x] 禁止 SpeechSynthesis 等 fallback 冒充正式旁白。
- [ ] 6/6 云希 MP3 真实生成并进入仓库。
- [ ] 实机听感 PASS：不机械、不像新闻播报、停顿自然。

> 后续会做 TTS 音色选择后台，但**本轮不开发完整音色中心**。

## 3. 画面好看

- [x] 固定 1920×1080 / 16:9 Garden 舞台。
- [x] 使用 Garden 官方 `warm-keynote` 设计 DNA。
- [x] 无字幕条、无 emoji 图标。
- [x] 第一屏保留强开场视觉。
- [x] 第二屏增加信息密度：同一模型分叉为“执行翻车 / 稳定闭环”，两侧均有状态信号，不允许大面积空白。
- [x] 第三屏做 Agent 工作台；第四屏做 Prompt vs Harness 类比；第五屏做十家公司执行循环；第六屏收束主结论。
- [ ] 6 屏逐屏检查：构图、字号、留白、信息密度均衡。

## 4. 动画衔接

- [x] 每个 Step 有独立主动作，不使用全章同一种淡入。
- [x] Scene 使用统一离场 / 入场语言，避免闪切。
- [x] SVG / CSS 动画至少 2 处，且用于“演示关系”而非装饰。
- [x] 不用 `setTimeout` / `setInterval` 驱动章节动画生命周期。
- [ ] 连续播放 6 Step 不重叠、不残影、不卡顿。

## 5. 手动 / 自动播放必须真的可用

### 手动模式

- [x] 明确显示“手动”模式。
- [x] 上一页 / 下一页按钮可用。
- [x] 点击舞台可推进下一 Step。
- [x] ← / → 键可导航。
- [x] 可单独点击“播放当前旁白”。
- [x] 手动模式不会因为旁白结束自己翻页。

### 自动模式

- [x] 明确显示“自动”模式。
- [x] 自动模式从当前 Step 播放正式旁白。
- [x] 严格由 `audio ended` 推进下一 Step。
- [x] 最后一段结束后停止 BGM 并退出 Auto。
- [ ] 实机 Auto 6 Step 连续播放 PASS。

## 6. 背景音乐不能锁死

第一章提供：

- 无音乐
- 轻松科技 · Short Plingy Loop（CC0）
- 轻松氛围 · Calm Loop（CC0）
- 轻快神秘 · Other Center（CC0）
- 本地上传音乐

硬要求：

- [x] 有预置音乐选择入口。
- [x] 有本地上传入口。
- [x] 本地文件只通过浏览器 `URL.createObjectURL` 使用，不上传服务器。
- [x] 有独立 BGM 音量滑杆。
- [x] 默认音量低，旁白优先。
- [ ] 三个预置资源实际可播放。
- [ ] 用户主观确认 BGM 舒服。

## 7. 本地录制 / 下载

- [x] 用户主动点击“录制并下载”。
- [x] 使用浏览器 `getDisplayMedia + MediaRecorder`。
- [x] 录制开始后隐藏播放器和音乐面板。
- [x] 录制数据留在浏览器内存，不上传 Project6。
- [x] 录制结束后直接触发 `harness-engineering-chapter1.webm` 本地下载。
- [ ] 实机完整录制一次，检查画面、旁白、BGM 都进入文件。

## 最终 Gate

必须同时满足：

- 主题清楚：PASS
- 口播自然：≥ 90 / 100
- 配音听感：≥ 90 / 100
- 画面好看：≥ 90 / 100
- 动画衔接：≥ 90 / 100
- 手动模式：PASS
- 自动模式：PASS
- BGM 选择 / 本地上传：PASS
- 本地录制 / 自动下载：PASS
- 用户验收：PASS

任一项 FAIL：**继续修改，不进入第二章。**

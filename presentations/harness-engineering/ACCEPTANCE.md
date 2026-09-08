# Harness Engineering · 第一章验收标准 v4

> 本文件是第一章硬 Gate。每次继续开发前必须依次阅读：
> `docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → `docs/DEVELOPMENT_STATUS.md` → Garden 官方 `SKILL.md` / `CHAPTER-CRAFT.md` / `AUDIO.md` / `RECORDING.md` → 本文件。

## 1. 先验收“讲什么”

- [x] 第一章一句话主题明确：**模型之外的运行系统，决定 Agent 能不能稳定把任务做完。**
- [x] 每个 Step 只承担一个口播节拍，不把整段说明书搬上屏。
- [x] 口播像日常讲解，不是论文 / PRD / 产品说明书。
- [x] 有自然转折和可想象的案例。
- [ ] 用户听完整章后确认：主题清楚、口播自然、愿意继续听。

## 2. 配音自然

当前正式 Voice：

```text
provider = edge-tts
client   = rany2/edge-tts
voice    = zh-CN-YunxiNeural
locale   = zh-CN
rate     = +0%
speed    = 1.0x
```

- [x] 不经过 Project5。
- [x] 禁止 SpeechSynthesis fallback。
- [x] 6/6 云希 MP3 已真实生成。
- [ ] 实机听感最终 PASS：不机械、不像新闻播报、停顿自然。

## 3. 画面好看

- [x] 固定 1920×1080 / 16:9 Garden 舞台。
- [x] 使用 Garden 官方 `warm-keynote` 设计 DNA。
- [x] 无字幕条、无 emoji 图标。
- [x] 第一屏保持强开场视觉。
- [x] 2～5 屏信息密度已提高。
- [x] 工具栏完全位于舞台外，不侵占成片画面。
- [x] 小字字号和字重已整体提升。
- [ ] 6 屏逐屏最终检查：构图、字号、留白、信息密度均衡。

## 4. Narration Beat 动效（新增硬 Gate）

核心原则：**观众现在听到什么，就让对应视觉现在出现。**

- [x] 第一章已经建立 `data-beat` 视觉标记。
- [x] 播放当前旁白 / Auto 时进入 Beat Reveal 模式。
- [x] Beat 进度使用真实 `audio.currentTime / audio.duration`。
- [x] Manual 纯浏览状态可以显示完整画面，方便检查。
- [x] 第二屏按“问题 → 失败侧 → 失败信号 → 稳定侧 → 稳定信号”顺序出现。
- [x] 第三屏按“工作台 → 工具/状态 → Harness 作用 → 最终目标”顺序出现。
- [x] 第四屏按“聪明员工 → Prompt → 工作环境 → Context/Tools/State/Recovery → 结论”顺序出现。
- [x] 第五屏按“任务 → 循环流程 → 无 Harness → 有 Harness → 10 家公司进度”顺序出现。
- [x] 第六屏按“结论标签 → 主结论 → 中文解释 → 四层 Harness”顺序收束。
- [ ] 实机听看确认：每个 Reveal 与真实语义点基本对应，没有过早或过晚。
- [ ] 连续 Auto 6 Step 不出现元素闪回、残影或一开始全亮。

## 5. 动画资源库

- [x] 后台新增独立 `motions.html` 动效库。
- [x] 新增 `data/motions.json` 开源动效库目录。
- [x] 第一批收录 Anime.js / Motion / Lottie Web / AutoAnimate / Animate.css / React Spring。
- [x] 动效库包含可直接重播的 Project6 Primitive 示例。
- [x] 建立 Primitive ID：`beat-reveal-01` / `flow-build-01` / `focus-shift-01` / `counter-progress-01`。
- [ ] 后续视频正式调用时，为每个使用的 Primitive 写进 manifest / scene metadata。

## 6. 手动 / 自动播放

### Manual
- [x] 手动模式明确可见。
- [x] 上一页 / 下一页可用。
- [x] 点击舞台和 ← / → 可导航。
- [x] 可单独播放当前旁白。
- [x] 手动模式旁白结束不会自动翻页。

### Auto
- [x] 自动模式明确可见。
- [x] Auto 由正式旁白 `ended` 推进下一 Step。
- [x] Auto 播放时同步启动 Narration Beat Reveal。
- [ ] 实机 Auto 6 Step 连续播放 PASS。

## 7. BGM

第一章提供：无音乐 / Short Plingy / Calm Loop / Other Center / 本地上传。

- [x] 3 个 CC0 预置。
- [x] 本地上传只使用 `URL.createObjectURL`，不上传服务器。
- [x] 独立音量控制。
- [ ] 用户主观确认最终 BGM 选择舒服。

## 8. 本地录制 / 下载

- [x] 使用浏览器 `getDisplayMedia + MediaRecorder`。
- [x] 检查 Secure Context；HTTP 环境不再静默失败。
- [x] 录制数据留在浏览器内存，不上传 Project6。
- [x] 录制结束自动下载 WebM。
- [x] 录制时工具栏弱化，不作为成片视觉。
- [ ] HTTPS / localhost 实机完整录制一次并检查画面、旁白、BGM。

## 最终 Gate

必须同时满足：

- 主题清楚：PASS
- 口播自然：≥ 90 / 100
- 配音听感：≥ 90 / 100
- 画面好看：≥ 90 / 100
- Narration Beat 动效：≥ 90 / 100
- 动画衔接：≥ 90 / 100
- Manual：PASS
- Auto：PASS
- BGM：PASS
- 本地录制：PASS
- 用户验收：PASS

任一项 FAIL：**继续修改，不进入第二章。**

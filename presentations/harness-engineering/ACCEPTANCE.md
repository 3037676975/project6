# Harness Engineering · 第一章验收标准 v7

> 每次继续开发前必须依次阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → 本文件 → Project6 本地 `vendor/upstream/emil-skills/` 相关动画 Skills。
>
> v7 的目标：**动画既要跟真实口播语义同步，也要在关键关系已经建立后保持“生命感”；持续动画只能服务连接、状态、流动、循环，不能让正文持续漂动。**

## 1. 内容与口播

- [x] 一句话主题：**模型之外的运行系统，决定 Agent 能不能稳定把任务做完。**
- [x] 6 个 Step 各自只有一段 narration。
- [x] 口播是聊天式中文，不是 PRD / 论文。
- [ ] 用户听完整章后确认内容自然、愿意继续听。

## 2. TTS + 隐藏时间码

```text
edge-tts
zh-CN-YunxiNeural
rate = +0%
1.0x
SentenceBoundary timing metadata
```

- [x] 6/6 MP3 已生成。
- [x] 无 SpeechSynthesis fallback。
- [x] 生成器同时输出 `timings.json` 和每 Step SRT。
- [x] SRT / timing 仅作为隐藏动画时间码，不显示成字幕条。
- [ ] 最终实机听感 PASS。

## 3. 画面

- [x] 1920×1080 固定 Garden 舞台。
- [x] warm-keynote 设计 DNA。
- [x] 控制条完全在舞台外。
- [x] 无可见字幕条。
- [x] 小字字号与字重已提高。
- [x] SVG 仍承担主要信息图标。
- [x] 允许 emoji 作为辅助视觉，但不得替代主图标、不得承担核心信息。
- [ ] 6 屏最终主观构图 PASS。

## 4. 动画设计链（v7 核心）

固定顺序：

```text
Garden Step / Narration
        ↓
find-animation-opportunities
判断哪些地方值得动、哪些地方不该动
        ↓
animate / animation-vocabulary / emil-design-eng
决定目的、属性、曲线、持续时间、物理关系
        ↓
GSAP Timeline / MotionPath / DrawSVG
执行一次性解释动画
        ↓
Continuous Ambient Motion Layer
只维持连接 / 状态 / 流动 / 循环的低强度生命感
        ↓
review-animations + improve-animations
按 Emil 标准重新审查整章
```

### 4.1 上游必须本地存在

- [x] `vendor/upstream/gsap/` 完整镜像 `greensock/GSAP`。
- [x] `vendor/upstream/emil-skills/` 完整镜像 `emilkowalski/skills`。
- [x] GSAP 原 README/package/许可证信息保留。
- [x] Emil MIT LICENSE 保留。
- [x] 后台动效库可以直接阅读这些本地原始文件。

### 4.2 允许动画的目的

每个主要动画至少命中一种：

- Explanation：解释“为什么 / 怎么工作”。
- Spatial consistency：让观众知道对象从哪里来、去哪里。
- State indication：让状态变化可理解。
- Preventing a jarring change：避免内容瞬移。
- Feedback：仅用于工具栏按钮等交互确认。
- **Ambient continuity：关系已经建立后，用低强度持续流动维持“这个系统仍然在运行”的感知。**

纯“看起来酷”不算理由。

### 4.3 严格 Step 边界

- [x] 6 个 Garden Step 对应 6 个独立 GSAP Timeline。
- [x] 每条 timeline 只操作自己的当前 scene。
- [x] GSAP timeline 不拥有 Step 导航权。
- [x] timeline 完成后保持当前 Step 最终状态。
- [x] Manual 播放当前旁白后不自动翻页。
- [x] Auto 唯一翻页条件是当前 narration `ended`。
- [x] Ambient loop 只在当前 scene `.active` 时运行，scene 失活立即 kill。
- [ ] 实机验证：绝不出现“旁白还在一，画面已跳到二”。

## 5. 真实语义同步，而不是百分比猜测

v7 继续禁止：

```text
audio.currentTime / duration
→ 粗百分比 threshold
→ data-beat
```

正式机制：

```text
edge-tts 同源 SentenceBoundary
        ↓
timings.json 的真实句子 start 时间
        ↓
narration.currentTime 只用于命中真实 cue
        ↓
GSAP tweenTo 当前 cue 对应的局部 timeline 终点
```

- [x] 不再存在 `data-beat`。
- [x] 不再按“音频百分比”猜语义点。
- [x] `timeupdate` 只和真实 TTS SentenceBoundary 做比较。
- [x] cue 只能推进当前 Step 内部动画。
- [ ] 实机逐句核对 6 段口播与画面动作时机。

## 6. 持续动画规则（v7 新硬 Gate）

持续动画只能用于以下概念：

- 数据 / 信号沿已经建立的连接线持续流动；
- 核心节点轻微 breathing / pulse；
- 执行循环中的 runner 周期运行；
- 进度状态按顺序循环演示；
- 可靠系统的低强度状态光晕。

禁止：

- 标题、正文、小字持续上下漂；
- 所有卡片持续 bounce；
- emoji 高频弹跳；
- 与当前讲解无关的无限循环；
- ambient loop 跨 Step 留在下一屏。

验收：

- [x] Step 1：关系线上持续有数据粒子流动，节点轻微呼吸。
- [x] Step 2：失败/稳定两条分支分别有低强度信号流，稳定侧保留轻微生命感。
- [x] Step 3：Agent Core 到四个模块的连接线上持续有小粒子流动。
- [x] Step 4：工作环境保持轻微状态光晕，Prompt token 只轻微 pulse，不重复穿梭抢注意力。
- [x] Step 5：runner 周期沿执行循环运行，01–10 状态循环展示。
- [x] Step 6：Reliable Agent 与四层 Harness 只做很轻的收束呼吸。
- [x] `prefers-reduced-motion` 下持续位移动画关闭。

## 7. Emoji 辅助视觉规则（v7 新）

- [x] emoji 只作辅助语义提示，例如 🧠 / ⚙️ / 📚 / 🔧 / 🧭 / 🛟 / 🔎 / 📝 / ✨。
- [x] emoji 不替代 SVG 主图标。
- [x] emoji 不承担按钮、状态、关键结论等唯一信息来源。
- [x] emoji 尺寸受控、低透明度、低频轻浮动。
- [x] Reduced Motion 下不做持续移动。
- [ ] 实机检查：emoji 是否真正增强理解，而不是显得幼稚或抢注意力。

## 8. Emil 动画规则

### 8.1 Easing / Duration

- [x] UI 进入 / 退出优先 strong ease-out。
- [x] 屏内移动 / morph 使用 ease-in-out / GSAP 等价曲线。
- [x] 工具栏按压反馈为 100–160ms 级别。
- [x] 不对普通工具栏做夸张长动画。
- [x] 视频解释动画可以更长，但必须服务讲解。
- [x] Ambient loop 使用低强度 linear / sine.inOut，不制造突然加速。

### 8.2 Physicality

- [x] 禁止 `scale(0)` 进入。
- [x] 卡片从 0.96–0.99 附近进入，保留实体感。
- [x] 流程、路径、节点具有方向关系。
- [x] 进入 / 退出方向尽量保持空间一致。

### 8.3 Performance

- [x] 普通 UI 动画优先 transform / opacity。
- [x] SVG Draw / MotionPath 只用于解释关系或低强度信号流。
- [x] 不用 `transition: all`。
- [x] 不用 top / left / width / height 做持续布局动画。

### 8.4 Accessibility

- [x] 存在 `prefers-reduced-motion`。
- [x] Hover 只在 `hover:hover` + `pointer:fine` 生效。
- [x] Reduced Motion 保留信息状态，只减少位移与动态感。

## 9. 第一章 6 屏空间故事

1. **Step 1：关系网络** — 路径建立后，数据粒子持续沿连接线流动。
2. **Step 2：同一模型分叉** — 两条分支建立后各自保持低强度信号传输。
3. **Step 3：Agent 工作台展开** — 四条连接建立后持续有工作流信号从 Core 向模块传递。
4. **Step 4：Prompt 到工作环境** — Prompt 一次性完成空间移动，随后环境保持轻微状态呼吸。
5. **Step 5：十家公司执行循环** — runner 周期循环，01–10 状态连续完成并复位。
6. **Step 6：Reliable Agent 收束** — 仅保留极轻的核心 pulse / layer wave。

## 10. 工具栏交互

- [x] Manual / Auto 状态明确。
- [x] Button press 有 160ms 以内反馈。
- [x] Hover 不影响触屏设备。
- [x] Focus-visible 可见。
- [x] 键盘左右切换保持快速，不强制播放长动画。

## 11. BGM

- [x] 无音乐 / 3 个 CC0 预置 / 本地上传。
- [x] 本地音乐不上传服务器。
- [ ] 用户最终选择满意。

## 12. 浏览器本地录制

- [x] `getDisplayMedia + MediaRecorder`。
- [x] Secure Context 检查。
- [x] 浏览器内存 → 自动下载 WebM。
- [x] Project6 服务器不保存成片。
- [ ] HTTPS 实机完整录制 PASS。

## 13. Emil Review Gate

每次提交第一章动画后必须重新检查：

- [ ] 是否存在“为了炫而动”的对象？有则删除。
- [ ] 是否还有整块 teleport / 一下全出现？有则改成空间连续过渡。
- [ ] 是否有 ease-in / scale(0) / transition: all / layout-property animation？有则 BLOCK。
- [ ] 动画是否影响文字阅读？影响则减弱或删除。
- [ ] Ambient loop 是否只服务“连接 / 状态 / 流动 / 循环”？不是则删除。
- [ ] 是否有持续动画在 scene 切换后残留？有则 BLOCK。
- [ ] emoji 是否抢占视觉层级？抢则减弱或删除。
- [ ] 2–5×慢放 / DevTools frame-by-frame 检查后无明显节奏断点。

## 最终 Gate

- 内容：PASS
- 配音：≥ 90
- 画面：≥ 90
- **TTS SentenceBoundary 同步：必须 PASS**
- **GSAP Step 边界：必须 PASS**
- **Continuous Ambient Motion：必须 PASS**
- **Emil Animation Review：必须 PASS**
- **动画不影响阅读：≥ 90**
- Manual：PASS
- Auto：PASS
- BGM：PASS
- 本地录制：PASS
- 用户最终验收：PASS

任一项 FAIL：**继续修改，不进入第二章。**

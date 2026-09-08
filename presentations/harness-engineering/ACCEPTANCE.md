# Harness Engineering · 第一章验收标准 v6

> 每次继续开发前必须依次阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → 本文件 → Project6 本地 `vendor/upstream/emil-skills/` 相关动画 Skills。
>
> v6 的目标不是“动画更多”，而是：**动画有目的、有空间关系、有物理连续性，并且真正跟旁白语义同步。**

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
- [x] SVG 图标替代 emoji 图标。
- [ ] 6 屏最终主观构图 PASS。

## 4. 动画设计链（v6 核心）

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
执行空间故事与解释动画
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

纯“看起来酷”不算理由。

### 4.3 严格 Step 边界

- [x] 6 个 Garden Step 对应 6 个独立 GSAP Timeline。
- [x] 每条 timeline 只操作自己的当前 scene。
- [x] GSAP timeline 不拥有 Step 导航权。
- [x] timeline 完成后保持当前 Step 最终状态。
- [x] Manual 播放当前旁白后不自动翻页。
- [x] Auto 唯一翻页条件是当前 narration `ended`。
- [ ] 实机验证：绝不出现“旁白还在一，画面已跳到二”。

## 5. 真实语义同步，而不是百分比猜测

v6 正式废弃：

```text
audio.currentTime / duration
→ 粗百分比 threshold
→ data-beat
```

新机制：

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

## 6. Emil 动画规则

### 6.1 Easing / Duration

- [x] UI 进入 / 退出优先 strong ease-out。
- [x] 屏内移动 / morph 使用 ease-in-out / GSAP 等价曲线。
- [x] 工具栏按压反馈为 100–160ms 级别。
- [x] 不对普通工具栏做夸张长动画。
- [x] 视频解释动画可以更长，但必须服务讲解。

### 6.2 Physicality

- [x] 禁止 `scale(0)` 进入。
- [x] 卡片从 0.96–0.99 附近进入，保留实体感。
- [x] 流程、路径、节点具有方向关系。
- [x] 进入 / 退出方向尽量保持空间一致。

### 6.3 Performance

- [x] 普通 UI 动画优先 transform / opacity。
- [x] SVG Draw / MotionPath 只用于解释关系。
- [x] 不用 `transition: all`。
- [x] 不用 top / left / width / height 做持续布局动画。

### 6.4 Accessibility

- [x] 存在 `prefers-reduced-motion`。
- [x] Hover 只在 `hover:hover` + `pointer:fine` 生效。
- [x] Reduced Motion 保留信息状态，只减少位移与动态感。

## 7. 第一章 6 屏空间故事

1. **Step 1：关系网络**  
   标签 → 标题从遮罩中抬起 → 关系路径绘制 → 节点建立 → traveler 沿路径移动。
2. **Step 2：同一模型分叉**  
   同一个模型 → 左侧失败分支生长 → 失败状态 → 右侧稳定分支生长 → 稳定状态聚焦。
3. **Step 3：Agent 工作台展开**  
   Agent Core → 四条连接线 → Context / Tools / State / Recovery 从中心关系中展开 → 收束成工作台。
4. **Step 4：Prompt 到工作环境**  
   员工 → Prompt token 沿桥接路径移动 → Harness 环境展开 → 四个条件出现 → 对比结论。
5. **Step 5：十家公司执行循环**  
   循环路径绘制 → runner 沿路径跑一圈 → 执行节点建立 → 两种执行模式对比 → 01–10 逐步完成。
6. **Step 6：Reliable Agent 收束**  
   主结论 → 中文解释 → 四层 Harness 向 Reliable Agent 聚合。

## 8. 工具栏交互

- [x] Manual / Auto 状态明确。
- [x] Button press 有 160ms 以内反馈。
- [x] Hover 不影响触屏设备。
- [x] Focus-visible 可见。
- [x] 键盘左右切换保持快速，不强制播放长动画。

## 9. BGM

- [x] 无音乐 / 3 个 CC0 预置 / 本地上传。
- [x] 本地音乐不上传服务器。
- [ ] 用户最终选择满意。

## 10. 浏览器本地录制

- [x] `getDisplayMedia + MediaRecorder`。
- [x] Secure Context 检查。
- [x] 浏览器内存 → 自动下载 WebM。
- [x] Project6 服务器不保存成片。
- [ ] HTTPS 实机完整录制 PASS。

## 11. Emil Review Gate

每次提交第一章动画后必须重新检查：

- [ ] 是否存在“为了炫而动”的对象？有则删除。
- [ ] 是否还有整块 teleport / 一下全出现？有则改成空间连续过渡。
- [ ] 是否有 ease-in / scale(0) / transition: all / layout-property animation？有则 BLOCK。
- [ ] 动画是否影响文字阅读？影响则减弱或删除。
- [ ] 场景是否有统一的 motion personality？不统一则重新收敛。
- [ ] 2–5×慢放 / DevTools frame-by-frame 检查后无明显节奏断点。

## 最终 Gate

- 内容：PASS
- 配音：≥ 90
- 画面：≥ 90
- **TTS SentenceBoundary 同步：必须 PASS**
- **GSAP Step 边界：必须 PASS**
- **Emil Animation Review：必须 PASS**
- **动画不影响阅读：≥ 90**
- Manual：PASS
- Auto：PASS
- BGM：PASS
- 本地录制：PASS
- 用户最终验收：PASS

任一项 FAIL：**继续修改，不进入第二章。**

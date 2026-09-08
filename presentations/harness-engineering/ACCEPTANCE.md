# Harness Engineering · 第一章验收标准 v22

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方 `web-video-presentation` → 本文件。

## v22 返工目标

用户反馈两个明确问题：
1. **音画有不同步感**；
2. **部分画面不好看 / 太像后台卡片页面。**

本轮不是推翻 Project6，而是把第一章拉回 Garden 的“视频网页”思路：一个清楚的视觉命题、真实空间关系、旁白驱动画面、画面结束后稳定停住。

---

## 1. Garden / Audio Gate

- [x] 6 个现有 Garden Step 与 6 段 narration 一一对应。
- [x] Step 内视觉阶段只读取 `timings.json` SentenceBoundary。
- [x] 删除 `8.6 / 10.45 / 12.25` 等人为猜测句内语义的 currentTime 阈值。
- [x] GSAP 不负责切换 Garden Step。
- [x] Manual narration 结束后停留当前 Step。
- [x] Auto 只在 narration `ended` 后进入下一 Step。
- [x] Auto 在 narration 结束后保留 200ms 缓冲。
- [ ] 浏览器实机连续播放 6 Step，听感 PASS。

> 当前 6 段旧音频里仍有长句。v22 的策略是：**不再假装逐词精确同步**，长句显示一个完整系统关系，不让几个子元素按猜测秒数抢跑。等用户本地 IndexTTS 批量音频工作流接入后，再把长句从源头拆成更细 Garden Step。

---

## 2. Theme Gate · Garden warm-keynote

Garden 官方 Warm Keynote 的核心性格：奶油纸底、暖色网格、单一 teal/青色强调、SaaS keynote / editorial 气质。

- [x] 正式页面统一使用 `--shell / --surface / --text / --accent ...` token。
- [x] 主强调色统一 teal，不再混用多套页面主题。
- [x] 1920×1080 舞台保持暖纸张网格。
- [x] 控制器在视频舞台外。
- [x] 无紫粉 AI 渐变、无 Emoji 图标。
- [ ] 用户确认主题比上一版更舒服、更像视频设计而不是后台系统。

---

## 3. Step 1 · Runtime Shell

- [x] 左侧只保留一个 Hook 主视觉中心。
- [x] 右侧 LLM + Context / Tools / State / Recovery 构成真正空间关系。
- [x] 路径与低强度信号流动用于表达“系统正在运行”。
- [x] 不再堆普通四卡片。

## 4. Step 2 · Execution Rail

- [x] 删除左右两块大卡片的 Unstable / Stable 后台式对比。
- [x] 改成 LLM → Tool → State → Recovery → Result 单一执行轨。
- [x] 失败用断链结构表达，不用大面积报警色。
- [x] “工具 / 状态 / 卡住”不再依赖手写秒数逐项弹出。

## 5. Step 3 · Agent Workbench

- [x] 删除 Resources + 深色 Console + Activity 三栏后台布局。
- [x] 改为一个中心 Workbench + 四个能力端口。
- [x] 画面主命题是“组织成完整系统”，而不是展示复杂后台 UI。

## 6. Step 4 · Prompt inside Harness

- [x] 不再做普通 VS 卡片。
- [x] 用“Prompt ticket 位于 Harness Operating Environment 内部”的包含关系解释差别。
- [x] Context / Tools / State / Recovery 是 Harness 的运行能力，不是装饰列表。

## 7. Step 5 · Ten-company loop

- [x] 删除 `Alpha AI / Nova Labs / Orbit Data ...` 等虚构公司名。
- [x] 删除 `6 VERIFIED / 4 PENDING / 8 sources ...` 等虚构统计。
- [x] 只使用口播中真实存在的“10 家公司”概念，以 01～10 任务节点呈现。
- [x] Prompt-only = 搜索 → 生成 → 总结。
- [x] Harness = 查资料 → 记来源 → 看缺口 → 继续验证 → 下一家。

## 8. Step 6 · Summary

- [x] 主结论：Model Intelligence × Execution System = Reliable Agent。
- [x] Context / Tools / State / Recovery 作为底层基础收束。
- [x] 结尾停稳，不让持续动画抢主结论。

---

## 9. 工程 / 录制 Gate

- [x] Manual / Auto 分离。
- [x] BGM 内置选项 + 本地上传；本地文件只使用 ObjectURL。
- [x] Reduced Motion 支持。
- [x] 录制仍走浏览器 `getDisplayMedia + MediaRecorder`，不上传服务器。
- [ ] HTTPS 实机录制完整 WebM PASS。

---

## 自检结论 v22

### 已通过（代码 / 结构）
- Garden Step 与 narration 文件映射：PASS
- SentenceBoundary 驱动：PASS
- 删除人工句内秒数：PASS
- narration ended + 200ms Auto 边界：PASS
- warm-keynote 统一：PASS
- 页面 2 / 3 去后台卡片墙：PASS
- 页面 5 去假数据：PASS
- 第二章未开发：PASS

### 必须由用户实机确认
- 6 Step 连播真实听感；
- 每一屏审美；
- 缩放后的文字可读性；
- HTTPS 完整录制。

**用户最终 PASS 之前，第一章 Gate 不关闭，不进入第二章。**

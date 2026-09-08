# Project6 开发状态

> 每次开发前必须依次阅读：
> `docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。
>
> 第一章开发还必须阅读 Garden 官方 `SKILL.md`、`CHAPTER-CRAFT.md`、`AUDIO.md`、`THEMES.md`、`RECORDING.md` 和 `presentations/harness-engineering/ACCEPTANCE.md`。
> 只有当前 Gate PASS 后，才允许继续下一阶段。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章返工验收**
- 当前状态：**IN PROGRESS / 87 分后继续精修**
- 最新用户评分：**87 / 100**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 当前范围：**只做第一章，不进入第二章**
- Garden Theme：官方 `warm-keynote`
- 章节：1
- Step：6
- 当前 TTS：`rany2/edge-tts` / `zh-CN-YunxiNeural` / `rate=+0%` / 1.0×
- 当前 BGM：无音乐 / 3 个 CC0 预置 / 浏览器本地上传
- 导出：浏览器本地 MediaRecorder → WebM

## 已完成

- [x] 主题一句话明确。
- [x] 6 段 narration 改成聊天式中文口播。
- [x] 云希 6/6 MP3 已生成。
- [x] Manual / Auto 模式彻底分开。
- [x] BGM 支持无音乐 / 3 个 CC0 预置 / 本地上传 / 音量调节。
- [x] 控制区移出 1920×1080 舞台。
- [x] 小字字号与字重整体上调。
- [x] 2～5 屏增加状态、组件、循环节点、进度等 secondary motion。
- [x] 录制按钮增加授权 / 录制 / 下载状态反馈，并检查 HTTPS Secure Context。
- [x] 视频作品页验收标准与开发状态改为页内折叠查看。

## 2026-09-08 · 87 分反馈新增完成

### 独立动效库

- [x] 后台资源导航增加独立「动效库」。
- [x] 新增 `motions.html`，提供开源动效引擎卡片和可重播 Demo。
- [x] 新增 `data/motions.json`，第一批收录：Anime.js、Motion、Lottie Web、AutoAnimate、Animate.css、React Spring。
- [x] 第一批 Project6 Primitive：`beat-reveal-01`、`flow-build-01`、`focus-shift-01`、`counter-progress-01`。
- [x] 动效库明确“引擎层”和“业务层”分离：业务层只认统一 Primitive / `data-beat`，底层可用 Anime.js / Motion / WAAPI 等替换。

### 第一章 Narration Beat Reveal

- [x] 第一章 6 个 Step 均加入 `data-beat` 标记。
- [x] 播放当前旁白和 Auto 模式时使用 `audio.currentTime / duration` 驱动 Beat。
- [x] 不再默认整屏关键内容一次性出现。
- [x] 第二屏顺序：标题 → 失败系统 → 失败信号 → 稳定系统 → 稳定信号。
- [x] 第三屏顺序：工作台 → 工具 / 状态 → Harness 作用 → 最终目标。
- [x] 第四屏顺序：聪明员工 → Prompt → 工作环境 → Harness 四层 → 结论。
- [x] 第五屏顺序：研究任务 → 执行循环 → 无 Harness → 有 Harness → 十家公司进度。
- [x] 第六屏顺序：章节结论 → 英文主结论 → 中文解释 → Context / Tools / State / Recovery。
- [x] Manual 非播放状态仍可看完整画面，便于检查布局。

## 当前待通过

- [ ] 实机听看每个 Beat 是否与中文语义点足够贴合，需要按真实音频继续微调 threshold。
- [ ] Browser Auto 6 Step 连续播放时 Beat 不闪回、不残影、不提前全亮。
- [ ] 动效库后续补更多 SVG / 图表 /数字 / 路径动画 Primitive。
- [ ] 录制按钮在最终 HTTPS 地址完成真实授权测试。
- [ ] 三个 BGM 主观听感最终选择 PASS。
- [ ] 完整 WebM 录制 / 自动下载实机 PASS。
- [ ] 用户确认第一章达到 90+ 并最终 PASS。

## 当前 Gate

**代码 / 资源 Gate：等待本轮 CI 复检。**

**产品最终 Gate：IN PROGRESS。**

当前主要差距已经进一步集中到：**Narration Beat 与真实语义同步精度、动效细节、浏览器实机录制、最终用户体验。** 第一章未最终 PASS 前，不进入第二章。

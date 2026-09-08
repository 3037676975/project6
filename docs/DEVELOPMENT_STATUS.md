# Project6 开发状态

> 每次开发前必须依次阅读：
> `docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。
>
> 第一章开发还必须阅读 Garden 官方 `SKILL.md`、`CHAPTER-CRAFT.md`、`AUDIO.md`、`THEMES.md`、`RECORDING.md` 和 `presentations/harness-engineering/ACCEPTANCE.md`。
> 只有当前 Gate PASS 后，才允许继续下一阶段。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章返工验收**
- 当前状态：**IN PROGRESS / 用户上一版评分 50 分**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 当前范围：**只做第一章，不进入第二章**
- Garden Theme：官方 `warm-keynote`
- 章节：1
- Step：6
- 当前 TTS：`rany2/edge-tts` / `zh-CN-YunxiNeural` / `rate=+0%` / 1.0×
- 当前 BGM：可选预置 + 本地上传，不再锁死一首
- 导出：浏览器本地 MediaRecorder → WebM

## 本轮用户扣分原因

1. 口播稿不像真人说话，主题表达不够清楚。
2. 云哲听感偏平，需要更有聊天感的音色。
3. BGM 选择差且被锁死，缺少上传 / 选择入口。
4. Manual / Auto 模式不清楚，手动操作反馈差。
5. 第二屏以后信息密度不足，画面偏空。
6. 之前验收偏代码指标，没有把“主题讲清楚 / 口播自然 / 用户愿意听”放到硬 Gate。

## 已完成的新返工

- [x] 重新定义第一章一句话主题：模型之外的运行系统，决定 Agent 能不能稳定把任务做完。
- [x] 6 段 narration 全部改成聊天式中文口播。
- [x] 正式音色改为 `zh-CN-YunxiNeural`（云希，Lively / Sunshine）。
- [x] TTS 生成脚本改为从 `narrations.json` 动态读取 voice / locale / rate，便于未来接音色选择后台。
- [x] 第一章播放器重新实现明确的 Manual / Auto 模式。
- [x] Manual 支持上一页 / 下一页 / 点击舞台 / ←→ / 单独播当前旁白。
- [x] Auto 仅按正式旁白 `ended` 推进。
- [x] 第二屏提高信息密度：同一模型分叉为失败执行系统 / 稳定执行系统，并加入状态信号。
- [x] 第三、四、五屏分别强化“工作台 / 类比 / 十家公司闭环”视觉关系。
- [x] BGM 面板增加：无音乐 / 3 个 CC0 预置 / 本地上传 / 音量控制。
- [x] 本地上传只用 `URL.createObjectURL`，不上传服务器。
- [x] 本地录制逻辑仍为 getDisplayMedia + MediaRecorder + 自动下载 WebM。
- [x] `ACCEPTANCE.md` 升级到 v3，加入“讲什么 / 口播自然 / 手动模式 / BGM 选择”硬 Gate。

## 当前待通过

- [ ] GitHub Actions 完成云希 6/6 MP3 重生成。
- [ ] 三个预置 BGM 均真实落盘并可播放。
- [ ] v3 自动 Gate PASS。
- [ ] 浏览器 Manual 实机操作 PASS。
- [ ] 浏览器 Auto 6 Step 连续播放 PASS。
- [ ] 本地 BGM 上传实机 PASS。
- [ ] 完整 WebM 录制 / 自动下载实机 PASS。
- [ ] 用户确认：主题清楚、口播自然、音色合适、画面信息密度与动画效果 PASS。

## 当前 Gate

**FAIL / 继续返工，不进入第二章。**

本轮不是因为“功能还没堆够”，而是因为上一版产品体验只有 50 分。必须先把内容、声音、播放、BGM 和画面密度做成一条真正能看的视频，再继续扩展。

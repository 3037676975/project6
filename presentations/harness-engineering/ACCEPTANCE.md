# Harness Engineering · 第一章验收标准 v5

> 每次继续开发前必须依次阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → 本文件 → Project6 本地 `vendor/upstream/emil-skills/skills/animate/SKILL.md` 与 `review-animations/STANDARDS.md`。

## 1. 内容与口播

- [x] 一句话主题：**模型之外的运行系统，决定 Agent 能不能稳定把任务做完。**
- [x] 6 个 Step 各自只有一段 narration。
- [x] 口播是聊天式中文，不是 PRD / 论文。
- [ ] 用户听完整章后确认内容自然、愿意继续听。

## 2. TTS

```text
edge-tts
zh-CN-YunxiNeural
rate = +0%
1.0x
```

- [x] 6/6 MP3 已生成。
- [x] 无 SpeechSynthesis fallback。
- [ ] 最终实机听感 PASS。

## 3. 画面

- [x] 1920×1080 固定 Garden 舞台。
- [x] warm-keynote 设计 DNA。
- [x] 控制条完全在舞台外。
- [x] 无字幕条。
- [x] 小字字号与字重已提高。
- [ ] 6 屏最终主观构图 PASS。

## 4. GSAP 动画核心（v5 新硬 Gate）

Project6 当前动画核心：

```text
Garden Step / Narration
        ↓
Emil Skills 做动画设计判断与 Review
        ↓
GSAP Timeline 执行当前 Step 内动画
```

### 4.1 上游必须本地存在

- [x] `vendor/upstream/gsap/` 完整镜像官方 `greensock/GSAP`。
- [x] `vendor/upstream/emil-skills/` 完整镜像官方 `emilkowalski/skills`。
- [x] GSAP 原 README/package/许可证信息保留。
- [x] Emil MIT LICENSE 保留。
- [x] 后台 `motions.html` 能直接读取本地上游原始文档。

### 4.2 严格 Step 边界

- [x] 第一章存在 6 条独立 GSAP timeline。
- [x] 每条 timeline 只查询/操作自己的 `.scene[data-step]` 内容。
- [x] GSAP timeline 不调用下一 Step。
- [x] timeline 完成后保持当前 Step 最终状态。
- [x] Manual 播放当前旁白后不自动翻页。
- [x] Auto 唯一翻页条件是当前 narration `ended`。
- [ ] 实机验证：绝不再出现“旁白还在一，画面已跳到二”。

### 4.3 废弃错误同步方案

以下正式禁止：

```text
audio.currentTime / duration
→ 粗百分比 threshold
→ data-beat 作为正式语义同步
```

- [x] 正式第一章已删除该主逻辑。
- [x] 不再使用 `narration.ontimeupdate` 驱动跨元素粗同步。

### 4.4 Emil 动画规则

- [x] 每个动画必须有 Explanation / State / Spatial / Feedback 等目的。
- [x] 进入优先 strong ease-out。
- [x] 顺序内容使用 stagger，而不是整屏一次出现。
- [x] 正在阅读的文字不会无意义持续漂移。
- [x] 不用 `scale(0)`。
- [x] 优先 transform / opacity；SVG 路径例外用于解释关系。
- [ ] 实机 Review：动画没有影响阅读、没有抢注意力、没有拖沓。

## 5. 第一章 6 条动画逻辑

1. Step 1：标签 → 标题 → 核心问题 → SVG 关系线。
2. Step 2：问题 → 执行翻车 → 失败信号 → VS → 稳定闭环 → 稳定信号。
3. Step 3：工作台 → 4 个模块 → Harness 作用卡片。
4. Step 4：员工 / Prompt → 工作环境 → 4 个 Harness 条件 → 结论。
5. Step 5：十家公司任务 → 执行循环 → 4 个节点 → 对比 → 公司进度。
6. Step 6：章节提示 → 英文主结论 → 中文解释 → 四层 Harness。

这些顺序只属于各自当前 narration，不得跨 Step 提前展示下一段内容。

## 6. Manual / Auto

### Manual
- [x] 上一页 / 下一页 / ←→ / 点击舞台可导航。
- [x] “当前旁白”只播放当前 Step narration 和当前 Step GSAP timeline。
- [x] narration 结束后保持当前 Step。

### Auto
- [x] 从当前 Step 播 narration + 当前 Step timeline。
- [x] narration `ended` 后才进入下一个 Step。
- [ ] 实机完整 Auto 6 Step PASS。

## 7. BGM

- [x] 无音乐 / 3 个 CC0 预置 / 本地上传。
- [x] 本地音乐不上传服务器。
- [ ] 用户最终选择满意。

## 8. 浏览器本地录制

- [x] `getDisplayMedia + MediaRecorder`。
- [x] Secure Context 检查。
- [x] 浏览器内存 → 自动下载 WebM。
- [x] Project6 服务器不保存成片。
- [ ] HTTPS 实机完整录制 PASS。

## 最终 Gate

- 内容：PASS
- 配音：≥ 90
- 画面：≥ 90
- **GSAP Step 边界：必须 PASS**
- **动画不影响阅读：≥ 90**
- Manual：PASS
- Auto：PASS
- BGM：PASS
- 本地录制：PASS
- 用户最终验收：PASS

任一项 FAIL：**继续修改，不进入第二章。**

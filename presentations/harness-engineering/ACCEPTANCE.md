# Harness Engineering · 第一章验收标准 v23

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → 本文件。

## 当前验收对象

第一章《Harness Engineering》共 6 个 Step / 6 张画面。当前不进入第二章。

## Gate A · 口播稿

状态：**PASS / 用户可重新确认**

- [x] 6 个 Step 均有独立口播。
- [x] 口播文本与画面 Step 一一对应。
- [x] Project6 作品页必须完整展示口播稿。
- [x] 用户点击“确认口播稿”后，才允许进入本地 TTS 阶段。
- [x] TTS JSON 必须可见预览，并提供一键复制。
- [x] JSON 任务编号固定为 `001`～`006`。

## Gate B · Garden 画面

状态：**CODE PASS / USER REVIEW**

- [x] 第一章 6 张画面均已实现。
- [x] 统一使用 Garden `warm-keynote` 视觉逻辑。
- [x] 删除后台卡片墙式画面。
- [x] Step 2 使用 Execution Rail。
- [x] Step 3 使用 Agent Workbench。
- [x] Step 4 使用 Prompt inside Harness 包含关系。
- [x] Step 5 删除虚构公司与虚构统计。
- [x] Step 6 使用 `Intelligence × Execution System = Reliable Agent` 收束。
- [ ] 用户逐张确认第 1～6 张画面。

## Gate C · 本地 IndexTTS 交接

状态：**READY / WAITING AUDIO ZIP**

- [x] Project6 只生成 TTS 任务 JSON，不负责本地 GPU 推理。
- [x] JSON 可复制给本地 IndexTTS 2.5 工作台。
- [x] 本地输出约定：`001.mp3`～`006.mp3` + `manifest.json`。
- [x] Project6 支持导入 ZIP，并在浏览器内用 JSZip 解压。
- [x] 音频按编号自动匹配画面。
- [ ] 用户上传真实 IndexTTS ZIP。
- [ ] 6/6 匹配通过。

## Gate D · 本地音画预览

状态：**WAITING AUDIO**

- [x] 项目页提供本地预览入口。
- [x] 不要求录制，不依赖服务端视频转码。
- [ ] 真实 IndexTTS 音频导入后完成 6 张画面顺序预览。
- [ ] 用户确认没有明显音画错位。

## Gate E · 动画音效

状态：**LOCKED UNTIL A-D PASS**

- [x] 动画音效与“配音”明确分离。
- [x] 音效库定义为：元素出现、whoosh 转场、UI click、confirm、提示/强调等短 SFX。
- [x] 音效必须位于脚本、画面、配音和本地预览之后。
- [ ] 第一章音画预览通过后才选择动画 SFX。

## Gate F · 第二章

状态：**LOCKED**

第一章 A～E 未全部 PASS 前，禁止进入第二章开发。

---

## 当前总状态

| Gate | 状态 |
|---|---|
| A 口播稿 | PASS / 可重新确认 |
| B Garden 画面 | CODE PASS / USER REVIEW |
| C 本地 IndexTTS | WAITING AUDIO ZIP |
| D 本地音画预览 | WAITING AUDIO |
| E 动画音效 | LOCKED |
| F 第二章 | LOCKED |

**当前下一步唯一任务：用户确认口播稿 → 复制 TTS JSON → 本地 IndexTTS 生成 → 上传 ZIP。**

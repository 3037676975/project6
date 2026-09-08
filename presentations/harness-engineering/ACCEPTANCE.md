# Harness Engineering · 第一章验收标准 v24

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → 本文件。

## 当前验收对象

第一章《Harness Engineering》共 6 个 Step / 6 张画面。

## Gate A · 口播稿

状态：**PASS / 用户可重新确认**

- [x] 6 个 Step 均有独立口播。
- [x] 口播文本与画面 Step 一一对应。
- [x] Project6 作品页完整展示口播稿。
- [x] 用户确认口播稿后才允许复制 TTS JSON。
- [x] TTS JSON 可见预览 + 一键复制。
- [x] JSON 任务编号固定为 `001`～`006`。

## Gate B · Garden 画面

状态：**CODE PASS / USER REVIEW**

- [x] 第一章 6 张画面均已实现。
- [x] 统一使用 Garden `warm-keynote` 视觉逻辑。
- [x] 删除后台卡片墙式画面。
- [x] Step 2 = Execution Rail。
- [x] Step 3 = Agent Workbench。
- [x] Step 4 = Prompt inside Harness。
- [x] Step 5 删除虚构公司与虚构统计。
- [x] Step 6 使用 `Intelligence × Execution System = Reliable Agent` 收束。
- [ ] 用户逐张确认第 1～6 张画面。

## Gate C · 本地 IndexTTS 导入

状态：**READY / WAITING REAL ZIP**

- [x] Project6 只生成 TTS 任务 JSON，不负责本地 GPU 推理。
- [x] JSON 可复制到本地 IndexTTS 2.5 工作台。
- [x] 本地输出编号固定为 `001`～`006`。
- [x] 支持直接多选 MP3 / WAV / M4A / OGG。
- [x] 支持 ZIP 浏览器本地解压。
- [x] 2026-09-09 修复：旧版错误引用不存在的 `vendor/upstream/jszip/jszip.min.js`；v24 改为可实际加载的 JSZip 3.10.1，并在页面显示 ZIP 引擎健康状态。
- [x] ZIP 内允许存在 `audio/001.mp3` 等子目录，按文件 basename 匹配编号。
- [x] 每段导入后必须提供独立试听，确认上传的确是新声音。
- [ ] 用户用真实 IndexTTS ZIP 完成 6/6 测试。

## Gate D · 本地音画预览

状态：**CODE FIXED / WAITING USER TEST**

- [x] 项目页提供本地预览，不要求录制。
- [x] 2026-09-09 根因确认：旧版 iframe 仍由 `audio-map.json` 加载历史 Edge TTS，因此“上传成功”并没有真正替换播放器音源。
- [x] v24 增加 Local Audio Bridge：启动本地预览时，将刚上传的 `001～006` Blob URL 注入 iframe narration。
- [x] iframe 每次启动本地预览都使用 cache-busting URL 重新加载，避免旧播放器状态残留。
- [x] narration 每个 Step 播放前按照 `.scene.active[data-step]` 强制选择对应本地音频。
- [x] 页面必须明确显示 `LOCAL AUDIO ACTIVE`，表示旧 Edge TTS 不参与本次预览。
- [ ] 用户实际听辨确认第 1 张确实是刚上传的 001 音频。
- [ ] 用户实际连续播放 001～006，确认顺序正确。
- [ ] 用户确认音画节奏可接受；如本地 IndexTTS 时长变化明显，再进行下一轮动画 timing 适配。

## Gate E · 动画音效

状态：**LOCKED UNTIL D PASS**

- [x] 动画 SFX 与人物配音分离。
- [x] 动画 SFX = 元素出现 / whoosh / click / confirm / emphasis 等。
- [x] 音效阶段位于本地音画预览之后。
- [ ] Gate D 用户 PASS 后才进入。

## 本轮 bug 防回归规则

以下两项以后必须作为强制验收：

1. **“上传文件成功”不等于“播放器已使用新文件”。** 必须实际检查 narration 当前 src 来自本地 Blob URL。
2. **ZIP 功能不能只写代码不检查依赖是否真的存在。** 页面必须显示 ZIP 引擎加载状态；依赖失败时不能假装支持 ZIP。

## 当前总状态

| Gate | 状态 |
|---|---|
| A 口播稿 | PASS / 可重新确认 |
| B Garden 画面 | CODE PASS / USER REVIEW |
| C 本地 IndexTTS | CODE READY / WAITING REAL ZIP |
| D 本地音画预览 | CODE FIXED / WAITING USER TEST |
| E 动画音效 | LOCKED |

**下一步：用户重新打开作品页，确认 ZIP 引擎显示已加载 → 上传真实 ZIP → 逐段试听 → 6/6 后开启本地预览 → 确认听到的是新 IndexTTS 声音。**

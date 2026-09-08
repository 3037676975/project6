# Project6 开发状态

> 每次开发前必须依次阅读：`docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。
> 第一章还必须阅读 Garden 官方规范、`presentations/harness-engineering/ACCEPTANCE.md`，以及 Project6 本地 Emil animation skills。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章返工验收**
- 当前状态：**IN PROGRESS / 40 分后动画体系重建**
- 最新用户评分：**40 / 100**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 当前范围：**只做第一章，不进入第二章**
- Garden Theme：`warm-keynote`
- Step：6
- TTS：`edge-tts / zh-CN-YunxiNeural / 1.0x`
- BGM：无音乐 / 3 个 CC0 预置 / 本地上传
- 导出：浏览器本地 MediaRecorder → WebM

## 用户本轮否决原因

1. 上一版自研 Beat Reveal 影响阅读。
2. `audio.currentTime / duration` 粗比例不能准确代表中文语义。
3. 视觉出现顺序与实际讲话内容对不上。
4. 产生“说一的时候画面像跳到二”的体验错误。
5. 动效缺乏成熟动画体系和严格 Review。

## 本轮已完成

### 上游动画体系固定到 Project6

- [x] 新增 `.github/workflows/sync-animation-upstreams.yml`。
- [x] GitHub Actions 已成功完整镜像 `greensock/GSAP`。
- [x] GitHub Actions 已成功完整镜像 `emilkowalski/skills`。
- [x] 本地路径：`vendor/upstream/gsap/`。
- [x] 本地路径：`vendor/upstream/emil-skills/`。
- [x] 镜像保存 upstream commit SHA。
- [x] GSAP 许可信息保留。
- [x] Emil MIT LICENSE 保留。

### 后台动效库重建

- [x] `motions.html` 把 GSAP 标为 CORE RUNTIME。
- [x] `motions.html` 把 Emil Skills 标为 CORE TASTE / REVIEW。
- [x] 后台直接读取 Project6 本地 GSAP README。
- [x] 后台直接读取本地 Emil `animate/SKILL.md`。
- [x] 后台直接读取本地 Emil animation standards / improve / opportunities。
- [x] `data/motions.json` 已把 GSAP + Emil 提升为 Core。

### 第一章动画逻辑重写

- [x] 删除正式 `data-beat + currentTime/duration threshold` 主逻辑。
- [x] 第一章通过本地 `vendor/upstream/gsap/dist/gsap.min.js` 加载 GSAP。
- [x] 建立 6 条独立 GSAP timeline。
- [x] 每条 timeline 只操作当前 Garden Step 内元素。
- [x] Timeline 不翻页。
- [x] Timeline 完成后保持当前 Step 最终状态。
- [x] Manual 当前旁白结束不翻页。
- [x] Auto 只有 narration `ended` 才进下一 Step。
- [x] 6 屏出现顺序重新按各自口播内容编排。

## 当前待通过

- [ ] CI Gate 更新为 GSAP v5 标准并 PASS。
- [ ] 浏览器实机确认 GSAP 本地文件加载成功。
- [ ] Manual：每一段旁白始终停留在对应 Step。
- [ ] Auto：6 Step 连播无提前跳页。
- [ ] 逐屏确认动画没有影响文字阅读。
- [ ] 逐屏确认 stagger / ease / duration 符合 Emil 标准。
- [ ] HTTPS 地址完成完整 WebM 本地录制。
- [ ] 用户重新评分达到 90+。

## 当前 Gate

**上游镜像 Gate：PASS。**

**代码 Gate：等待 v5 CI。**

**产品最终 Gate：FAIL / 继续返工。**

第一章未最终 PASS 前，不进入第二章。

# Project6 开发状态

> 每次开发前必须依次阅读：`docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。
> 第一章还必须阅读 Garden 官方规范、`presentations/harness-engineering/ACCEPTANCE.md`、`ANIMATION_REVIEW.md`，以及 Project6 本地 Emil animation skills。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章返工验收 + 资源体系增强**
- 当前状态：**IN PROGRESS / Galaxy 组件层接入中**
- 当前唯一主验收作品：`presentations/harness-engineering/`
- 当前范围：**只完善第一章与资源体系，不进入第二章**
- Garden Theme：`warm-keynote`
- Step：6
- TTS：`edge-tts / zh-CN-YunxiNeural / 1.0x`
- TTS timing：`SentenceBoundary / timings.json / hidden SRT`
- 动画 Runtime：`GSAP + MotionPathPlugin + DrawSVGPlugin`
- 动画设计/Review：`emilkowalski/skills`
- 视觉组件来源：`uiverse-io/galaxy`
- BGM：无音乐 / 3 个 CC0 预置 / 本地上传
- 导出：浏览器本地 MediaRecorder → WebM

## 当前制作链

```text
Garden Step / Narration
        ↓
Uiverse Galaxy Search
寻找现成视觉组件 / micro-interaction 原型
        ↓
Garden Theme Adaptation
统一视觉语言
        ↓
Emil Skills
find opportunities → animate → review → improve
        ↓
GSAP
Timeline / DrawSVG / MotionPath / Continuous Motion
        ↓
Edge TTS SentenceBoundary
语义时间码
```

## 已完成

### 上游资源体系

- [x] `vendor/upstream/gsap/` 完整镜像 GSAP。
- [x] `vendor/upstream/emil-skills/` 完整镜像 Emil Skills。
- [x] 同步 Workflow 已升级，加入 `uiverse-io/galaxy`。
- [x] Galaxy 许可证确认 MIT。
- [x] 同步流程会生成 `data/galaxy-components.json`。
- [x] `data/motions.json` 把 Galaxy 提升为 CORE 视觉组件来源。

### 后台资源入口

- [x] 新增 `components.html`。
- [x] 首页侧栏增加「组件库 · Galaxy」。
- [x] 顶部快捷入口增加「组件库」。
- [x] 移动端导航增加组件入口。
- [x] 组件页支持搜索 / 分类 / 随机 / 分页。
- [x] 组件页支持本地 iframe 预览。
- [x] 组件页支持本地源码查看。

### 第一章已有能力

- [x] Garden 6 Step。
- [x] Edge TTS 6/6 + SentenceBoundary timing。
- [x] GSAP / MotionPath / DrawSVG。
- [x] Emil Review。
- [x] 主动画 + continuous ambient motion。
- [x] emoji 作为低层级辅助视觉已允许。
- [x] Manual / Auto。
- [x] 本地 BGM 上传。
- [x] 浏览器本地 MediaRecorder。

## 当前待通过

- [ ] Creative Upstream Action 完成 Galaxy 整仓镜像。
- [ ] `data/galaxy-components.json` 实际总数确认 3000+。
- [ ] 组件页在正式 Project6 地址实机加载大索引。
- [ ] 从 Galaxy 选取首批 8–12 个适合知识视频的组件原型，建立 Project6 curated shortlist。
- [ ] 第一章选取 2–4 个 Galaxy 细节语言进行 Theme-adapted 重构，不直接照搬原色。
- [ ] 浏览器实机逐句确认 SentenceBoundary 与视觉动作语义贴合。
- [ ] Manual / Auto 完整实机验证。
- [ ] HTTPS 地址完成完整 WebM 本地录制。
- [ ] 用户最终体验验收。

## 当前 Gate

**GSAP / Emil：PASS。**

**Galaxy 集成 Gate：IN PROGRESS。**

**第一章产品最终 Gate：IN PROGRESS。**

第一章未最终 PASS 前，不进入第二章。

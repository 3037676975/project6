# Project6 开发状态

> 每次开发前阅读：PROJECT_CHARTER → PRD → ACTIVE_DECISIONS → DEVELOPMENT_STATUS → 当前作品 ACCEPTANCE。

## 当前 Phase

**Phase 1 · Harness Engineering 第一章 + 本地 IndexTTS 真实交接验收**

## 当前状态

- 后台：作品优先结构。
- `studio.html`：已删除。
- 视频工作台：已废弃。
- 第一章 Garden：6 张画面代码完成，待用户视觉确认。
- 口播稿：6/6 完整。
- Canonical TTS JSON：`presentations/harness-engineering/tts-tasks.json`。
- TTS JSON：作品页可见预览；用户确认口播后可一键复制。
- 本地 TTS：由用户本机 IndexTTS 2.5 负责。
- 动画 SFX：最后环节。

## 2026-09-09 · v24 真实音频链路修复

### Bug 1 · JSZip 未加载

根因：`works.html` 引用了不存在的：

```text
vendor/upstream/jszip/jszip.min.js
```

仓库 `vendor/upstream/` 实际没有 jszip 目录。

修复：

- [x] 改为实际可加载的 JSZip 3.10.1。
- [x] 作品页增加 ZIP 引擎健康状态。
- [x] ZIP 中支持 `audio/001.mp3` 这类子目录。
- [x] 导入后每个音频提供独立试听。

### Bug 2 · 上传新音频后，预览仍播放旧 Edge TTS

根因：上传逻辑只在作品页建立了音频文件列表；iframe 内第一章播放器仍通过历史 `audio-map.json` 选择旧 narration。也就是说过去只有“文件匹配 UI”，没有真正完成“播放器音源替换”。

修复：

- [x] 作品页为上传的 001～006 建立真实 Object URL。
- [x] 开启本地预览时重新加载第一章 iframe，清除旧播放状态。
- [x] 向 iframe 安装 Local Audio Bridge。
- [x] narration 每次播放时，根据当前 `.scene.active[data-step]` 强制选择对应的 001～006 本地 Object URL。
- [x] 页面显示 `LOCAL AUDIO ACTIVE` 后，才表示本地 IndexTTS 已真正参与预览。
- [x] 旧 Edge TTS 不能作为本地预览的实际音源。

## 当前 Gate

| Gate | 状态 | 通过条件 |
|---|---|---|
| A 口播稿 | PASS / RECONFIRM | 用户确认当前 6 段口播 |
| B Garden 画面 | USER REVIEW | 用户逐张确认第1～6张 |
| C 本地 IndexTTS | CODE READY / WAITING REAL ZIP | 真 ZIP 6/6 匹配 + 独立试听正确 |
| D 本地音画预览 | CODE FIXED / WAITING USER TEST | 显示 LOCAL AUDIO ACTIVE，并实际听到新 IndexTTS 001～006 |
| E 动画音效 | LOCKED | D PASS 后才进入 |

## 强制防回归规则

1. 文件上传成功 ≠ 播放器已经切换音源。
2. 每个本地音频必须能在作品页独立试听。
3. 整章预览必须明确显示本地音源已激活。
4. ZIP 依赖必须有真实健康检查，不能引用一个不存在的 vendor 文件后仍宣称功能完成。
5. 如果用户本地 IndexTTS 音频时长与旧 Edge TTS 差异明显，下一步应重新适配 Step 内动画 timing，而不是继续使用旧 timing 假装同步。

## 当前唯一下一步

用户刷新新版作品页，确认 `ZIP 引擎已加载` → 上传真实 ZIP → 先逐段试听 001～006 → 点击开启本地预览 → 确认第一张开始就是刚上传的新声音。

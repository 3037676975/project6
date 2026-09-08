# Project6 开发状态

> 每次开发前必须依次阅读：
> `docs/PROJECT_CHARTER.md` → `docs/PRD.md` → `docs/ACTIVE_DECISIONS.md` → 本文件。
>
> 第一章开发还必须阅读 Garden 官方 `SKILL.md`、`CHAPTER-CRAFT.md`、`AUDIO.md`、`THEMES.md`、`RECORDING.md` 和 `presentations/harness-engineering/ACCEPTANCE.md`。
> 只有当前 Gate PASS 后，才允许继续下一阶段。

## 当前定位

- 当前 Phase：**Phase 1 · 第一章返工验收**
- 当前状态：**IN PROGRESS / 85 分后继续精修**
- 最新用户评分：**85 / 100**
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
- [x] 正式音色为 `zh-CN-YunxiNeural`，6/6 MP3 已生成。
- [x] Manual / Auto 模式彻底分开。
- [x] Manual 支持上一页 / 下一页 / 点击舞台 / ←→ / 当前旁白。
- [x] Auto 由 narration ended 推进。
- [x] BGM 支持无音乐 / 3 个 CC0 预置 / 本地上传 / 音量调节。
- [x] 本地音乐使用 `URL.createObjectURL`，不上传服务器。
- [x] 第一屏视觉方向保留。
- [x] 第二屏已增加失败/稳定两套状态信号。
- [x] 第三至第五屏分别强化工作台、员工类比、十家公司闭环。
- [x] 2026-09-08 85 分反馈后，控制区已移出 1920×1080 舞台。
- [x] 小字字号与字重整体上调。
- [x] 2～5 屏继续增加状态线、组件、循环节点、进度等 secondary motion。
- [x] 录制按钮增加等待授权 / 正在录制 / 停止并下载 / 已下载等状态反馈。
- [x] 视频作品页的验收标准与开发状态改为页内折叠查看，不再把 Markdown 文件作为主要用户入口。

## 录制当前真实状态

浏览器录制仍采用：

```text
getDisplayMedia
+ MediaRecorder
+ Browser Blob
+ 自动下载 WebM
```

**服务器不保存最终视频。**

但需要特别注意：`getDisplayMedia()` 通常要求 HTTPS 或 localhost。Project6 若通过 HTTP IP 打开，浏览器可能不开放该 API。当前代码会提供失败/取消状态，但还需要在实际部署环境确认 HTTPS。

## 当前待通过

- [ ] 录制按钮在最终部署地址完成真实授权测试。
- [ ] 若当前 Project6 仍为 HTTP IP，需要给正式预览地址补 HTTPS，或明确安全上下文方案。
- [ ] Browser Manual 实机操作 PASS。
- [ ] Browser Auto 6 Step 连续播放 PASS。
- [ ] 三个 BGM 主观听感选择 PASS。
- [ ] 本地 BGM 上传实机 PASS。
- [ ] 完整 WebM 录制 / 自动下载实机 PASS。
- [ ] 6 屏逐屏检查字号、留白、信息密度、动画稳定性。
- [ ] 用户确认第一章达到 90+ 并最终 PASS。

## 当前 Gate

**代码 / 资源 Gate：PASS。**

**产品最终 Gate：IN PROGRESS。**

当前主要差距已经从“内容方向和声音错误”转为“浏览器实机录制、控制体验、细节动效与视觉密度”。第一章未最终 PASS 前，不进入第二章。

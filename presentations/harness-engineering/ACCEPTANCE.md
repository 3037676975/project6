# Harness Engineering · 整片验收标准 v63

> 当前正式产品构建：**Project6 v63**。版本 Source of Truth 为 `assets/version.js`。

## 本轮 v63 变更边界

v63 是后台体验与信息架构整理版本，原则是：**功能保留，生产入口更清晰，不增加大型新能力。**

- [x] 工作台重新设计为 Editorial Production Console / 创作控制台。
- [x] 视频作品页保留脚本、TTS JSON、ZIP 导入、42/42 匹配和本地音频注入能力。
- [x] 新增共享后台视觉层 `assets/admin-ui-v63.css`。
- [x] 删除独立 `audio.html` 动画音效库。
- [x] Gate E 改为“项目内 SFX / BGM”，仍保持 D PASS 后才进入。
- [x] README、PROJECT_CHARTER、PRD、ACTIVE_DECISIONS、DEVELOPMENT_STATUS 同轮同步。
- [ ] 正式部署后浏览器视觉回归：工作台 / 作品页 / 组件库 / 动效库 / Garden / 项目总纲视觉一致。

## Gate A · 完整口播
状态：**REVIEW**

- [x] 42 Scene 连续 Narration 与稳定 001～042 编号存在。
- [x] 完整 TTS JSON 可预览与复制。
- [ ] 用户最终确认整片口播。

## Gate B · Garden 视觉
状态：**REVIEW**

- [x] Harness Engineering 共 42 Scene。
- [x] 已有 Screenshot QA 基线：42/42、tiny=0、overflow=0、console errors=0、responsiveFails=0。
- [ ] 用户最终确认正式播放器与纯成片窗口视觉一致。

## Gate C · 本地 TTS 配音源库
状态：**REVIEW**

- [x] ZIP 保存到当前浏览器 IndexedDB；单个音频不持久保存。
- [x] 多个 ZIP 形成独立配音源，可切换、试听、删除。
- [x] 正式播放器将当前配音源 001～042 通过 `P6_LOCAL_AUDIO` 注入 Garden 原生 `localAudio`。
- [x] 旁白默认开启，不再存在必须点击“启用旁白声音”的步骤。
- [x] 录制控制台直接负责当前配音源播放；“自动播放”点击即为用户手势。
- [ ] 用户实机确认：选择配音源后直接点“自动播放”，Scene 001 可听到对应旁白。
- [ ] 用户实机确认：音频结束后 Scene 与下一段配音同步推进。

## Gate D · 整片音画
状态：**REVIEW**

- [x] 播放器支持本地配音源注入。
- [x] Scene 与 001～042 使用稳定编号关系。
- [ ] 用户实机完整或抽样验证 narration 与画面同步。
- [ ] timing 微调完成后 Gate D 才可 PASS。

## Gate E · 项目内 SFX / BGM
状态：**LOCKED**

- [x] v63 删除脱离视频项目的独立音效库入口。
- [x] SFX 与人物配音继续严格分离。
- [ ] Gate D PASS 后，按当前 Scene 实际需求添加 reveal / whoosh / click / confirm / accent 等短 SFX。
- [ ] 不为了“以后可能会用”先扩展大型音效资源库。

## Gate F · 高清本地录制
状态：**REVIEW**

- [x] Capture Surface 只负责成片画面；控制台 UI 不入镜。
- [x] 通信通道固定为 `project6-harness-control`，不随产品版本改名。
- [x] TTS Web Audio 混音轨在录制页预创建。
- [x] 支持用户操作顺序：开始录制 → 再点自动播放。
- [x] 最终录制流包含 Capture 视频/标签页音频 + TTS 混音轨。
- [x] 输出画质：1080P / 1440P / 4K。
- [x] 录制四态：开始、暂停/继续、停止并保存、取消并丢弃。
- [ ] 用户实机确认：10～20 秒录制文件中有当前配音源旁白。
- [ ] 用户实机确认：旁白与画面 Scene 同步，不使用旧配音源。

## 版本一致性 Gate

以下任意一项出现即 FAIL：
1. `assets/version.js` 当前版本不是 v63；
2. 工作台或作品页仍把旧版本写成 Current；
3. 后台重新出现独立 `audio.html` 音效库入口；
4. 控制台 / Capture / 配音模块通信通道不一致；
5. 又恢复“成片窗口手动声音解锁”流程；
6. 页面升级而 README / DEVELOPMENT_STATUS / ACCEPTANCE / Charter / PRD 未同步。

## 当前结论

v63 没有重写已经跑通的 Garden、TTS 与录制实现层，而是对后台 UI、版本事实源、导航和 SFX 归属做收敛。下一阶段仍然是实机验证配音源与整片同步；只有 Gate D 通过后，才进入项目内 SFX / BGM 和最终录制收尾。

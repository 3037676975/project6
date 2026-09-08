# Harness Engineering · 第一章验收标准 v9

> 开发前固定阅读：`PROJECT_CHARTER.md` → `PRD.md` → `ACTIVE_DECISIONS.md` → `DEVELOPMENT_STATUS.md` → Garden 官方规范 → Emil Skills → 本文件。
>
> v9 目标：**保留 warm-keynote 奶油纸张 + 青绿视觉 DNA；使用成熟 Cloud / SaaS Design System 的层级、密度、状态和 spacing 思路；Uiverse Galaxy 提供组件灵感；Emil 决定动画是否合理；GSAP 执行。正式第一章禁止 Emoji。**

## 1. 内容
- [x] 一句话主题：模型之外的运行系统，决定 Agent 能不能稳定把任务做完。
- [x] 6 个 Garden Step，各自一段 narration。
- [x] 口播保持聊天式中文。
- [ ] 用户最终听感 PASS。

## 2. 配音与同步
- [x] `edge-tts / zh-CN-YunxiNeural / +0% / 1.0x`。
- [x] 6/6 MP3 Ready。
- [x] `timings.json` 使用真实 SentenceBoundary。
- [x] 可见字幕禁止；SRT 只作为隐藏 timing。
- [x] 视觉 cue 只在当前 Garden Step 内运行。
- [x] Auto 唯一翻页条件：当前 narration `ended`。
- [ ] 浏览器实机逐句核对语义时机。

## 3. v9 视觉系统硬规则
### 3.1 基础 DNA
- [x] 1920×1080 固定舞台。
- [x] warm-keynote 奶油纸张 / 青绿 accent 保留。
- [x] 主要文本为深墨绿，次级文本有稳定对比度。
- [x] 统一 Surface / Status / Label / Icon box 语言。
- [x] 控制栏完全在舞台外。
- [x] 正式第一章 **不使用 Emoji**。

### 3.2 Cloud / SaaS Design 参考原则
- [x] Comfortable density：不靠巨大空白制造高级感，也不靠堆文字填满。
- [x] 4px/8px 级 spacing rhythm，组件内外间距保持规律。
- [x] 一屏只有一个主视觉命题，其他组件服务主命题。
- [x] 状态颜色具有语义：mint=ready/stable，coral=fail/gap。
- [x] Iconography 使用简单 SVG 线性图标，不用装饰 emoji。
- [x] 卡片不是页面布局的唯一手段：至少包含网络、运行台、Control Plane、任务表格等不同结构。
- [ ] 用户最终确认信息密度和层级舒服。

## 4. 第一章 6 屏构图 Gate
1. **Step 1 · Runtime shell**：大标题 + Agent Runtime 系统壳；Context/Tools/State/Recovery 围绕模型形成关系，而不是四张散卡。
2. **Step 2 · Two lanes**：同一模型的失败/稳定双通道对比；状态与信号有语义颜色。
3. **Step 3 · Cloud console workbench**：资源栏 + 深色 runtime console + activity rail，体现“工作台”而不是海报。
4. **Step 4 · Prompt → Control Plane**：Prompt 作为输入对象沿路径进入 Harness Control Plane。
5. **Step 5 · Research workspace**：十家公司任务用真实 dashboard / pipeline / table 表达执行闭环。
6. **Step 6 · System summary**：Context / Tools / State / Recovery 聚合到 Reliable Agent。

任意一屏退化成“标题 + 四张白卡片”：**FAIL**。

## 5. Galaxy 使用规则
- [x] Galaxy 完整本地镜像与 3800+ 索引保留。
- [x] Galaxy 用于研究组件结构、状态 chip、loader、pattern、按钮微交互。
- [x] 正式视频不能把第三方组件原色原样贴进画面。
- [x] 组件必须先适配 Garden Theme，再进入 Step。
- [x] Galaxy 不拥有动画时间线和 Step 导航权。
- [x] 旧 `galaxy-layer.css` 不再作为第一章正式视觉补丁层。

## 6. Emil + GSAP 动画 Gate
动画链：
`find-animation-opportunities → animate/vocabulary → GSAP → SentenceBoundary → review/improve`

- [x] 每 Step 独立 Timeline。
- [x] 不使用 `data-beat + 音频百分比`。
- [x] 不使用 `scale(0)` / `transition: all`。
- [x] UI 高频反馈控制在短时长。
- [x] 主要文字出现后保持稳定。
- [x] 持续动画只服务“连接、运行状态、进度、循环”。
- [x] `prefers-reduced-motion` 存在。
- [ ] 0.5× / 0.25× 慢放 feel-check。

## 7. 动画目的逐屏检查
- Step 1：系统壳建立 → 关系线建立 → 信号持续沿关系流动。
- Step 2：先建立失败侧，再建立稳定侧；底部状态流只维持运行感。
- Step 3：资源 / Runtime / Activity 按“工作台”空间关系建立；Runtime 内状态持续低强度运行。
- Step 4：Prompt token 沿明确路径进入 Control Plane；四层能力随后建立。
- Step 5：Pipeline → 公司列表 → 闭环检查；进度条持续显示任务仍在推进。
- Step 6：四层能力收束到 Reliable Agent；结尾稳定，不炫技。

## 8. Manual / Auto
- [x] Manual：上一页 / 下一页 / 方向键 / 当前旁白；不会因旁白结束翻页。
- [x] Auto：narration ended 后才进入下一 Step。
- [ ] 实机连续播放 6 Step 无提前跳页。

## 9. BGM
- [x] 无音乐 / 3 个预置 / 本地上传。
- [x] 本地音乐通过 ObjectURL，不上传服务器。
- [ ] 用户选择最终满意音乐。

## 10. 浏览器本地录制
- [x] `getDisplayMedia + MediaRecorder`。
- [x] Secure Context 检查。
- [x] 浏览器内存 → 自动下载 WebM。
- [x] Project6 服务器不保存成片。
- [ ] HTTPS 实机完整录制 PASS。

## 11. 最终 Design Review
必须逐屏回答：
1. 观众第一眼看哪里？
2. 这一屏唯一要理解的关系是什么？
3. 有没有第二个组件在抢主层级？
4. 信息是不是太空 / 太挤？
5. 动画有没有帮助理解？
6. 是否存在无意义装饰？
7. 小字在 1920×1080 缩放后是否仍能读？
8. 颜色是不是在表达状态，而不是装饰？

## 最终 Gate
- 内容：PASS
- TTS：PASS
- SentenceBoundary：PASS
- 画面：≥ 90
- Cloud/SaaS hierarchy & density：必须 PASS
- Galaxy component adaptation：必须 PASS
- Emil Animation Review：必须 PASS
- GSAP Step boundary：必须 PASS
- Manual / Auto：PASS
- BGM：PASS
- 本地录制：PASS
- 用户最终验收：PASS

任一项 FAIL：继续修改，不进入第二章。

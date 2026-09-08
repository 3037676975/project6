(() => {
  const data = window.P6_FULL_VIDEO;
  if (!data) return;
  const $ = s => document.querySelector(s);
  const stage = $('#stage'), sceneRoot = $('#sceneRoot'), chapterLabel = $('#chapterLabel'), countLabel = $('#countLabel');
  const prevBtn = $('#prevBtn'), nextBtn = $('#nextBtn'), playBtn = $('#playBtn'), pauseBtn = $('#pauseBtn'), fullscreenBtn = $('#fullscreenBtn');
  const scrub = $('#scrub'), status = $('#status'), chapterNav = $('#chapterNav'), narration = $('#narration');
  let current = 0, playing = false, paused = false, localAudio = {}, fallbackTimer = null;

  function fit(){
    const viewer = $('.viewer').getBoundingClientRect();
    stage.style.transform = `scale(${Math.min(viewer.width / 1920, viewer.height / 1080)})`;
  }
  addEventListener('resize', fit); fit();
  const chapterOf = scene => data.chapters.find(c => c.id === scene.chapter);
  const esc = (v='') => v.replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const tag = (t,c='') => `<span class="g-tag ${c}">${esc(t)}</span>`;
  const smallNode = (t,c='') => `<div class="g-small ${c}">${esc(t)}</div>`;

  function visualFor(s){
    const p=s.points||[];
    switch(s.id){
      case '001': return `<div class="v-dual-agents"><div class="agent-track steady"><span>同一个 MODEL</span><div class="agent-dot"></div><div class="track-line"></div><b>稳定运行</b></div><div class="agent-track drift"><span>同一个 MODEL</span><div class="agent-dot"></div><div class="track-line broken"></div><b>两步跑偏</b></div><div class="v-question">差别在哪？</div></div>`;
      case '002': return `<div class="v-broken-chain"><div class="chain-model">LLM</div><div class="chain-link ok">Prompt</div><div class="chain-link cut">Tool</div><div class="chain-link ghost">State</div><div class="chain-link ghost">Result</div><svg viewBox="0 0 900 220"><path class="draw" d="M120 110 H350 M470 110 H790"/></svg><div class="break-mark">×</div></div>`;
      case '003': return `<div class="v-workbench"><div class="bench-core"><small>MODEL</small><b>LLM</b></div><svg viewBox="0 0 900 520"><path class="draw" d="M450 260 C300 190 235 105 135 95 M450 260 C600 190 665 105 765 95 M450 260 C300 330 235 415 135 425 M450 260 C600 330 665 415 765 425"/></svg>${smallNode('Context','a')}${smallNode('Tools','b')}${smallNode('State','c')}${smallNode('Recovery','d')}</div>`;
      case '004': return `<div class="v-boundary"><div class="ring r1"><b>回答</b></div><div class="ring r2"><b>执行</b></div><div class="ring r3"><b>观察 · 恢复</b></div><div class="boundary-caption">系统边界正在向外扩张</div></div>`;
      case '005': return `<div class="v-fourq"><div class="q-center">HARNESS</div><div class="q q1"><i>01</i><b>看到什么？</b><small>Context</small></div><div class="q q2"><i>02</i><b>能做什么？</b><small>Tools</small></div><div class="q q3"><i>03</i><b>做到哪里？</b><small>State</small></div><div class="q q4"><i>04</i><b>怎么恢复？</b><small>Recovery</small></div></div>`;
      case '006': return `<div class="v-equation"><div class="eq-left"><small>MODEL</small><strong>聪明</strong></div><div class="eq-op">×</div><div class="eq-left"><small>HARNESS</small><strong>执行系统</strong></div><div class="eq-op">=</div><div class="eq-result"><small>AGENT</small><strong>稳定交付</strong></div></div>`;
      case '007': return `<div class="v-migration"><div class="hill h1"><span>01</span><b>PROMPT</b><small>说清楚</small></div><div class="hill h2"><span>02</span><b>CONTEXT</b><small>给信息</small></div><div class="hill h3"><span>03</span><b>HARNESS</b><small>管执行</small></div><svg viewBox="0 0 900 380"><path class="draw" d="M80 315 C230 275 245 230 340 220 C490 205 520 130 650 115 C745 105 785 60 835 45"/></svg></div>`;
      case '008': return `<div class="v-prompt-door"><div class="door"><div class="door-copy">“帮我总结一下”</div></div><div class="door-arrow">→</div><div class="answer flat">普通总结</div><div class="prompt-strip">角色 · 示例 · 约束 · 格式</div></div>`;
      case '009': return `<div class="v-context-room"><div class="model-chair">MODEL</div><div class="doc d1">需求文档</div><div class="doc d2">评审记录</div><div class="doc d3">规范</div><div class="doc d4">工具结果</div><div class="doc d5">任务状态</div><svg viewBox="0 0 900 500"><path class="draw" d="M100 95 C260 150 330 220 450 255 M790 95 C630 150 570 215 450 255 M100 410 C260 350 330 300 450 255 M790 410 C630 350 570 300 450 255"/></svg></div>`;
      case '010': return `<div class="v-control-tower"><div class="tower"><span>HARNESS</span><b>CONTROL</b></div><div class="lane l1">PLAN</div><div class="lane l2">ACT</div><div class="lane l3">OBSERVE</div><div class="lane l4">RECOVER</div><div class="signal s1"></div><div class="signal s2"></div><div class="signal s3"></div></div>`;
      case '011': return `<div class="v-nested"><div class="nest n3"><b>HARNESS</b><div class="nest n2"><b>CONTEXT</b><div class="nest n1"><b>PROMPT</b></div></div></div><div class="nest-note">不是替代，是一层一层扩大系统边界</div></div>`;
      case '012': return `<div class="v-expansion"><div class="axis"></div><div class="exp e1"><i>01</i><b>单轮回答</b><small>Prompt</small></div><div class="exp e2"><i>02</i><b>信息供给</b><small>Context</small></div><div class="exp e3"><i>03</i><b>长链执行</b><small>Harness</small></div><div class="exp-arrow">→ 系统责任扩大</div></div>`;
      case '013': return `<div class="v-before-after"><div class="prompt-card weak"><small>BEFORE</small><b>帮我总结</b><p>宽泛 · 无角色 · 无格式</p></div><div class="knife"></div><div class="prompt-card strong"><small>AFTER</small><b>角色 + 目标 + 约束</b><p>输出结构被明确塑形</p></div></div>`;
      case '014': return `<div class="v-probability"><div class="fan"><span>A</span><span>B</span><span>C</span><span>D</span><span>E</span></div><div class="beam"></div><div class="target">符合意图的路径</div><div class="beam-label">PROMPT 改变概率分布</div></div>`;
      case '015': return `<div class="v-prompt-machine"><div class="machine-input">原始问题</div><div class="gear g1">角色</div><div class="gear g2">任务</div><div class="gear g3">约束</div><div class="machine-output">可控输出</div><svg viewBox="0 0 900 420"><path class="draw" d="M105 210 H265 M635 210 H790"/></svg></div>`;
      case '016': return `<div class="v-examples"><div class="sample s1"><small>EXAMPLE 01</small><b>输入 → 输出</b></div><div class="sample s2"><small>EXAMPLE 02</small><b>输入 → 输出</b></div><div class="pattern-arrow">学习范式</div><div class="newcase"><small>NEW INPUT</small><b>沿样例结构补全</b></div></div>`;
      case '017': return `<div class="v-fence"><div class="free-space">可能答案空间</div><div class="fence-line"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="allowed">允许区域</div><div class="constraint-label">格式 · 风格 · 边界</div></div>`;
      case '018': return `<div class="v-ceiling"><div class="prompt-box">PROMPT</div><div class="ceiling-line"></div><div class="outside o1">企业知识</div><div class="outside o2">实时数据</div><div class="outside o3">任务状态</div><div class="outside o4">工具反馈</div><div class="ceiling-copy">表达解决不了“缺信息”</div></div>`;
      case '019': return `<div class="v-context-map"><div class="ctx-center">当前决策</div>${['用户输入','历史对话','检索结果','工具返回','任务状态','系统规则'].map((x,i)=>`<div class="ctx c${i+1}">${x}</div>`).join('')}<svg viewBox="0 0 900 520"><path class="draw" d="M450 260 L150 90 M450 260 L450 55 M450 260 L755 95 M450 260 L140 430 M450 260 L455 465 M450 260 L765 420"/></svg></div>`;
      case '020': return `<div class="v-rag"><div class="rag-source">文档库</div><div class="rag-search">检索</div><div class="rag-rank">排序</div><div class="rag-context">相关片段</div><div class="rag-model">MODEL</div><div class="rag-line"><span></span></div></div>`;
      case '021': return `<div class="v-context-stack"><div class="ctx-layer l1">固定规则</div><div class="ctx-layer l2">当前任务</div><div class="ctx-layer l3">运行状态</div><div class="ctx-layer l4">外部证据</div><div class="ctx-pointer">→ 结构化进入模型</div></div>`;
      case '022': return `<div class="v-budget"><div class="budget-title">CONTEXT BUDGET</div><div class="budget-bar"><span class="use"></span><span class="noise"></span></div><div class="budget-labels"><b>相关信息</b><b>噪声</b></div><div class="attention">注意力不是无限资源</div></div>`;
      case '023': return `<div class="v-disclosure"><div class="drawer root"><b>SKILL INDEX</b><small>只暴露最少信息</small></div><div class="drawer d1"><b>需要工具 A</b><small>加载 SOP</small></div><div class="drawer d2"><b>需要工具 B</b><small>加载参数</small></div><div class="drawer d3"><b>需要案例</b><small>加载参考</small></div><div class="disclose-arrow">按需展开 ↓</div></div>`;
      case '024': return `<div class="v-bridge"><div class="bank left"><b>INPUT</b><span>Prompt</span><span>Context</span></div><div class="bridge-deck"><i></i><i></i><i></i><i></i><strong>HARNESS</strong></div><div class="bank right"><b>EXECUTION</b><span>Action</span><span>Recovery</span></div></div>`;
      case '025': return `<div class="v-sixlayers">${['Context','Tools','Orchestration','Memory','Evaluation','Recovery'].map((x,i)=>`<div class="six l${i+1}"><span>0${i+1}</span><b>${x}</b></div>`).join('')}<div class="six-caption">6 LAYERS · ONE OPERATING SYSTEM</div></div>`;
      case '026': return `<div class="v-switchboard"><div class="switch-model">MODEL</div>${['Search','Browser','Code','API','DB'].map((x,i)=>`<div class="port p${i+1}"><i></i><b>${x}</b></div>`).join('')}<div class="selector">只给“现在需要”的工具</div></div>`;
      case '027': return `<div class="v-orchestrate"><div class="loop-node a">理解目标</div><div class="loop-node b">补信息</div><div class="loop-node c">执行</div><div class="loop-node d">检查</div><div class="loop-node e">修正</div><svg viewBox="0 0 900 520"><path class="draw" d="M185 130 C420 25 710 80 735 250 C760 420 500 470 245 405 C80 365 70 210 185 130 Z"/></svg></div>`;
      case '028': return `<div class="v-state-board"><div class="state-column"><small>NOW</small><b>当前任务</b><span>3 / 7 已完成</span></div><div class="state-column"><small>SESSION</small><b>中间结果</b><span>已确认结论</span></div><div class="state-column"><small>LONG TERM</small><b>长期记忆</b><span>用户偏好</span></div><div class="state-pin">不要混在一起</div></div>`;
      case '029': return `<div class="v-radar"><div class="radar-ring r1"></div><div class="radar-ring r2"></div><div class="radar-ring r3"></div><div class="radar-sweep"></div><div class="radar-dot d1"></div><div class="radar-dot d2"></div><div class="radar-dot d3"></div><div class="radar-copy"><b>EVALUATE</b><span>日志 · 指标 · 测试 · 错误归因</span></div></div>`;
      case '030': return `<div class="v-recovery"><div class="guard good">正常执行</div><div class="guard fail">API 超时</div><div class="guard retry">重试</div><div class="guard rollback">回滚稳定状态</div><svg viewBox="0 0 900 440"><path class="draw" d="M125 220 H335 M460 220 H690 M690 220 C800 220 805 355 690 355 H390 C290 355 285 285 335 255"/></svg></div>`;
      case '031': return `<div class="v-before-after-system"><div class="system-side before"><small>BEFORE</small><div class="mini-track broken"></div><b>模型聪明 · 系统不稳</b></div><div class="system-mid">→</div><div class="system-side after"><small>AFTER</small><div class="mini-track stable"></div><b>同模型 · 更完整 Harness</b></div></div>`;
      case '032': return `<div class="v-reset"><div class="ctx-window tired"><span>CONTEXT 98%</span><div class="noise-lines"></div></div><div class="reset-flash">RESET</div><div class="handoff">STATE HANDOFF →</div><div class="ctx-window fresh"><span>NEW AGENT</span><b>干净上下文</b></div></div>`;
      case '033': return `<div class="v-triangle"><div class="role planner">PLANNER<small>规格</small></div><div class="role generator">GENERATOR<small>实现</small></div><div class="role evaluator">EVALUATOR<small>真实测试</small></div><svg viewBox="0 0 900 520"><path class="draw" d="M450 80 L160 400 L740 400 Z"/></svg><div class="triangle-core">生产 ≠ 验收</div></div>`;
      case '034': return `<div class="v-diagnose"><div class="diag-center">Agent 失败</div>${['缺工具？','缺反馈？','缺状态？','缺标准？'].map((x,i)=>`<div class="diag q${i+1}">${x}</div>`).join('')}<div class="diag-answer">先修环境，不是只让它“再努力一次”</div></div>`;
      case '035': return `<div class="v-doc-tree"><div class="tree-root">AGENTS.md<br><small>INDEX ONLY</small></div><div class="tree-line"></div>${['架构文档','设计文档','执行计划','质量规则','安全规则'].map((x,i)=>`<div class="tree-leaf l${i+1}">${x}</div>`).join('')}</div>`;
      case '036': return `<div class="v-browser-loop"><div class="mock-browser"><div class="browser-top"><i></i><i></i><i></i></div><div class="browser-body"><div class="page-block"></div><div class="log-block">LOG<br>WARN → FIX</div></div></div><div class="verify-steps"><span>RUN</span><span>SEE</span><span>FIX</span><span>VERIFY</span></div></div>`;
      case '037': return `<div class="v-summary-one"><div class="hero-word">PROMPT</div><div class="hero-rule"></div><div class="hero-sub">把任务讲清楚</div><div class="hero-tags">${tag('角色')}${tag('目标')}${tag('约束')}${tag('示例')}</div></div>`;
      case '038': return `<div class="v-summary-one context"><div class="hero-word">CONTEXT</div><div class="hero-rule"></div><div class="hero-sub">把信息给正确</div><div class="hero-tags">${tag('文档')}${tag('状态')}${tag('工具结果')}${tag('结构化输入')}</div></div>`;
      case '039': return `<div class="v-summary-one harness"><div class="hero-word">HARNESS</div><div class="hero-rule"></div><div class="hero-sub">让模型持续做对</div><div class="hero-tags">${tag('Tools')}${tag('State')}${tag('Evaluation')}${tag('Recovery')}</div></div>`;
      case '040': return `<div class="v-final-equation"><div class="eq-model">MODEL<small>决定上限</small></div><div class="eq-cross">×</div><div class="eq-harness">HARNESS<small>决定落地</small></div><div class="eq-equal">=</div><div class="eq-delivery">STABLE<br>DELIVERY</div></div>`;
      case '041': return `<div class="v-engineer-map"><div class="engineer">AI ENGINEER</div>${['任务结构','信息流','工具系统','状态','反馈','验收'].map((x,i)=>`<div class="skill s${i+1}">${x}</div>`).join('')}<svg viewBox="0 0 900 520"><path class="draw" d="M450 260 L115 95 M450 260 L450 60 M450 260 L785 95 M450 260 L115 430 M450 260 L450 465 M450 260 L785 430"/></svg></div>`;
      case '042': return `<div class="v-final"><div class="final-orbit o1"></div><div class="final-orbit o2"></div><div class="final-core"><small>RELIABLE AI</small><b>稳定交付<br>是系统能力</b></div><div class="final-words"><span>PROMPT</span><span>CONTEXT</span><span>HARNESS</span></div></div>`;
      default: return `<div class="v-placeholder"><b>${esc(s.accent)}</b></div>`;
    }
  }

  function sceneLayout(s){
    const heroIds=['006','012','025','037','038','039','040','042'];
    const centered=heroIds.includes(s.id);
    return `<section class="scene scene-${s.id} ${centered?'scene-hero':''}">
      <div class="copy"><div class="kicker">${esc(s.kicker)}</div><h1 class="title">${esc(s.title)}<br><span class="accent">${esc(s.accent)}</span></h1><div class="summary">${esc(s.narration)}</div></div>
      <div class="visual visual-${s.id}"><div class="canvas">${visualFor(s)}</div></div>
    </section>`;
  }

  function animateScene(s){
    if(!window.gsap) return;
    gsap.killTweensOf('*');
    const tl=gsap.timeline();
    tl.fromTo('.copy .kicker',{opacity:0,y:12},{opacity:1,y:0,duration:.35,ease:'power2.out'})
      .fromTo('.copy .title',{opacity:0,y:28},{opacity:1,y:0,duration:.58,ease:'power3.out'},'-=.12')
      .fromTo('.copy .summary',{opacity:0,y:18},{opacity:1,y:0,duration:.5,ease:'power2.out'},'-=.28');
    if(['002','003','007','009','015','019','027','030','033','041'].includes(s.id)){
      tl.fromTo('.visual .draw',{strokeDasharray:1200,strokeDashoffset:1200},{strokeDashoffset:0,duration:1.15,ease:'power2.inOut'},'-=.18');
    } else if(['012','021','025','028','035'].includes(s.id)){
      tl.fromTo('.visual .exp,.visual .ctx-layer,.visual .six,.visual .state-column,.visual .tree-leaf',{opacity:0,y:28},{opacity:1,y:0,duration:.45,stagger:.10,ease:'back.out(1.4)'},'-=.18');
    } else {
      tl.fromTo('.visual .canvas > div,.visual .canvas > svg',{opacity:0,y:20,scale:.98},{opacity:1,y:0,scale:1,duration:.48,stagger:.07,ease:'power3.out'},'-=.2');
    }
    if(s.id==='014') gsap.fromTo('.beam',{scaleX:.05,transformOrigin:'left center'},{scaleX:1,duration:1.1,ease:'power2.inOut'});
    if(s.id==='022') gsap.fromTo('.budget-bar .use',{width:'0%'},{width:'58%',duration:1,ease:'power2.out'});
    if(s.id==='029') gsap.to('.radar-sweep',{rotation:360,duration:4,repeat:-1,ease:'none',transformOrigin:'50% 100%'});
    if(s.id==='032') gsap.fromTo('.reset-flash',{opacity:0,scale:.7},{opacity:1,scale:1,duration:.28,yoyo:true,repeat:1,repeatDelay:.35});
    if(s.id==='042'){gsap.to('.final-orbit.o1',{rotation:360,duration:12,repeat:-1,ease:'none'});gsap.to('.final-orbit.o2',{rotation:-360,duration:16,repeat:-1,ease:'none'});}
  }

  function render(i){
    current=Math.max(0,Math.min(data.scenes.length-1,i));
    const s=data.scenes[current],ch=chapterOf(s);
    clearTimeout(fallbackTimer);narration.pause();narration.removeAttribute('src');narration.load();
    sceneRoot.innerHTML=sceneLayout(s);
    chapterLabel.innerHTML=`<i></i>${esc(ch?.id||'')} · ${esc(ch?.title||'')}`;
    countLabel.textContent=`${String(current+1).padStart(2,'0')} / ${String(data.scenes.length).padStart(2,'0')}`;
    scrub.value=current;chapterNav.textContent=ch?`${ch.id} ${ch.title}`:'';status.textContent=localAudio[s.id]?`LOCAL ${s.id}`:`SCENE ${s.id}`;
    animateScene(s);
  }

  const audioForCurrent=()=>localAudio[data.scenes[current].id]||'';
  async function playCurrent(){const src=audioForCurrent();playing=true;paused=false;playBtn.classList.add('on');pauseBtn.classList.remove('on');if(src){narration.src=src;narration.currentTime=0;try{await narration.play();status.textContent=`LOCAL AUDIO · ${data.scenes[current].id}`}catch(e){status.textContent='点击播放以授权音频';playing=false}}else{status.textContent='无本地音频 · 画面预览';fallbackTimer=setTimeout(()=>advance(),6500)}}
  function advance(){if(current<data.scenes.length-1){render(current+1);if(playing)setTimeout(playCurrent,180)}else{playing=false;playBtn.classList.remove('on');status.textContent='END'}}
  function pause(){paused=true;playing=false;narration.pause();clearTimeout(fallbackTimer);if(window.gsap)gsap.globalTimeline.pause();pauseBtn.classList.add('on');playBtn.classList.remove('on');status.textContent='PAUSED'}
  async function resume(){if(window.gsap)gsap.globalTimeline.resume();if(narration.src&&narration.currentTime>0){playing=true;paused=false;await narration.play().catch(()=>{})}else playCurrent();pauseBtn.classList.remove('on');playBtn.classList.add('on')}
  narration.addEventListener('ended',()=>{if(!paused)advance()});
  prevBtn.addEventListener('click',()=>render(current-1));nextBtn.addEventListener('click',()=>render(current+1));playBtn.addEventListener('click',()=>paused?resume():playCurrent());pauseBtn.addEventListener('click',pause);scrub.addEventListener('input',e=>render(Number(e.target.value)));
  fullscreenBtn.addEventListener('click',async()=>{try{const shell=document.querySelector('.shell');if(document.fullscreenElement)await document.exitFullscreen();else await shell.requestFullscreen()}catch(e){status.textContent='浏览器不支持全屏'}});
  document.addEventListener('fullscreenchange',()=>setTimeout(fit,60));
  addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();playing?pause():resume()}if(e.key==='ArrowRight')render(current+1);if(e.key==='ArrowLeft')render(current-1);if(e.key.toLowerCase()==='f')fullscreenBtn.click()});
  window.addEventListener('message',e=>{if(e.origin!==location.origin)return;const msg=e.data||{};if(msg.type==='P6_LOCAL_AUDIO'&&msg.files){localAudio={...msg.files};status.textContent=`LOCAL AUDIO ${Object.keys(localAudio).length}/${data.scenes.length}`;render(current)}if(msg.type==='P6_CLEAR_AUDIO'){localAudio={};render(current)}});
  scrub.max=data.scenes.length-1;render(0);if(window.parent&&window.parent!==window)window.parent.postMessage({type:'P6_PLAYER_READY'},location.origin);
})();
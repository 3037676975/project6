(() => {
  'use strict';

  const STORAGE_PROJECTS = 'project6.projects.v1';
  const STORAGE_SETTINGS = 'project6.settings.v1';
  const state = { seedProjects: [], templates: [], sceneBlueprints: [], projects: [], sceneIndex: 0, playing: false, playTimer: null, search: '' };

  const FALLBACK_PROJECTS = [
    {id:'P0025',title:'什么是 RAG',category:'AI知识讲解',status:'制作中',scenes:4,voice:'ETG1',engine:'garden',theme:'tech-blue'},
    {id:'P0024',title:'AI Agent 入门',category:'技术科普',status:'规划中',scenes:4,voice:'ETG1',engine:'garden',theme:'tech-blue'},
    {id:'P0023',title:'机器学习三大范式',category:'知识讲解',status:'已完成',scenes:5,voice:'ETG1',engine:'garden',theme:'soft-blue'}
  ];
  const FALLBACK_TEMPLATES = [
    {id:'HOOK-001',name:'3秒冲突开场',type:'hook',description:'用问题、反常识与答案承诺快速建立注意力。'},
    {id:'SCENE-FLOW-001',name:'流程图动画',type:'scene',description:'适合 RAG、Agent、工作流与产品机制讲解。'},
    {id:'SCENE-COMPARE-001',name:'对比卡片',type:'scene',description:'左右对照两个方案、概念或前后状态。'},
    {id:'SCENE-SUMMARY-001',name:'总结卡片',type:'scene',description:'结尾用 3 个关键点完成记忆强化。'},
    {id:'THEME-TECH-001',name:'科技蓝主题',type:'theme',description:'蓝白渐变、玻璃感卡片，适合 AI 与技术内容。'},
    {id:'THEME-FINANCE-001',name:'财经数据主题',type:'theme',description:'强调数字、趋势和结构化信息呈现。'}
  ];
  const FALLBACK_SCENES = [
    {id:'SCENE-001',type:'title',name:'标题开场',duration:5,animation:'fade-in'},
    {id:'SCENE-002',type:'flow',name:'流程解释',duration:10,animation:'svg-flow'},
    {id:'SCENE-003',type:'compare',name:'概念对比',duration:8,animation:'card-reveal'},
    {id:'SCENE-004',type:'summary',name:'总结卡片',duration:8,animation:'card-reveal'}
  ];

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const esc = (v='') => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const clamp = (n,min,max) => Math.min(Math.max(n,min),max);

  function readJSON(key, fallback) {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch { return fallback; }
  }
  function writeJSON(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function toast(message) {
    const el = $('#toast'); if (!el) return;
    el.textContent = message; el.classList.add('show');
    clearTimeout(toast.timer); toast.timer = setTimeout(() => el.classList.remove('show'), 2200);
  }
  function routeInfo() {
    const raw = (location.hash || '#/dashboard').replace(/^#\/?/, '');
    const [pathRaw, query=''] = raw.split('?');
    return { path: pathRaw || 'dashboard', params: new URLSearchParams(query) };
  }
  function navigate(path) { location.hash = '#/' + path; }

  async function loadJson(path, fallback) {
    try { const r = await fetch(path, {cache:'no-store'}); if (!r.ok) throw new Error(r.status); return await r.json(); }
    catch { return fallback; }
  }
  async function boot() {
    const [projects, templates, scenes] = await Promise.all([
      loadJson('./data/projects.json', FALLBACK_PROJECTS),
      loadJson('./data/templates.json', FALLBACK_TEMPLATES),
      loadJson('./data/scenes.json', FALLBACK_SCENES)
    ]);
    state.seedProjects = projects;
    state.templates = templates.length ? templates : FALLBACK_TEMPLATES;
    state.sceneBlueprints = scenes.length ? scenes : FALLBACK_SCENES;
    rebuildProjects();
    bindShell();
    render();
  }
  function rebuildProjects() {
    const local = readJSON(STORAGE_PROJECTS, []);
    const map = new Map(state.seedProjects.map(p => [p.id, normalizeProject(p)]));
    local.forEach(p => map.set(p.id, normalizeProject(p)));
    state.projects = [...map.values()].sort((a,b) => (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || '') || b.id.localeCompare(a.id));
  }
  function normalizeProject(p) {
    const project = {...p};
    project.theme ||= 'tech-blue'; project.voice ||= 'ETG1'; project.engine ||= 'garden'; project.status ||= '规划中';
    project.sceneData ||= buildScenes(project);
    project.scenes = project.sceneData.length;
    return project;
  }
  function buildScenes(project) {
    const title = project.title || '未命名视频';
    return [
      {id:'S01',type:'title',name:'开场 Hook',title,body:'用一个问题快速进入主题',duration:5,animation:'fade-in'},
      {id:'S02',type:'flow',name:'核心流程',title:'核心机制是怎样运转的？',body:'用户问题|检索/分析|组织信息|输出结果',duration:10,animation:'svg-flow'},
      {id:'S03',type:'compare',name:'关键对比',title:'为什么这个方法更有效？',body:'传统方式|信息容易过时|当前方案|结构更清晰、可追踪',duration:8,animation:'card-reveal'},
      {id:'S04',type:'summary',name:'总结 CTA',title:'记住这 3 个重点',body:'先理解问题|再看工作流程|最后理解适用边界',duration:8,animation:'card-reveal'}
    ];
  }
  function persistProject(project) {
    const list = readJSON(STORAGE_PROJECTS, []);
    const i = list.findIndex(x => x.id === project.id);
    const next = {...project, updatedAt:new Date().toISOString(), scenes:project.sceneData?.length || project.scenes || 0};
    if (i >= 0) list[i] = next; else list.push(next);
    writeJSON(STORAGE_PROJECTS, list); rebuildProjects();
    return next;
  }
  function getProject(id) { return state.projects.find(p => p.id === id) || state.projects[0]; }
  function statusClass(s) { return s === '已完成' ? 'status-done' : s === '制作中' ? 'status-progress' : 'status-plan'; }
  function iconFor(type) { return ({hook:'⚡',scene:'◫',theme:'✦',title:'T',flow:'⇢',compare:'↔',summary:'✓'})[type] || '◈'; }

  function bindShell() {
    window.addEventListener('hashchange', () => { state.sceneIndex = 0; stopPlayback(); render(); });
    $('#new-project-btn')?.addEventListener('click', () => navigate('create'));
    $('#global-search')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') { state.search = e.currentTarget.value.trim(); navigate('projects'); }
    });
  }
  function updateNavigation(path) {
    const normalized = path === 'create' ? 'projects' : path;
    $$('.nav-link').forEach(a => a.classList.toggle('active', a.dataset.route === normalized));
    $$('.mobile-nav a').forEach(a => a.classList.toggle('active', a.dataset.route === normalized));
    const titles = {dashboard:'工作台',projects:'项目中心',create:'创建视频',studio:'视频工作台',templates:'模板库',assets:'素材库',lab:'开源实验室',settings:'设置'};
    const title = titles[path] || 'Project6';
    if ($('#page-title')) $('#page-title').textContent = title;
    document.title = `${title} · Project6`;
  }
  function render() {
    const {path, params} = routeInfo(); updateNavigation(path);
    const root = $('#app-content'); if (!root) return;
    stopPlayback(false);
    if (path === 'dashboard') root.innerHTML = dashboardView();
    else if (path === 'projects') root.innerHTML = projectsView();
    else if (path === 'create') root.innerHTML = createView(params);
    else if (path === 'studio') root.innerHTML = studioView(params);
    else if (path === 'templates') root.innerHTML = templatesView();
    else if (path === 'assets') root.innerHTML = assetsView();
    else if (path === 'lab') root.innerHTML = labView();
    else if (path === 'settings') root.innerHTML = settingsView();
    else { navigate('dashboard'); return; }
    bindView(path, params);
  }

  function projectCard(p) {
    return `<article class="card project-card">
      <div class="project-cover"><span class="project-id">${esc(p.id)} · ${esc(p.category || '视频项目')}</span><div class="project-title">${esc(p.title)}</div></div>
      <div class="card-pad"><span class="status ${statusClass(p.status)}">${esc(p.status)}</span>
      <div class="project-meta"><span>${p.sceneData?.length || p.scenes || 0} Scenes</span><span>${esc(p.engine)}</span></div>
      <div class="toolbar" style="margin-top:14px"><button class="btn btn-soft open-studio" data-id="${esc(p.id)}">进入 Studio</button></div></div>
    </article>`;
  }
  function templateCard(t) {
    return `<article class="card template-card" data-template="${esc(t.id)}"><div class="template-icon">${iconFor(t.type)}</div><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p><div class="tag-row"><span class="tag">${esc(t.type.toUpperCase())}</span><span class="tag">可复用</span></div></article>`;
  }

  function dashboardView() {
    const completed = state.projects.filter(p => p.status === '已完成').length;
    const inProgress = state.projects.filter(p => p.status === '制作中').length;
    const recent = state.projects.slice(0,4);
    return `<section class="hero"><div><span class="eyebrow">✦ PROJECT6 · PERSONAL AI VIDEO OS</span><h1>AI Video<br><span>Creative Studio</span></h1><p>把脚本、分镜、Scene、TTS、模板和网页动画统一到一个工作台。第一阶段先把“可重复的视频生产流程”做扎实，再逐步接入 AI API 与本地 MP4 导出。</p><div class="hero-actions"><button class="btn btn-primary" id="hero-create">＋ 新建视频项目</button><button class="btn btn-ghost" id="hero-templates">浏览模板</button></div></div><div class="hero-visual"><div class="orbit"><div class="orbit-center">▶</div><div class="orbit-chip">Garden Scenes</div><div class="orbit-chip">Project5 TTS</div><div class="orbit-chip">HTML / SVG</div><div class="orbit-chip">Local Render</div></div></div></section>
    <section class="stats"><div class="stat-card"><div class="stat-label">视频项目</div><div class="stat-value">${state.projects.length}</div><div class="stat-meta">${inProgress} 个制作中</div></div><div class="stat-card"><div class="stat-label">模板资产</div><div class="stat-value">${state.templates.length}</div><div class="stat-meta">持续沉淀方法论</div></div><div class="stat-card"><div class="stat-label">已完成</div><div class="stat-value">${completed}</div><div class="stat-meta">可继续复用结构</div></div><div class="stat-card"><div class="stat-label">默认声音</div><div class="stat-value" style="font-size:22px">ETG1</div><div class="stat-meta">Project5 / Edge</div></div></section>
    <div class="section-head"><div><h2>最近项目</h2><p>继续上次的脚本、分镜与 Scene。</p></div><button class="btn btn-ghost" id="all-projects">查看全部</button></div><section class="grid grid-4">${recent.map(projectCard).join('')}</section>
    <div class="section-head"><div><h2>推荐模板</h2><p>不是收藏视频，而是沉淀可复用的生产规律。</p></div><button class="btn btn-ghost" id="all-templates">模板库</button></div><section class="grid grid-3">${state.templates.slice(0,3).map(templateCard).join('')}</section>
    <div class="section-head"><div><h2>生产管线</h2><p>Project6 V1 保持静态、低资源、可部署。</p></div></div><section class="panel"><div class="panel-body"><div class="pipeline"><div class="pipeline-step"><b>1. Create</b><small>建立项目与默认分镜</small></div><div class="pipeline-step"><b>2. Studio</b><small>编辑 Scene 与时间轴</small></div><div class="pipeline-step"><b>3. Voice</b><small>Project5 TTS（下一阶段接入）</small></div><div class="pipeline-step"><b>4. Render</b><small>WebMotion / HyperFrames 本地导出</small></div></div></div></section>`;
  }

  function projectsView() {
    const q = state.search.toLowerCase();
    const projects = state.projects.filter(p => !q || [p.title,p.id,p.category,p.status].join(' ').toLowerCase().includes(q));
    return `<div class="section-head" style="margin-top:0"><div><h2>视频项目</h2><p>项目是 Project6 的最小生产单元：脚本 + Scene + 声音 + 主题。</p></div><button class="btn btn-primary" id="projects-create">＋ 新建项目</button></div>
      <section class="panel"><div class="panel-body"><div class="toolbar"><input id="project-search" class="input" style="max-width:340px" placeholder="搜索标题 / ID / 状态" value="${esc(state.search)}"><select id="project-filter" class="select" style="max-width:170px"><option value="">全部状态</option><option>制作中</option><option>规划中</option><option>已完成</option></select></div></div></section>
      <section class="grid grid-4" id="project-grid" style="margin-top:16px">${projects.length ? projects.map(projectCard).join('') : '<div class="card empty" style="grid-column:1/-1"><strong>没有匹配项目</strong>换一个关键词试试。</div>'}</section>`;
  }

  function createView(params) {
    const tplId = params.get('template'); const tpl = state.templates.find(t => t.id === tplId);
    const theme = tpl?.type === 'theme' ? tpl.id : 'THEME-TECH-001';
    return `<div class="section-head" style="margin-top:0"><div><h2>创建新视频</h2><p>先用结构化参数创建项目。AI 自动生成放到下一阶段，避免 V1 依赖昂贵 API。</p></div></div>
      <div class="create-layout"><form class="panel" id="create-form"><div class="panel-head"><b>项目设置</b><span class="status status-plan">LOCAL DRAFT</span></div><div class="panel-body"><div class="form-grid">
      <div class="field field-full"><label>视频标题</label><input class="input" name="title" required placeholder="例如：什么是 RAG？"></div>
      <div class="field"><label>内容类型</label><select class="select" name="category"><option>AI知识讲解</option><option>技术科普</option><option>财经知识</option><option>产品教程</option><option>读书分享</option></select></div>
      <div class="field"><label>视觉主题</label><select class="select" name="theme"><option value="THEME-TECH-001" ${theme==='THEME-TECH-001'?'selected':''}>科技蓝</option><option value="THEME-FINANCE-001" ${theme==='THEME-FINANCE-001'?'selected':''}>财经数据</option><option value="soft-blue">柔和知识风</option></select></div>
      <div class="field"><label>声音</label><select class="select" name="voice"><option value="ETG1">ETG1 · Edge 云哲</option><option value="none">暂不配音</option></select></div>
      <div class="field"><label>视频引擎</label><select class="select" name="engine"><option value="garden">Garden / HTML Scenes</option><option value="native">Project6 Native</option></select></div>
      <div class="field"><label>目标时长</label><select class="select" name="duration"><option value="60">1 分钟</option><option value="180" selected>3 分钟</option><option value="300">5 分钟</option></select></div>
      <div class="field"><label>项目状态</label><select class="select" name="status"><option>规划中</option><option>制作中</option></select></div>
      <div class="field field-full"><label>内容目标 / 提示</label><textarea class="textarea" name="brief" placeholder="这期视频想讲清楚什么？目标观众是谁？"></textarea></div>
      </div><div class="toolbar" style="margin-top:18px"><button class="btn btn-primary" type="submit">创建项目并进入 Studio</button><button class="btn btn-ghost" type="button" id="cancel-create">取消</button></div></div></form>
      <aside><div class="preview-note"><h3>创建后会得到什么？</h3><p>Project6 会先生成 4 个基础 Scene：开场、核心流程、关键对比、总结。它们会保存在浏览器 LocalStorage 中，可以立即进入 Studio 修改。</p></div><div class="notice" style="margin-top:14px">V1 暂时不把 API Key 放在前端，也不让 Webhook 承担 AI 生成或大型渲染。这样部署链路更稳定。</div>${tpl?`<div class="preview-note" style="margin-top:14px"><h3>已选模板</h3><p>${esc(tpl.name)} · ${esc(tpl.description)}</p></div>`:''}</aside></div>`;
  }

  function studioView(params) {
    const project = getProject(params.get('id'));
    if (!project) return '<div class="card empty"><strong>还没有项目</strong>先创建一个视频项目。</div>';
    const scenes = project.sceneData || buildScenes(project); state.sceneIndex = clamp(state.sceneIndex,0,scenes.length-1); const scene = scenes[state.sceneIndex];
    return `<div class="section-head" style="margin-top:0"><div><h2>${esc(project.title)}</h2><p>${esc(project.id)} · ${esc(project.category)} · ${esc(project.engine)}</p></div><div class="toolbar"><button class="btn btn-ghost" id="studio-back">项目中心</button><button class="btn btn-primary" id="save-project">保存修改</button></div></div>
    <div class="studio-layout"><section class="panel scene-list-panel"><div class="panel-head"><b>Scenes</b><small>${scenes.length} 个</small></div><div class="scene-list">${scenes.map((s,i)=>`<div class="scene-item ${i===state.sceneIndex?'active':''}" data-index="${i}"><b>${String(i+1).padStart(2,'0')} · ${esc(s.name)}</b><small>${esc(s.type)} · ${Number(s.duration)||0}s</small></div>`).join('')}<button class="btn btn-ghost" id="add-scene" style="width:100%;margin-top:8px">＋ 添加 Scene</button></div></section>
    <section class="stage-wrap"><div class="stage" id="stage">${scenePreview(scene, project)}</div><div class="toolbar" style="justify-content:center;margin-top:12px"><button class="btn btn-ghost" id="prev-scene">◀</button><button class="btn btn-primary" id="play-scenes">${state.playing?'暂停':'▶ 预览播放'}</button><button class="btn btn-ghost" id="next-scene">▶</button><button class="btn btn-soft" id="local-render">导出计划</button></div><div class="timeline"><div class="timeline-head"><span>Timeline · ${scenes.reduce((n,s)=>n+(Number(s.duration)||0),0)}s</span><span>HTML / SVG Scene Track</span></div><div class="timeline-track">${scenes.map((s,i)=>`<div class="timeline-segment ${i===state.sceneIndex?'active':''}" data-index="${i}" style="flex:${Math.max(1,Number(s.duration)||1)}">${String(i+1).padStart(2,'0')} ${esc(s.name)}<br>${Number(s.duration)||0}s</div>`).join('')}</div></div></section>
    <aside class="panel inspector"><div class="panel-head"><b>Scene Inspector</b><span class="tag">${esc(scene.type)}</span></div><div class="inspector-section"><div class="field"><label>Scene 名称</label><input class="input scene-field" data-key="name" value="${esc(scene.name)}"></div><div class="field"><label>主标题</label><input class="input scene-field" data-key="title" value="${esc(scene.title||'')}"></div><div class="field"><label>内容</label><textarea class="textarea scene-field" data-key="body">${esc(scene.body||'')}</textarea></div><div class="field"><label>时长（秒）</label><input type="number" min="1" max="60" class="input scene-field" data-key="duration" value="${Number(scene.duration)||5}"></div></div><div class="inspector-section"><b style="font-size:13px">Pipeline</b><div class="pipeline" style="grid-template-columns:1fr;margin-top:10px"><div class="pipeline-step"><b>🎙 ${esc(project.voice)}</b><small>Project5 TTS · 待后端代理接入</small></div><div class="pipeline-step"><b>🎨 ${esc(project.theme)}</b><small>Theme token</small></div><div class="pipeline-step"><b>⚙ ${esc(project.engine)}</b><small>Scene renderer</small></div></div></div></aside></div>`;
  }

  function scenePreview(scene, project) {
    const type = scene.type || 'title';
    if (type === 'flow') {
      const nodes = String(scene.body||'输入|处理|输出').split('|');
      return `<div class="stage-scene"><span class="stage-label">${esc(project.id)} · FLOW SCENE</span><div class="stage-title">${esc(scene.title||scene.name)}</div><div class="flow-row">${nodes.map((n,i)=>`${i?'<span class="flow-arrow">→</span>':''}<span class="flow-node">${esc(n)}</span>`).join('')}</div></div>`;
    }
    if (type === 'compare') {
      const parts = String(scene.body||'方案A|特点A|方案B|特点B').split('|');
      return `<div class="stage-scene"><span class="stage-label">COMPARE</span><div class="stage-title">${esc(scene.title||scene.name)}</div><div class="flow-row"><span class="flow-node">${esc(parts[0]||'A')}<br><small>${esc(parts[1]||'')}</small></span><span class="flow-arrow">VS</span><span class="flow-node">${esc(parts[2]||'B')}<br><small>${esc(parts[3]||'')}</small></span></div></div>`;
    }
    if (type === 'summary') {
      const points = String(scene.body||'重点一|重点二|重点三').split('|');
      return `<div class="stage-scene"><span class="stage-label">SUMMARY</span><div class="stage-title">${esc(scene.title||scene.name)}</div><div class="flow-row">${points.map((p,i)=>`<span class="flow-node">0${i+1} · ${esc(p)}</span>`).join('')}</div></div>`;
    }
    return `<div class="stage-scene"><span class="stage-label">PROJECT6 · ${esc(project.category)}</span><div class="stage-title">${esc(scene.title||project.title)}</div><div class="stage-sub">${esc(scene.body||'')}</div></div>`;
  }

  function templatesView() {
    return `<div class="section-head" style="margin-top:0"><div><h2>模板资产库</h2><p>模板保存“怎么做视频”，不是保存成品视频。</p></div><button class="btn btn-primary" id="template-create-project">＋ 用模板创建项目</button></div><div class="toolbar" style="margin-bottom:16px"><button class="btn btn-soft template-filter" data-type="">全部</button><button class="btn btn-ghost template-filter" data-type="hook">开场</button><button class="btn btn-ghost template-filter" data-type="scene">Scene</button><button class="btn btn-ghost template-filter" data-type="theme">Theme</button></div><section class="grid grid-3" id="template-grid">${state.templates.map(templateCard).join('')}</section>`;
  }

  function assetsView() {
    return `<div class="section-head" style="margin-top:0"><div><h2>素材库</h2><p>V1 先建立素材分类与使用规则，避免服务器存大量成品视频。</p></div></div><section class="grid grid-4"><div class="card card-pad"><div class="template-icon">▧</div><h3>图片</h3><p style="color:var(--text)">封面、插图、背景。后续接图片生成 API。</p></div><div class="card card-pad"><div class="template-icon">◇</div><h3>SVG / 图形</h3><p style="color:var(--text)">流程图、数据图、知识卡片，优先使用矢量素材。</p></div><div class="card card-pad"><div class="template-icon">♫</div><h3>Audio</h3><p style="color:var(--text)">Project5 TTS、音效和 BGM 的引用信息。</p></div><div class="card card-pad"><div class="template-icon">Aa</div><h3>Design Tokens</h3><p style="color:var(--text)">字体、圆角、颜色、动效速度等主题资产。</p></div></section><div class="notice" style="margin-top:18px">建议：服务器保存 HTML / CSS / SVG / 图片 / 必要音频；最终 MP4 默认导出到本地，不把服务器当视频仓库。</div>`;
  }

  function labView() {
    const labs = [
      ['🌱','Garden Skills','学习 Scene / Theme / Skill 组织方式','https://github.com/ConardLi/garden-skills'],
      ['H','HyperFrames','学习 Agent-first HTML → Video 与确定性渲染','https://github.com/heygen-com/hyperframes'],
      ['W','WebMotion','学习浏览器 WebCodecs 本地视频导出','https://github.com/superhq-ai/webmotion'],
      ['M','Motion Canvas','学习知识讲解型矢量动画与配音同步','https://github.com/motion-canvas/motion-canvas'],
      ['K','Keyloom','学习 Scene 模板库和浏览器 Studio 结构','https://github.com/theexperiencecompany/keyloom'],
      ['✂','OpenCut','学习时间轴、轨道、素材和剪辑器交互','https://github.com/opencut-app/OpenCut']
    ];
    return `<div class="section-head" style="margin-top:0"><div><h2>开源实验室</h2><p>只吸收架构与方法，不把所有项目塞进 Project6。</p></div></div><section class="grid grid-3">${labs.map(x=>`<article class="card lab-card"><div class="lab-logo">${x[0]}</div><div><h3>${esc(x[1])}</h3><p>${esc(x[2])}</p><a href="${x[3]}" target="_blank" rel="noopener">查看源码 ↗</a></div></article>`).join('')}</section><div class="notice" style="margin-top:18px">当前路线：Garden 学生产结构 → Motion Canvas 学知识动画 → WebMotion / HyperFrames 学本地导出 → OpenCut 学 Studio 交互。</div>`;
  }

  function settingsView() {
    const s = readJSON(STORAGE_SETTINGS, {voice:'ETG1',project5:'http://186.244.245.177:28442/',render:'browser'});
    return `<div class="section-head" style="margin-top:0"><div><h2>工作台设置</h2><p>只保存非敏感配置。API Key 不应写入公开前端。</p></div></div><form class="panel" id="settings-form"><div class="panel-body"><div class="form-grid"><div class="field"><label>默认声音</label><select class="select" name="voice"><option value="ETG1" ${s.voice==='ETG1'?'selected':''}>ETG1 · Edge 云哲</option><option value="none">无</option></select></div><div class="field"><label>默认渲染方式</label><select class="select" name="render"><option value="browser">浏览器本地渲染</option><option value="record">MediaRecorder 录制</option></select></div><div class="field field-full"><label>Project5 Base URL</label><input class="input" name="project5" value="${esc(s.project5||'')}" placeholder="http://server:port/"></div></div><div class="notice" style="margin-top:16px">Project5 需要 Bearer API Key。由于 Project6 目前是公开静态前端，不能安全保存密钥。正确方案是下一阶段增加一个很轻量的 server-side proxy，再由 Project6 调用代理。</div><button class="btn btn-primary" style="margin-top:16px">保存设置</button></div></form>`;
  }

  function bindView(path, params) {
    $$('.open-studio').forEach(b => b.addEventListener('click', () => navigate(`studio?id=${encodeURIComponent(b.dataset.id)}`)));
    $$('.template-card').forEach(c => c.addEventListener('dblclick', () => navigate(`create?template=${encodeURIComponent(c.dataset.template)}`)));
    if (path === 'dashboard') {
      $('#hero-create')?.addEventListener('click',()=>navigate('create')); $('#hero-templates')?.addEventListener('click',()=>navigate('templates')); $('#all-projects')?.addEventListener('click',()=>navigate('projects')); $('#all-templates')?.addEventListener('click',()=>navigate('templates'));
    }
    if (path === 'projects') bindProjects();
    if (path === 'create') bindCreate();
    if (path === 'studio') bindStudio(params);
    if (path === 'templates') bindTemplates();
    if (path === 'settings') bindSettings();
  }
  function bindProjects() {
    $('#projects-create')?.addEventListener('click',()=>navigate('create'));
    const input=$('#project-search'), filter=$('#project-filter');
    const apply=()=>{ const q=(input.value||'').toLowerCase(), f=filter.value; $$('.project-card').forEach(card=>{ const t=card.textContent.toLowerCase(); const status=card.textContent; card.style.display=(!q||t.includes(q))&&(!f||status.includes(f))?'':'none';}); };
    input?.addEventListener('input',apply); filter?.addEventListener('change',apply);
  }
  function bindCreate() {
    $('#cancel-create')?.addEventListener('click',()=>navigate('projects'));
    $('#create-form')?.addEventListener('submit', e => {
      e.preventDefault(); const fd=new FormData(e.currentTarget); const stamp=Date.now().toString().slice(-6);
      const p={id:'P'+stamp,title:fd.get('title').trim(),category:fd.get('category'),theme:fd.get('theme'),voice:fd.get('voice'),engine:fd.get('engine'),duration:Number(fd.get('duration')),status:fd.get('status'),brief:fd.get('brief').trim(),createdAt:new Date().toISOString()};
      p.sceneData=buildScenes(p); p.scenes=p.sceneData.length; persistProject(p); toast('项目已创建'); navigate(`studio?id=${encodeURIComponent(p.id)}`);
    });
  }
  function bindStudio(params) {
    const project=getProject(params.get('id')); if(!project) return; const scenes=project.sceneData;
    const go=i=>{ state.sceneIndex=clamp(i,0,scenes.length-1); render(); };
    $$('.scene-item,.timeline-segment').forEach(el=>el.addEventListener('click',()=>go(Number(el.dataset.index))));
    $('#prev-scene')?.addEventListener('click',()=>go(state.sceneIndex-1)); $('#next-scene')?.addEventListener('click',()=>go(state.sceneIndex+1)); $('#studio-back')?.addEventListener('click',()=>navigate('projects'));
    $$('.scene-field').forEach(el=>el.addEventListener('change',()=>{ const scene=scenes[state.sceneIndex]; const key=el.dataset.key; scene[key]=key==='duration'?clamp(Number(el.value)||1,1,60):el.value; persistProject(project); render(); }));
    $('#save-project')?.addEventListener('click',()=>{persistProject(project);toast('项目已保存到本机浏览器');});
    $('#add-scene')?.addEventListener('click',()=>{scenes.push({id:'S'+String(scenes.length+1).padStart(2,'0'),type:'title',name:'新 Scene',title:'新的画面',body:'在右侧修改内容',duration:5,animation:'fade-in'});persistProject(project);state.sceneIndex=scenes.length-1;render();});
    $('#local-render')?.addEventListener('click',()=>toast('已预留本地导出接口：下一阶段接 WebMotion / HyperFrames'));
    $('#play-scenes')?.addEventListener('click',()=>state.playing?stopPlayback(true):startPlayback(project));
  }
  function startPlayback(project) {
    stopPlayback(false); state.playing=true; toast('开始 Scene 预览'); render();
    const step=()=>{ const p=getProject(project.id); const scenes=p.sceneData; if(!state.playing)return; if(state.sceneIndex>=scenes.length-1){stopPlayback(true);return;} state.sceneIndex++; render(); state.playing=true; state.playTimer=setTimeout(step, Math.min(Math.max((scenes[state.sceneIndex].duration||5)*250,1000),3000)); };
    state.playTimer=setTimeout(step, 1400);
  }
  function stopPlayback(rerender=false) { clearTimeout(state.playTimer); state.playTimer=null; const was=state.playing; state.playing=false; if(rerender&&was) render(); }
  function bindTemplates() {
    $('#template-create-project')?.addEventListener('click',()=>navigate('create'));
    $$('.template-filter').forEach(btn=>btn.addEventListener('click',()=>{const type=btn.dataset.type;$$('.template-card').forEach(c=>{const t=state.templates.find(x=>x.id===c.dataset.template);c.style.display=!type||t?.type===type?'':'none';});$$('.template-filter').forEach(x=>{x.className='btn '+(x===btn?'btn-soft':'btn-ghost')});}));
    $$('.template-card').forEach(c=>c.addEventListener('click',()=>{toast('双击模板可用于创建项目');}));
  }
  function bindSettings() {
    $('#settings-form')?.addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);writeJSON(STORAGE_SETTINGS,{voice:fd.get('voice'),render:fd.get('render'),project5:fd.get('project5')});toast('设置已保存');});
  }

  boot();
})();

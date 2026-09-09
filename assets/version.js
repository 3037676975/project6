(() => {
  const BUILD = Object.freeze({
    project: 'Project6',
    version: 'v47',
    number: 47,
    cache: '47',
    updatedAt: '2026-09-09'
  });
  window.P6_BUILD = BUILD;

  function syncCurrentVersionUI(){
    const skip = new Set(['SCRIPT','STYLE','PRE','CODE','TEXTAREA']);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (!n.parentElement || skip.has(n.parentElement.tagName)) continue;
      if (/\bv\d+\b/i.test(n.nodeValue || '')) nodes.push(n);
    }
    nodes.forEach(n => { n.nodeValue = n.nodeValue.replace(/\bv\d+\b/gi, BUILD.version); });
    document.querySelectorAll('a[href], iframe[src]').forEach(el => {
      const attr = el.hasAttribute('href') ? 'href' : 'src', raw = el.getAttribute(attr);
      if (!raw) return;
      let next = raw.replace(/([?&])v=\d+/g, `$1v=${BUILD.cache}`);
      next = next.replace(/\bv\d+\b/gi, BUILD.version);
      if (next !== raw) el.setAttribute(attr, next);
    });
    if (/\bv\d+\b/i.test(document.title)) document.title = document.title.replace(/\bv\d+\b/gi, BUILD.version);
  }
  const mount = () => {
    syncCurrentVersionUI();
    if (document.getElementById('p6BuildBadge')) return;
    const badge=document.createElement('div'); badge.id='p6BuildBadge'; badge.textContent=`P6 · ${BUILD.version}`; badge.title=`Project6 build ${BUILD.version} · ${BUILD.updatedAt}`;
    Object.assign(badge.style,{position:'fixed',top:'14px',right:'16px',zIndex:'99999',minWidth:'72px',height:'30px',padding:'0 10px',display:'inline-flex',alignItems:'center',justifyContent:'center',border:'1px solid rgba(15,23,42,.14)',borderRadius:'999px',background:'rgba(255,255,255,.92)',color:'#172033',boxShadow:'0 8px 24px rgba(15,23,42,.10)',backdropFilter:'blur(10px)',WebkitBackdropFilter:'blur(10px)',font:'900 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace',letterSpacing:'.04em',pointerEvents:'none'});
    document.body.appendChild(badge);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
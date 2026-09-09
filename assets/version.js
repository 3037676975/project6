(() => {
  const BUILD = Object.freeze({
    project: 'Project6',
    version: 'v45',
    number: 45,
    cache: '45',
    updatedAt: '2026-09-09'
  });
  window.P6_BUILD = BUILD;

  const mount = () => {
    if (document.getElementById('p6BuildBadge')) return;
    const badge = document.createElement('div');
    badge.id = 'p6BuildBadge';
    badge.textContent = `P6 · ${BUILD.version}`;
    badge.title = `Project6 build ${BUILD.version} · ${BUILD.updatedAt}`;
    Object.assign(badge.style, {
      position: 'fixed', top: '14px', right: '16px', zIndex: '99999',
      minWidth: '72px', height: '30px', padding: '0 10px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      border: '1px solid rgba(15,23,42,.14)', borderRadius: '999px',
      background: 'rgba(255,255,255,.92)', color: '#172033',
      boxShadow: '0 8px 24px rgba(15,23,42,.10)',
      backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
      font: '900 12px/1 ui-monospace,SFMono-Regular,Menlo,monospace',
      letterSpacing: '.04em', pointerEvents: 'none'
    });
    document.body.appendChild(badge);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, {once:true});
  else mount();
})();

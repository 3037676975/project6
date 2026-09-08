(() => {
  const root = document.getElementById('sceneRoot');
  if (!root) return;
  function repair(){
    root.querySelectorAll('.s002 .pipe-node').forEach(el => {
      const txt = el.textContent || '';
      if (!txt.includes('<br>')) return;
      const parts = txt.split('<br><small>');
      const main = parts[0];
      const sub = (parts[1] || '').replace('</small>','');
      el.textContent = '';
      const b = document.createElement('b'); b.textContent = main;
      const small = document.createElement('small'); small.textContent = sub;
      el.append(b, small);
    });
  }
  new MutationObserver(repair).observe(root,{childList:true,subtree:true});
  repair();
})();

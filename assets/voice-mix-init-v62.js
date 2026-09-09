(() => {
  if(!/\/record\.html$/i.test(location.pathname))return;
  const prepare=()=>{if(typeof window.P6EnsureVoiceMix==='function')window.P6EnsureVoiceMix().catch(()=>{});else setTimeout(prepare,40)};
  prepare();
})();
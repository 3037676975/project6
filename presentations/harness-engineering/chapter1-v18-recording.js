// v18 recording capability hint. Does not change the existing recorder on secure origins.
(() => {
  const btn=document.getElementById('recordBtn');
  const status=document.getElementById('recordStatus');
  if(!btn||!status)return;
  const supported=!!(window.isSecureContext&&navigator.mediaDevices?.getDisplayMedia);
  if(!supported){
    status.textContent='当前 HTTP · 需 HTTPS';
    status.title='浏览器屏幕捕获 getDisplayMedia 只允许 HTTPS，localhost/127.0.0.1 为本机开发例外。';
    btn.title='远程 HTTP 页面无法调用浏览器屏幕捕获；切换到 HTTPS 后即可本地录制并自动下载。';
    document.addEventListener('click',e=>{
      if(e.target!==btn)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      status.textContent='请用 HTTPS / localhost';
    },true);
  } else {
    status.textContent='录制就绪';
    btn.title='录制完成后直接下载到浏览器本地，不上传服务器';
  }
})();

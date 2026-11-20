// ============================================================
// 公共防直达检测脚本（最终修复版）
// 使用方式：在页面中引入 <script src="direct-access-check.js"></script>
// 说明：本文件从 repo-login/direct-access-check.js 复制，仅把“未登录跳转”
//       的目标由不存在的相对 login.html 改为登录站完整地址（XAUTH.LOGIN_PAGE），
//       其余逻辑保持原样。仓库3 域名下没有 login.html，相对路径会 404。
// ============================================================

(function(){
  try{
    // 登录页完整地址（优先用 xauth.js 的 XAUTH.LOGIN_PAGE）
    function loginPageUrl(){
      try{
        if(window.XAUTH && window.XAUTH.LOGIN_PAGE) return window.XAUTH.LOGIN_PAGE;
      }catch(e){}
      return 'https://cqxjw-class7-2020.pages.dev/login.html';
    }

    // 检查是否已登录
    var hasSession = localStorage.getItem('sb_session') || localStorage.getItem('sb_admin') || 
                      sessionStorage.getItem('sb_session') || sessionStorage.getItem('sb_admin');
    var loggedIn = sessionStorage.getItem('logged_in') || localStorage.getItem('logged_in');
    
    // 检查是否是访客
    var isVisitor = sessionStorage.getItem('visitor_verified') || 
                    sessionStorage.getItem('mode') === 'visitor' ||
                    localStorage.getItem('mode') === 'visitor';
    
    // 检查是否是管理员页面（需要管理员权限）
    var isAdminPage = window.location.pathname.indexOf('admin-') >= 0;
    
    // 如果未登录且不是访客，跳转到登录页
    if(!loggedIn || !hasSession){
      if(!isVisitor){
        // 延迟跳转，确保页面其他代码可以正常执行
        setTimeout(function(){
          window.location.href = loginPageUrl();
        }, 100);
        return;
      }
    }
    
    // 如果是管理员页面，检查是否是管理员
    if(isAdminPage && loggedIn && hasSession){
      try{
        var adm = JSON.parse(localStorage.getItem('sb_admin') || sessionStorage.getItem('sb_admin') || 'null');
        var ADMIN_UIDS = ["919f3af0-801d-4d7b-87b4-03bedc9d2896", "6522e17f-14ea-4f1f-b20d-10457d598fef"];
        if(!adm || !adm.uid || ADMIN_UIDS.indexOf(adm.uid) < 0){
          setTimeout(function(){
            window.location.href = loginPageUrl();
          }, 100);
          return;
        }
      }catch(e){
        setTimeout(function(){
          window.location.href = loginPageUrl();
        }, 100);
        return;
      }
    }
  }catch(e){
    // 如果有错误，不阻止页面加载，只在控制台输出错误
    console.error('防直达检测错误:', e);
  }
})();

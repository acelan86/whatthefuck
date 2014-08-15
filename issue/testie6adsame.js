var iframe_dom = parent.document.getElementById(sinaadToolkitSandboxId);

var newdiv = parent.document.createElement("div");
newdiv.id = "_as_expandpip";
iframe_dom.parentNode.parentNode.parentNode.insertBefore(newdiv,iframe_dom.parentNode.parentNode)
iframe_dom.parentNode.parentNode.style.height = "1px";

var t = parent.document.createElement('script');
t.src = 'http://d1.sina.com.cn/litong/zhitou/test/3403.js';
t.type = 'text/javascript';
iframe_dom.parentNode.insertBefore(t,iframe_dom);
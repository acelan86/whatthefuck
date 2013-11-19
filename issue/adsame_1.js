//if(document.domain == "sina.com.cn"){
	document.domain = "sina.com.cn"	;
//}

var iframe_dom = parent.document.getElementById(sinaadToolkitSandboxId);

var newdiv = parent.document.createElement("div");
newdiv.id = "_as_expandpip";
newdiv.style.marginTop = "2px";
newdiv.style.marginLeft = "2px";
iframe_dom.parentNode.insertBefore(newdiv,iframe_dom)
var t = parent.document.createElement('script');
t.src = 'http://rm.sina.com.cn/bj_chuanyang/xj20131112/34366.js';
t.type = 'text/javascript';
iframe_dom.parentNode.insertBefore(t,iframe_dom);

iframe_dom.style.display = "block";



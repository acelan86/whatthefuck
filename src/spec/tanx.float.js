(function(doc) {
    "use strict";
    //正式上线极有可能是这个pid
    //var pid = 'mm_15890324_2192376_18658505';

    //这是一个pid是一个测试pid，会出现域名未注册的情况
    var pid = 'mm_26632206_2690592_13334931';

    var anchor = doc.createElement('a');
    anchor.style.display = 'none';
    anchor.id = 'tanx-a-' + pid;
    doc.body.appendChild(anchor);

    var tanx_s = doc.createElement('script');
    tanx_s.type = 'text/javascript';
    tanx_s.charset = 'gbk';
    tanx_s.id = 'tanx-s-' + pid;
    tanx_s.async = true;
    tanx_s.src = 'http://p.tanx.com/ex?i=' + pid;

    var tanx_h = doc.getElementsByTagName('head')[0];
    if (tanx_h) {
        tanx_h.insertBefore(tanx_s, tanx_h.firstChild);
    }
})(document);

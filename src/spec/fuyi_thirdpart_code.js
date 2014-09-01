(function (d, s, id) {
    "use strict";
    var uid = "woshiacelanaacelan";
    var code = "//r.sax.sina.com.cn/fy.html?" + uid;
    if (document.getElementById(id)) {
        return;
    }
    var iframe = document.createElement('iframe');
    iframe.src = code;
    iframe.id = id;
    iframe.style.cssText = 'position:absolute;width:1px;height:1px;border:none;';
    document.body.appendChild(iframe);
})(document, 'iframe', 'sina-fy');
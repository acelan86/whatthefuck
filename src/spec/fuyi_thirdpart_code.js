(function (d, id) {
    "use strict";
    var uid = "5202423375",
        code = "//r.sax.sina.com.cn/fy.html?" + uid,
        n = d.getElementsByTagName('script')[0],
        s;
    if (document.getElementById(id)) {
        return;
    }
    s = d.createElement('iframe');
    s.style.cssText = "position:absolute;width:1px;height:1px;margin:0px;padding:0px;overflow:hidden;border:none;";
    s.src = code;
    s.id = id;
    n.parentNode.insertBefore(s, n);
})(document, 'sina-fy');
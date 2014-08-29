(function (d, s, id) {
    "use strict";
    var uid = "woshiacelanaacelan";
    var code = "//d5.sina.com.cn/litong/zhitou/sinaads/src/spec/fuyi_small_thirdpart_code.html?" + uid;
    if (document.getElementById(id)) {
        return;
    }
    var iframe = document.createElement('iframe');
    iframe.src = code;
    iframe.id = id;
    document.body.appendChild(iframe);
})(document, 'iframe', 'sina-fy');
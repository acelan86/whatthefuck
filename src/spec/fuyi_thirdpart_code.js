(function (d, s, id) {
    var uid = "woshiacelanaacelan";
    var code = "//r.sax.sina.com.cn/fuyi_thirdpart_code.html?" + uid;
    if (document.getElementById(id)) return;
    var iframe = document.createElement('iframe');
    iframe.src = code;
    iframe.id = id;
    document.body.appendChild(iframe);
})(document, 'iframe', 'sina-fy');
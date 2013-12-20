(function (exports) {
    "use strict";

    //获取window.name上带的参数
    var EX_PAR = (function () {
        var n = window.name,
            s = location.search.substring(1),
            i = 0,
            len,
            p,
            EX_PAR = {},
            arr = [];

        if (n) {
            arr.push(n);
        }
        if (s) {
            arr.push(s);
        }
        n = arr.join('&');

        if (n) {
            n = n.split('&');
            for(i = 0, len = n.length; i < len; i++) {
                p = n[i];
                if (p) {
                    p = p.split('=');
                    if (EX_PAR[p[0]]) {
                        EX_PAR[p[0]].push(p[1]);
                    } else {
                        EX_PAR[p[0]] = [p[1]];
                    }
                }
            }
        }
        return EX_PAR;
    })();


    var sinaadsMoHelper = {
        rnd : function () {
            return Math.floor(Math.random() * 2147483648).toString(36);
        },
        log : function (url, useCache) {
            var img = new Image(),
                key = '_sinaads_sio_log_' + sinaadsMoHelper.rnd();

            window[key] = img;
         
            img.onload = img.onerror = img.onabort = function () {
                img.onload = img.onerror = img.onabort = null;
         
                window[key] = null;
                img = null;
            };
     
            img.src = url + (useCache ? '' : (url.indexOf('?') > 0 ? '&' : '?') + key);
        },
        sendClickTag : function () {
            if (EX_PAR.clickTAG && EX_PAR.clickTAG.length > 0) {
                for (var k = 0, len = EX_PAR.clickTAG.length; k < len; k++) {
                    sinaadsMoHelper.log(decodeURIComponent(EX_PAR.clickTAG[k]));
                }
            }

        }
    };

    exports.sinaadsMoHelper = exports.sinaadsMoHelper || sinaadsMoHelper;

})(window);
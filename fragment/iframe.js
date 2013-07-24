function fillIframe(iframe, content, useStandar) {
    //
    if (useStandar && Boolean(content)) {
        var _content = content.toLowerCase();
        //有标准头
        content = -1 < _content.indexOf("<!doctype") || -1 < _content.indexOf("<html") ? 
            content : 
            "<html>\n<head>\n<script>var inDapIF=true;\x3c/script>\n</head><body>" + content + "</body></html>\n";
    }
    //ie
    if (0 != ie) {
        var doc;
        try {
            doc = !!iframe.contentWindow.document
        } catch(e) {
            doc = false;
        }

        //document能获取到
        if (doc) {
            var f = b,
            g = jd();
            try {
                b = f;
                var h = "http://" + na() + "/pagead/inject_object_div.js"; //url
                //IE > 6
                if (6 < parseInt(qc(), 10) || 0 > b.indexOf(h)) {
                    var k;
                    i: {
                        var l = qc();
                        if (! (0 == l || isNaN(l) || 10 <= l || 7 > l)) for (h = 0; h < f.length; ++h) if (127 < f.charCodeAt(h)) {
                            k = !0;
                            break i

                        }
                        k = !1

                    }
                    if (k) {
                        var p = unescape(encodeURIComponent(f)),
                        m = Math.floor(p.length / 2);
                        k = [];
                        for (h = 0; h < m; ++h) k[h] = String.fromCharCode(256 * p.charCodeAt(2 * h + 1) + p.charCodeAt(2 * h));
                        1 == p.length % 2 && (k[m] = p.charAt(p.length - 1));
                        f = k.join("")

                    }
                    window.frames[a.name].contents = f;
                    a.src = 'javascript:window["contents"]'

                } else {
                    window.frames[iframe.name].contents = f,
                    iframe.src = 'javascript:document.write(window["contents"]);document.close();'
                }
            } catch(u) {
                kd("Could not write third party content into IE iframe: " + 
                u.message)

            } finally {
                ld(g)

            }
        //document不能获取到
        } else {
            m = b;
            p = jd();
            try {
                f = "google-ad-content-" + (Math.floor(2147483648 * Math.random()).toString(36) + Math.abs(Math.floor(2147483648 * Math.random()) ^ ga()).toString(36)),
                window[f] = m,
                m = 'var adContent = window.parent["' + f + '"];window.parent["' + f + '"] = null;document.write(adContent);',
                m = 6 == qc() ? "window.onload = function() {document.write(\\'<sc\\' + \\'ript type=\"text/javascript\">document.domain = \"" + document.domain + '";' + m + "<\\/scr\\' + \\'ipt>\\');document.close(); };": 'document.domain = "' + 
                document.domain + '";' + m + "document.close();",
                iframe.src = 'javascript:\'<script type="text/javascript">' + m + "\x3c/script>'"

            } catch(K) {
                window[f] = null,
                kd("Could not write third party content into  IE iframe with modified document.domain: " + K.message)

            } finally {
                ld(p)

            }

        }

    } else {
        p = b;
        try {
            g = a.contentWindow ? a.contentWindow.document: a.contentDocument,
            -1 != navigator.userAgent.indexOf("Firefox") && g.open("text/html", "replace"),
            g.write(p),
            g.close()

        } catch(v) {
            kd("Could not write content into iframe using  the DOM standards method:" + 
            v.message)

        }

    }
}
(function (window, undefined) {
    var NOW = (new Date()).getTime();
    var PV_DOMAIN = 'sina.com.cn'; //曝光监测地址

    var SSP_ALLOW_SIZE = {
        '980*90'    : true,
        '300*500'   : true
    };

    var _IFRAME_ONLOAD_CODE = '' + 
        'console.debug(window)' + 
        // 'var i = this.id,' + 
        //     's = window.sinaads_iframe_oncopy,' + 
        //     'H = s && s.handlers,' +
        //     'h = H && H[i],' + 
        //     'w = this.contentWindow,' + 
        //     'd;' +
        // 'try {' + 
        //     'd = w.document;' +
        // '} catch ( e ) {}' + 
        // 'if (h && d && (!d.body || !d.body.firstChild)) {' + 
        //     'if (h.call) {' + 
        //         'setTimeout(h, 0)' +
        //     '} else if (h.match) {' + 
        //         'w.location.replace(h);' + 
        //     '}' + 
        // '}' + 
    ';';

    //html转移相关
    var da = /&/g,
        ea = /</g, 
        fa = />/g, 
        ga = /\"/g, 
        B = {"\x00": "\\0","\b": "\\b","\f": "\\f","\n": "\\n","\r": "\\r","\t": "\\t","\x0B": "\\x0B",'"': '\\"',"\\": "\\\\"},
        C = {"'": "\\'"};

    //字符串中需要转义的字符及对应的转义字符串
    var ESCAPE_MAP = {
            '"'     : '\\"',
            "\\"    : "\\\\", 
            "/"     : "\\/",
            "\b"    : "\\b",
            "\f"    : "\\f",
            "\n"    : "\\n",
            "\r"    : "\\r",
            "\t"    : "\\t",
            "\x0B"  : "\\u000b"
        },
        //字符串中非中文字符串
        STR_REG = /\uffff/.test("\uffff") ? (/[\\\"\x00-\x1f\x7f-\uffff]/g) : (/[\\\"\x00-\x1f\x7f-\xff]/g);

    /**
     * 转义特殊字符并将其他字符换成unicode
     */
    function _string(str, arr) {
        arr.push('"');
        arr.push(str.replace(STR_REG, function(s) {
            //如果再需要转义的字符表中，替换成转移字符对应的值
            if (s in ESCAPE_MAP) {
                return ESCAPE_MAP[s];
            }
            //否则转成对应的unicode码
            var alphaCode = s.charCodeAt(0), 
                unicodePerfix = "\\u";
            //需要增加几位0来补位
            16 > alphaCode ? unicodePerfix += "000" : 256 > alphaCode ? unicodePerfix += "00" : 4096 > alphaCode && (unicodePerfix += "0");
            //保存转移过的值到ESCAPE_MAP提高转义效率，同时返回进行替换
            return ESCAPE_MAP[s] = unicodePerfix + alphaCode.toString(16);
        }));
        arr.push('"');
    }


    /**
     * 从url中获取主域名
     */
    var DOMAIN_REG = /^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/;
    function  _getDomain(url, def_domain) {
        if (!url) {
            return def_domain;
        }
        var domain = url.match(DOMAIN_REG);
        return domain ? domain[0] : def_domain;
    }

    function _createURL(domain, path, useSSL) {
        var protocal = useSSL ? "https" : "http";
        return [protocal, "://", domain, path].join("");
    }


    /**
     * 将对象转换成字符串形式表示
     */
    function _stringify(value, arr) {
        switch (typeof value) {
            case "string":
                _string(value, arr);
                break;
            case "number":
                arr.push(isFinite(value) && !isNaN(value) ? value : "null");
                break;
            case "boolean":
                arr.push(value);
                break;
            case "undefined":
                arr.push("null");
                break;
            case "object":
                //is Null
                if (null == value) {
                    arr.push("null");
                    break;
                }
                //is Array
                if (value instanceof Array) {
                    var len = value.length,
                        comma;
                    arr.push("[");
                    for (comma = "", i = 0; i < len; i++) {
                        arr.push(comma);
                        _stringify(value[i], arr);
                        comma = ",";
                    }
                    arr.push("]");
                    break;
                }

                //is Object
                arr.push("{");
                var comma = "",
                    v;
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        v = value[key];
                        if ("function" != typeof v) { 
                            arr.push(comma);
                            _string(key, arr); 
                            arr.push(":");
                            _stringify(v, arr);
                            comma = ",";
                        }
                    }
                }
                arr.push("}");
                break;
            case "function":
                break;
            default:
                throw Error("未知的值类型: " + typeof value);
        }
    }

    /**
     * 遍历对象并执行方法，Object.map
     */
    function _map(obj, iterator) {
        for (var key in obj) {
            Object.prototype.hasOwnProperty.call(obj, key) && iterator.call(null, obj[key], key, obj);
        }
    }

    /**
     * 将config的属性值转换成变量声明代码
     */
    function _configToJsVarCode(config) {
        var code = [];

        config.sinaads_page_url && (config.sinaads_page_url = String(config.sinaads_page_url));

        _map(config, function(value, key) {
            if (null != value) {
                var tmp = [];
                try {
                    _stringify(value, tmp);
                    tmp = tmp.join("");
                } catch (k) {
                }
                tmp && code.push(key, "=", tmp, ";");
            }
        });

        return code.join("");
    }

    /**
     * 判断是否为sina商业广告节点且为未完成状态
     */
    //1.class=sinaads 
    //2.data-sinaads-status !== "done"
    function _isPaddingSinaad(element) {
        return /(^| )sinaads($| )/.test(element.className) && "done" !== element.getAttribute("data-ad-status");
    }
    /**
     * 如果有id参数，则获取id为当前id的未渲染元素，如果没有提供id，则从现有的元素中获取一个待渲染广告元素
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function _getSinaAd(id) {
        var inss = document.getElementsByTagName("ins"),
            i = 0,
            len = inss.length,
            ins;
        for (ins = inss[i]; i < len; ins = inss[++i]) {
            if (_isPaddingSinaad(ins) && (!id || ins.id === id)) { 
                return ins;
            }
        }
        return null;
    }

    /**
     * @todo  same array.push?
     * @param {[type]} array [description]
     * @param {[type]} attr  [description]
     */
    function _addAttributeToHTMLArray(arr, attr) {
        if (!(2 > arguments.length)) {
            for (var i = 1, len = arguments.length; i < len; ++i) {
                arr.push(arguments[i]);
            }
        }
    }

    function _getShowADScript() {
        var tag = "script";
        //return ["<", tag, ' src="', R(A(), "/pagead/js/r20130709/r20130206/show_ads_impl.js", ""), '"></', tag, ">"].join("");
        return '<script src="./sinaads_ssp.js"></script>';
    }
    /**
     * 创建公共的iframe属性值，填充到iframeConfig参数中
     * @param  {[type]} iframeConfig [description]
     * @param  {[type]} width        [description]
     * @param  {[type]} height       [description]
     * @param  {[type]} useQuote     [description]
     * @return {[type]}              [description]
     */
    function _initIframeProp(iframeConfig, width, height, useQuote) {
        var quote = useQuote ? '"' : ""; //是否使用引号将属性包裹
        var zero = quote + "0" + quote;
        iframeConfig.width = quote + width + quote;
        iframeConfig.height = quote + height + quote;
        iframeConfig.frameborder = zero;
        iframeConfig.marginwidth = zero;
        iframeConfig.marginheight = zero;
        iframeConfig.vspace = zero;
        iframeConfig.hspace = zero;
        iframeConfig.allowtransparency = quote + "true" + quote;
        iframeConfig.scrolling = quote + "no" + quote
    }

    /**
     * 根据iframeConfig生成iframe的html
     */
    function _createIframeHTML(iframeConfig) {
        var html = ["<iframe"];
        _map(iframeConfig, function(value, key) {
            html.push(" " + key + '="' + (null == value ? "" : value) + '"')
        });
        html.push("></iframe>");
        return html.join("");
    }


    /**
     * 是否可以操作iframe内容
     */
    function _canOptIframeContent(window) {
        try {
            return !!window.location.href || "" === window.location.href
        } catch (e) {
            return false;
        }
    }

    function _getFillIframeContentFn(window, iframeId, content, b) {
        return function() {
            var done = false;
            //e && Q().al(3E4);
            try {
                if (_canOptIframeContent(window.document.getElementById(iframeId).contentWindow)) {
                    var contentWindow = window.document.getElementById(iframeId).contentWindow, 
                        doc = contentWindow.document;
                    (doc.body && doc.body.firstChild || (doc.open(), doc.sinaads_async_iframe_close = true, doc.write(content)));
                } else {
                    var contentWindow = window.document.getElementById(iframeId).contentWindow,
                        code,
                        d;
                    d = content;
                    d = String(content);

                    if (d.quote) {
                        g = d.quote();
                    } else {
                        for (var tmp = ['"'], i = 0; i < d.length; i++) {
                            var l = d.charAt(i), 
                                y = l.charCodeAt(0), 
                                v = tmp, 
                                w = i + 1,
                                s;
                            if (!(s = B[l])) {
                                var z;
                                if (31 < y && 127 > y)
                                    z = l;
                                else {
                                    var r = l;
                                    if (r in C)
                                        z = C[r];
                                    else if (r in B)
                                        z = C[r] = B[r];
                                    else {
                                        var q = r, t = r.charCodeAt(0);
                                        if (31 < t && 127 > t)
                                            q = r;
                                        else {
                                            if (256 > t) {
                                                if (q = "\\x", 16 > t || 256 < t)
                                                    q += "0"
                                            } else
                                                q = "\\u", 4096 > t && (q += "0");
                                            q += t.toString(16).toUpperCase()
                                        }
                                        z = C[r] = q
                                    }
                                }
                                s = z
                            }
                            v[w] = s
                        }
                        tmp.push('"');
                        code = tmp.join("");
                    }
                    contentWindow.location.replace("javascript:" + code);
                }
                done = true
            } catch (e) {
                console.debug(e);
                //m = J().sinaads_jobrunner, P(m) && m.rl()
            }
            //f && (new U(a)).set(b, wa(a, b, c, !1))
        }
    }


    function _fillADElement(window, config, element, createWrapIframeFn) {
        var tag = "script", 
            width = config.sinaads_ad_width,
            height = config.sinaads_ad_height,
            iframeConfig = {},
            iframeId,
            pvIframeConfig = {},
            pvIframeId,
            pvIframeHTML;

        _initIframeProp(iframeConfig, width, height, !0);
        //iframe onload设置
        iframeConfig.onload = '"' + _IFRAME_ONLOAD_CODE + '"';

        //创建iframe容器并返回这个容器的id
        iframeId = createWrapIframeFn(window, iframeConfig, config);

        
        var varDecalareCode = _configToJsVarCode(config); //将config的属性转成变量声明的语句, 用于塞入iframe中作为真正广告的参数


        var auth = config || window; //如果没有config, 则取window中的参数，这个config用与生成唯一的验证码
        auth = [
            auth.sinaads_ad_pdps,
            auth.sinaads_ad_width,
            auth.sinaads_ad_height
        ];
        //最大25层，找到element嵌套的所有id的路径
        var path = [],  
            i = 0;

        if (element) {
            if (element) {
                for ( ; element && 25 > i; element = element.parentNode, ++i) {
                    path.push(9 != element.nodeType && element.id || "");
                }
                path = path.join();
            } else {
                path = "";
            }
            path && auth.push(path);
        }
        var authKey,
            len,
            seed = 305419896;
        if (auth) {
            if (authKey = auth.join(":"), len = authKey.length, 0 == len) {
                authKey = 0;
            } else {
                for (i = 0; i < len; i++)
                    seed ^= (seed << 5) + (seed >> 2) + authKey.charCodeAt(i) & 4294967295;
                authKey = 0 < seed ? seed : 4294967296 + seed;
            }
        }
        authKey = authKey.toString();

        

        pvIframeId = "ads_pv_iframe" + config.sinaads_uid;

        // //获取page_url 广告所在页面url
        // var page_url = adObj.sina_page_url;
        // if (!page_url) {
        //     n: {
        //         var doc = win.document;

        //         width = width || win.sina_ad_width, height = height || win.sina_ad_height;

        //         if (win.top == win) {
        //             var inIframe = !1;
        //         } else {
        //             var doc = doc.documentElement;
        //             if (width && height) {
        //                 var w = 1, s = 1;
        //                 a.innerHeight ? (w = a.innerWidth, s = a.innerHeight) : v && v.clientHeight ? (w = v.clientWidth, s = v.clientHeight) : b.body && (w = b.body.clientWidth, s = b.body.clientHeight);
        //                 if (s > 2 * y || w > 2 * l) {
        //                     b = !1;
        //                     break n
        //                 }
        //             }
        //             inIframe = !0
        //         }
        //     }
        //     page_url = inIframe ? win.document.referrer : win.document.URL
        // }

        // var loc = encodeURIComponent(page_url);
        // b = null;
        // "PC" != h && "EI" != h || (b = ("PC" == h ? "K" : "I") + "-" + (l + "/" + c + "/" + a.sinaads_unique_id));
        
        //构造曝光监控iframe
        _initIframeProp(pvIframeConfig, width, height, false);
        pvIframeConfig.style = "display:none";
        //d = b; //神马
        pvIframeConfig.id = pvIframeId;
        pvIframeConfig.name = pvIframeId;
        pvIframeConfig.src = _createURL(_getDomain("", PV_DOMAIN), ["/path", config.sinaads_page_url ? "#" + encodeURIComponent(config.sinaads_page_url) : ""].join(""));
        pvIframeHTML = _createIframeHTML(pvIframeConfig);



        var time = (new Date).getTime();


        var content = [
            '<!doctype html><html><body>',
                pvIframeHTML, //这里应该是曝光记录 
                '<', tag + '>',
                    varDecalareCode, 
                    //'sinaads_show_ads_impl=true;',
                    'sinaads_uid=', window.sinaads_uid, ';',
                    'sinaads_async_iframe_id="', iframeId, '";',
                    'sinaads_ad_auth_key="', authKey, '";',
                    "sinaads_start_time=", NOW, ";",
                    //"sinaads_bpp=", time > now ? time - now : 1, ";",
                '</', tag, '>',
                _getShowADScript(),
            '</body></html>'
        ].join("");

        _getFillIframeContentFn(window, iframeId, content, !0)();

        //(a.document.getElementById(e) ? ma : na)(wa(a, e, content, !0))
    }

    /**
     * 渲染广告
     * @param  {[type]} win   [description]
     * @param  {[type]} adObj [description]
     * @param  {[type]} adins [description]
     * @return {[type]}       [description]
     */
    function _render(window, config, element) {
        _fillADElement(window, config, element, function(window, iframeConfig, config) {
            var id = iframeConfig.id,
                i = 0;

            for ( ; !id || window.document.getElementById(id); ) {
                id = "sinaads_wrapiframe_" + i++;
            }

            iframeConfig.id = id;
            iframeConfig.name = id;

            var width = Number(config.sinaads_ad_width),
                height = Number(config.sinaads_ad_height),
                style = "border:none;height:" + width + "px;margin:0;padding:0;position:relative;visibility:visible;width:" + height + "px",
                html = ["<iframe"];
            
            for (var key in iframeConfig) {
                iframeConfig.hasOwnProperty(key) && _addAttributeToHTMLArray(html, key + "=" + iframeConfig[key]);
            }
            html.push('style="left:0;position:absolute;top:0;"');
            html.push("></iframe>");

            element.innerHTML = [
                '<ins style="display:inline-table;', style, '">',
                    '<ins id="', iframeConfig.id + "_wrapper", '" style="display:block;', style, '">',
                        html.join(" "), 
                    '</ins>',
                '</ins>'
            ].join("");

            //返回iframeid
            return iframeConfig.id;
        });
    }
    /**
     * 初始化广告对象
     * @param  {object} adConf [description]
     * @return {[type]}       [description]
     */
    function init(config) {
        var element = config.element; //广告容器

        config = config.params || {};   //广告配置

        //从confi.element中得到需要渲染的ins元素
        if (element) {
            if (!_isPaddingSinaad(element) && (element = element.id && _getSinaAd(element.id), !element)) {
                throw Error("sinaads: 该元素已经被渲染完成，无需渲染");
            }
            if (!("innerHTML" in element)) {
                throw Error("sinaads: 无法渲染该元素");
            }
        //没有对应的ins元素, 获取一个待初始化的ins, 如果没有，抛出异常
        } else if (element = _getSinaAd(), !element) {
            throw Error("sinaads: 所有待渲染的元素都已经被渲染完成");
        }

        //置成完成状态，下面开始渲染
        element.setAttribute("data-ad-status", "done"); 


        //全局唯一id标识，用于后面为容器命名
        window.sinaads_uid ? ++window.sinaads_uid : window.sinaads_uid = 1;

        //将data-xxx-xxxx,转换成sinaads_xxx_xxxx，并把值写入config
        //这里因为上面设置了data-ad-status属性, 所以sinaads-ad-status的状态也会被写入conf
        for (var attrs = element.attributes, len = attrs.length, i = 0; i < len; i++) {
            var attr = attrs[i];
            if (/data-/.test(attr.nodeName)) {
                var key = attr.nodeName.replace("data", "sinaads").replace(/-/g, "_");
                config.hasOwnProperty(key) || (config[key] = attr.nodeValue);
            }
        }


        //设置宽高属性到config中, sinaads_ad_height, sinaads_ad_width
        var reg = /([0-9]+)px/,
            keys = ["width", "height"],
            key,
            value;
        reg.test(element.style.width) && reg.test(element.style.height) || (element = window.getComputedStyle ? window.getComputedStyle(element, null) : element.currentStyle, element.style.width = element.width, element.style.height = element.height);
        for (var i = 0; i < keys.length; i++) {
            key = "sinaads_ad_" + keys[i], 
            config.hasOwnProperty(key) || (value = reg.exec(element.style[keys[i]])) && (config[key] = value[1]);
        }

        //@todo 判断使用什么样的广告脚本
        //比如使用宽高白名单等SSP_ALLOW_SIZE[config.sinaads_ad_width + '*' + config.sinaads_ad_height]
        config.sinaads_loader_used = config.sinaads_loader_used || "ssp"; //目前暂时只使用ssp加载方式


        //判断是否是广告位支持的格式
        //@todo 控制某个广告位只支持加载某种类型广告
        // var type;
        // if ((type = config.sinaads_ad_output) && "html" !== type) {
        //     throw Error("目前不支持sinaads_ad_output中配置的广告类型" + type);

        _render(window, config, element);
    }

    /* 在脚本加载之前注入的广告数据存入再sinaads数组中，遍历数组进行初始化 */
    var perloadAds = window.sinaads;
    if (perloadAds && perloadAds.shift) {
        for (var ad, len = 20; (ad = perloadAds.shift()) && 0 < len--;) {
            init(ad);
        }
    }
    //在脚本加载之后，sinaad重新定义，并赋予push方法为初始化方法
    window.sinaads = {push : init};
    /**
     * @usage  (sinaads = window.sinaads || []).push({});
     */
})(window);
/**
 * 渣浪统一商业广告脚本
 * @param  {[type]} window    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 * @usage  
 *     (sinaads = window.sinaads || []).push({});
 */
(function (window, undefined) {
    var now = (new Date()).getTime();

    var PV_DOMAIN = 'sina.com.cn'; //默认曝光监测地址

    //@todo 目前没有用到，这里预留可以配置允许的广告尺寸
    var SSP_ALLOW_SIZE = {
        '980*90'    : true,
        '300*500'   : true
    };

    var _IFRAME_ONLOAD_CODE = ''; //预留，当iframe广告加载完成后需要做的事情可以在外部定义


    //html转义相关
    var AMP_REG = /&/g,
        LT_REG = /</g, 
        GT_REG = />/g, 
        DOUBLE_QUOTE_REG = /\"/g, 
        BLANK_REG = {
            "\x00"  : "\\0",
            "\b"    : "\\b",
            "\f"    : "\\f",
            "\n"    : "\\n",
            "\r"    : "\\r",
            "\t"    : "\\t",
            "\x0B"  : "\\x0B",
            '"'     : '\\"',
            "\\"    : "\\\\"
        },
        QUOTE_REG = {
            "'": "\\'"
        };

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
    function _toUnicode(str, arr) {
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
     * 将对象转换成字符串形式表示
     */
    function _stringify(value, arr) {
        switch (typeof value) {
            case "string":
                _toUnicode(value, arr);
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
                            _toUnicode(key, arr); 
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
    function _isPenddingSinaad(element) {
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
            if (_isPenddingSinaad(ins) && (!id || ins.id === id)) { 
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
        //@todo 可以在这里根据sinaads_ad_format使用不同的加载脚本
        return ['<', tag, ' src="./ssp.js"></', tag, '>'].join('');
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
        iframeConfig.scrolling = quote + "no" + quote;
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
            try {
                if (_canOptIframeContent(window.document.getElementById(iframeId).contentWindow)) {
                    var contentWindow = window.document.getElementById(iframeId).contentWindow, 
                        doc = contentWindow.document;
                    (doc.body && doc.body.firstChild || (doc.open(), doc.sinaads_async_iframe_close = true, doc.write(content)));
                }
                done = true;
            } catch (e) {
                console.debug(e);
            }
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

        //获取page_url 广告所在页面url
        var page_url = config.sinaads_page_url, //是否配置了page_url, 广告所在页面
            isInIframe;
        if (!page_url) {
            page_url = (window.top === window) ?  window.document.URL : window.document.referrer;
        }

        //构造曝光监控iframe
        _initIframeProp(pvIframeConfig, width, height, false);
        pvIframeConfig.style = "display:none";
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
                    'sinaads_uid=', window.sinaads_uid, ';',
                    'sinaads_async_iframe_id="', iframeId, '";',
                    'sinaads_ad_auth_key="', authKey, '";',
                    "sinaads_start_time=", now, ";",
                '</', tag, '>',
                _getShowADScript(),
            '</body></html>'
        ].join("");

        _getFillIframeContentFn(window, iframeId, content, !0)();
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
                style = "border:none;height:" + height + "px;margin:0;padding:0;position:relative;visibility:visible;width:" + width + "px",
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
            if (!_isPenddingSinaad(element) && (element = element.id && _getSinaAd(element.id), !element)) {
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
        //
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
})(window);
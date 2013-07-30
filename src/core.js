/**
 * sinaadToolkit
 * 新浪广告工具包，提供了浏览器判断，渲染，cookie, storage, iframe, 转义等基础操作
 * @param  {[type]} window    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function (window, undefined) {

    var core = window.sinaadToolkit = window.sinaadToolkit || {
        /**
         * 工具包资源地址
         */
        TOOLKIT_URL : 'http://d1.sina.com.cn/litong/zhitou/sinaads/src/core.js',
        /**
         * 获取当前时间戳
         * @return {[type]} [description]
         */
        now : function () {
            return new Date().getTime();
        },
        /**
         * 判断是否是函数
         * @param  {[type]} source [description]
         * @return {[type]}        [description]
         */
        isFunction : function (source) {
            return '[object Function]' == Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是字符串
         * @param  {[type]} source [description]
         * @return {[type]}        [description]
         */
        isString : function (source) {
           return '[object String]' == Object.prototype.toString.call(source);
        }
    };

    /** =============
     * 判断浏览器类型和特性的属性
     */
    core.browser = core.browser || (function (ua) {
        var browser =   {
            android : /(Android)\s+([\d.]+)/i.test(ua),
            ipad : /(iPad).*OS\s([\d_]+)/i.test(ua),
            webos : /(webOS|hpwOS)[\s\/]([\d.]+)/i.test(ua),
            kindle : /Kindle\/([\d.]+)/i.test(ua),
            silk : /Silk\/([\d._]+)/i.test(ua),
            blackberry : /(BlackBerry).*Version\/([\d.]+)/i.test(ua),
            bb10 : /(BB10).*Version\/([\d.]+)/i.test(ua),
            rimtabletos : /(RIM\sTablet\sOS)\s([\d.]+)/i.test(ua),
            playbook : /PlayBook/i.test(ua),
            chrome : /chrome\/(\d+\.\d+)/i.test(ua) ? + RegExp['\x241'] : undefined,
            firefox : /firefox\/(\d+\.\d+)/i.test(ua) ? + RegExp['\x241'] : undefined,
            ie : /msie (\d+\.\d+)/i.test(ua) ? (document.documentMode || + RegExp['\x241']) : undefined,
            isGecko : /gecko/i.test(ua) && !/like gecko/i.test(ua),
            isStrict : document.compatMode == "CSS1Compat",
            isWebkit : /webkit/i.test(ua),
            opera : /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(ua) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined
        };

        browser.iphone = !browser.ipad && /(iPhone\sOS)\s([\d_]+)/i.test(ua);
        browser.touchpad = browser.webos && /TouchPad/.test(ua);

        browser.tablet = !!(browser.ipad || browser.playbook || (browser.android && !/Mobile/.test(ua)) || (browser.firefox && /Tablet/.test(ua)));
        browser.phone  = !!(!browser.tablet && (browser.android || browser.iphone || browser.webos || browser.blackberry || browser.bb10 || (browser.chrome && /Android/.test(ua)) || (browser.chrome && /CriOS\/([\d.]+)/.test(ua)) || (browser.firefox && /Mobile/.test(ua))));

        try {
            if (/(\d+\.\d+)/.test(external.max_version)) {
                browser.maxthon = + RegExp['\x241'];
            }
        } catch (e) {}
        browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp['\x241'] || RegExp['\x242']) : undefined;
        browser.isSupportFixed = !browser.ie || browser.ie >=7;

        return browser;
    })(navigator.userAgent);



    /** =======================
     * 数组相关处理
     * core.array.remove
     * core.array.each
     */
    core.array = core.array = {
        remove : function (source, match) {
            var len = source.length;
                
            while (len--) {
                if (len in source && source[len] === match) {
                    source.splice(len, 1);
                }
            }
            return source;
        },
        each : function (source, iterator, thisObject) {
            var returnValue, 
                item, 
                i, 
                len = source.length;
            
            if ('function' == typeof iterator) {
                for (i = 0; i < len; i++) {
                    item = source[i];
                    //TODO
                    //此处实现和标准不符合，标准中是这样说的：
                    //If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
                    returnValue = iterator.call(thisObject || source, item, i);
            
                    if (returnValue === false) {
                        break;
                    }
                }
            }
            return source;
        }
    };


    /** ==================
     * 字符串相关处理
     * core.string.encodeHTML
     * core.string.decodeHTML
     * core.string.formalString
     */
    core.string = core.string || (function () {
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
            STR_REG =  /\uffff/.test("\uffff") ? (/[\\\"\x00-\x1f\x7f-\uffff]/g) : (/[\\\"\x00-\x1f\x7f-\xff]/g);
        return {
            //转义html
            encodeHTML : function (source) {
                return String(source)
                            .replace(/&/g,'&amp;')
                            .replace(/</g,'&lt;')
                            .replace(/>/g,'&gt;')
                            .replace(/"/g, "&quot;")
                            .replace(/'/g, "&#39;");
            },
            //反转义html
            decodeHTML : function (source) {
                var str = String(source)
                            .replace(/&quot;/g,'"')
                            .replace(/&lt;/g,'<')
                            .replace(/&gt;/g,'>')
                            .replace(/&amp;/g, "&");
                //处理转义的中文和实体字符
                return str.replace(/&#([\d]+);/g, function(_0, _1){
                    return String.fromCharCode(parseInt(_1, 10));
                });
            },
            /**
             * 转义字符串中的特殊字符
             */
            formalString : function (str) {
                var ret = [];
                ret.push(str.replace(STR_REG, function(s) {
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
                return '"' + ret.join('') + '"';
            }
        };
    })();

    /** ================
     * object相关
     * core.object.map
     */
    core.object = core.object || {
        map : function (source, iterator) {
            var results = {};
            for (var key in source) {
                if (source.hasOwnProperty(key)) {
                    results[key] = iterator(source[key], key);
                }
            }
            return results;
        }
    };

    /** ====================
     * cookie相关
     * core.cookie.get
     * core.cookie.set
     * core.cookie.remove
     */
    core.cookie = core.cookie || {
        _isValidKey : function (key) {
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        },
        getRaw : function (key) {
            if (core.cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                     
                if (result) {
                    return result[2] || null;
                }
            }
            return null;
        },
        setRaw : function (key, value, options) {
            if (!core.cookie._isValidKey(key)) {
                return;
            }
             
            options = options || {};

            // 计算cookie过期时间
            var expires = options.expires;
            if ('number' == typeof options.expires) {
                expires = new Date();
                expires.setTime(expires.getTime() + options.expires);
            }
             
            document.cookie =
                key + "=" + value
                + (options.path ? "; path=" + options.path : "")
                + (expires ? "; expires=" + expires.toGMTString() : "")
                + (options.domain ? "; domain=" + options.domain : "")
                + (options.secure ? "; secure" : ''); 

        },
        get : function (key) {
            var value = core.cookie.getRaw(key);
            if ('string' == typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        },
        set : function (key, value, options) {
            core.cookie.setRaw(key, encodeURIComponent(value), options);
        },
        remove : function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            baidu.cookie.setRaw(key, '', options);
        }
    };


    /** ===================
     * 本地存储对象，如果是ie8-，使用userData, 否则使用localstorage, 否则使用cookie
     * core.storage.get
     * core.storage.set
     * core.storage.remove
     */
    core.storage = core.storage || (function () {
        var UserData = {
            userData : null,
            name : location.hostname,
            init : function () {
                if (!UserData.userData) {
                    try {
                        UserData.userData = document.createElement('INPUT');
                        UserData.userData.type = "hidden";
                        UserData.userData.style.display = "none";
                        UserData.userData.addBehavior ("#default#userData");
                        document.body.appendChild(UserData.userData);
                        var expires = new Date();
                        expires.setDate(expires.getDate() + 365);
                        UserData.userData.expires = expires.toUTCString();
                    } catch (e) {
                        return false;
                    }
                }
                return true;
            },
            setItem : function (key, value, expires) {
                if (UserData.init()) {
                    UserData.userData.load(UserData.name);
                    UserData.userData.setAttribute(key, value);
                    UserData.userData.save(UserData.name);
                }
            },
            getItem : function (key) {
                if (UserData.init()) {
                    UserData.userData.load(UserData.name);
                    return UserData.userData.getAttribute(key);
                }
            },
            removeItem : function (key) {
                if (UserData.init()) {
                    UserData.userData.load(UserData.name);
                    UserData.userData.removeAttribute(key);
                    UserData.userData.save(UserData.name);
                }

           }
        };

        var ls = {
            getItem : function (key) {
                return window.localStorage.getItem(key);
            },
            setItem : function (key, value, expires) {
                window.localStorage.setItem(key, value + (expires ? ';expires=' + (core.now() + expires) : ''));
            },
            removeItem : function (key) {
                window.localStorage.removeItem(key);
            }
        };
        var cookie = {
            getItem : function (key) {
                return core.cookie.get(key);
            },
            setItem : function (key, value, expires) {
                core.cookie.set(key, value, {expires : expires || 0});
            },
            removeItem : function (key) {
                core.cookie.remove(key);
            }
        };

        var storage = core.browser.ie && core.browser.id < 8 ? userData : window.localStorage ? ls : cookie;
        
        return {
            get : function (key) {
                var value = storage.getItem(key);
                if (value) {
                    value = value.split(';');
                    //有过期时间
                    if (value[1] && core.now() > parseInt(value[1].split('=')[1], 10)) {
                        storage.removeItem(key);
                        return null;
                    } else {
                        return value[0];
                    }
                }
                return null;
            },
            set : function (key, value, expires) {
                storage.setItem(key, value, expires);
            },
            remove : function (key) {
                storage.removeItem(key);
            }
        };
    })();



    /** ==================
     * url相关
     * core.url.getDomain
     * core.url.createURL
     * core.url.top
     */
    core.url = core.url || (function () {
        var DOMAIN_REG = /^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/;
        return {
            getDomain : function (url, def_domain) {
                if (!url) {
                    return def_domain;
                }
                var domain = url.match(DOMAIN_REG);
                return domain ? domain[0] : def_domain;
            },
            createURL : function (domain, path, useSSL) {
                return [useSSL ? "https" : "http", "://", domain, path].join("");
            },
            top : (function () {
                var top;
                try {
                    top = window.top.location.href;
                } catch (e) {}
                return top || document.referrer || window.location.href;
            })()
        };
    })();



    /** ================
     * DOM相关方法
     * core.dom.getDocument
     * core.dom.getComputedStyle
     * core.dom.getCurrentStyle
     */
    core.dom = core.dom || {
        getDocument : function (element) {
            return element.nodeType == 9 ? element : element.ownerDocument || element.document;
        },
        getComputedStyle : function(element, key){
            var doc = core.dom.getDocument(element),
                styles;
            if (doc.defaultView && doc.defaultView.getComputedStyle) {
                styles = doc.defaultView.getComputedStyle(element, null);
                if (styles) {
                    return styles[key] || styles.getPropertyValue(key);
                }
            }
            return ''; 
        },
        getCurrentStyle : function(element, key){
            return element.style[key] || (element.currentStyle ? element.currentStyle[key] : "") || core.dom.getComputedStyle(element, key);
        }
    };


    /** =====================
     * 页面相关
     * core.page.getScrollTop
     * core.page.getScrollLeft
     * core.page.getViewHeight
     * core.page.getViewWidth
     */
    core.page = core.page || {
        getScrollTop : function () {
            var d = document;
            return window.pageYOffset || d.documentElement.scrollTop || d.body.scrollTop;
        },
        getScrollLeft : function () {
            var d = document;
            return window.pageXOffset || d.documentElement.scrollLeft || d.body.scrollLeft;
        },
        getViewHeight : function () {
            var doc = document,
            client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
            return client.clientHeight;
        },
        getViewWidth : function () {
            var doc = document,
            client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
            return client.clientWidth;
        }
    };

    /** ===========
     * 事件相关
     * core.event.on
     */
    core.event = core.event || {
        on : function (dom, type, callback) {
            if (dom.attachEvent) {
                dom.attachEvent('on' + type, callback);
            } else {
                dom.addEventListener(type, callback, false);
            }
        }
    };

    /**
     * serveer io
     * core.sio.loadScript
     * core.sio.jsonp
     * core.sio.log
     */
    core.sio = core.sio || (function () {
        function _createScriptTag(scr, url, charset) {
            scr.setAttribute('type', 'text/javascript');
            charset && scr.setAttribute('charset', charset);
            scr.setAttribute('src', url);
            document.getElementsByTagName('head')[0].appendChild(scr);
        }
        function _removeScriptTag(scr) {
            if(scr && scr.parentNode){
                scr.parentNode.removeChild(scr);
            }
            scr = null;
        }
        return {
            //加载js模块
            loadScript : function (url, opt_callback, opt_options) {
                var scr = document.createElement("SCRIPT"),
                    scriptLoaded = 0,
                    options = opt_options || {},
                    charset = options['charset'],
                    callback = opt_callback || function(){},
                    timeOut = options['timeOut'] || 0,
                    timer;
                
                // IE和opera支持onreadystatechange
                // safari、chrome、opera支持onload
                scr.onload = scr.onreadystatechange = function () {
                    // 避免opera下的多次调用
                    if (scriptLoaded) {
                        return;
                    }
                    
                    var readyState = scr.readyState;
                    if ('undefined' == typeof readyState
                        || readyState == "loaded"
                        || readyState == "complete") {
                        scriptLoaded = 1;
                        try {
                            callback();
                            clearTimeout(timer);
                        } finally {
                            scr.onload = scr.onreadystatechange = null;
                            _removeScriptTag(scr);
                        }
                    }
                };

                if( timeOut ){
                    timer = setTimeout(function(){
                        scr.onload = scr.onreadystatechange = null;
                        _removeScriptTag(scr);
                        options.onfailure && options.onfailure();
                    }, timeOut);
                }
                
                _createScriptTag(scr, url, charset);
            },
            //jsonp方式回调
            jsonp : function(url, callback, opt_options) {
                var scr = document.createElement('SCRIPT'),
                    prefix = '_sinaads_cbs_',
                    callbackName,
                    callbackImpl,
                    options = opt_options || {},
                    charset = options['charset'],
                    queryField = options['queryField'] || 'callback',
                    timeOut = options['timeOut'] || 0,
                    timer,
                    reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
                    matches;
         
                if (core.isFunction(callback)) {
                    callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
                    window[callbackName] = getCallBack(0);
                } else if(core.isString(callback)){
                    // 如果callback是一个字符串的话，就需要保证url是唯一的，不要去改变它
                    // TODO 当调用了callback之后，无法删除动态创建的script标签
                    callbackName = callback;
                } else {
                    if (matches = reg.exec(url)) {
                        callbackName = matches[2];
                    }
                }
         
                if( timeOut ){
                    timer = setTimeout(getCallBack(1), timeOut);
                }
         
                //如果用户在URL中已有callback，用参数传入的callback替换之
                url = url.replace(reg, '\x241' + queryField + '=' + callbackName);
                 
                if (url.search(reg) < 0) {
                    url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
                }
                _createScriptTag(scr, url, charset);
         
                function getCallBack(onTimeOut){
                     
                    return function(){
                        try {
                            if( onTimeOut ){
                                options.onfailure && options.onfailure();
                            }else{
                                callback.apply(window, arguments);
                                clearTimeout(timer);
                            }
                            window[callbackName] = null;
                            delete window[callbackName];
                        } catch (exception) {
                            // ignore the exception
                        } finally {
                            _removeScriptTag(scr);
                        }
                    }
                }
            },

            log : function(url) {
                var img = new Image(),
                    key = '_sinaads_sio_log_' + Math.floor(Math.random() *
                          2147483648).toString(36);

                window[key] = img;
             
                img.onload = img.onerror = img.onabort = function() {
                  img.onload = img.onerror = img.onabort = null;
             
                  window[key] = null;
                  img = null;
                };
         
                img.src = url;
            }
        };
    })();

    /** ================
     * swf相关方法
     * core.swf.getMovie
     * core.swf.createHTML
     * 
     */
    core.swf = core.swf || {
        version : (function () {
            var n = navigator;
            if (n.plugins && n.mimeTypes.length) {
                var plugin = n.plugins["Shockwave Flash"];
                if (plugin && plugin.description) {
                    return plugin.description
                            .replace(/([a-zA-Z]|\s)+/, "")
                            .replace(/(\s)+r/, ".") + ".0";
                }
            } else if (window.ActiveXObject && !window.opera) {
                for (var i = 12; i >= 2; i--) {
                    try {
                        var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
                        if (c) {
                            var version = c.GetVariable("$version");
                            return version.replace(/WIN/g,'').replace(/,/g,'.');
                        }
                    } catch(e) {}
                }
            }
        })(),
        getMovie : function (name, context) {
            context = context || window;
            //ie9下, Object标签和embed标签嵌套的方式生成flash时,
            //会导致document[name]多返回一个Object元素,而起作用的只有embed标签
            var movie = context.document[name],
                ret;
            return core.browser.ie == 9 ?
                movie && movie.length ? 
                    (ret = core.array.remove(core.toArray(movie), function(item){
                        return item.tagName.toLowerCase() != "embed";
                    })).length == 1 ? ret[0] : ret
                    : movie
                : movie || context[name];
        },
        createHTML : function (options) {
            options = options || {};
            var version = core.swf.version, 
                needVersion = options['ver'] || '6.0.0', 
                vUnit1, vUnit2, i, k, len, item, tmpOpt = {},
                encodeHTML = core.string.encodeHTML;
            
            // 复制options，避免修改原对象
            for (k in options) {
                tmpOpt[k] = options[k];
            }
            options = tmpOpt;
            
            // 浏览器支持的flash插件版本判断
            if (version) {
                version = version.split('.');
                needVersion = needVersion.split('.');
                for (i = 0; i < 3; i++) {
                    vUnit1 = parseInt(version[i], 10);
                    vUnit2 = parseInt(needVersion[i], 10);
                    if (vUnit2 < vUnit1) {
                        break;
                    } else if (vUnit2 > vUnit1) {
                        return ''; // 需要更高的版本号
                    }
                }
            } else {
                return ''; // 未安装flash插件
            }
            
            var vars = options['vars'],
                objProperties = ['classid', 'codebase', 'id', 'width', 'height', 'align'];
            
            // 初始化object标签需要的classid、codebase属性值
            options['align'] = options['align'] || 'middle';
            options['classid'] = 'clsid:d27cdb6e-ae6d-11cf-96b8-444553540000';
            options['codebase'] = 'http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0';
            options['movie'] = options['url'] || '';
            delete options['vars'];
            delete options['url'];
            
            // 初始化flashvars参数的值
            if ('string' == typeof vars) {
                options['flashvars'] = vars;
            } else {
                var fvars = [];
                for (k in vars) {
                    item = vars[k];
                    fvars.push(k + "=" + encodeURIComponent(item));
                }
                options['flashvars'] = fvars.join('&');
            }
            
            // 构建IE下支持的object字符串，包括属性和参数列表
            var str = ['<object '];
            for (i = 0, len = objProperties.length; i < len; i++) {
                item = objProperties[i];
                str.push(' ', item, '="', encodeHTML(options[item]), '"');
            }
            str.push('>');
            var params = {
                'wmode'             : 1,
                'scale'             : 1,
                'quality'           : 1,
                'play'              : 1,
                'loop'              : 1,
                'menu'              : 1,
                'salign'            : 1,
                'bgcolor'           : 1,
                'base'              : 1,
                'allowscriptaccess' : 1,
                'allownetworking'   : 1,
                'allowfullscreen'   : 1,
                'seamlesstabbing'   : 1,
                'devicefont'        : 1,
                'swliveconnect'     : 1,
                'flashvars'         : 1,
                'movie'             : 1
            };
            
            for (k in options) {
                item = options[k];
                k = k.toLowerCase();
                if (params[k] && (item || item === false || item === 0)) {
                    str.push('<param name="' + k + '" value="' + encodeHTML(item) + '" />');
                }
            }
            
            // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
            options['src']  = options['movie'];
            options['name'] = options['id'];
            delete options['id'];
            delete options['movie'];
            delete options['classid'];
            delete options['codebase'];
            options['type'] = 'application/x-shockwave-flash';
            options['pluginspage'] = 'http://www.macromedia.com/go/getflashplayer';
            
            
            // 构建embed标签的字符串
            str.push('<embed');
            // 在firefox、opera、safari下，salign属性必须在scale属性之后，否则会失效
            // 经过讨论，决定采用BT方法，把scale属性的值先保存下来，最后输出
            var salign;
            for (k in options) {
                item = options[k];
                if (item || item === false || item === 0) {
                    if ((new RegExp("^salign\x24", "i")).test(k)) {
                        salign = item;
                        continue;
                    }
                    
                    str.push(' ', k, '="', encodeHTML(item), '"');
                }
            }
            
            if (salign) {
                str.push(' salign="', encodeHTML(salign), '"');
            }
            str.push('></embed></object>');
            
            return str.join('');
        }
    };


    /**
     * iframe相关方法
     * core.iframe.init
     * core.iframe.createHTML
     * core.iframe.fill
     */
    core.iframe = core.iframe || {
        init : function (config, width, height, useQuote) {
            var quote = useQuote ? '"' : ""; //是否使用引号将属性包裹
            var zero = quote + "0" + quote;
            config.width = quote + width + quote;
            config.height = quote + height + quote;
            config.frameborder = zero;
            config.marginwidth = zero;
            config.marginheight = zero;
            config.vspace = zero;
            config.hspace = zero;
            config.allowtransparency = quote + "true" + quote;
            config.scrolling = quote + "no" + quote;
        },
        createHTML : function (config) {
            var html = [];
            core.object.map(config, function(value, key) {
                html.push(" " + key + '="' + (null == value ? "" : value) + '"')
            });
            return "<iframe" + html.join("") + "></iframe>";
        },
        fill : function (iframe, content) {
            try {
                var doc = iframe.contentWindow.document;
                doc.open();
                doc.write(content);
                iframe.onload = function () {
                    try {
                        this.contentWindow.document.close();
                    } catch (e) {}
                };
                //doc.close(); //这里不close，防止后面的document.write无法生效， 在iframe onload的时候关闭
            } catch (e) {}
        }
    };


    /** ==================
     * 监测相关
     * core.monitor.parseTpl
     * core.monitor.createImpressMonitor
     * core.monitor.createClickMonitor
     */
    core.monitor  = core.monitor || {

        //将监控url中的__xxx__变量名替换成正确的值
        parseTpl : (function (monitorUrl, data) {
            var reg = /\{__([a-zA-Z0-9]+(_*[a-zA-Z0-9])*)__\}/g;

            return function (monitorUrl, data) {
                if (!monitorUrl) return '';
                return monitorUrl.replace(reg, function (s1, s2) {
                    //插入adbox能支持的模版变量
                    //见adbox监控接口文档，
                    //https://github.com/acelan86/pandora/wiki/%E6%B8%B2%E6%9F%93%E5%BC%95%E6%93%8E%E6%96%87%E6%A1%A3%E8%AF%B4%E6%98%8E
                    //adbox的监控需要插入到iframe的name中，使用api_exu=xxx的方式
                    if (s2.indexOf('adbox_') > 0) {
                        s2 = s2.split('_');
                        return '{__mo' + s2[2] + '__}';
                    }
                    return data[s2] || s1;
                });
            };
        })(),
        //创建曝光监测
        createImpressMonitor : function (pvs) {
            var html = [];

            core.array.each(pvs, function (pv, i) {
                var config = {};
                core.iframe.init(config, 1, 1, false);
                config.src = pv;
                config.style = 'display:none;';
                html.push(core.iframe.createHTML(config));
            });
            return html.join('');
        },
        //创建点击监测
        createClickMonitor : function (type, monitor) {
            if (!monitor) {
                return;
            }
            var monitor = 'string' === typeof monitor ? [monitor] : monitor,
                ret = [],
                comma = '';

            core.array.each(monitor, function(url, i) {
                var code = '';

                if (url) {
                    switch (type) {
                        case 'image' :
                        case 'flash' :
                            code = 'sinaadToolkit.sio.log(\'' + url + '\')';
                            comma = ';'
                            break;
                        case 'adbox' :
                            code = 'api_exu=' + encodeURIComponent(url);
                            comma = '&';
                            break;
                        default :
                            break;
                    }
                    code && ret.push(code);
                } 
            });
            return ret.join(comma);
        }
    };



    /** ==============
     * 广告渲染相关
     * core.ad.createHTML
     */
    core.ad = core.ad || {
        createHTML : function (type, src, width, height, link, monitor) {
            var html = '',
                config,
                monitorCode;

            width += String(width).indexOf('%') !== -1 ? '' : 'px';
            height += String(height).indexOf('%') !== -1 ? '' : 'px';

            monitorCode = core.monitor.createClickMonitor(type, monitor);
            switch (type) {
                case 'js' :
                    html = ['<', 'script src="', src, '"></','script>'].join('');
                    break;
                case 'url' : 
                    config = {};
                    core.iframe.init(config, width, height, false);
                    config.src = src;
                    html = core.iframe.createHTML(config);
                    break;
                case 'image' : 
                    html = '<img border="0" src="' + src + '" style="width:' + width + ';height:' + height +';border:0" alt="' + src + '"/>';
                    html = link ? '<a href="' + link + '" target="' + (core.browser.phone ? '_top' : '_blank') + '"' + (monitorCode ? ' onclick="try{' + monitorCode + '}catch(e){}"' : '') + '>' + html + '</a>' : html;
                    break;
                case 'text' : 
                    html = '<span>' + src + '</span>';
                    break;
                case 'flash' : 
                    html = core.swf.createHTML({
                        url : src,
                        width : width,
                        height : height,
                        wmode : 'transparent'
                    });
                    if (link) {
                        html = [
                            '<div style="width:' + width + ';height:' + height + ';position:relative;overflow:hidden;">',
                                html,
                                '<a style="position:absolute;background:#fff;opacity:0;_filter:alpha(opacity=0);width:' + width + ';height:' + height + ';left:0;top:0" href="' + link + '" target="' + (core.browser.phone ? '_top' : '_blank') + '"' + (monitorCode ? ' onclick="try{' + monitorCode + '}catch(e){}"' : '') + '></a>',
                            '</div>'
                        ].join('');
                    }
                    break;
                case 'adbox' :
                    config = {};
                    core.iframe.init(config, width, height, false);
                    config.src = src;
                    monitorCode && (config.name = monitorCode);
                    html = core.iframe.createHTML(config);
                    break;
                default : 
                    html = src;
                    break;
            }
            return html;
        }
    };


    /** =================
     * 广告沙箱
     * core.sandbox.create
     */
    core.sandbox = core.sandbox || (function () {
        var uid = 0;
        /**
         * 将对象转换成字符串形式表示
         */
        function _stringify(value, arr) {
            switch (typeof value) {
                case "string":
                    arr.push(core.string.formalString(value));
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
                                arr.push(key); 
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
                    //throw Error("未知的值类型: " + typeof value);
            }
        }
 

        /**
         * 将config的属性值转换成变量声明代码
         */
        function _objToJsVarCode(obj) {
            var code = [];

            core.object.map(obj, function(value, key) {
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

        return {
            create : function (container, width, height, content, context) {
                var context = context || {},
                    sandboxId =  context.sandboxId || (context.sandboxId = '_sinaads_sandbox_id' + (uid++));

                width += String(width).indexOf('%') !== -1 ? '' : 'px';
                height += String(height).indexOf('%') !== -1 ? '' : 'px';

                var iframeConfig = {};
                core.iframe.init(iframeConfig, width, height, 0);
                iframeConfig.src = 'javascript:\'<html><body style=background:transparent;></body></html>\'';
                iframeConfig.id = sandboxId;
                iframeConfig.style = 'float:left;';

                container.innerHTML = [
                    '<ins style="margin:0px auto;display:block;overflow:hidden;width:' + width + ';height:' + height + ';">',
                        core.iframe.createHTML(iframeConfig),
                    '</ind>'
                ].join('');

                container.style.cssText += ';overflow:hidden;display:block;';

                //context转成js代码描述，用于注入到iframe中
                context = _objToJsVarCode(context);

                //构造iframe实体
                core.iframe.fill(document.getElementById(sandboxId), [
                    '<!doctype html><html><body style="background:transparent">',
                        '<', 'script>', context, '</', 'script>',
                        '<', 'script src="' + core.TOOLKIT_URL + '" charset="utf-8"></', 'script>',
                        content,
                    '</body></html>'
                ].join(""));
            }
        };
    })();

    /**
     * core.seed 种子，每次加载获取cookie或者storage中的这个值，如果没有，随机生成1个值
     */
    if (!core.seed) {
        var KEY = 'rotatecount';
        core.seed = parseInt(core.storage.get(KEY), 10) || Math.floor(Math.random() * 100);
        //大于1000就从0开始，防止整数过大
        core.storage.set(KEY, core.seed > 1000 ? 0 : ++core.seed);
    }

})(window);

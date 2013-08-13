/*!
 * sinaadToolkit
 * 新浪广告工具包，提供了浏览器判断，渲染，cookie, storage, iframe, 转义等基础操作
 * @author  acelan(xiaobin8[at]staff.sina.com.cn)
 * @version  1.0.0
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
         * 随机数生成，生成一个随机数的36进制表示方法
         */
        rnd : function () {
            return Math.floor(Math.random() * 2147483648).toString(36);
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
        var STR_REG =  /\uffff/.test("\uffff") ? (/[\\\"\x00-\x1f\x7f-\uffff]/g) : (/[\\\"\x00-\x1f\x7f-\xff]/g);
        
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
     * core.url.getDomain //
     * core.url.createURL
     * core.url.top
     */
    core.url = core.url || (function () {
        //var DOMAIN_REG = /^([\w-]+\.)*([\w-]{2,})(\:[0-9]+)?$/;
        return {
            // getDomain : function (url, def_domain) {
            //     if (!url) {
            //         return def_domain;
            //     }
            //     var domain = url.match(DOMAIN_REG);
            //     return domain ? domain[0] : def_domain;
            // },
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
                            code = 'sinaadToolkit.sio.log(\'' + url + '\')';
                            comma = ';'
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

            //将iframe的name设置成跟id一样，如果没有的配置name的话
            config.name = config.name || config.id;

            core.object.map(config, function(value, key) {
                html.push(" " + key + '="' + (null == value ? "" : value) + '"')
            });
            return "<iframe" + html.join("") + "></iframe>";
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

            monitorCode = core.monitor.createClickMonitor(type, monitor);
            switch (type) {
                case 'image' : 
                    html = '<img border="0" src="' + src + '" style="width:100%;border:0" alt="' + src + '"/>';
                    html = link ? '<a href="' + link + '" target="' + (core.browser.phone ? '_top' : '_blank') + '"' + (monitorCode ? ' onclick="try{' + monitorCode + '}catch(e){}"' : '') + '>' + html + '</a>' : html;
                    break;
                case 'text' : 
                    html = '<span>' + src + '</span>';
                    break;
                default : break;
            }
            return html;
        }
    };

    /**
     * core.seed 种子，每次加载获取cookie或者storage中的这个值，如果没有，随机生成1个值
     */
    if (!core.seed) {
        var KEY = 'sinaadtoolkit_seed';
        core.seed = parseInt(core.storage.get(KEY), 10) || Math.floor(Math.random() * 100);
        //大于1000就从0开始，防止整数过大
        core.storage.set(KEY, core.seed > 1000 ? 0 : ++core.seed);
    }

})(window);











/**
 * sinaads
 * 新浪统一商业广告脚本, 负责使用pdps(新浪广告资源管理码)向广告引擎请求数据并处理广告渲染
 * @param  {[type]} window    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function (window, undefined) {
    var IMPRESS_URL = 'http://sax.sina.com.cn/impress.php';

    var core = window.sinaadToolkit,
        now = core.now(); //加载sinaads的时间

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

    function _renderWidthEmbedIframe(element, config) {
        element.innerHTML = [
            '<ins style="margin:0px auto;display:block;">',
                config.pv,
                core.ad.createHTML(config.type, config.src, config.width, config.height, config.link, config.monitor),
            '</ind>'
        ].join('');
        element.style.cssText += ';display:block;overflow:hidden;';
    }
    /**
     * 初始化广告对象
     * @param  {object} adConf [description]
     * @return {[type]}       [description]
     */
    function _init(config) {
        var element = config.element; //广告容器

        config = config.params || {};   //广告配置

        //从confi.element中得到需要渲染的ins元素
        if (element) {
            if (!_isPenddingSinaad(element) && (element = element.id && _getSinaAd(element.id), !element)) {
                //throw Error("sinaads: 该元素已经被渲染完成，无需渲染");
            }
            if (!("innerHTML" in element)) {
                //throw Error("sinaads: 无法渲染该元素");
            }
        //没有对应的ins元素, 获取一个待初始化的ins, 如果没有，抛出异常
        } else if (element = _getSinaAd(), !element) {
            //throw Error("sinaads: 所有待渲染的元素都已经被渲染完成");
        }

        //置成完成状态，下面开始渲染
        element.setAttribute("data-ad-status", "done"); 


        //全局唯一id标识，用于后面为容器命名
        config.sinaads_uid = (window.sinaads_uid ? ++window.sinaads_uid : window.sinaads_uid = 1);

        //将data-xxx-xxxx,转换成sinaads_xxx_xxxx，并把值写入config
        //这里因为上面设置了data-ad-status属性, 所以sinaads-ad-status的状态也会被写入conf
        for (var attrs = element.attributes, len = attrs.length, i = 0; i < len; i++) {
            var attr = attrs[i];
            if (/data-/.test(attr.nodeName)) {
                var key = attr.nodeName.replace("data", "sinaads").replace(/-/g, "_");
                config.hasOwnProperty(key) || (config[key] = attr.nodeValue);
            }
        }

        //获取page_url 广告所在页面url
        var page_url = config.sinaads_page_url = config.sinaads_page_url || ((window.top === window.self) ?  window.document.URL : window.document.referrer);

        
        //获取定向关键词
        var metas = document.getElementsByTagName('head')[0].getElementsByTagName('meta'),
            targeting = {
                keywords : '', //关键字定向
                template : '', //模版定向
                entry : ''     //入口定向
            };
        core.array.each(metas, function (meta, i) {
            var entry = '',
                meta = metas[i];
            if (meta.name.toLowerCase() === 'keywords') {
                targeting.keywords += ',' + meta.content;
            } else if (meta.name.toLowerCase() === 'templateTargeting') {
                targeting.template += ',' + meta.conrent;
            }
            if (entry = core.cookie.get('sinaads_entry_targeting')) {
                targeting.entry = entry;
            }
        });


        var params = [
            'adunitid=' + config.sinaads_ad_pdps,
            'rotate_count=' + core.seed,
            'TIMESTAMP=' + core.now().toString(36),
            'referral=' + encodeURIComponent(page_url),
            'tgkw=' + (targeting.keywords ? encodeURIComponent(targeting.keywords) : ''),
            'tgtpl=' + (targeting.template ? encodeURIComponent(targeting.template) : ''),
            'tgentry=' + (targeting.entry ? encodeURIComponent(targeting.entry) : '')
        ];
        
        core.sio.loadScript(IMPRESS_URL + '?' + params.join('&'), function (data) {

            //测试移动端数据
            // window._ssp_ad.data["PDPS000000045274"] = {
            //     size : "320*35",
            //     type : 'embed',
            //     content : {
            //         pv : ["http://baidu.com/?mobi", "http://baidu.com/?mobi"],
            //         type : 'image',
            //         src : ["http://d1.sina.com.cn/litong/zhitou/test/images/dbc92931.png"],
            //         monitor : ["http://mobi.com"],
            //         link : ['http://mobi.com']
            //     }
            // };


            data = window._ssp_ad.data[config.sinaads_ad_pdps]; //兼容方法
            
            if (!data || data === 'nodata') {
                //console.log(config.sinaads_ad_pdps + ': 该广告位没有获取到可用的数据');
                return;
            }

            var size = data.size.split('*'),
                width = config.sinaads_ad_width || (config.sinaads_ad_width = Number(size[0])),
                height = config.sinaads_ad_height || (config.sinaads_ad_height = Number(size[1])),
                oWidth = width,
                oHeight = height;

            data.content.src = data.content.src instanceof Array ? data.content.src : data.content.src ? [data.content.src] : [];
            data.content.link = data.content.link instanceof Array ? data.content.link : data.content.link ? [data.content.link] : [];
            data.content.type = data.content.type instanceof Array ? data.content.type : data.content.type ? [data.content.type] : [];
            
            var monitor = data.content.monitor = data.content.monitor instanceof Array ? data.content.monitor : data.content.monitor ? [dta.content.monitor] : [];
            var pv = data.content.pv = data.content.pv instanceof Array ? data.content.pv : data.content.pv ? [dta.content.pv] : [];
            var mapping = data.mapUrl instanceof Array ? data.mapUrl : data.mapUrl ? [data.mapUrl] : [];

            //test
            // pv = [
            //    'http://click.sina.com.cn?a={__sinaads_ad_width__}&b={__sinaads_ad_pdps__}',
            //    'http://click.sina.com.cn?ad_x={__sinaads_adbox_el__}&pdps={__sinaads_ad_pdps__}'
            // ];

            // monitor = [
            //    'http://click.sina.com.cn?a={__sinaads_ad_width__}&b={__sinaads_ad_pdps__}',
            //    'http://click.sina.com.cn?ad_x={__sinaads_adbox_el__}&pdps={__sinaads_ad_pdps__}'
            // ];

            /** 解析监控链接，并注入模版值 **/
            core.array.each(pv, function (url, i) {
                pv[i] = core.monitor.parseTpl(url, config);
            });
            core.array.each(monitor, function (url, i) {
                monitor[i] = core.monitor.parseTpl(url, config);
            });

            _renderWidthEmbedIframe(element, {
                uid : config.sinaads_uid,
                pdps : config.sinaads_ad_pdps,
                pageurl : config.sinaads_page_url,
                width : width,
                height : height,

                type : data.content.type[0] || 'html',
                src : data.content.src[0] || '',
                link : data.content.link[0] || '',
                monitor : monitor,

                pv : core.monitor.createImpressMonitor(pv) || ''
            });

            /**
             * cookie mapping
             * @type {Number}
             */
            for (var i = 0, len = mapping.length; i < len; i++) {
                mapping[i] && core.sio.log(mapping[i]);
            }
        });
    }

    /* 在脚本加载之前注入的广告数据存入再sinaads数组中，遍历数组进行初始化 */
    var perloadAds = window.sinaads;
    if (perloadAds && perloadAds.shift) {
        for (var ad, len = 20; (ad = perloadAds.shift()) && 0 < len--;) {
            _init(ad);
        }
    }
    //在脚本加载之后，sinaad重新定义，并赋予push方法为初始化方法
    window.sinaads = {push : _init};
})(window);

/**
 * 兼容旧版本的数据适配器
 * @type {Object}
 */
window._ssp_ad = {
    data : {},
    adapter : function (data) {
        var networkMap = {
            '1' : 'http://d3.sina.com.cn/litong/zhitou/union/tanx.html?pid=',
            '2' : 'http://d3.sina.com.cn/litong/zhitou/union/google.html?pid='
        };

        var ret = {},
            ad = data.ad[0],
            content = ad.value[0].content,
            type = content.type || [],
            src = content.src || [],
            size = ad.size.split('*'),
            link = content.link || [];

        if (ad.engineType === 'network') {
            src = [networkMap['' + ad.value[0].manageType] + content + '&w=' + size[0] + '&h=' + size[1]];
            type = ['url'];
        }
        if (ad.engineType === 'dsp' && parseInt(ad.value[0].manageType, 10) !== 17) {
            src = [content];
            type = ['html'];
        }

        for (var i = 0, len = src.length; i < len; i++) {
            var _type;
            if (!type[i]) {
                _type = src[i].substring(src[i].length - 3);
                switch (_type) {
                    case 'tml' :
                        type[i] = 'url';
                        break;
                    case 'png':
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                        type[i] = 'image';
                        break;
                    default: break;
                }
            }
        }
        // 通栏  950*90 tl
        // 画中画 300*250 hzh
        // 矩形 250*230 jx
        // 短通栏 640*90 dtl
        // 大按钮 300*120 dan
        // 小按钮 240*120 xan
        // 跨栏 1000*90 kl
        // 背投  750*450 bt
        // 文字链 wzl
        ret.type = (function (type) {
            switch (type) {
                case 'bt' :
                    return 'bp';
                case 'kl' :
                    return 'couplet';
                default : 
                    return 'embed';
            }
        })(ad.type);

        ret.size = ad.size;
        ret.mapUrl = data.mapUrl;
        ret.content = {
            src : src instanceof Array ? src : [src],
            link : link instanceof Array ? link : [link],
            pv : content.pv || [],
            type : type,
            monitor : content.monitor || []
        };
        return ret;
    },
    callback : function (data) {
        if (data === 'nodata' || (data.ad && data.ad[0] && (!data.ad[0].value || data.ad[0].value && data.ad[0].value.length <= 0))) {
            return;
        }
        window._ssp_ad.data[data.ad[0].id] = window._ssp_ad.adapter(data);
    }
};

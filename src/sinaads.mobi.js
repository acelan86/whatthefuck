/**
 * sinaadToolkit
 * 新浪广告工具包，提供了浏览器判断，渲染，cookie, storage, iframe, 转义等基础操作
 * @param  {[type]} window    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function (window, undefined) {
    var core = window.sinaadToolkit = window.sinaadToolkit || {
        now : function () {
            return new Date().getTime().toString(36);
        },
        isFunction : function (source) {
            return '[object Function]' == Object.prototype.toString.call(source);
        },
        isString : function (source) {
           return '[object String]' == Object.prototype.toString.call(source);
        }
    };

    /**
     * 判断浏览器类型和特性的属性
     */
    core.browser = core.browser || {
        chrome : /chrome\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined,
        firefox : /firefox\/(\d+\.\d+)/i.test(navigator.userAgent) ? + RegExp['\x241'] : undefined,
        ie : /msie (\d+\.\d+)/i.test(navigator.userAgent) ? (document.documentMode || + RegExp['\x241']) : undefined,
        isGecko : /gecko/i.test(navigator.userAgent) && !/like gecko/i.test(navigator.userAgent),
        isStrict : document.compatMode == "CSS1Compat",
        isWebkit : /webkit/i.test(navigator.userAgent),
        opera : /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(navigator.userAgent) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined
    };

    try {
        if (/(\d+\.\d+)/.test(external.max_version)) {
            core.browser.maxthon = + RegExp['\x241'];
        }
    } catch (e) {}

    (function(){
        var ua = navigator.userAgent;
        core.browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp['\x241'] || RegExp['\x242']) : undefined;
    })();

    core.browser.isSupportFixed = !core.browser.ie || core.browser.ie >=7;


    /**
     * 数组相关处理
     * @type {Object}
     */
    // var array = core.array = {
    //     remove : function (source, match) {
    //         var len = source.length;
                
    //         while (len--) {
    //             if (len in source && source[len] === match) {
    //                 source.splice(len, 1);
    //             }
    //         }
    //         return source;
    //     },
    //     each : function (source, iterator, thisObject) {
    //         var returnValue, item, i, len = source.length;
            
    //         if ('function' == typeof iterator) {
    //             for (i = 0; i < len; i++) {
    //                 item = source[i];
    //                 //TODO
    //                 //此处实现和标准不符合，标准中是这样说的：
    //                 //If a thisObject parameter is provided to forEach, it will be used as the this for each invocation of the callback. If it is not provided, or is null, the global object associated with callback is used instead.
    //                 returnValue = iterator.call(thisObject || source, item, i);
            
    //                 if (returnValue === false) {
    //                     break;
    //                 }
    //             }
    //         }
    //         return source;
    //     }
    // };


    /**
     * 字符串相关处理
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

    /**
     * object相关
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

    /**
     * cookie相关
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


    /**
     * 本地存储对象，如果是ie8-，使用userData, 否则使用localstorage, 否则使用cookie
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
                window.localStorage.setItem(key, value + (expires ? ';expires=' + (new Date().getTime() + expires) : ''));
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
                    if (value[1] && new Date().getTime() > parseInt(value[1].split('=')[1], 10)) {
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



    /**
     * url相关
     * @type {[type]}
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
            }
        };
    })();

    /**
     * server io
     * @type {Object}
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


    core.ad = core.ad || {
        //创建监测链接
        createMonitor : function (type, monitor) {
            if (!monitor) {
                return;
            }
            var monitor = 'string' === typeof monitor ? [monitor] : monitor,
                url,
                ret = [],
                code = '',
                comma = '';
            for (var i = 0, len = monitor.length; i < len; i++) {
                url = monitor[i];
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
            }
            return ret.join(comma);
        },
        createHTML : function (type, src, width, height, link, monitor) {
            var html = '',
                config,
                monitorCode;

            //适配adbox链接
            if (type === 'url' && src.indexOf('adbox.sina.com.cn/ad/') > 0) {
                type = 'adbox';
            }

            monitorCode = core.ad.createMonitor(type, monitor);
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
                    html = '<img src="' + src + '" style="width:' + width + 'px;height:' + height + 'px" alt="' + src + '"/>';
                    html = link ? '<a href="' + link + '" target="_blank"' + (monitorCode ? ' onclick="alert(\'click\');try{' + monitorCode + '}catch(e){alert(e);}"' : '') + '>' + html + '</a>' : html;
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
                            '<div style="width:' + width + 'px;height:' + height + 'px;position:relative;overflow:hidden;">',
                                html,
                                '<a style="position:absolute;background:#fff;opacity:0;_filter:alpha(opacity=0);width:' + width + 'px;height:' + height + 'px;left:0;top:0" href="' + link + '" target="_blank"' + (monitorCode ? ' onclick="alert(\'click\');try{' + monitorCode + '}catch(e){alert(e)}"' : '') + '></a>',
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

    /* core.seed 种子，每次加载获取cookie或者storage中的这个值，如果没有，随机生成1个值 */
    if (!core.seed) {
        var KEY = 'rotatecount';
        core.seed = core.storage.get(KEY) || Math.floor(Math.random() * 100);
        core.storage.set(KEY, ++core.seed);
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
    var IMPRESS_URL = 'http://123.126.53.109/impress.php',
    	SINAAD_TOOLKIT_URL = 'http://d1.sina.com.cn/litong/zhitou/sinaads/src/core.js';

    var now = new Date().getTime(), //加载sinaads的时间
        core = window.sinaadToolkit;

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
    function _configToJsVarCode(config) {
        var code = [];

        core.object.map(config, function(value, key) {
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

    function _renderWidthEmbedIframe(element, config) {
        //embed Iframe
        var iframeId = 'sinaads_iframe_' + config.sinaads_uid,
            iframeConfig = {};
        core.iframe.init(iframeConfig, config.sinaads_ad_width, config.sinaads_ad_height, false);
        iframeConfig.id = iframeId;
        iframeConfig.src = 'javascript:\'<html><body style=background:transparent;></body></html>\'';
        iframeConfig.style = "float:left;";
        element.innerHTML = core.iframe.createHTML(iframeConfig);
        element.style.overflow = 'hidden';
        element.style.display = 'block';


        //pv iframe
        var pvIframeHTML = (function (pvs) {
            var html = [],
                config;

            for (var i = 0, len = pvs.length; i < len; i++) {
                config = {};
                core.iframe.init(config, 1, 1, false);
                config.src = pvs[i];
                config.style = 'display:none;';
                html.push(core.iframe.createHTML(config));
            }
            return html.join('');
        })(config.sinaads_ad_pv);

        //传递到内嵌iframe中的变量
        var varDecalareCode = _configToJsVarCode({
            sinaads_uid : config.sinaads_uid,
            sinaads_async_iframe_id : iframeId,
            sinaads_start_time : now,
            sinaads_span_time : new Date().getTime() - now,
            sinaads_ad_pdps : config.sinaads_ad_pdps,
            sinaads_ad_width : config.sinaads_ad_width,
            sinaads_ad_height : config.sinaads_ad_height,
            sinaads_page_url : config.sinaads_page_url
        });


        //广告内容
        var fragment = core.ad.createHTML(
            config.sinaads_ad_content_type[0],
            config.sinaads_ad_content[0],
            config.sinaads_ad_width,
            config.sinaads_ad_height,
            config.sinaads_ad_link[0],
            config.sinaads_ad_monitor
        );

        //构造iframe实体
        core.iframe.fill(document.getElementById(iframeId), [
            '<!doctype html><html><body style="background:transparent">',
                pvIframeHTML, //这里应该是曝光记录 
                '<', 'script>', varDecalareCode, '</', 'script>',
                '<', 'script src="' + SINAAD_TOOLKIT_URL + '" charset="utf-8"></', 'script>',
                fragment,
            '</body></html>'
        ].join(""));
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

        //判断是否是广告位支持的格式
        //@todo 控制某个广告位只支持加载某种类型广告


        //获取page_url 广告所在页面url
        var page_url = config.sinaads_page_url = config.sinaads_page_url || ((window.top === window) ?  window.document.URL : window.document.referrer);

        core.sio.loadScript(IMPRESS_URL + '?adunitid=' + config.sinaads_ad_pdps + '&rotate_count=' + core.seed +'&TIMESTAMP=' + core.now() +'&referral=' + encodeURIComponent(page_url), function (data) {

            data = window._ssp_ad.data[config.sinaads_ad_pdps]; //兼容方法
            
            if (!data || data === 'nodata') {
                //console.log(config.sinaads_ad_pdps + ': 该广告位没有获取到可用的数据');
                return;
            }

            var size = data.size.split('*'),
                mapping = data.mapUrl;
            config.sinaads_ad_width = config.sinaads_ad_width || Number(size[0]);
            config.sinaads_ad_height = config.sinaads_ad_height || Number(size[1]);
            config.sinaads_ad_type = data.type;
            config.sinaads_ad_content = data.content.src || [];
            config.sinaads_ad_content_type = data.content.type || [];
            config.sinaads_ad_pv = data.content.pv || [];
            config.sinaads_ad_monitor = data.content.monitor || [];
            config.sinaads_ad_link = data.content.link || [];

            switch (config.sinaads_ad_type) {
                case 'couple' : 
                    // if (!window.sinaads_couple) {
                    //     core.sio.loadScript('./src/plus/couple.js', function () {
                    //         sinaads.couple({
                    //             src: config.sinaads_ad_content,
                    //             //[主,左,右]
                    //             link: config.sinaads_ad_link,
                    //             //[主,左,右]
                    //             top: config.sinaads_couple_top || 10,
                    //             //距离顶部高度
                    //             mainW: config.sinaads_ad_width,
                    //             mainH: config.sinaads_ad_height,
                    //             sideW: 120,
                    //             sideH: 270,
                    //             showCoupletMonitor: ""
                    //         });
                    //     });
                    // } else {
                    //     sinaads_couple(config);
                    // }
                    break;
                case 'videoWindow' : 
                    // if (!window.sinaads_videoWindow) {
                    //     core.sio.loadScript('./plus/videoWindow.js', function () {
                    //         sinaads_videoWindow(config);
                    //     });
                    // } else {
                    //     sinaads_videoWindow(config);
                    // }
                    break;
                case 'stream' : 
                    // if (!window.sinaads_stream) {
                    //     core.sio.loadScript('./plus/stream.js', function () {
                    //         sinaads_stream(config);
                    //     });
                    // } else {
                    //     sinaads_stream(config);
                    // }
                    break;
                case 'fullscreen' : 
                    // if (!window.sinaads_fullscreen) {
                    //     core.sio.loadScript('./plus/fullscreen', function () {
                    //         sinaads_fullscreen(config);
                    //     });
                    // } else {
                    //     sinaads_fullscreen(config);
                    // }
                    break;
                default : 
                    _renderWidthEmbedIframe(element, config);
                    break;
            }

            //cookie mapping
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

        if (type.length <= 0) {
            for (var i = 0, len = src.length; i < len; i++) {
                var _type = src[i].substring(src[i].length - 3);
                switch (_type) {
                    case 'swf' :
                        type.push('flash');
                        break;
                    case 'tml' :
                        type.push('url');
                        break;
                    case '.js' :
                        type.push('js');
                        break;
                    case 'png':
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                        type.push('image');
                        break;
                    default:
                        type.push('html');
                        break;
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
                    return 'couple';
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

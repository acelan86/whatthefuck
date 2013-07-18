(function (window, undefined) {

    var sinaads = window.sinaads = window.sinaads || {};

    sinaads.core = sinaads.core || {};



    sinaads.core.isFunction = function (source) {
        return '[object Function]' == Object.prototype.toString.call(source);
    };

    sinaads.core.isString = function (source) {
       return '[object String]' == Object.prototype.toString.call(source);
    };

    sinaads.core.isArray = function (source) {
        return '[object Array]' == Object.prototype.toString.call(source);
    };

    sinaads.core.toArray = function (source) {
        if (source === null || source === undefined) {
            return [];
        }
        if (sinaads.core.isArray(source)) {
            return source;
        }
        // The strings and functions also have 'length'
        if (typeof source.length !== 'number' || typeof source === 'string' || sinaads.core.isFunction(source)) {
            return [source];
        }
    };

    /**
     * 数组相关处理
     * @type {Object}
     */
    sinaads.core.array = sinaads.core.array || {
        remove : function (source, match) {
            var len = source.length;
                
            while (len--) {
                if (len in source && source[len] === match) {
                    source.splice(len, 1);
                }
            }
            return source;
        }
    };

    /**
     * 字符串相关处理
     */
    sinaads.core.string = sinaads.core.string || {
        encodeHTML : function (source) {
            return String(source)
                        .replace(/&/g,'&amp;')
                        .replace(/</g,'&lt;')
                        .replace(/>/g,'&gt;')
                        .replace(/"/g, "&quot;")
                        .replace(/'/g, "&#39;");
        },
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


    /**
     * 判断浏览器类型和特性的属性
     */
    sinaads.core.browser = sinaads.core.browser || {
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
            sinaads.core.browser.maxthon = + RegExp['\x241'];
        }
    } catch (e) {}

    (function(){
        var ua = navigator.userAgent;
        sinaads.core.browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp['\x241'] || RegExp['\x242']) : undefined;
    })();

    sinaads.core.browser.isSupportFixed = !sinaads.core.browser.ie || sinaads.core.browser.ie >=7;

    /**
     * cookie相关
     */
    sinaads.core.cookie = sinaads.core.cookie || {
        _isValidKey : function (key) {
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        },
        getRaw : function (key) {
            if (sinaads.core.cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                     
                if (result) {
                    return result[2] || null;
                }
            }
            return null;
        },
        setRaw : function (key, value, options) {
            if (!sinaads.core.cookie._isValidKey(key)) {
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
            var value = sinaads.core.cookie.getRaw(key);
            if ('string' == typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        },
        set : function (key, value, options) {
            sinaads.core.cookie.setRaw(key, encodeURIComponent(value), options);
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
    sinaads.core.storage = sinaads.core.storage || (function () {
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
                return sinaads.core.cookie.get(key);
            },
            setItem : function (key, value, expires) {
                sinaads.core.cookie.set(key, value, {expires : expires || 0});
            },
            removeItem : function (key) {
                sinaads.core.cookie.remove(key);
            }
        };

        var storage = sinaads.core.browser.ie && sinaads.core.browser.id < 8 ? userData : window.localStorage ? ls : cookie;
        
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
     * 服务端io相关
     */
    function _createScriptTag(scr, url, charset) {
        scr.setAttribute('type', 'text/javascript');
        charset && scr.setAttribute('charset', charset);
        scr.setAttribute('src', url);
        document.getElementsByTagName('head')[0].appendChild(scr);
    };

    function _removeScriptTag(scr) {
        if(scr && scr.parentNode){
            scr.parentNode.removeChild(scr);
        }
        scr = null;
    };

    sinaads.core.sio = sinaads.core.sio || {
        callByBrowser : function (url, opt_callback, opt_options) {
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
                };
                 
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
            };
            _createScriptTag(scr, url, charset);
        },

        callByServer : function(url, callback, opt_options) {
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
     
            if (sinaads.core.isFunction(callback)) {
                callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
                window[callbackName] = getCallBack(0);
            } else if(sinaads.core.isString(callback)){
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


    sinaads.core.swf = sinaads.core.swf || {
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
            return sinaads.core.browser.ie == 9 ?
                movie && movie.length ? 
                    (ret = sinaads.core.array.remove(sinaads.core.toArray(movie), function(item){
                        return item.tagName.toLowerCase() != "embed";
                    })).length == 1 ? ret[0] : ret
                    : movie
                : movie || context[name];
        },
        createHTML : function (options) {
            options = options || {};
            var version = sinaads.core.swf.version, 
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

})(window);
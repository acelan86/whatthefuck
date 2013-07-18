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
    sinaads.core.array = {
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
        create : function () {

        },
        createHTML : function () {

        }
    };

})(window);
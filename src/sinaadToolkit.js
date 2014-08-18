/*!
 * sinaadToolkit
 * @description 新浪广告工具包，提供了浏览器判断，渲染，cookie, storage, iframe, 转义等基础操作
 * @author  acelan <xiaobin8[at]staff.sina.com.cn>
 * @version  1.0.0
 */
(function (window, undefined) {

    "use strict";

    /**
     * @global
     * @namespace
     * @name sinaadToolkit
     */
    var sinaadToolkit = window.sinaadToolkit = window.sinaadToolkit || /** @lends sinaadToolkit */{
        /**
         * 工具包版本号
         * @type {String}
         * @const
         */
        VERSION : '1.0.0',
        /**
         * 模式 debug || release
         * 在页面url中使用__sinaadToolkitDebug__可以触发debug模式
         */
        mode : window.location.href.indexOf('__sinaadToolkitDebug__') !== -1 ? 'debug' : 'release',  //是否开启debug模式
        /**
         * 调试方法，用于方便线上调试问题
         * @param  {String} msg 输出的信息
         */
        debug : (function () {
            /**
             * @remarks 当script放在head中，立即执行的时候doc.body不存在，这时候模拟的console窗口没有地方挂接
             * 这是我们选择的是抛弃这部分debug信息，后续考虑使用cache将这部分信息缓存下来，当body加载后进行回放
             * 但是考虑到这只是调试信息，而且head上挂接js的使用方法在广告逻辑上比较少用，因此没有必要花大力气用几行
             * 代码去实现这个功能。
             */
            var containerId = 'sinaadToolkitDebugContainer';
            var console = window.console || {
                log : function (msg) {
                    if (!document.body) {
                        return;
                    }
                    var consoleView = document.getElementById(containerId);
                    if (!consoleView) {
                        consoleView = document.createElement('ul');
                        consoleView.id = containerId;
                        consoleView.style.cssText = 'z-index:99999;overflow:auto;height:300px;position:absolute;right:0;top:0;opacity:.9;*filter:alpha(opacity=90);background:#fff;width:500px;';
                        document.body.insertBefore(consoleView, document.body.firstChild);
                    }
                    var li = document.createElement('li');
                    li.style.cssText = 'border-bottom:1px dotted #ccc;line-height:30px;font-size:12px;';
                    li.innerHTML = msg + Array.prototype.slice.call(arguments, 1).join(' ');
                    consoleView.appendChild(li);
                }
            };
            return function (msg) {
                if (sinaadToolkit.mode === 'debug') {
                    console.log(msg, Array.prototype.slice.call(arguments, 1));
                }
            };
        })(),
        /**
         * 错误信息
         */
        error : function (msg, e) {
            try {
                sinaadToolkit.sio.log('//d00.sina.com.cn/a.gif?' + [
                    'type=' + 'sinaads_error',
                    'msg=' + encodeURIComponent(msg ? msg : e ? e.message : 'unknow'),
                    'ref=' + encodeURIComponent(sinaadToolkit.url.top),
                    'ja=' + (navigator.javaEnabled() ? 1 : 0),
                    'ck=' + (navigator.cookieEnabled ? 1 : 0),
                    'ds=' + (window.screen.width + "x" + window.screen.height),
                    'ua=' + encodeURIComponent(navigator.appVersion),
                    'pf=' + navigator.platform,
                    'ts=' + sinaadToolkit.now()
                ].join('&'));
            } catch (e) {}

            if (sinaadToolkit.mode === 'debug') {
                throw new Error(msg + (e ? ':' + e.message : ''));
            }
        },
        /**
         * 获取当前时间戳
         * @return {Number} 当前时间戳
         * @static
         */
        now : function () {
            return +new Date();
        },
        /**
         * 随机数生成，生成一个随机数的36进制表示方法
         * @return {String} 生成一个随机的36进制字符串（包含0-9a-z）
         * @static
         */
        rnd : function () {
            return Math.floor(Math.random() * 2147483648).toString(36);
        },
        /**
         * 获取[min, max]区间内任意整数
         * @param  {Number} min 最小值
         * @param  {Number} max 最大值
         * @return {Number}     
         */
        rand : function (min, max) {
            return Math.floor(min + Math.random() * (max - min + 1));
        },
        /**
         * 把一个字符串生成唯一hash
         * @param  {String} s 要生成hash的字符串
         * @return {String}   36进制字符串
         */
        hash : function (s) {
            var hash = 0,
                i = 0,
                w;

            for (; !isNaN(w = s.charCodeAt(i++));) {
                hash = ((hash << 5) - hash) + w;
                hash = hash & hash;
            }

            return Math.abs(hash).toString(36);
        },
        /**
         * 判断是否是函数
         * @param  {Any}        source      需要判断的对象
         * @return {Boolean}                是否是函数
         * @staitc
         */
        isFunction : function (source) {
            return '[object Function]' === Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是字符串
         * @param  {Any} source 要判断的对象
         * @return {Boolean}        是否字符串
         * @static
         */
        isString : function (source) {
            return '[object String]' === Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是null或者未定义
         * @param  {Any} source  要判断的对象
         * @return {Boolean}      是否为null或未定义
         */
        isNull : function (source) {
            return ('undefined' === typeof source) || (source === null);
        },
        /**
         * 判断是否是数组
         */
        isArray : function (source) {
            return '[object Array]' === Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是数字
         */
        isNumber : function (source) {
            return '[object Number]' === Object.prototype.toString.call(source) && isFinite(source);
        },
        /**
         * 在全局上下文中执行script
         * @remarks  来自jquery
         * @param  {String} data 要执行的脚本代码
         */
        // Evaluates a script in a global context
        // Workarounds based on findings by Jim Driscoll
        // http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
        globalEval: function (data) {
            if (data && /\S/.test(data)) {
                // We use execScript on Internet Explorer
                // We use an anonymous function so that context is window
                // rather than jQuery in Firefox
                (window.execScript || function (data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },

        /**
         * 在窗口后面弹出一个窗口
         */
        underPop : function (loc, name, width, height) {
            function _popAd() {
                var _pop = window.open('about:blank', name, 'width=' + width + ',height=' + height);
                _pop.blur();
                _pop.opener.focus();
                _pop.location = loc;
                sinaadToolkit.event.un(document.body, 'click', _popAd);
            }
            try {
                _popAd();
            } catch (e) {
                sinaadToolkit.debug('sinaads:Cannot pop window, use click event.');
                sinaadToolkit.event.on(document.body, 'click', _popAd);
            }
        }
    };


    /**
     * 资源备选地址
     * @static
     * @const
     */
    sinaadToolkit.RESOURCE_URL = sinaadToolkit.RESOURCE_URL || [
        'http://d1.sina.com.cn/litong/zhitou/sinaads',
        'http://d2.sina.com.cn/litong/zhitou/sinaads',
        'http://d3.sina.com.cn/litong/zhitou/sinaads',
        'http://d4.sina.com.cn/litong/zhitou/sinaads',
        'http://d5.sina.com.cn/litong/zhitou/sinaads',
        'http://d6.sina.com.cn/litong/zhitou/sinaads',
        'http://d7.sina.com.cn/litong/zhitou/sinaads',
        'http://d8.sina.com.cn/litong/zhitou/sinaads',
        'http://d9.sina.com.cn/litong/zhitou/sinaads'
        //'.'
    ][sinaadToolkit.rand(0, 8)];

    /**
     * 工具包资源地址
     * @static
     * @const
     */
    sinaadToolkit.TOOLKIT_URL = sinaadToolkit.RESOURCE_URL + '/release/sinaadToolkit.js';

    /**
     * @namespace sinaadToolkit.browser
     */
    sinaadToolkit.browser = sinaadToolkit.browser || (function (ua) {
        /**
         * @lends sinaadToolkit.browser
         */
        var browser = {
            /**
             * 是否是andriod系统
             * @type {Boolean}
             * @marks zepto的Android判断好像有问题
             * eg: userAgent: Mozilla/4.0 (compatible;Android;320x480)
             */
            //android : /(Android)\s+([\d.]+)/i.test(ua),
            android : /(Android)(\s+([\d.]+))*/i.test(ua),
            /**
             * @type {Boolean}
             */
            ipad : /(iPad).*OS\s([\d_]+)/i.test(ua),
            /**
             * @type {Boolean}
             */
            webos : /(webOS|hpwOS)[\s\/]([\d.]+)/i.test(ua),
            /**
             * @type {Boolean}
             */
            kindle : /Kindle\/([\d.]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            silk : /Silk\/([\d._]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            blackberry : /(BlackBerry).*Version\/([\d.]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            bb10 : /(BB10).*Version\/([\d.]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            rimtabletos : /(RIM\sTablet\sOS)\s([\d.]+)/i.test(ua),
            /** 
             * @type {Boolean}
             */
            playbook : /PlayBook/i.test(ua),
            /** 
             * 如果是chrome浏览器，返回浏览器当前版本号
             * @type {Number}
             */
            chrome : /chrome\/(\d+\.\d+)/i.test(ua) ? + RegExp.$1 : undefined,
            /**
             * 如果是firefox浏览器，返回浏览器当前版本号
             * @type {Number}
             */
            firefox : /firefox\/(\d+\.\d+)/i.test(ua) ? + RegExp.$1 : undefined,
            /**
             * 如果是ie返回ie当前版本号
             * @type {Number}
             */
            ie : /msie (\d+\.\d+)/i.test(ua) ? (document.documentMode || + RegExp.$1) : undefined,
            /**
             * @type {Boolean}
             */
            isGecko : /gecko/i.test(ua) && !/like gecko/i.test(ua),
            /**
             * @type {Boolean}
             */
            isStrict : document.compatMode === "CSS1Compat",
            /**
             * @type {Boolean}
             */
            isWebkit : /webkit/i.test(ua),
            /**
             * 如果是opera,返回opera当前版本号
             * @type {Number}
             */
            opera : /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(ua) ?  + (RegExp.$6 || RegExp.$2) : undefined
        };

        /**
         * @type {Boolean}
         */
        browser.iphone = !browser.ipad && /(iPhone\sOS)\s([\d_]+)/i.test(ua);
        /**
         * @type {Boolean}
         */
        browser.touchpad = browser.webos && /TouchPad/.test(ua);
        /**
         * @type {Boolean}
         */
        browser.tablet = !!(browser.ipad || browser.playbook || (browser.android && !/Mobile/.test(ua)) || (browser.firefox && /Tablet/.test(ua)));
        /**
         * @type {Boolean}
         */
        browser.phone  = !!(!browser.tablet && (browser.android || browser.iphone || browser.webos || browser.blackberry || browser.bb10 || (browser.chrome && /Android/.test(ua)) || (browser.chrome && /CriOS\/([\d.]+)/.test(ua)) || (browser.firefox && /Mobile/.test(ua))));

        try {
            if (/(\d+\.\d+)/.test(window.external.max_version)) {
                /**
                 * 如果是遨游浏览器，返回遨游版本号
                 * @type {Number}
                 */
                browser.maxthon = + RegExp.$1;
            }
        } catch (e) {}

        browser.mobile = browser.tablet || browser.phone || browser.touchpad;

        /**
         * 如果是safari浏览器，返回safari版本号
         * @type {Number}
         */
        browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp.$1 || RegExp.$2) : undefined;
        /**
         * 是否支持position:fixed属性
         * @type {Boolean}
         */
        browser.isSupportFixed = !browser.ie || browser.ie >= 7;

        return browser;

    })(navigator.userAgent);

    /**
     * 获取系统信息
     * @type {Object}
     */
    sinaadToolkit.systemInfo = {
        screenSize : window.screen ? (window.screen.width + "x" + window.screen.height) : '-',
        language : navigator.systemLanguage || navigator.browserLanguage || navigator.language || navigator.userLanguage || '-',
        platform : '-'
    };


    /**
     * @namespace sinaadToolkit.array
     */
    sinaadToolkit.array = sinaadToolkit.array || /** @lends sinaadToolkit.array */{
        /**
         * 移除数组元素
         * @param  {Array} source 要移除元素的数组
         * @param  {Any} match  要移除的元素
         * @return {Array}        移除元素后的数组
         */
        remove : function (source, match) {
            var len = source.length;
                
            while (len--) {
                if (len in source && source[len] === match) {
                    source.splice(len, 1);
                }
            }
            return source;
        },
        /**
         * 遍历数组
         * @param  {Array} source     要遍历的源数组
         * @param  {Function} iterator   遍历方法
         * @param  {Object} thisObject 调用对象
         * @return {Array}            被遍历的源数组
         */
        each : function (source, iterator, thisObject) {

            source = sinaadToolkit.array.ensureArray(source);

            var returnValue,
                item,
                i,
                len = source.length;
            
            if ('function' === typeof iterator) {
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
        },
        /**
         * 将传入元素转换成一个数组，如果是一个数组，直接返回，如果不是，判断是否为null或者undefined,如果不是，返回这个元素组成的数组，否则返回空数组
         * @param  {Any} source 需要转换的对象
         * @return {Array}      转换后的数组
         */
        ensureArray : function (source) {
            return sinaadToolkit.isArray(source) ? source : sinaadToolkit.isNull(source) ? [] : [source];
        }
    };


    /**
     * @namespace sinaadToolkit.string
     */
    sinaadToolkit.string = sinaadToolkit.string || (function () {
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
        
        return /** @lends sinaadToolkit.string */{
            /**
             * 转义html
             * @param  {String} source 要转义的源字符串
             * @return {String}        转义后的字符串
             */
            encodeHTML : function (source) {
                return String(source)
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, "&quot;")
                            .replace(/'/g, "&#39;");
            },
            /**
             * 反转义html
             * @param  {String} source 要转义的源字符串
             * @return {String}        转义后的字符串
             */
            decodeHTML : function (source) {
                var str = String(source)
                            .replace(/&quot;/g, '"')
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>')
                            .replace(/&amp;/g, "&");
                //处理转义的中文和实体字符
                return str.replace(/&#([\d]+);/g, function (_0, _1) {
                    return String.fromCharCode(parseInt(_1, 10));
                });
            },
            /**
             * 转义字符串中的特殊字符
             * @params {Sting} source 要转义的字符串
             * @return {String} 转义后的字符串
             */
            formalString : function (source) {
                var ret = [];
                ret.push(source.replace(STR_REG, function (str) {
                    //如果再需要转义的字符表中，替换成转移字符对应的值
                    if (str in ESCAPE_MAP) {
                        return ESCAPE_MAP[str];
                    }
                    //否则转成对应的unicode码
                    var alphaCode = str.charCodeAt(0),
                        unicodePerfix = "\\u";
                    //需要增加几位0来补位
                    16 > alphaCode ? unicodePerfix += "000" : 256 > alphaCode ? unicodePerfix += "00" : 4096 > alphaCode && (unicodePerfix += "0");

                    //保存转移过的值到ESCAPE_MAP提高转义效率，同时返回进行替换
                    ESCAPE_MAP[str] = unicodePerfix + alphaCode.toString(16);

                    return ESCAPE_MAP[str];
                }));
                return '"' + ret.join('') + '"';
            },
            /**
             * 简单模版方法
             * @param  {String} source 模版
             * @param  {Object} opts   替换变量
             * @return {String}        模版替换后的结果
             */
            format : function (source, opts) {
                source = String(source);
                var data = Array.prototype.slice.call(arguments, 1),
                    toString = Object.prototype.toString;
                if (data.length) {
                    data = data.length === 1 ?
                        /* ie 下 Object.prototype.toString.call(null) == '[object Object]' */
                        (opts !== null && (/\[object Array\]|\[object Object\]/.test(toString.call(opts))) ? opts : data) : data;
                    return source.replace(/#\{(.+?)\}/g, function (match, key) {
                        var replacer = data[key];
                        // chrome 下 typeof /a/ == 'function'
                        if ('[object Function]' === toString.call(replacer)) {
                            replacer = replacer(key);
                        }
                        return ('undefined' === typeof replacer ? '' : replacer);
                    });
                }
                return source;
            },
            toCamelCase : function (source) {
                //提前判断，提高效率
                if (source.indexOf('-') < 0 && source.indexOf('_') < 0) {
                    return source;
                }
                return source.replace(/[-_][^-_]/g, function (match) {
                    return match.charAt(1).toUpperCase();
                });
            }
        };
    })();

    /**
     * 删除目标字符串两端的空白字符
     * @name sinaadToolkit.string.trim
     * @function
     * @grammar sinaadToolkit.string.trim(source)
     * @param {string} source 目标字符串
     * @remark
     * 不支持删除单侧空白字符
     * @shortcut trim
     * @meta standard
     *             
     * @returns {string} 删除两端空白字符后的字符串
     */

    sinaadToolkit.string.trim = sinaadToolkit.string.trim || (function () {
        var trimer = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+\x24)", "g");
        
        return function (source) {
            source = source || "";
            return String(source).replace(trimer, "");
        };
    })();

    sinaadToolkit.number = sinaadToolkit.number || {
        pad : function (source, length) {
            var pre = "",
                negative = (source < 0),
                string = String(Math.abs(source));
         
            if (string.length < length) {
                pre = (new Array(length - string.length + 1)).join('0');
            }
         
            return (negative ?  "-" : "") + pre + string;
        }
    };


    sinaadToolkit.date = sinaadToolkit.date || {
        format : function (source, pattern) {
            if ('string' !== typeof pattern) {
                return source.toString();
            }
         
            function replacer(patternPart, result) {
                pattern = pattern.replace(patternPart, result);
            }
             
            var pad     = sinaadToolkit.number.pad,
                year    = source.getFullYear(),
                month   = source.getMonth() + 1,
                date2   = source.getDate(),
                hours   = source.getHours(),
                minutes = source.getMinutes(),
                seconds = source.getSeconds();
         
            replacer(/yyyy/g, pad(year, 4));
            replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
            replacer(/MM/g, pad(month, 2));
            replacer(/M/g, month);
            replacer(/dd/g, pad(date2, 2));
            replacer(/d/g, date2);
         
            replacer(/HH/g, pad(hours, 2));
            replacer(/H/g, hours);
            replacer(/hh/g, pad(hours % 12, 2));
            replacer(/h/g, hours % 12);
            replacer(/mm/g, pad(minutes, 2));
            replacer(/m/g, minutes);
            replacer(/ss/g, pad(seconds, 2));
            replacer(/s/g, seconds);
         
            return pattern;
        }
    };


    /**
     * @namespace sinaadToolkit.object
     */
    sinaadToolkit.object = sinaadToolkit.object || /** @lends sinaadToolkit.object */{
        /**
         * object的遍历方法
         * @param  {Object} source   要遍历的对象
         * @param  {Function} iterator 遍历方法，第一个参数为遍历的值，第二个位key
         * @return {Object}          key映射的遍历结果
         */
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
     * @namespace sinaadToolkit.event
     */
    sinaadToolkit.event = sinaadToolkit.event || /** @lends sinaadToolkit.event */{
        /**
         * 注册事件
         * @param  {HTMLNodeElement}   dom      事件监听节点
         * @param  {String}   type     事件类型
         * @param  {Function} callback 回调方法
         */
        on : function (dom, type, callback) {
            if (dom.attachEvent) {
                dom.attachEvent('on' + type, callback);
            } else if (dom.addEventListener) {
                dom.addEventListener(type, callback, false);
            }
        },
        un : function (dom, type, callback) {
            if (dom.detachEvent) {
                dom.detachEvent('on' + type, callback);
            } else if (dom.removeEventListener) {
                dom.removeEventListener(type, callback);
            }
        }
    };

    /**
     * @namespace sinaadToolkit.cookie
     */
    sinaadToolkit.cookie = sinaadToolkit.cookie || /** @lends sinaadToolkit.cookie */{
        /**
         * @private
         * @param  {String} key 要验证的cookie的key
         * @return {Boolean}    是否为符合规则的key
         */
        // http://www.w3.org/Protocols/rfc2109/rfc2109
        // Syntax:  General
        // The two state management headers, Set-Cookie and Cookie, have common
        // syntactic properties involving attribute-value pairs.  The following
        // grammar uses the notation, and tokens DIGIT (decimal digits) and
        // token (informally, a sequence of non-special, non-white space
        // characters) from the HTTP/1.1 specification [RFC 2068] to describe
        // their syntax.
        // av-pairs   = av-pair *(";" av-pair)
        // av-pair    = attr ["=" value] ; optional value
        // attr       = token
        // value      = word
        // word       = token | quoted-string
         
        // http://www.ietf.org/rfc/rfc2068.txt
        // token      = 1*<any CHAR except CTLs or tspecials>
        // CHAR       = <any US-ASCII character (octets 0 - 127)>
        // CTL        = <any US-ASCII control character
        //              (octets 0 - 31) and DEL (127)>
        // tspecials  = "(" | ")" | "<" | ">" | "@"
        //              | "," | ";" | ":" | "\" | <">
        //              | "/" | "[" | "]" | "?" | "="
        //              | "{" | "}" | SP | HT
        // SP         = <US-ASCII SP, space (32)>
        // HT         = <US-ASCII HT, horizontal-tab (9)>
        _isValidKey : function (key) {
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        },
        /**
         * 从cookie中获取key所对应的值
         * @private
         * @param  {String} key 要获取的cookie的key
         * @return {String}     cookie对应该key的值
         */
        _getRaw : function (key) {
            if (sinaadToolkit.cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                     
                if (result) {
                    return result[2] || null;
                }
            }
            return null;
        },
        /**
         * 将cookie中key的值设置为value, 并带入一些参数
         * @private
         * @param  {String} key 要设置的cookie的key
         * @param  {String} value 要设置的值
         * @param  {Object} options 选项
         */
        _setRaw : function (key, value, options) {
            if (!sinaadToolkit.cookie._isValidKey(key)) {
                return;
            }
             
            options = options || {};

            // 计算cookie过期时间
            var expires = options.expires;
            if ('number' === typeof options.expires) {
                expires = new Date();
                expires.setTime(expires.getTime() + options.expires);
            }
             
            document.cookie =
                key + "=" + value +
                (options.path ? "; path=" + options.path : "") +
                (expires ? "; expires=" + expires.toGMTString() : "") +
                (options.domain ? "; domain=" + options.domain : "") +
                (options.secure ? "; secure" : '');

        },
        /**
         * 获取cookie中key的值
         * @param  {String} key 要获取的key
         * @return {String}     cookie值
         */
        get : function (key) {
            var value = sinaadToolkit.cookie._getRaw(key);
            if ('string' === typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        },
        /**
         * 设置cookie值
         * @param  {String} key     要设置的key
         * @param  {String} value   要设置的value   
         * @param  {object} options 选项
         */
        set : function (key, value, options) {
            sinaadToolkit.cookie._setRaw(key, encodeURIComponent(value), options);
        },
        /**
         * 移除key相关的cookie
         * @param  {String} key     要移除的cookie的key
         * @param  {Object} options 选项
         */
        remove : function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            sinaadToolkit.cookie._setRaw(key, '', options);
        }
    };

    /**
     * @namespace sinaadToolkit.storage
     */
    sinaadToolkit.storage = sinaadToolkit.storage || (function () {
        //关闭浏览器后过期的key
        var _sessionStorageMap = {};
        //刷新浏览器清空没有设置expires的存储
        sinaadToolkit.event.on(window, 'beforeunload', function () {
            for (var key in _sessionStorageMap) {
                try {
                    sinaadToolkit.storage.remove(key);
                    delete _sessionStorageMap[key];
                } catch (e) {}
            }
        });

        /**
         * userData相关方法
         */
        var userData = {
            id : 'sinaadToolkitUserDataContainer',
            name : location.hostname,
            init : function () {
                var dom = document.getElementById(userData.id);
                if (!dom) {
                    try {
                        dom = document.createElement('input');
                        dom.type = "hidden";
                        dom.style.display = "none";
                        dom.addBehavior("#default#userData");
                        document.body.insertBefore(dom, document.body.firstChild);
                        var expires = new Date();
                        expires.setDate(expires.getDate() + 365);
                        dom.expires = expires.toUTCString();
                    } catch (e) {
                        sinaadToolkit.debug('sinaadToolkit.storage:userData init fail, ' + e.message);
                        return null;
                    }
                }
                return dom;
            },
            setItem : function (key, value, expires) {
                var dom = userData.init();
                if (dom) {
                    dom.load(userData.name);
                    dom.setAttribute(key, value + (expires ? ';expires=' + (sinaadToolkit.now() + expires) : ''));
                    dom.save(userData.name);
                }
                if (!expires) {
                    _sessionStorageMap[key] = 1;
                }
            },
            getItem : function (key) {
                var dom = userData.init();
                if (dom) {
                    dom.load(userData.name);
                    return dom.getAttribute(key);
                }
                return null;
            },
            removeItem : function (key) {
                var dom = userData.init();
                if (dom) {
                    dom.load(userData.name);
                    dom.removeAttribute(key);
                    dom.save(userData.name);
                }
            }
        };

        /**
         * localstorage相关方法
         */
        var ls = {
            getItem : function (key) {
                return window.localStorage.getItem(key);
            },
            setItem : function (key, value, expires) {
                window.localStorage.setItem(key, value + (expires ? ';expires=' + (sinaadToolkit.now() + expires) : ''));
                if (!expires) {
                    _sessionStorageMap[key] = 1;
                }
            },
            removeItem : function (key) {
                window.localStorage.removeItem(key);
            }
        };

        /**
         * cookie相关方法
         * @type {Object}
         */
        var cookie = {
            getItem : function (key) {
                return sinaadToolkit.cookie.get(key);
            },
            setItem : function (key, value, expires) {
                sinaadToolkit.cookie.set(key, value, {expires : expires || 0});
            },
            removeItem : function (key) {
                sinaadToolkit.cookie.remove(key);
            }
        };

        /** 
         * 根据浏览器支持选择相关的存储方案
         * 当ie且ie<8时使用userData方案，否则使用localStorage方案，否则使用cookie方案
         */
        var storage = window.localStorage ? ls : sinaadToolkit.browser.ie && sinaadToolkit.browser.ie < 8 ? userData : cookie;

        return /** @lends sinaadToolkit.storage */{
            /**
             * 获取本地存储的key的值
             * @param  {String} key key
             * @return {String}     取得的值
             */
            get : function (key) {
                try {
                    var value = storage.getItem(key);
                    if (value) {
                        sinaadToolkit.debug('sinaadToolkit.storage.get:get value of ' + key + ':' + value);
                        value = value.split(';expires=');
                        //有过期时间
                        if (value[1] && sinaadToolkit.now() > parseInt(value[1], 10)) {
                            storage.removeItem(key);
                            return null;
                        } else {
                            return value[0];
                        }
                    }
                    return null;
                } catch (e) {
                    sinaadToolkit.debug('sinaadToolkit.storage.get:' + e.message);
                    return null;
                }
            },
            /**
             * 设置本地存储key的值为value
             * 注意：请不要设置非字符串格式形式的值到本地存储
             * @param  {String} key     设置的key
             * @param  {String} value   设置的value
             * @param  {Number} expires 过期时间毫秒数
             */
            set : function (key, value, expires) {
                try {
                    storage.setItem(key, value, expires);
                } catch (e) {
                    sinaadToolkit.error('sinaadToolkit.storage.set:' + e.message);
                }
            },
            /**
             * 移除本地存储中key的值
             * @param  {String} key 要移除的key
             */
            remove : function (key) {
                try {
                    storage.removeItem(key);
                } catch (e) {
                    sinaadToolkit.error('sinaadToolkit.storage.remove:' + e.message);
                }
            }
        };
    })();


    /* 测试移除没有设置过期时间的存储 */
    // sinaadToolkit.storage.set('noexpireskey', 1);
    // sinaadToolkit.storage.set('noexpireskey2', 2);

    /**
     * @namespace sinaadToolkit.url
     */
    sinaadToolkit.url = sinaadToolkit.url || /** @lends sinaadToolkit.url */{
        protocol : (function() {
            return (window.location.protocol === "https:" ? "https://" : "http://");
        })(),
        /**
         * 确保传入的字符串是一个url, 同时去除前后空格
         * iframe的src在ie下协议写错会导致刷新当前页面成iframe的src,
         * 判断是否有http或者https开头，如果没有直接认定添加http或者https
         * @todo \n\r 去除
         */
        ensureURL : function (source) {
            source = sinaadToolkit.string.trim(source);
            return source ? (/^(http|https):\/\//).test(source) ? source : (sinaadToolkit.url.protocol + source) : '';
        },
        /**
         * 创建一个url
         * @param  {String} domain url主域
         * @param  {String} path   path
         * @param  {Boolean} useSSL 使用https?
         * @return {String}        生成的url
         */
        createURL : function (domain, path, useSSL) {
            return [useSSL ? "https" : "http", "://", domain, path].join("");
        },
        /**
         * 获取当前页面所在的主页面url
         * @return {String} 获取当前页面所在的主页面url
         */
        top : (function () {
            var top;
            try {
                top = window.top.location.href;
            } catch (e) {}
            top = top || ((window.top === window.self) ?  window.location.href : window.document.referrer);
            if (!top) {
                sinaadToolkit.error('sinaadToolkit:Cannot get pageurl on which ad locates.');
            }
            return top;
        })()
    };



    /**
     * @namespace sinaadToolkit.dom
     */
    sinaadToolkit.dom = sinaadToolkit.dom || /** @lends sinaadToolkit.dom */{
        /**
         * 获取元素
         * 
         */
        get : function (id) {
            if (!id) {
                return null;
            }
            if ('string' === typeof id || id instanceof String) {
                return document.getElementById(id);
            } else if (id.nodeName && (id.nodeType === 1 || id.nodeType === 9)) {
                return id;
            }
            return null;
        },
        addClass : function (element, className) {
            element = sinaadToolkit.dom.get(element);
            var classArray = className.split(/\s+/),
                result = element.className,
                classMatch = " " + result + " ",
                i = 0,
                l = classArray.length;

            for (; i < l; i++){
                 if ( classMatch.indexOf( " " + classArray[i] + " " ) < 0 ) {
                     result += (result ? ' ' : '') + classArray[i];
                 }
            }

            element.className = result;
            return element;
        },
        /**
         * 获取某个dom节点所属的document
         * @param  {HTMLNodeElement} element 节点
         * @return {DocumentElement}         所属的document节点
         */
        getDocument : function (element) {
            return element.nodeType === 9 ? element : element.ownerDocument || element.document;
        },
        /**
         * 获取某个dom节点的某个计算后样式
         * @param  {HTMLNodeElement} element 节点
         * @param  {String} key     样式名
         * @return {String}         样式值
         */
        getComputedStyle : function (element, key) {
            var doc = sinaadToolkit.dom.getDocument(element),
                styles;
            if (doc.defaultView && doc.defaultView.getComputedStyle) {
                styles = doc.defaultView.getComputedStyle(element, null);
                if (styles) {
                    return styles[key] || styles.getPropertyValue(key);
                }
            }
            return '';
        },
        /**
         * 获取某个dom节点的某个当前样式
         * @param  {HTMLNodeElement} element 节点
         * @param  {String} key     样式名
         * @return {String}         样式值
         */
        getCurrentStyle : function (element, key) {
            return element.style[key] || (element.currentStyle ? element.currentStyle[key] : "") || sinaadToolkit.dom.getComputedStyle(element, key);
        },

        _styleFixer : {},
        _styleFilter : [],

        /**
         * 获取目标元素的样式值
         * @name sinaadToolkit.dom.getStyle
         * @function
         * @grammar sinaadToolkit.dom.getStyle(element, key)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @param {string} key 要获取的样式名
         * @remark
         * 
         * 为了精简代码，本模块默认不对任何浏览器返回值进行归一化处理（如使用getStyle时，不同浏览器下可能返回rgb颜色或hex颜色），也不会修复浏览器的bug和差异性（如设置IE的float属性叫styleFloat，firefox则是cssFloat）。<br />
         * sinaadToolkit.dom._styleFixer和sinaadToolkit.dom._styleFilter可以为本模块提供支持。<br />
         * 其中_styleFilter能对颜色和px进行归一化处理，_styleFixer能对display，float，opacity，textOverflow的浏览器兼容性bug进行处理。  
         * @shortcut getStyle
         * @meta standard
         * @returns {string} 目标元素的样式值
         */
        // TODO
        // 1. 无法解决px/em单位统一的问题（IE）
        // 2. 无法解决样式值为非数字值的情况（medium等 IE）
        getStyle : function (element, key) {
            var dom = sinaadToolkit.dom,
                fixer;

            element = dom.get(element);
            key = sinaadToolkit.string.toCamelCase(key);
            //computed style, then cascaded style, then explicitly set style.
            var value = element.style[key] ||
                        (element.currentStyle ? element.currentStyle[key] : "") ||
                        dom.getComputedStyle(element, key);

            // 在取不到值的时候，用fixer进行修正
            if (!value || value === 'auto') {
                fixer = dom._styleFixer[key];
                if (fixer) {
                    value = fixer.get ? fixer.get(element, key, value) : sinaadToolkit.dom.getStyle(element, fixer);
                }
            }
            
            /* 检查结果过滤器 */
            if ((fixer = dom._styleFilter)) {
                value = fixer.filter(key, value, 'get');
            }
            return value;
        },
        /**
         * 获取目标元素相对于整个文档左上角的位置
         * @name sinaadToolkit.dom.getPosition
         * @function
         * @grammar sinaadToolkit.dom.getPosition(element)
         * @param {HTMLElement|string} element 目标元素或目标元素的id
         * @meta standard
         *             
         * @returns {Object} 目标元素的位置，键值为top和left的Object。
         */
        getPosition : function (element) {
            element = sinaadToolkit.dom.get(element);
            var doc = sinaadToolkit.dom.getDocument(element),
                browser = sinaadToolkit.browser,
                getStyle = sinaadToolkit.dom.getStyle,
                // Gecko 1.9版本以下用getBoxObjectFor计算位置
                // 但是某些情况下是有bug的
                // 对于这些有bug的情况
                // 使用递归查找的方式
                // BUGGY_GECKO_BOX_OBJECT = browser.isGecko > 0 &&
                //                          doc.getBoxObjectFor &&
                //                          getStyle(element, 'position') === 'absolute' &&
                //                          (element.style.top === '' || element.style.left === ''),
                pos = {"left": 0, "top": 0},
                viewport = (browser.ie && !browser.isStrict) ? doc.body : doc.documentElement,
                parent,
                box;
            
            if (element === viewport) {
                return pos;
            }


            if (element.getBoundingClientRect) { // IE and Gecko 1.9+
                
                //当HTML或者BODY有border width时, 原生的getBoundingClientRect返回值是不符合预期的
                //考虑到通常情况下 HTML和BODY的border只会设成0px,所以忽略该问题.
                box = element.getBoundingClientRect();

                pos.left = Math.floor(box.left) + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
                pos.top  = Math.floor(box.top)  + Math.max(doc.documentElement.scrollTop,  doc.body.scrollTop);
                
                // IE会给HTML元素添加一个border，默认是medium（2px）
                // 但是在IE 6 7 的怪异模式下，可以被html { border: 0; } 这条css规则覆盖
                // 在IE7的标准模式下，border永远是2px，这个值通过clientLeft 和 clientTop取得
                // 但是。。。在IE 6 7的怪异模式，如果用户使用css覆盖了默认的medium
                // clientTop和clientLeft不会更新
                pos.left -= doc.documentElement.clientLeft;
                pos.top  -= doc.documentElement.clientTop;
                
                var htmlDom = doc.body,
                    // 在这里，不使用element.style.borderLeftWidth，只有computedStyle是可信的
                    htmlBorderLeftWidth = parseInt(getStyle(htmlDom, 'borderLeftWidth'), 10),
                    htmlBorderTopWidth = parseInt(getStyle(htmlDom, 'borderTopWidth'), 10);
                if (browser.ie && !browser.isStrict) {
                    pos.left -= isNaN(htmlBorderLeftWidth) ? 2 : htmlBorderLeftWidth;
                    pos.top  -= isNaN(htmlBorderTopWidth) ? 2 : htmlBorderTopWidth;
                }
            /*
             * 因为firefox 3.6和4.0在特定页面下(场景待补充)都会出现1px偏移,所以暂时移除该逻辑分支
             * 如果 2.0版本时firefox仍存在问题,该逻辑分支将彻底移除. by rocy 2011-01-20
            } else if (doc.getBoxObjectFor && !BUGGY_GECKO_BOX_OBJECT){ // gecko 1.9-

                // 1.9以下的Gecko，会忽略ancestors的scroll值
                // https://bugzilla.mozilla.org/show_bug.cgi?id=328881 and
                // https://bugzilla.mozilla.org/show_bug.cgi?id=330619

                box = doc.getBoxObjectFor(element);
                var vpBox = doc.getBoxObjectFor(viewport);
                pos.left = box.screenX - vpBox.screenX;
                pos.top  = box.screenY - vpBox.screenY;
                */
            } else { // safari/opera/firefox
                parent = element;

                do {
                    pos.left += parent.offsetLeft;
                    pos.top  += parent.offsetTop;
              
                    // safari里面，如果遍历到了一个fixed的元素，后面的offset都不准了
                    if (browser.isWebkit > 0 && getStyle(parent, 'position') === 'fixed') {
                        pos.left += doc.body.scrollLeft;
                        pos.top  += doc.body.scrollTop;
                        break;
                    }
                    
                    parent = parent.offsetParent;
                } while (parent && parent !== element);

                // 对body offsetTop的修正
                if (browser.opera > 0 || (browser.isWebkit > 0 && getStyle(element, 'position') === 'absolute')) {
                    pos.top  -= doc.body.offsetTop;
                }

                // 计算除了body的scroll
                parent = element.offsetParent;
                while (parent && parent !== doc.body) {
                    pos.left -= parent.scrollLeft;
                    // see https://bugs.opera.com/show_bug.cgi?id=249965
                    // if (!b.opera || parent.tagName != 'TR') {
                    if (!browser.opera || parent.tagName !== 'TR') {
                        pos.top -= parent.scrollTop;
                    }
                    parent = parent.offsetParent;
                }
            }

            return pos;
        },
        /**
         * dom.innerHTML的增强版本，可执行script
         * @param  {HTMLElement} dom     容器节点元素
         * @param  {String} content 插入的内容
         */
        fill : (function () {
            var rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g;

            return function (dom, content) {
                if (!dom) {
                    return;
                }

                /*
                 * 当inner的第一个节点就是script的时候ie会丢弃这个节点，不下载也不执行
                 * 因此这里有这个hack，考虑到没有什么大影响，直接没有区分浏览器
                 */
                dom.innerHTML = '<i style="display:none;">Hack ie first node is script</i>' + content;

                var scripts = dom.getElementsByTagName('script'),
                    i = 0,
                    len = scripts.length,
                    script;

                /* 保证按顺序执行 */
                function exec() {
                    if (i++ < len && (script = scripts[0])) {
                        //ie6下会自动执行具有defer属性的内联和外部脚本
                        if (sinaadToolkit.browser.ie <= 6 && script.defer) {
                            exec();
                        } else {
                            if (script.src) {
                                sinaadToolkit.sio.loadScript(script.src, exec, {charset:'gb2312'});
                            } else {
                                sinaadToolkit.globalEval((script.text || script.textContent || script.innerHTML || "").replace(rcleanScript, ""));
                                exec();
                            }
                        }
                        //移除脚本节点
                        if (script.parentNode ) {
                            script.parentNode.removeChild(script);
                        }
                    }
                }

                exec();
            };
        })()
    };

    /**
     * 为获取和设置样式的过滤器
     * @private
     * @meta standard
     */
    sinaadToolkit.dom._styleFilter.filter = function (key, value, method) {
        for (var i = 0, filters = sinaadToolkit.dom._styleFilter, filter; (filter = filters[i]); i++) {
            if ((filter = filter[method])) {
                value = filter(key, value);
            }
        }
        return value;
    };


    /**
     * @namespace sinaadToolkit.page
     */
    sinaadToolkit.page = sinaadToolkit.page || /** @lends sinaadToolkit.page */{
        /**
         * 获取向上滚动高度
         * @return {Number} 向上滚动高度
         */
        getScrollTop : function () {
            var doc = document;
            return window.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop;
        },
        /**
         * 获取向左滚动高度
         * @return {Number} 向左滚动高度
         */
        getScrollLeft : function () {
            var doc = document;
            return window.pageXOffset || doc.documentElement.scrollLeft || doc.body.scrollLeft;
        },
        /**
         * 获取页面高度
         * @return {Number} 页面高度
         */
        getViewHeight : function () {
            var doc = document,
                client = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;
            return client.clientHeight;
        },
        /**
         * 获取页面宽度
         * @return {Number} 页面宽度
         */
        getViewWidth : function () {
            var doc = document,
                client = doc.compatMode === 'BackCompat' ? doc.body : doc.documentElement;
            return client.clientWidth;
        }
    };


    sinaadToolkit.Deferred = sinaadToolkit.Deferred || (function (core) {
        function _pipe(original, deferred, callback, actionType) {
            return function () {
                if (typeof callback === 'function') {
                    try {
                        var returnValue = callback.apply(original, arguments);

                        if (Deferred.isPromise(returnValue)) {
                            returnValue.then(
                                function () {
                                    deferred.resolve.apply(deferred, arguments);
                                },
                                function () {
                                    deferred.reject.apply(deferred, arguments);
                                }
                            );
                        }
                        else {
                            deferred.resolve.call(deferred, returnValue);
                        }
                    }
                    catch (e) {
                        sinaadToolkit.error('sinaadToolkit.Deferred:Error occurred in _pipe. ' + e.message);
                        deferred.reject(e);
                    }
                }
                // `.then()`及`.then(done, null)`时使用
                // 直接使用原`Deferred`保存的参数将`deferred`改为对应状态
                else {
                    deferred[actionType].apply(deferred, original._args);
                }
            };
        }
        //判断promise状态决定指定回调方法
        function _flush(deferred) {
            if (deferred._state === 'pending') {
                return;
            }
            var callbacks = deferred._state === 'resolved' ? deferred._resolves.slice() : deferred._rejects.slice();

            setTimeout(function () {
                core.array.each(callbacks, function (callback) {
                    try {
                        callback.apply(deferred, deferred._args);
                    } catch (e) {
                        sinaadToolkit.error('sinaadToolkit.Deferred:Error occurred in _flush. ' + e.message);
                    }
                });
            }, 0);

            deferred._resolves = [];
            deferred._rejects = [];
        }

        /**
         * @constructor
         * @class Prossmise的一个实现
         * @memberOf sinaadToolkit
         */
        function Deferred() {
            this._state = 'pending'; //当前promise状态
            this._args = null;       //传递参数
            this._resolves = [];     //成功回调集合
            this._rejects = [];      //失败回调集合
        }
        
        Deferred.prototype = /** @lends Deferred.prototype */{
            /**
             * @method
             */
            resolve : function () {
                if (this._state !== "pending") {
                    return;
                }

                this._state = 'resolved';
                this._args = [].slice.call(arguments);

                _flush(this);
            },
            reject : function () {
                if (this._state !== 'pending') {
                    return;
                }
                this._state = 'rejected';
                this._args = [].slice.call(arguments);

                _flush(this);
            },
            then : function (resolve, reject) {
                var deferred = new Deferred();
                
                this._resolves.push(_pipe(this, deferred, resolve, 'resolve'));
                this._rejects.push(_pipe(this, deferred, reject, 'reject'));

                _flush(this);

                return deferred;
            },
            done : function (callback) {
                return this.then(callback);
            },
            fail : function (callback) {
                return this.then(null, callback);
            }
        };

        Deferred.isPromise = function (value) {
            return value && typeof value.then === 'function';
        };

        return Deferred;

    })(sinaadToolkit);


    sinaadToolkit.throttle = sinaadToolkit.throttle || /** 
         * @memberOf sinaadToolkit
         * @method throttle
         * @description  频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
         * @param fn {function}  需要调用的函数
         * @param delay  {number}    延迟时间，单位毫秒
         * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
         * @return {function}    实际调用函数
         */
        function (fn, delay, immediate, debounce) {
        var curr = +new Date(),//当前时间
            last_call = 0,
            last_exec = 0,
            timer = null,
            diff, //时间差
            context,//上下文
            args,
            exec = function () {
                last_exec = curr;
                fn.apply(context, args);
            };
        return function () {
            curr = +new Date();
            context = this,
            args = arguments,
            diff = curr - (debounce ? last_call : last_exec) - delay;
            clearTimeout(timer);
     
            if (debounce) {
                if (immediate) {
                    timer = setTimeout(exec, delay);
                } else if (diff >= 0) {
                    exec();
                }
            } else {
                if (diff >= 0) {
                    exec();
                } else if (immediate) {
                    timer = setTimeout(exec, -diff);
                }
            }
     
            last_call = curr;
        };
    };
     
    sinaadToolkit.debounce = sinaadToolkit.debounce || /**
     * @method  debounce
     * @description 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
     * @memberOf sinaadToolkit
     * @param fn {function}  要调用的函数
     * @param delay   {number}    空闲时间
     * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
     * @return {function}    实际调用函数
     */
    function (fn, delay, immediate) {
        return sinaadToolkit.throttle(fn, delay, immediate, true);
    };

    /**
     * @namespace sinaadToolkit.sio
     */
    sinaadToolkit.sio = sinaadToolkit.sio || (function () {
        /**
         * @private
         * @param  {HTMLScriptElement} scr     script节点
         * @param  {String} url     资源地址
         * @param  {String} charset 字符集
         */
        function _createScriptTag(scr, url, charset) {
            scr.setAttribute('type', 'text/javascript');
            charset && scr.setAttribute('charset', charset);
            scr.setAttribute('src', url);
            document.getElementsByTagName('head')[0].appendChild(scr);
        }
        /**
         * @private
         * @param  {HTMLScriptElement} scr script节点
         */
        function _removeScriptTag(scr) {
            if (scr && scr.parentNode) {
                scr.parentNode.removeChild(scr);
            }
            scr = null;
        }
        return /** @lends sinaadToolkit.sio */{
            IMG_1_1 : 'http://d00.sina.com.cn/a.gif',
            /**
             * 加载js模块
             * @param  {String} url          资源地址
             * @param  {Function} opt_callback 成功后回调方法
             * @param  {Object} opt_options  选项
             */
            loadScript : function (url, optCallback, optOptions) {
                var scr = document.createElement("SCRIPT"),
                    scriptLoaded = 0,
                    options = optOptions || {},
                    charset = options.charset || 'utf-8',
                    callback = optCallback || function () {},
                    timeOut = options.timeout || 0,
                    timer;
                
                // IE和opera支持onreadystatechange
                // safari、chrome、opera支持onload
                scr.onload = scr.onreadystatechange = function () {
                    // 避免opera下的多次调用
                    if (scriptLoaded) {
                        return;
                    }
                    
                    var readyState = scr.readyState;
                    if ('undefined' === typeof readyState ||
                         readyState === "loaded" ||
                         readyState === "complete") {
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

                if (timeOut) {
                    timer = setTimeout(function () {
                        scr.onload = scr.onreadystatechange = null;
                        _removeScriptTag(scr);
                        options.onfailure && options.onfailure();
                    }, timeOut);
                }
                
                _createScriptTag(scr, url, charset);
            },
            /**
             * jsonp方式回调
             * @param  {String}   url         资源地址
             * @param  {Function} callback    回调方法
             * @param  {Object}   opt_options 选项
             */
            jsonp : function (url, callback, optOptions) {
                var scr = document.createElement('SCRIPT'),
                    prefix = '_sinaads_cbs_',
                    callbackName,
                    // callbackImpl,
                    options = optOptions || {},
                    charset = options.charset || 'utf-8',
                    queryField = options.queryField || 'callback',
                    timeOut = options.timeout || 0,
                    timer,
                    reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
                    matches;

                function getCallBack(onTimeOut) {
                     
                    return function () {
                        try {
                            if (onTimeOut) {
                                options.onfailure && options.onfailure();
                            } else {
                                callback.apply(window, arguments);
                                clearTimeout(timer);
                            }
                            window[callbackName] = null;
                            delete window[callbackName];
                        } catch (e) {
                            // ignore the exception
                        } finally {
                            _removeScriptTag(scr);
                        }
                    };
                }
         
                if (sinaadToolkit.isFunction(callback)) {
                    callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
                    window[callbackName] = getCallBack(0);
                } else if (sinaadToolkit.isString(callback)) {
                    // 如果callback是一个字符串的话，就需要保证url是唯一的，不要去改变它
                    // TODO 当调用了callback之后，无法删除动态创建的script标签
                    callbackName = callback;
                } else {
                    if ((matches = reg.exec(url))) {
                        callbackName = matches[2];
                    }
                }
         
                if (timeOut) {
                    timer = setTimeout(getCallBack(1), timeOut);
                }
         
                //如果用户在URL中已有callback，用参数传入的callback替换之
                url = url.replace(reg, '\x241' + queryField + '=' + callbackName);
                 
                if (url.search(reg) < 0) {
                    url += (url.indexOf('?') < 0 ? '?' : '&') + queryField + '=' + callbackName;
                }
                _createScriptTag(scr, url, charset);
            },
            /**
             * 日志方法
             * @param  {String} url 发送日志地址
             */
            log : function (url, useCache) {
                var img = new Image(),
                    key = '_sinaads_sio_log_' + sinaadToolkit.rnd();

                window[key] = img;
             
                img.onload = img.onerror = img.onabort = function () {
                    img.onload = img.onerror = img.onabort = null;
             
                    window[key] = null;
                    img = null;
                };
         
                img.src = url + (useCache ? '' : (url.indexOf('?') > 0 ? '&' : '?') + key);
            }
        };
    })();


    /**
     * @namespace sinaadToolkit.swf
     */
    sinaadToolkit.swf = sinaadToolkit.swf || /** @lends sinaadToolkit.swf */{
        uid : 0,
        /**
         * 获取当前flash对象
         * @param  {String} name    要获取的flash的id或name
         * @param  {Object} context 从哪个上下文对象中获取这个flash对象，默认从当前上下文
         * @return {Object}         得到的flash对象
         */
        getMovie : function (name, context) {
            context = context || window;
            //ie9下, Object标签和embed标签嵌套的方式生成flash时,
            //会导致document[name]多返回一个Object元素,而起作用的只有embed标签
            var movie = context.document[name],
                ret;
            return sinaadToolkit.browser.ie === 9 ?
                movie && movie.length ?
                    (ret = sinaadToolkit.array.remove(sinaadToolkit.toArray(movie), function (item) {
                        return item.tagName.toLowerCase() !== "embed";
                    })).length === 1 ? ret[0] : ret
                    : movie
                : movie || context[name];
        },
        /**
         * 创建flash的html
         * @param  {Object} options 选项
         * @return {String}         flash的html
         * http://www.w3help.org/zh-cn/causes/HO8001  修改成仅用embed标签渲染flash
         */
        createHTML : function (options) {
            options = options || {};
            var item,
                k,
                tmpOpt = {},
                encodeHTML = sinaadToolkit.string.encodeHTML;
            
            // 复制options，避免修改原对象
            for (k in options) {
                tmpOpt[k] = options[k];
            }
            options = tmpOpt;
            
            var vars = options.vars;
            
            // 初始化flashvars参数的值
            if ('string' === typeof vars) {
                options.flashvars = vars;
            } else {
                var fvars = [];
                for (k in vars) {
                    item = vars[k];
                    fvars.push(k + "=" + encodeURIComponent(item));
                }
                options.flashvars = fvars.join('&');
            }
            
            var str = ['<embed'];
            // 使用embed时，flash地址的属性名是src，并且要指定embed的type和pluginspage属性
            options.name = options.id || 'sinaadtk_swf_uid_' + (sinaadToolkit.swf.uid++);
            options.align = options.align || 'middle';
            options.src  = options.url || '';
            options.type = 'application/x-shockwave-flash';
            options.pluginspage = 'http://www.macromedia.com/go/getflashplayer';

            delete options.id;
            delete options.url;
            delete options.vars;
            
            
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
            str.push('/>');
            
            return str.join('');
        }
    };



    /**
     * @namespace sinaadToolkit.iframe
     */
    sinaadToolkit.iframe = sinaadToolkit.iframe || /** @lends sinaadToolkit.iframe */{
        uid : 0,
        /**
         * 往一个对象中填充iframe的初始属性，返回一个用于生成iframe的对象
         * @param  {Object} config   需要填充的对象
         * @param  {Number} width    iframe宽
         * @param  {Number} height   iframe高
         * @param  {Boolean} useQuote 属性前后是否用引号包裹
         * @return {Object}          填充完初始属性，用于生成iframe的对象
         */
        init : function (config, width, height, useQuote) {
            var quote = useQuote ? '"' : "", //是否使用引号将属性包裹
                zero = quote + "0" + quote;
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
        /**
         * 使用iframe配置对象生成iframe的html
         * @param  {Object} config iframe配置属性对象
         * @return {String}        生成iframe的html
         */
        createHTML : function (config) {
            var html = [];

            //将iframe的name设置成跟id一样，如果没有的配置name的话
            config.name = config.name || config.id || ('sinaadtk_iframe_uid_' + sinaadToolkit.iframe.uid++);

            sinaadToolkit.object.map(config, function (value, key) {
                html.push(" " + key + '="' + (null === value ? "" : value) + '"');
            });
            return "<iframe" + html.join("") + "></iframe>";
        },
        /**
         * 往iframe中填充内容
         * @param  {HTMLIframeElement} iframe  iframe节点
         * @param  {String} content 要填充的内容
         */
        fill : function (iframe, content) {
            var doc,
                ie = sinaadToolkit.browser.ie;
            //ie
            if (ie) {
                //是否可以获取到iframe的document
                try {
                    doc = !!iframe.contentWindow.document;
                } catch (e) {
                    doc = false;
                }
                if (doc) {
                    try {
                        //ie > 6
                        if (ie > 6) {
                            // var k;
                            // i: {
                            //     //ie 7 - 10
                            //     if (ie > 7 && ie <= 10) {
                            //         for (var i = 0; i < content.length; ++i) {
                            //             if (127 < content.charCodeAt(i)) {
                            //                 k = true;
                            //                 break i;
                            //             }
                            //         }
                            //     }
                            //     k = false;
                            // }
                            // if (k) {
                            //     var content = unescape(encodeURIComponent(content));
                            //     var mid = Math.floor(content.length / 2);
                            //     k = [];
                            //     for (var i = 0; i < mid; ++i) {
                            //         k[i] = String.fromCharCode(256 * content.charCodeAt(2 * i + 1) + content.charCodeAt(2 * i));
                            //     }
                            //     1 == content.length % 2 && (k[mid] = content.charAt(content.length - 1));
                            //     content = k.join("");
                            // }
                            window.frames[iframe.name].contents = content;
                            iframe.src = 'javascript:window["contents"]';
                        // ie <= 6
                        } else {
                            window.frames[iframe.name].contents = content;
                            iframe.src = 'javascript:document.write(window["contents"]);/* document.close(); */';
                        }
                    } catch (e) {
                        sinaadToolkit.error("sinaadToolkit.iframe.fill: cannot fill iframe content in ie, ", e);
                    }
                } else {
                    /**
                     * ie下，且iframe.contentWindow.document无法取到，跨域
                     * 比如宿主页面设置了document.domain, 而iframe没有设置
                     * 在iframe中设置document.domain  
                     */
                    try {
                        var key = "sinaads-ad-iframecontent-" + sinaadToolkit.rnd();
                        window[key] = content;
                        content = 'var adContent = window.parent["' + key + '"];window.parent["' + key + '"] = null;document.write(adContent);';
                        content = sinaadToolkit.browser.ie && sinaadToolkit.browser.ie <= 6 ?
                             "window.onload = function() {" +
                                "document.write(\\'<sc\\' + \\'ript type=\"text/javascript\">document.domain = \"" + document.domain + '";' + content + "<\\/scr\\' + \\'ipt>\\');" +
                                "document.close();" +
                            "};" :
                            'document.domain = "' + document.domain + '";' +
                            content +
                            "document.close();";

                        iframe.src = 'javascript:\'<script type="text/javascript">' + content + "\x3c/script>'";
                    } catch (e) {
                        window[key] = null;
                        sinaadToolkit.error("sinaadToolkit.iframe.fill:Cannot fill iframe in IE by modifying the document.domain. ", e);
                    }
                }
            //标准浏览器，标准方法
            } else {
                try {
                    doc = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument,
                    sinaadToolkit.browser.firefox &&
                    doc.open("text/html", "replace");
                    doc.write(content);
                    doc.close();
                } catch (e) {
                    sinaadToolkit.error("sinaadToolkit.iframe.fill:Cannot fill iframe by regular method. ", e);
                }
            }
        }
    };


    /**
     * @namespace sinaadToolkit.monitor
     */
    sinaadToolkit.monitor = sinaadToolkit.monitor || /** @lends sinaadToolkit.monitor */{

        /**
         * 将监控url中的__xxx__变量名替换成正确的值，值从对象data中获取
         * @param  {String} monitorUrl 监控url
         * @param  {Object} data       用于替换的值对象
         * @return {String}            返回替换后的url
         */
        parseTpl : (function () {
            var reg = /\{__([a-zA-Z0-9]+(_*[a-zA-Z0-9])*)__\}/g;

            return function (monitorUrl, data) {
                //增加timestamp参数替换
                data.timestamp = data.timestamp || sinaadToolkit.now();
                if (!monitorUrl) {
                    return '';
                }
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
        /**
         * 创建曝光监测, 返回创建曝光的iframe的html片段
         * @param  {Array:String} pvs 曝光监控的url数组
         * @return {String}     返回创建曝光的iframe的html片段
         */
        createImpressMonitor : function (pvs) {
            var html = [];

            sinaadToolkit.array.each(pvs, function (pv) {
                var config = {};
                sinaadToolkit.iframe.init(config, 1, 1, false);
                config.src = pv;
                config.style = 'display:none;';
                html.push(sinaadToolkit.iframe.createHTML(config));
            });
            return html.join('');
        },
        /**
         * 创建二跳跟踪监测
         * @param  {String} link    落地页
         * @param  {Array:String} monitor 监测地址
         * @return {String}         二跳监测地址
         */
        createTrackingMonitor : function (link, monitor) {
            //如果没有link，就不生成二跳监测
            if (!link) {
                return '';
            }

            var clickTAG = sinaadToolkit.url.ensureURL(link);

            sinaadToolkit.array.each(monitor, function (url) {
                url = sinaadToolkit.url.ensureURL(url);
                
                if (url) {
                    clickTAG = url + encodeURIComponent(clickTAG);
                }
            });

            return clickTAG;
        }
    };

    /**
     * @namespace sinaadToolkit.ad
     */
    sinaadToolkit.ad = sinaadToolkit.ad || /** @lends sinaadToolkit.ad */{
        /**
         * 通过src地址获取资源类型
         * @param  {String} src 资源地址
         * @return {String}     类型
         */
        getTypeBySrc : function (src, defaultType) {
            var type = defaultType;
            if (!type) {
                type = src.substring(src.length - 3).toLowerCase();
                switch (type) {
                    case 'swf':
                        type = 'flash';
                        break;
                    case 'tml':
                        type = 'url';
                        break;
                    case '.js' :
                        type = 'js';
                        break;
                    case 'png':
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                        type = 'image';
                        break;
                    default:
                        type = 'html';
                        break;
                }
            }

            if (type === 'url' && src.indexOf('adbox.sina.com.cn/ad/') >= 0) {
                type = 'adbox';
            }
            return type;
        },
        /**
         * 创建广告展现html
         * @param  {String} type    广告类型，如图片等
         * @param  {String} src     广告资源地址
         * @param  {Number} width   广告宽
         * @param  {Number} height  广告高
         * @param  {String} link    广告资源落地页地址
         * @param  {Array:String} monitor 广告点击监测的url数组
         * @param  {String} tpl     模版
         * @param  {Object} opt_options 额外参数
         *         @param {Boolean} wmode 是否透明
         * @return {String}         广告展现html
         */
        createHTML : function (type, src, width, height, link, monitor, tpl, opt_options) {
            var html = [],
                _html = '',
                config,
                tmpData = {},
                len = 0,
                i = 0;

            opt_options = opt_options || {};

            src = sinaadToolkit.array.ensureArray(src),
            type = sinaadToolkit.array.ensureArray(type),
            link = sinaadToolkit.array.ensureArray(link),
            monitor = sinaadToolkit.array.ensureArray(monitor);

            width += sinaadToolkit.isNumber(width) ? 'px' : '',
            height += sinaadToolkit.isNumber(height) ? 'px' : '';


            /**
             * 把所有的属性拉平，方便模板处理
             * src0, src1, src2 ... srcn
             * type0, type1, type2 ... typen
             * link0, link1, link2 ... linkn
             * monitor0, monitor1, monitor2 ... monitorn
             */
            sinaadToolkit.array.each(src, function (_src, i) {
                tmpData['src' + i] = _src;
                tmpData['type' + i] = type[i] || sinaadToolkit.ad.getTypeBySrc(_src, type[i]);
                tmpData['link' + i] = link[i];
                tmpData['monitor' + i] = '';
                tmpData['monitor1_1_' + i] = sinaadToolkit.monitor.createTrackingMonitor(sinaadToolkit.sio.IMG_1_1, monitor);
                tmpData['monitor1_1_' + i] = tmpData['monitor1_1_' + i] === sinaadToolkit.sio.IMG_1_1 ? '' : tmpData['monitor1_1_' + i];
            });
            tmpData.width = width;
            tmpData.height = height;
            tmpData.src = tmpData.src0 || '';
            tmpData.type = tmpData.type0 || '';
            tmpData.link = tmpData.link0 || '';
            tmpData.monitor = tmpData.monitor0 || '';
            tmpData.monitor1_1 = tmpData.monitor1_1_0 || '';


            //如果提供了模版，则使用模版来渲染广告
            //模版中可以含有参数type, src, width, height, monitor, link
            //现在主要用在智投文字链和图文方式
            if (tpl && 'string' === typeof tpl) {
                return sinaadToolkit.string.format(tpl, tmpData);
            }


            len = src.length;
            len = 1; //暂时先支持一个元素

            for (; i < len; i++) {
                //如果没有自定模版
                src = tmpData['src' + i];
                type = tmpData['type' + i];
                link = tmpData['link' + i];
                monitor = monitor.join('|');

                switch (type) {
                    case 'image' :
                        _html = '<img border="0" src="' + sinaadToolkit.url.ensureURL(src) + '" style="width:' + width + ';height:' + height + ';border:0" alt="' + src + '"/>';
                        //onclick与跳转同时发送会导致丢失移动端的监测
                        _html = link ? '<a href="' + link + '" target="_blank">' + _html + '</a>' : _html;
                        break;
                    case 'text' :
                        _html = link ? '<a href="' + link + '" target="_blank">' + src + '</a>' : src;
                        break;
                    case 'flash' :
                        var vars = {};
                        link && (vars.clickTAG = link);
                        _html = sinaadToolkit.swf.createHTML({
                            url : sinaadToolkit.url.ensureURL(src),
                            width : width,
                            height : height,
                            wmode : opt_options.wmode || 'opaque',
                            vars : vars,
                            id : opt_options.id || ''
                        });
                        if (link) {
                            _html = [
                                '<div style="width:' + width + ';height:' + height + ';position:relative;overflow:hidden;">',
                                    _html,
                                    '<a style="position:absolute;background:#fff;opacity:0;filter:alpha(opacity=0);width:' + width + ';height:' + height + ';left:0;top:0" href="' + link + '" target="_blank"></a>',
                                '</div>'
                            ].join('');
                        }
                        break;
                    case 'adbox' :
                    case 'url' :
                        config = {};
                        sinaadToolkit.iframe.init(config, width, height, false);
                        config.src = sinaadToolkit.url.ensureURL(src);
                        monitor && (config.name = 'clickTAG=' + encodeURIComponent(monitor));
                        _html = sinaadToolkit.iframe.createHTML(config);
                        break;
                    case 'js' :
                        _html = [
                            '<', 'script charset="utf-8" src="', sinaadToolkit.url.ensureURL(src), '"></', 'script>'
                            ].join('');
                        break;
                    default :
                        _html = src.replace(/\\x3c/g, '<').replace(/\\x3e/g, '>');
                        break;
                }
                html.push(_html);
            }
            return html.join(' ');
        }
    };



    /**
     * @namespace sinaadToolkit.sandbox
     */
    sinaadToolkit.sandbox = sinaadToolkit.sandbox || (function () {
        /**
         * 沙箱uid
         * @private
         * @type {Number}
         */
        var uid = 0;
        /**
         * 将对象转换成字符串形式表示
         * @private
         */
        function _stringify(value, arr) {
            var comma = "",
                i;

            switch (typeof value) {
                case "string":
                    arr.push(sinaadToolkit.string.formalString(value));
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
                    if (null === value) {
                        arr.push("null");
                        break;
                    }
                    //is Array
                    if (value instanceof Array) {
                        var len = value.length;

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
                    var v;
                    comma = "";
                    for (var key in value) {
                        if (value.hasOwnProperty(key)) {
                            v = value[key];
                            if ("function" !== typeof v) {
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
         * @private
         */
        function _objToJsVarCode(obj) {
            var code = [];

            sinaadToolkit.object.map(obj, function (value, key) {
                if (null !== value) {
                    var tmp = [];
                    try {
                        _stringify(value, tmp);
                        tmp = tmp.join("");
                    } catch (e) {}
                    tmp && code.push(key, "=", tmp, ";");
                }
            });

            return code.join("");
        }

        return /** @lends sinaadToolkit.sandbox */{
            /**
             * 创建一个广告展现沙箱
             * @param  {HTMLNodeElement} container 沙箱所在容器
             * @param  {Number} width     沙箱宽
             * @param  {Number} height    沙箱高
             * @param  {String} content   沙箱内容
             * @param  {Object} context   沙箱中传入的外部属性值
             */
            create : function (container, width, height, content, context) {
                var sandboxId =  'sinaadtk_sandbox_id_' + uid++;

                context = context || {};

                context.sinaadToolkitSandboxId = sandboxId; //增加sandboxId到全局变量中，方便内部获取iframe节点

                width += sinaadToolkit.isNumber(width) ? 'px' : '';
                height += sinaadToolkit.isNumber(height) ? 'px' : '';

                var iframeConfig = {};
                sinaadToolkit.iframe.init(iframeConfig, width, height, 0);
                iframeConfig.src = 'javascript:\'<html><body style=background:transparent;></body></html>\'';
                iframeConfig.id = sandboxId;
                iframeConfig.style = 'float:left;';

                container.innerHTML = sinaadToolkit.iframe.createHTML(iframeConfig);

                //context转成js代码描述，用于注入到iframe中
                context = _objToJsVarCode(context);

                //构造iframe实体
                sinaadToolkit.iframe.fill(document.getElementById(sandboxId), [
                    '<!doctype html><html><body style="background:transparent">',
                        '<', 'script>', context, '</', 'script>',
                        content,
                    '</body></html>'
                ].join(""));
            }
        };
    })();



    /**
     * @name Box
     * @class 跟随容器，创建一个可以指定展现位置的跟随容器盒
     * @constructor
     */
    function Box(config) {
        this.uid = config.uid || ('sinaadToolkitBox' + Box.uid++);
        this.width = config.width || 0;
        this.height = config.height || 'auto';
        this.position = config.position || "center center";
        // this.smartPosition = {my : '', at : '', of : ''}; //同jq的position
        this.follow = config.follow || 0;
        this.zIndex = config.zIndex || 99999;
        this.minViewportWidth = config.minViewportWidth || 0;  //容器最小宽度

        this.positionStyle = this.follow ? (sinaadToolkit.browser.isSupportFixed ? 'fixed' : 'absolute') : 'absolute';

        var element = document.createElement('div');
        element.id = this.uid;
        config.className && (element.className = config.className);
        element.style.cssText += 'position:' + this.positionStyle + ';width:' + this.width + 'px;height:' + this.height + 'px;z-index:' + this.zIndex + ';display:' + (config.autoShow ? 'block' : 'none');
        document.body.insertBefore(element, document.body.firstChild);

        this.setPosition();
        this.resetPositionHandler = this.getResetPositionHandler();
        sinaadToolkit.event.on(window, 'resize', this.resetPositionHandler);
        if (this.follow && !sinaadToolkit.browser.isSupportFixed) {
            sinaadToolkit.event.on(window, 'scroll', this.resetPositionHandler);
        }
    }
    Box.uid = 0;

    Box.prototype = /** @lends Box.prototype */{
        getMain : function () {
            return document.getElementById(this.uid);
        },
        getResetPositionHandler : function () {
            var THIS = this;
            return function () {
                THIS.setPosition();
            };
        },
        /**
         * 设置盒子的位置
         */
        setPosition : function () {
            var element = this.getMain(),
                position = this.position.split(' '),
                viewWidth = sinaadToolkit.page.getViewWidth(),
                viewHeight = sinaadToolkit.page.getViewHeight(),
                offsetTop = 0,
                offsetLeft = 0,
                hOffset = Math.min(this.minViewportWidth ? (viewWidth / 2 - this.minViewportWidth / 2) : 0, 0);

            if (this.follow) {
                offsetTop = sinaadToolkit.browser.isSupportFixed ? 0 : sinaadToolkit.page.getScrollTop() || 0;
                offsetLeft = sinaadToolkit.browser.isSupportFixed ? 0 : sinaadToolkit.page.getScrollLeft() || 0;
            }

            switch (position[0]) {
                case 'center' :
                    element.style.left = offsetLeft + (viewWidth - this.width) / 2 + offsetLeft + 'px';
                    break;
                case 'left' :
                    element.style.left = offsetLeft + hOffset + 'px';
                    break;
                case 'right' :
                    if (this.follow) {
                        element.style.left = offsetLeft + (viewWidth - this.width) - hOffset + 'px';
                    } else {
                        element.style.right = hOffset + 'px';
                    }
                    break;
                default :
                    element.style.left = offsetLeft + (parseInt(position[0], 10) || 0) + 'px';
                    break;
            }
            switch (position[1]) {
                case 'center' :
                    element.style.top = (viewHeight - this.height) / 2 + offsetTop + 'px';
                    break;
                case 'top' :
                    element.style.top = offsetTop + 'px';
                    break;
                case 'bottom' :
                    if (this.follow) {
                        element.style.top = offsetTop + (viewHeight - this.height) + 'px';
                    } else {
                        element.style.bottom = '0px';
                    }
                    break;
                default :
                    element.style.top = offsetTop + (parseInt(position[1], 10) || 0) + 'px';
                    break;
            }
        },
        /**
         * 显示盒子
         */
        show : function () {
            this.getMain().style.display = 'block';
        },
        /**
         * 隐藏盒子
         */
        hide : function () {
            this.getMain().style.display = 'none';
        },
        remove : function () {
            var element = this.getMain();
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
            element = null;
            sinaadToolkit.event.un(window, 'scroll', this.resetPositionHandler);
            sinaadToolkit.event.un(window, 'resize', this.resetPositionHandler);
        }
    };
    sinaadToolkit.Box = sinaadToolkit.Box || Box;

    /**
     * @todo 简单动画方法
     */

})(window);
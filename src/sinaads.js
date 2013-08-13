/*!
 * sinaadToolkit
 * @description 新浪广告工具包，提供了浏览器判断，渲染，cookie, storage, iframe, 转义等基础操作
 * @author  acelan <xiaobin8[at]staff.sina.com.cn>
 * @version  1.0.0
 */
(function (window, undefined) {

    var sinaadToolkit = window.sinaadToolkit || {
        /**
         * 工具包版本号
         * @type {String}
         * @const
         */
        VERSION : '1.0.0',
        /**
         * 工具包资源地址
         * @static
         * @const
         */
        TOOLKIT_URL : './src/sinaadToolkit.js',
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
         * @return {String} 生成一个随机的36进制字符串（包含0-9a-zA-Z）
         * @static
         */
        rnd : function () {
            return Math.floor(Math.random() * 2147483648).toString(36);
        },
        /**
         * 判断是否是函数
         * @param  {Any}        source      需要判断的对象
         * @return {Boolean}                是否是函数
         * @staitc
         */
        isFunction : function (source) {
            return '[object Function]' == Object.prototype.toString.call(source);
        },
        /**
         * 判断是否是字符串
         * @param  {Any} source 要判断的对象
         * @return {Boolean}        是否字符串
         * @static
         */
        isString : function (source) {
           return '[object String]' == Object.prototype.toString.call(source);
        }
    };

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
             */
            android : /(Android)\s+([\d.]+)/i.test(ua),
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
            chrome : /chrome\/(\d+\.\d+)/i.test(ua) ? + RegExp['\x241'] : undefined,
            /**
             * 如果是firefox浏览器，返回浏览器当前版本号
             * @type {Number}
             */
            firefox : /firefox\/(\d+\.\d+)/i.test(ua) ? + RegExp['\x241'] : undefined,
            /**
             * 如果是ie返回ie当前版本号
             * @type {Number}
             */
            ie : /msie (\d+\.\d+)/i.test(ua) ? (document.documentMode || + RegExp['\x241']) : undefined,
            /**
             * @type {Boolean}
             */
            isGecko : /gecko/i.test(ua) && !/like gecko/i.test(ua),
            /**
             * @type {Boolean}
             */
            isStrict : document.compatMode == "CSS1Compat",
            /**
             * @type {Boolean}
             */
            isWebkit : /webkit/i.test(ua),
            /**
             * 如果是opera,返回opera当前版本号
             * @type {Number}
             */
            opera : /opera(\/| )(\d+(\.\d+)?)(.+?(version\/(\d+(\.\d+)?)))?/i.test(ua) ?  + ( RegExp["\x246"] || RegExp["\x242"] ) : undefined
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
            if (/(\d+\.\d+)/.test(external.max_version)) {
                /**
                 * 如果是遨游浏览器，返回遨游版本号
                 * @type {Number}
                 */
                browser.maxthon = + RegExp['\x241'];
            }
        } catch (e) {}

        /**
         * 如果是safari浏览器，返回safari版本号
         * @type {Number}
         */
        browser.safari = /(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(ua) && !/chrome/i.test(ua) ? + (RegExp['\x241'] || RegExp['\x242']) : undefined;
        /**
         * 是否支持position:fixed属性
         * @type {Boolean}
         */
        browser.isSupportFixed = !browser.ie || browser.ie >=7;

        return browser;

    })(navigator.userAgent);


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
                            .replace(/&/g,'&amp;')
                            .replace(/</g,'&lt;')
                            .replace(/>/g,'&gt;')
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
             * @params {Sting} source 要转义的字符串
             * @return {String} 转义后的字符串
             */
            formalString : function (source) {
                var ret = [];
                ret.push(source.replace(STR_REG, function(str) {
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
                    return ESCAPE_MAP[str] = unicodePerfix + alphaCode.toString(16);
                }));
                return '"' + ret.join('') + '"';
            }
        };
    })();



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
        /**
         * 获取cookie中key的值
         * @param  {String} key 要获取的key
         * @return {String}     cookie值
         */
        get : function (key) {
            var value = sinaadToolkit.cookie._getRaw(key);
            if ('string' == typeof value) {
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
        /**
         * userData相关方法
         */
        var userData = {
            userData : null,
            name : location.hostname,
            init : function () {
                if (!userData.userData) {
                    try {
                        userData.userData = document.createElement('INPUT');
                        userData.userData.type = "hidden";
                        userData.userData.style.display = "none";
                        userData.userData.addBehavior ("#default#userData");
                        document.body.appendChild(userData.userData);
                        var expires = new Date();
                        expires.setDate(expires.getDate() + 365);
                        userData.userData.expires = expires.toUTCString();
                    } catch (e) {
                        return false;
                    }
                }
                return true;
            },
            setItem : function (key, value, expires) {
                if (userData.init()) {
                    userData.userData.load(userData.name);
                    userData.userData.setAttribute(key, value);
                    userData.userData.save(userData.name);
                }
            },
            getItem : function (key) {
                if (userData.init()) {
                    userData.userData.load(userData.name);
                    return userData.userData.getAttribute(key);
                }
            },
            removeItem : function (key) {
                if (userData.init()) {
                    userData.userData.load(userData.name);
                    userData.userData.removeAttribute(key);
                    userData.userData.save(userData.name);
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
        var storage = sinaadToolkit.browser.ie && sinaadToolkit.browser.ie < 8 ? userData : window.localStorage ? ls : cookie;
        
        return /** @lends sinaadToolkit.storage */{
            /**
             * 获取本地存储的key的值
             * @param  {String} key key
             * @return {String}     取得的值
             */
            get : function (key) {
                var value = storage.getItem(key);
                if (value) {
                    value = value.split(';');
                    //有过期时间
                    if (value[1] && sinaadToolkit.now() > parseInt(value[1].split('=')[1], 10)) {
                        storage.removeItem(key);
                        return null;
                    } else {
                        return value[0];
                    }
                }
                return null;
            },
            /**
             * 设置本地存储key的值为value
             * 注意：请不要设置非字符串格式形式的值到本地存储
             * @param  {String} key     设置的key
             * @param  {String} value   设置的value
             * @param  {Number} expires 过期时间毫秒数
             */
            set : function (key, value, expires) {
                storage.setItem(key, value, expires);
            },
            /**
             * 移除本地存储中key的值
             * @param  {String} key 要移除的key
             */
            remove : function (key) {
                storage.removeItem(key);
            }
        };
    })();



    /**
     * @namespace sinaadToolkit.url
     */
    sinaadToolkit.url = sinaadToolkit.url || /** @lends sinaadToolkit.url */{
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
            return top || ((window.top === window.self) ?  window.location.href : window.document.referrer);
        })()
    };



    /**
     * @namespace sinaadToolkit.dom
     */
    sinaadToolkit.dom = sinaadToolkit.dom || /** @lends sinaadToolkit.dom */{
        /**
         * 获取某个dom节点所属的document
         * @param  {HTMLNodeElement} element 节点
         * @return {DocumentElement}         所属的document节点
         */
        getDocument : function (element) {
            return element.nodeType == 9 ? element : element.ownerDocument || element.document;
        },
        /**
         * 获取某个dom节点的某个计算后样式
         * @param  {HTMLNodeElement} element 节点
         * @param  {String} key     样式名
         * @return {String}         样式值
         */
        getComputedStyle : function(element, key){
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
        getCurrentStyle : function(element, key){
            return element.style[key] || (element.currentStyle ? element.currentStyle[key] : "") || sinaadToolkit.dom.getComputedStyle(element, key);
        }
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
                client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
            return client.clientHeight;
        },
        /**
         * 获取页面宽度
         * @return {Number} 页面宽度
         */
        getViewWidth : function () {
            var doc = document,
                client = doc.compatMode == 'BackCompat' ? doc.body : doc.documentElement;
            return client.clientWidth;
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
            } else {
                dom.addEventListener(type, callback, false);
            }
        }
    };


    /**
     * @namespace sinaadToolkit.Defered
     */
    sinaadToolkit.Deferred = sinaadToolkit.Deferred || (function (core) {
        function _pipe(original, deferred, callback, actionType) {
            return function () {
                if (typeof callback === 'function') {
                    try {
                        var returnValue = 
                            callback.apply(original, arguments);

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
                    catch (error) {
                        deferred.reject(error);
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
                core.array.each(callbacks, function (callback, i) {
                    try {
                        callback.apply(deferred, deferred._args);
                    } catch (e) {}
                });
            }, 0);

            deferred._resolves = [];
            deferred._rejects = [];
        }

        function Deferred() {
            this._state = 'pending'; //当前promise状态
            this._args = null;       //传递参数
            this._resolves = [];     //成功回调集合
            this._rejects = [];      //失败回调集合
        }
        
        Deferred.prototype = {
            resolve : function (args) {
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
            if(scr && scr.parentNode){
                scr.parentNode.removeChild(scr);
            }
            scr = null;
        }
        return /** @lends sinaadToolkit.sio */{
            /**
             * 加载js模块
             * @param  {String} url          资源地址
             * @param  {Function} opt_callback 成功后回调方法
             * @param  {Object} opt_options  选项
             */
            loadScript : function (url, opt_callback, opt_options) {
                var scr = document.createElement("SCRIPT"),
                    scriptLoaded = 0,
                    options = opt_options || {},
                    charset = options['charset'] || 'utf-8',
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
            /**
             * jsonp方式回调
             * @param  {String}   url         资源地址
             * @param  {Function} callback    回调方法
             * @param  {Object}   opt_options 选项
             */
            jsonp : function(url, callback, opt_options) {
                var scr = document.createElement('SCRIPT'),
                    prefix = '_sinaads_cbs_',
                    callbackName,
                    callbackImpl,
                    options = opt_options || {},
                    charset = options['charset'] || 'utf-8',
                    queryField = options['queryField'] || 'callback',
                    timeOut = options['timeOut'] || 0,
                    timer,
                    reg = new RegExp('(\\?|&)' + queryField + '=([^&]*)'),
                    matches;
         
                if (sinaadToolkit.isFunction(callback)) {
                    callbackName = prefix + Math.floor(Math.random() * 2147483648).toString(36);
                    window[callbackName] = getCallBack(0);
                } else if(sinaadToolkit.isString(callback)){
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
            /**
             * 日志方法
             * @param  {String} url 发送日志地址
             */
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
         
                img.src = url + (url.indexOf('?') > 0 ? '&' : '?') + key;
            }
        };
    })();


    /**
     * @namespace sinaadToolkit.swf
     */
    sinaadToolkit.swf = sinaadToolkit.swf || /** @lends sinaadToolkit.swf */{
        /**
         * flash版本号
         * @type {Number}
         */
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
            return sinaadToolkit.browser.ie == 9 ?
                movie && movie.length ? 
                    (ret = sinaadToolkit.array.remove(sinaadToolkit.toArray(movie), function(item){
                        return item.tagName.toLowerCase() != "embed";
                    })).length == 1 ? ret[0] : ret
                    : movie
                : movie || context[name];
        },
        /**
         * 创建flash的html
         * @param  {Object} options 选项
         * @return {String}         flash的html
         */
        createHTML : function (options) {
            options = options || {};
            var version = sinaadToolkit.swf.version, 
                needVersion = options['ver'] || '6.0.0', 
                vUnit1, vUnit2, i, k, len, item, tmpOpt = {},
                encodeHTML = sinaadToolkit.string.encodeHTML;
            
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
     * @namespace sinaadToolkit.iframe
     */
    sinaadToolkit.iframe = sinaadToolkit.iframe || /** @lends sinaadToolkit.iframe */{
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
            config.name = config.name || config.id;

            sinaadToolkit.object.map(config, function(value, key) {
                html.push(" " + key + '="' + (null == value ? "" : value) + '"')
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
                    doc = !!iframe.contentWindow.document
                } catch(e) {
                    doc = false;
                }
                if (doc) {
                    try {
                        //ie > 6
                        if (ie > 6) {
                            var k;
                            i: {
                                //ie 7 - 10
                                if (ie > 7 && ie <= 10) {
                                    for (var i = 0; i < content.length; ++i) {
                                        if (127 < content.charCodeAt(i)) {
                                            k = true;
                                            break i;
                                        }
                                    }
                                }
                                k = false;
                            }
                            if (k) {
                                var content = unescape(encodeURIComponent(content));
                                var mid = Math.floor(content.length / 2);
                                k = [];
                                for (var i = 0; i < mid; ++i) {
                                    k[i] = String.fromCharCode(256 * content.charCodeAt(2 * i + 1) + content.charCodeAt(2 * i));
                                }
                                1 == content.length % 2 && (k[mid] = content.charAt(content.length - 1));
                                content = k.join("");
                            }
                            window.frames[iframe.name].contents = content;
                            iframe.src = 'javascript:window["contents"]';
                        // ie < 6
                        } else {
                            window.frames[iframe.name].contents = content;
                            iframe.src = 'javascript:document.write(window["contents"]);/* document.close(); */';
                        }
                    } catch(e) {
                        alert("无法ie的iframe中写入内容: " + e.message);
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
                             "window.onload = function() {"
                                + "document.write(\\'<sc\\' + \\'ript type=\"text/javascript\">document.domain = \"" + document.domain + '";' + content + "<\\/scr\\' + \\'ipt>\\');"
                                + "document.close();"
                            + "};" :
                             'document.domain = "' + document.domain + '";'
                            + content
                            + "document.close();";

                        iframe.src = 'javascript:\'<script type="text/javascript">' + content + "\x3c/script>'";
                    } catch(e) {
                        window[key] = null;
                        alert("无法通过修改document.domain的方式来填充IE下的iframe内容: " + e.message);
                    }
                }
            //标准浏览器，标准方法
            } else {
                try {
                    doc = iframe.contentWindow ? iframe.contentWindow.document : iframe.contentDocument, 
                    sinaadToolkit.browser.firefox 
                    && doc.open("text/html", "replace");
                       doc.write(content);
                       doc.close();
                } catch(e) {
                    alert("无法使用标准方法填充iframe的内容: " + e.message);
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
        /**
         * 创建曝光监测, 返回创建曝光的iframe的html片段
         * @param  {Array:String} pvs 曝光监控的url数组
         * @return {String}     返回创建曝光的iframe的html片段
         */
        createImpressMonitor : function (pvs) {
            var html = [];

            sinaadToolkit.array.each(pvs, function (pv, i) {
                var config = {};
                sinaadToolkit.iframe.init(config, 1, 1, false);
                config.src = pv;
                config.style = 'display:none;';
                html.push(sinaadToolkit.iframe.createHTML(config));
            });
            return html.join('');
        },
        /**
         * 创建点击监测
         * @param  {String} type    需要监测的对象的类型，如图片，链接，flash等
         * @param  {Array:String} monitor 监测url数组
         * @return {String}         返回监测的html片段
         */
        createClickMonitor : function (type, monitor) {
            if (!monitor) {
                return;
            }
            var monitor = 'string' === typeof monitor ? [monitor] : monitor,
                ret = [],
                comma = '';

            sinaadToolkit.array.each(monitor, function(url, i) {
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



    /**
     * @namespace sinaadToolkit.ad
     */
    sinaadToolkit.ad = sinaadToolkit.ad || /** @lends sinaadToolkit.ad */{
        /**
         * 创建广告展现html
         * @param  {String} type    广告类型，如图片等
         * @param  {String} src     广告资源地址
         * @param  {Number} width   广告宽
         * @param  {Number} height  广告高
         * @param  {String} link    广告资源落地页地址
         * @param  {Array:String} monitor 广告点击监测的url数组
         * @return {String}         广告展现html
         */
        createHTML : function (type, src, width, height, link, monitor) {
            var html = '',
                config,
                monitorCode;

            width += String(width).indexOf('%') !== -1 ? '' : 'px';
            height += String(height).indexOf('%') !== -1 ? '' : 'px';

            monitorCode = sinaadToolkit.monitor.createClickMonitor(type, monitor);

            switch (type) {
                case 'js' :
                    html = ['<', 'script src="', src, '"></','script>'].join('');
                    break;
                case 'url' : 
                    config = {};
                    sinaadToolkit.iframe.init(config, width, height, false);
                    config.src = src;
                    html = sinaadToolkit.iframe.createHTML(config);
                    break;
                case 'image' : 
                    html = '<img border="0" src="' + src + '" style="width:' + width + ';height:' + height +';border:0" alt="' + src + '"/>';
                    html = link ? '<a href="' + link + '" target="' + (sinaadToolkit.browser.phone ? '_top' : '_blank') + '"' + (monitorCode ? ' onclick="try{' + monitorCode + '}catch(e){}"' : '') + '>' + html + '</a>' : html;
                    break;
                case 'text' : 
                    html = '<span>' + src + '</span>';
                    break;
                case 'flash' : 
                    html = sinaadToolkit.swf.createHTML({
                        url : src,
                        width : width,
                        height : height,
                        wmode : 'transparent'
                    });
                    if (link) {
                        html = [
                            '<div style="width:' + width + ';height:' + height + ';position:relative;overflow:hidden;">',
                                html,
                                '<a style="position:absolute;background:#fff;opacity:0;filter:alpha(opacity=0);width:' + width + ';height:' + height + ';left:0;top:0" href="' + link + '" target="' + (sinaadToolkit.browser.phone ? '_top' : '_blank') + '"' + (monitorCode ? ' onclick="try{' + monitorCode + '}catch(e){}"' : '') + '></a>',
                            '</div>'
                        ].join('');
                    }
                    break;
                case 'adbox' :
                    config = {};
                    sinaadToolkit.iframe.init(config, width, height, false);
                    config.src = src;
                    monitorCode && (config.name = monitorCode);
                    html = sinaadToolkit.iframe.createHTML(config);
                    break;
                default : 
                    html = src.replace(/\\x3c/g, '<').replace(/\\x3e/g, '>');
                    break;
            }
            return html;
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
         * @private
         */
        function _objToJsVarCode(obj) {
            var code = [];

            sinaadToolkit.object.map(obj, function(value, key) {
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

        return /** @lends sinaadToolkit.sandbox */{
            /**
             * 创建一个广告展现沙箱
             * @param  {HTMLNodeElement} container 沙箱所在容器
             * @param  {Number} width     沙箱宽
             * @param  {Number} height    沙箱搞
             * @param  {String} content   沙箱内容
             * @param  {Object} context   沙箱中传入的外部属性值
             */
            create : function (container, width, height, content, context) {
                var context = context || {},
                    sandboxId =  context.sandboxId || (context.sandboxId = '_sinaads_sandbox_id' + (uid++));

                width += String(width).indexOf('%') !== -1 ? '' : 'px';
                height += String(height).indexOf('%') !== -1 ? '' : 'px';

                var iframeConfig = {};
                sinaadToolkit.iframe.init(iframeConfig, width, height, 0);
                iframeConfig.src = 'javascript:\'<html><body style=background:transparent;></body></html>\'';
                iframeConfig.id = sandboxId;
                iframeConfig.style = 'float:left;';

                container.innerHTML = [
                    '<ins style="margin:0px auto;display:block;overflow:hidden;width:' + width + ';height:' + height + ';">',
                        sinaadToolkit.iframe.createHTML(iframeConfig),
                    '</ind>'
                ].join('');

                container.style.cssText += ';display:block;overflow:hidden;';

                //context转成js代码描述，用于注入到iframe中
                context = _objToJsVarCode(context);

                //构造iframe实体
                sinaadToolkit.iframe.fill(document.getElementById(sandboxId), [
                    '<!doctype html><html><body style="background:transparent">',
                        '<', 'script>', context, '</', 'script>',
                        '<', 'script src="' + sinaadToolkit.TOOLKIT_URL + '" charset="utf-8"></', 'script>',
                        content,
                    '</body></html>'
                ].join(""));
            }
        };
    })();



    /**
     * 跟随容器基类
     */
    function Box(config) {
        var THIS = this;

        this.width = config.width || 0;
        this.height = config.height || 'auto';
        this.position = config.position || "center center";
        this.follow = config.follow || 0;

        this.positionStyle = this.follow ? (sinaadToolkit.browser.isSupportFixed ? 'fixed' : 'absolute') : 'absolute';

        this.element = document.createElement('div');
        this.element.style.position = this.positionStyle;

        this.element.style.cssText += ';width:' + this.width + 'px;height:' + this.height + 'px;z-index:9999;display:' + (config.autoShow ? 'block' : 'none');

        this.setPosition();

        sinaadToolkit.event.on(window, 'resize', function () {
            THIS.setPosition();
        });

        if (this.follow && !sinaadToolkit.browser.isSupportFixed) {
            sinaadToolkit.event.on(window, 'scroll', function () {
                THIS.setPosition();
            });
        }

        document.body.insertBefore(this.element, document.body.firstChild);

    }

    Box.prototype = {
        setPosition : function () {
            var position = this.position.split(' '),
                viewWidth = sinaadToolkit.page.getViewWidth(),
                viewHeight = sinaadToolkit.page.getViewHeight(),
                offsetTop = 0,
                offsetLeft = 0,
                left = 0,
                top = 0;

            if (this.follow) {
                offsetTop = sinaadToolkit.browser.isSupportFixed ? 0 : sinaadToolkit.page.getScrollTop() || 0;
                offsetLeft = sinaadToolkit.browser.isSupportFixed ? 0 : sinaadToolkit.page.getScrollLeft() || 0;
            }

            switch (position[0]) {
                case 'center' :
                    this.element.style.left = (viewWidth - this.width) / 2 + offsetLeft + 'px';
                    break;
                case 'left' :
                    this.element.style.left = offsetLeft + 'px';
                    break;
                case 'right' :
                    if (this.follow) {
                        this.element.style.left = offsetLeft + (viewWidth - this.width) + 'px'; 
                    } else {
                        this.element.style.right = '0px';
                    }
                    break;
                default :
                    this.element.style.left = offsetLeft + (parseInt(position[0], 10) || 0) + 'px';
                    break;
            }
            switch (position[1]) {
                case 'center' :
                    this.element.style.top = (viewHeight - this.height) / 2 + offsetTop + 'px';
                    break;
                case 'top' :
                    this.element.style.top = offsetTop + 'px';
                    break;
                case 'bottom' :
                    if (this.follow) {
                        this.element.style.top = offsetTop + (viewHeight - this.height) + 'px'; 
                    } else {
                        this.element.style.bottom = '0px';
                    }
                    break;
                default :
                    this.element.style.top = offsetTop + (parseInt(position[1], 10) || 0) + 'px';
                    break;
            }
        },
        show : function () {
            this.element.style.display = 'block';
        },
        hide : function () {
            this.element.style.display = 'none';
        }
    };
    sinaadToolkit.Box = sinaadToolkit.Box || Box;

    /**
     * 简单动画方法
     * @todo
     */
    

    /**
     * 计数种子，每次加载获取cookie或者storage中的这个值，如果没有，随机生成1个值
     */
    if (!sinaadToolkit.seed) {
        var KEY = 'sinaadtoolkit_seed_core';
        sinaadToolkit.seed = parseInt(sinaadToolkit.storage.get(KEY), 10) || Math.floor(Math.random() * 100);
        //大于1000就从0开始，防止整数过大
        sinaadToolkit.storage.set(KEY, sinaadToolkit.seed > 1000 ? 0 : ++sinaadToolkit.seed);
    }

    //exports
    window.sinaadToolkit = window.sinaadToolkit || sinaadToolkit;

})(window);











/*!
 * sinaads
 * 新浪统一商业广告脚本
 * 负责使用pdps(新浪广告资源管理码)向广告引擎请求数据并处理广告渲染
 * @author acelan <xiaobin8[at]staff.sina.com.cn>
 * @version 1.0.0
 * @date 2013-08-08
 */
(function (window, core, undefined) {
    var IMPRESS_URL = 'http://123.126.53.109/impress.php';

    var now = core.now(); //加载sinaads的时间


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

    /**
     * 获取广告数据
     * @param  {Array} pdps 广告pdps
     * @return {Deferred}      promise调用对象
     */
    function getData(pdps) {
        var pdps = pdps instanceof Array ? pdps : [pdps],
            deferred = new core.Deferred(),
            params = [
            'adunitid=' + pdps.join(','),
            'rotate_count=' + core.seed,
            'TIMESTAMP=' + core.now().toString(36),
            'referral=' + encodeURIComponent(core.url.top),
            targeting.keywords ? 'tgkw=' + encodeURIComponent(targeting.keywords) : '',
            targeting.template ? 'tgtpl=' + encodeURIComponent(targeting.template) : '',
            targeting.entry ? 'tgentry=' + encodeURIComponent(targeting.entry) : ''
        ];

        core.sio.loadScript(IMPRESS_URL + '?' + params.join('&'), function () {
            deferred.resolve();
        });

        return deferred;
    }


    function _renderWidthEmbedIframe(element, config) {
        var uid = config.uid,
            iframeId = 'sinaads_iframe_' + uid,
            type = config.type,
            width = config.width,
            height = config.height,
            link = config.link,
            monitor = config.monitor,
            src = config.src,
            pdps = config.pdps,
            coupletTop = config.coupletTop || 0;

        //广告内容， 如果没有src，则不渲染
        var adContent = src ? core.ad.createHTML(type, src, width, height, link, monitor) : '';

        //创建广告渲染的沙箱环境，并传递部分广告参数到沙箱中
        core.sandbox.create(element, width, height, config.pv + adContent, {
            sinaads_uid : uid,
            sinaads_async_iframe_id : iframeId,
            sinaads_start_time : now,
            sinaads_span_time : core.now() - now,
            sinaads_ad_pdps : pdps,
            sinaads_ad_width : width,
            sinaads_ad_height : height,
            sinaads_page_url : config.pageurl,
            sandboxId : iframeId,
            sinaads_couplet_top : coupletTop
        });
    }
    /**
     * 初始化广告对象
     * @param  {object} config 配置项
     */
    function _init(config) {
        var element = config.element; //广告容器

        config = config.params || {};   //广告配置

        //从config.element中得到需要渲染的ins元素，如果没有，则获取页面上未完成状态的广告节点
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
        config.sinaads_page_url = core.url.top;

        function render() {

            var data = window._ssp_ad.data[config.sinaads_ad_pdps]; //兼容方法
            
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

            // 自适应处理 
            if (!!config.sinaads_ad_fullview && !!width) {
                width = '100%';
                height = '100%';
                element.style.cssText = 'display:block;visiable:hidden;';
                element.style.cssText = 'width:100%;height:' + (element.offsetWidth * oHeight / oWidth) + 'px;visiable:visiablity';

                core.event.on(window, 'resize', function () {
                    element.style.height = (element.offsetWidth * oHeight / oWidth) + 'px';
                });
            }

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
            /** 
             * 渲染广告
             */
            switch (data.type) {
                case 'couplet' : 
                    //是跨栏，隐藏掉改区块
                    element.style.cssText = 'position:absolute;top:-9999px';
                    //这里认为如果couplet类型给的是素材的话，那么素材必须大于1个，否则为html类型
                    if (data.content.src.length > 1) {
                        //注入跨栏数据
                        var CoupletMediaData = {
                            src : data.content.src,
                            type : data.content.type,
                            link : data.content.link,
                            top : config.sinaads_couple_top || 0,
                            mainWidth : width,
                            mainHeight : height,
                            sideWidth : 25,
                            sideHeight : 300,
                            monitor : data.content.monitor || [],
                            delay : config.sinaads_ad_delay || 0
                        };
                        sinaadToolkit.sio.loadScript('./src/plus/CoupletMedia.js', function () {
                            new sinaadToolkit.CoupletMedia(CoupletMediaData);
                        });
                        data.content.src = [];
                    }
                    break;
                case 'videoWindow' : 
                    element.style.cssText = 'position:absolute;top:-9999px';
                    if (data.content.type[0] !== 'js') {
                        var VideoWindowMediaData = {
                            src : data.content.src[0],
                            type : data.content.type[0],
                            width : width,
                            height : height,
                            link : data.content.link[0],
                            monitor : data.content.monitor,
                            delay : config.sinaads_ad_delay || 0
                        };
                        sinaadToolkit.sio.loadScript('./src/plus/VideoWindowMedia.js', function () {
                            new sinaadToolkit.VideoWindowMedia(VideoWindowMediaData);
                        });
                    }
                    data.content.src = [] //已经处理过，无需再处理
                    break;
                case 'stream' :
                    //流媒体，隐藏掉该区块
                    element.style.cssText = 'position:absolute;top:-9999px';
                    //这里认为如果给的是素材的话，那么素材必须大于1个，否则为js类型
                    if (data.content.src.length > 1) {
                        //注入流媒体数据
                        var StreamMediaData = {
                            main : {
                                type : 'flash',
                                src : 'http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fc1715.swf',
                                link : 'http://sina.com.cn',
                                width : width,
                                height : height
                            },
                            mini : {
                                src : 'http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fb1.swf',
                                type : 'flash',
                                link : 'http://sina.com.cn'
                            },
                            delay : config.sinaads_ad_delay || 0
                        };
                        sinaadToolkit.sio.loadScript('./src/plus/StreamMedia.js', function () {
                            new sinaadToolkit.StreamMedia(StreamMediaData);
                        });
                        data.content.src = [];
                    } else {
                        //富媒体供应商提供的js
                        //生成一个用于渲染容器到页面中
                        var streamContainer = document.createElement('div');
                        streamContainer.id = 'SteamMediaWrap';
                        document.body.insertBefore(streamContainer, document.body.firstChild);
                            
                        sinaadToolkit.sio.loadScript(data.content.src[0]);
                        data.content.src = [] //已经处理过，无需再处理
                    }
                    break;
                case 'fullscreen' : 
                    //是全屏广告，隐藏掉改区块
                    element.style.cssText = 'position:absolute;top:-9999px';
                    var FullScreenMediaData = {
                        type : data.content.type[0] || '',
                        src : data.content.src[0] || '',
                        link : data.content.link[0] || '',
                        width : width,
                        height : height,
                        hasClose : 1,
                        delay : config.sinaads_ad_delay || 0
                    };

                    sinaadToolkit.sio.loadScript('./src/plus/FullscreenMedia.js', function () {
                        new sinaadToolkit.FullscreenMedia(element, FullScreenMediaData);
                    });
                    data.content.src = [];
                    break;
                case 'bp' : 
                    //是背投广告，隐藏掉改区块
                    element.style.cssText = 'position:absolute;top:-9999px';
                    //这里规定背投的素材不能是js或者代码片段，而且只能有1个
                    window.open('http://d1.sina.com.cn/d1images/pb/pbv4.html?' + data.content.link[0] + '${}' + data.content.type[0] + '${}' + data.content.src[0]);
                    data.content.src = [];
                    break;
                case 'textlink': 

                default : 

                    break;
            }

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

                pv : core.monitor.createImpressMonitor(pv) || '',
                coupletTop : config.sinaads_couplet_top || 0
            });

            /**
             * cookie mapping
             * @type {Number}
             */
            for (var i = 0, len = mapping.length; i < len; i++) {
                mapping[i] && core.sio.log(mapping[i]);
            }
        };

        if (!_ssp_ad.data[config.sinaads_ad_pdps]) {
            getData([config.sinaads_ad_pdps]).done(render);
        } else {
            render();
        }
    }


    /**
     * 初始化方法，处理js加载成功之前压入延迟触发的广告位，
     * 并将后续广告压入方法置成内部初始化方法
     */
    function init() {
        /* 在脚本加载之前注入的广告数据存入在sinaads数组中，遍历数组进行初始化 */
        var perloadAds = window.sinaads;
        if (perloadAds && perloadAds.shift) {
            for (var ad, len = 20; (ad = perloadAds.shift()) && 0 < len--;) {
                _init(ad);
            }
        }
        //在脚本加载之后，sinaad重新定义，并赋予push方法为初始化方法
        window.sinaads = {push : _init};
    }

    /* 判断是否有需要预加载的数据，加载完成后执行初始化操作，否则执行初始化操作 */
    var perloadData = window.sinaadsPerloadData;
    if (perloadData instanceof Array && perloadData.length > 0) {
        getData(perloadData).done(init).fail(init);
    } else {
        init();
    }
    window.sinaadsPerloadData = null;

})(window, window.sinaadToolkit);







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
                    case 'swf' :
                        type[i] = 'flash';
                        break;
                    case 'tml' :
                        type[i] = 'url';
                        break;
                    case '.js' :
                        type[i] = 'js';
                        break;
                    case 'png':
                    case 'jpg':
                    case 'gif':
                    case 'bmp':
                        type[i] = 'image';
                        break;
                    default:
                        type[i] = 'html';
                        break;
                }
            }
            if (type[i] === 'url' && src[i].indexOf('adbox.sina.com.cn/ad/') >= 0) {
                type[i] = 'adbox';
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
                case 'lmt' : 
                    return 'stream';
                case 'sc' : 
                    return 'videoOpen';
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
        if (data === 'nodata' || data.ad.length <= 0) {
            return;
        }
        for (var i = 0, len = data.ad.length; i < len; i++) {
            if (data.ad[i] && (!data.ad[i].value || data.ad[i].value && data.ad[0].value.length <= 0)) {
                return;
            }
            window._ssp_ad.data[data.ad[i].id] = window._ssp_ad.adapter({
                mapUrl : data.mapUrl,
                ad : [data.ad[i]]
            });
        }
    }
};


/**
 *  测试数据填充区域
 */
//测试乐居数据
// window._ssp_ad.data["PDPS000000000020"] = {
//     size : "1000*90",
//     type : 'embed',
//     content : {
//         pv : ["http://baidu.com/?leju", "http://baidu.com/?leju2"],
//         type : 'html',
//         src : [
//             [
//                 '\x3c!-- 乐居广告js start--\x3e',
//                 '\x3cscript charset="utf-8" src="http://d5.sina.com.cn/litong/zhitou/leju/leju.js"\x3e\x3c/script\x3e',
//                 '\x3cscript\x3e',
//                     'leju.conf.url = \'http://adm.leju.sina.com.cn/get_ad_list/PG_514AC4246D2142\';',
//                     'leju.conf.defaultUrl = \'http://d3.sina.com.cn/litong/zhitou/leju/news.js\';',
//                     'var position = \'ad_47200\';',
//                     'var lejuMedia = leju.getData();',
//                     'lejuMedia.then(function (data) {',
//                         'var data = data[position][0];',
//                         'document.write(sinaadToolkit.ad.createHTML(\'flash\', data.params.src, sinaads_ad_width, sinaads_ad_height, data.params.link, []));',
//                     '});',
//                 '\x3c/script\x3e',
//                 '\x3c!-- 乐居广告js end --\x3e',
//             ].join('')
//         ],
//         monitor : ["http://leju.com"],
//         link : ['http://leju.com']
//     }
// };

// //测试乐居数据-跨栏
// window._ssp_ad.data["PDPS000000000021"] = {
//     size : "1000*90",
//     type : 'embed',
//     content : {
//         pv : [],
//         type : 'html',
//         src : [
//             [
//                 '\x3c!-- 乐居广告js start--\x3e',
//                 '\x3cscript charset="utf-8" src="http://d5.sina.com.cn/litong/zhitou/leju/leju.js"\x3e\x3c/script\x3e',
//                 '\x3cscript\x3e',
//                     'leju.conf.url = \'http://adm.leju.sina.com.cn/get_ad_list/PG_514AC47514A055\';',
//                     'leju.conf.defaultUrl = \'http://d3.sina.com.cn/litong/zhitou/leju/news.js\';',
//                     'var position = \'couplet\';',
//                     'var lejuMedia = leju.getData();',
//                     'lejuMedia.then(function (data) {',
//                         'var data = data[position][0];',
//                         'var win;',
//                         'try {',
//                             'var parent = window.parent;',
//                             'parent.lejuCoupleData = {',
//                                 'src : [data.params.bar, data.params.left, data.params.right],',
//                                 'link : data.params.link,',
//                                 'top : 10,',
//                                 'mainW : sinaads_ad_width,',
//                                 'mainH : sinaads_ad_height,',
//                                 'sideW : 25,',
//                                 'sideH : 300',
//                             '};',
//                             'if (!parent.sinaads_couple) {',
//                                 'parent.sinaadToolkit.sio.loadScript(\'./src/plus/couple.js\', function () {',
//                                     'parent.sinaads_couple(parent.lejuCoupleData);',
//                                 '});',
//                             '} else {',
//                                 'parent.sinaads_couple(parent.lejuCoupleData);',
//                             '}',
//                         '} catch (e) {',
//                             'alert(e.message);',
//                         '}',
//                     '});',
//                 '\x3c/script\x3e',
//                 '\x3c!-- 乐居广告js end --\x3e',
//             ].join('')
//         ],
//         monitor : ["http://leju.com"],
//         link : ['http://leju.com']
//     }
// };
// 
// 流媒体广告
window._ssp_ad.data["PDPS000000000066"] = {
    size : "1000*450",
    type : 'stream',
    content : {
        pv : ["http://baidu.com/?stream", "http://baidu.com/?stream2"],
        type : ['flash', 'flash'],
        src : [
            'http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fc1715.swf',
            'http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fb1.swf'
            //'http://rm.sina.com.cn/bj-icast/mv/cr/2013/07/129132/31641/code.js'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }
};
//全屏广告
window._ssp_ad.data["PDPS000000000067"] = {
    size : "1000*400",
    type : 'fullscreen',
    content : {
        pv : ["http://baidu.com/?stream", "http://baidu.com/?stream2"],
        type : ['image'],
        src : [
            'http://d1.sina.com.cn/201308/06/504904_sina-fulls-1000X450-0806-CC.jpg'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }
};

//视窗广告
window._ssp_ad.data["PDPS000000000068"] = {
    size : "300*297",
    type : 'videoWindow',
    content : {
        pv : ["http://baidu.com/?stream", "http://baidu.com/?stream2"],
        type : ['flash'],
        src : [
            'http://d1.sina.com.cn/rwei/shijia2012/shichuang1129/300x250.swf'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }
};
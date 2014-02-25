(function (window, exports, undefined) {
    "use strict";

    var exports = exports || window;

    var doc = window.document,
        storage,
        api = {},
        uid = window.location.hostname,
        pageDomain = doc.domain;

    function getStorage() {
        if (storage) {
            return storage;
        }
        storage = document.createElement('input');
        storage.type = 'hidden';
        storage.style.display = "none";
        storage.addBehavior("#default#userData");
        document.body.insertBefore(storage, document.body.firstChild);
        storage.load(uid);
        return storage;
    }

    if ('localStorage' in window && window.localStorage) {
        storage = window.localStorage;
        api = {
            get : function (key) {
                return storage.getItem(key);
            },
            set : function (key, value) {
                storage.setItem(key, value);
            },
            remove : function (key) {
                storage.removeItem(key);
            }
        };
    } else if (doc.documentElement.addBehavior) {
        api = {
            get : function (key) {
                return getStorage().getAttribute(key);
            },
            set : function (key, value) {
                var storage = getStorage();
                storage.setAttribute(key, value);
                storage.save(uid);
            },
            remove : function (key) {
                var storage = getStorage();
                storage.removeAttribute(key);
                storage.save(uid);
            }
        };
    }

    /**
     * 删除某个域下某个值的本地存储（内部方法）
     * @param  {String} key    存储名称
     * @param  {String} domain 域
     */
    function _remove(key, domain) {
        api.remove(key + '@' + domain);
    } 
    
    /**
     * 获取某个域下某个名字的本地存储内容（内部方法）
     * @desc   去除过期的本地存储内容
     * @param  {String} key    存储名称
     * @param  {String} domain 域
     * @return {String}        值
     */
    function _get(key, domain) {
        var value = api.get(key + '@' + domain),
            expires;

        if (value) {
            //如果是localStorage或者userData获取到的数据，格式为value;domain=domain;expires=expires
            var match = value.match(/([^;]+)(;\s*expires=([^;]+))?/);
            if (match) {
                value = match[1],
                expires = match[3];

                //处理过期时间
                if (expires && +(new Date()) > parseInt(expires, 10)) {
                    _remove(key, domain);
                    value = null;
                }
            }
        }
        return value;
    }

    var __storage__ = {
        /**
         * 获取某个域下某个名字的本地存储内容
         * @desc   递归查找每个域下的值，由最精确到最不精确的主域依次筛选
         * @param  {String} key    存储名称
         * @param  {String} domain 域
         * @return {String}        值
         */
        get : function (key) {
            var domain = pageDomain,
                value,
                pos;

            while (value = _get(key, domain), pos = domain.indexOf('.'), !value && (pos !== -1)) {
                domain = domain.substring(pos + 1);
            }
            return value;
        },
        /**
         * 设置本地存储的值
         * @key         {String}     名字
         * @value       {String}     设置的值
         * @opt_options
         *     expires  {Number}     毫秒数过期时间
         *     domain   {String}     设置的主域
         */
        set : function (key, value, opt_options) {
            var options = opt_options || {},
                domain = options.domain || pageDomain,
                expires = options.expires ? Number(expires) : 0;
            api.set(key + '@' + domain, value + (expires ? ('; expires=' + expires) : ''));
        },
        /**
         * 清除所有域下的名称为key的存储内容
         * @key         {String}     名字
         */
        remove : function (key) {
            var domain = pageDomain,
                pos;

            while (pos = domain.indexOf('.'), pos !== -1) {
                domain = domain.substring(pos + 1);
                _remove(key, domain);
            }
        }
    };

    exports.storage = __storage__;
})(window);
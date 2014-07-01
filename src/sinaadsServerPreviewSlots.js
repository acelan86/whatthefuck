/**
 * 获取需要进行服务端预览的广告位，并暴露在window.sinaadsServerPreviewSlots变量中
 * @author acelan(xiaobin8[at]staff.sina.com.cn)
 */
(function (window, undefined) {

    "use strict";

    var cookie = {
        _isValidKey : function (key) {
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        },
        _getRaw : function (key) {
            if (cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                     
                if (result) {
                    return result[2] || null;
                }
            }
            return null;
        },
        _setRaw : function (key, value, options) {
            if (!cookie._isValidKey(key)) {
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
        get : function (key) {
            var value = cookie._getRaw(key);
            if ('string' === typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        },
        set : function (key, value, options) {
            cookie._setRaw(key, encodeURIComponent(value), options);
        },
        remove : function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            cookie._setRaw(key, '', options);
        }
    };

    function padNumber(source, length) {
        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));
     
        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }
     
        return (negative ?  "-" : "") + pre + string;
    }

    function formatDate(source, pattern) {
        if ('string' !== typeof pattern) {
            return source.toString();
        }
     
        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }
         
        var pad     = padNumber,
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

    function stringify(obj) {
        var str = [];
        for (var key in obj) {
            str.push('"' + key + '":"' + obj[key] + '"');
        }
        return '{' + str.join(',') + '}';
    }

    var top = (function () {
            var top;
            try {
                top = window.top.location.href;
            } catch (e) {}
            top = top || ((window.top === window.self) ?  window.location.href : window.document.referrer);
            return top;
        })(),
        _hash = (top.split('#')[1] || '').split('?')[0] || '',
        _query = (top.split('?')[1] || '').split('#')[0] || '',
        par = (_hash + '&' + _query)
            .replace(/</g, '')
            .replace(/>/g, '')
            .replace(/"/g, '')
            .replace(/'/g, '');

    //cookie.set('sinaads_ip', '111.111.111.111');

    var sinaadsServerPreviewSlots = (function () {
        var query = par.split('&'),
            slots = {},
            key = 'sinaads_server_preview', //必需有的key
            q,
            i = 0,
            len = 0,
            date = formatDate(new Date(), 'yyyyMMddHH'),
            ip = '',
            deliveryId = '',
            pdps = '';

        for (i = 0, len = query.length; i < len; i++) {
            if ((q = query[i])) {
                q = q.split('=');

                if (q[0] === key && q[1]) {
                    q = decodeURIComponent(q[1]).split('|');

                    pdps = q[0] || pdps;
                    date = q[1] || date;
                    ip = q[2] || ip;
                    deliveryId = q[3] || deliveryId;

                    if (pdps) {
                        slots[pdps] = [];
                        date && slots[pdps].push('date=' + encodeURIComponent(date));
                        ip && slots[pdps].push('tgip=' + encodeURIComponent(ip));
                        deliveryId && slots[pdps].push('deid=' + encodeURIComponent(deliveryId));
                        slots[pdps] = slots[pdps].join('&');
                    }
                }
            }
        }
        return slots;
    })();


    window.getSinaadsServerPreviewSlots = function () {
        return stringify(sinaadsServerPreviewSlots);
    };

})(window);
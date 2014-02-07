/**
 * 频率控制器
 * @param  {[type]} window    [description]
 * @param  {[type]} exports   [description]
 * @param  {[type]} core      [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function (window, exports, core, undefined) {
    "use strict";
    if (exports.FrequenceController) {
        return;
    }

    function FrequenceController(uid) {
        this.uid = uid || 'fc-uid' + (+new Date()).toString(36);
        this.list = {};
    }
    FrequenceController.prototype = {
        has : function (key) {
            return this.list[key];
        },
        register : function (key, frequence) {
            if (frequence) {
                this.list[key] = frequence;
            }
        },
        disable : function (key) {
            if (this.has(key)) {
                core.storage.set(this.uid + key + '_disabled', 1, this.list[key] * 1000);
            }
        },
        isDisabled : function (key) {
            return core.storage.get(this.uid + key + '_disabled');
        }
    };

    exports.FrequenceController = FrequenceController;
    return FrequenceController;

})(window, window.sinaadToolkit || window, window.sinaadToolkit);


/**
 * [description]
 * @param  {[type]} window  [description]
 * @param  {[type]} exports [description]
 * @return {[type]}         [description]
 */
(function (window, exports, undefined) {
    "use strict";

    if (exports.OrderController) {
        return;
    }

    //状态表
    var STATE_MAP = {
        'INIT' : 1,  //初始化，即创建一个顺序
        'READY' : 2, //数据准备完成，可以执行，但需要等待前驱完成
        'DOING' : 3, //正在执行处理方法
        'DONE' : 4   //执行处理方法结束
    };

    var CHECK_FREQUENCE = 1 * 1000; //默认轮询检查时间
    var DONE_TIMEOUT = 12 * 1000; //默认前驱最长处理时间，如果前驱超出处理时间还没完成，后继会直接开始处理

    function _getDoneHandler(oc, type) {
        return function () {
            oc.done(type);
        };
    }

    /**
     * 检查order列表中的所有类型是否已经可以执行
     * 完成的类型会被从order列表中被移除
     * @return {[type]} [description]
     */
    function _check(oc) {
        var i = 0,
            type,
            callback;

        while ((type = oc.order[i++])) {
            //判断某个状态是否可以执行
            if (_canDoing(oc, type)) {
                //类型为正在执行状态
                oc._state[type] = STATE_MAP.DOING;
                //设置一段时间后由正在执行状态变成完成状态，防止因为特殊原因某个执行过程被迫中断
                oc._doneTimeoutTimer[type] = setTimeout(_getDoneHandler(oc, type), oc._timeout);
                
                //获取当前类型的
                callback = oc._callback[type];
                if ('function' === typeof callback) {
                    callback.apply(oc._callbackThis[type] || null, oc._callbackArgs[type] || []);
                } else {
                    //如果没有回调，直接进入成功状态
                    oc.done(type);
                }
            }
        }
        if (OrderController.allDone(oc)) {
            oc._checkTimer && clearInterval(oc._checkTimer); //停止轮询
        }
    }

    function _getCheckHandler(oc) {
        return function () {
            _check(oc);
        };
    }

    function _canDoing(oc, type) {
        var i = 0, _type;

        while ((_type = oc.order[i++]) && _type !== type) {
            if (oc._state[_type] !== STATE_MAP.DONE) {
                return false;
            }
        }
        return oc._state[type] ? oc._state[type] === STATE_MAP.READY : true;
    }
    /**
     * [OrderController description]
     * @param {[type]} order       [description]
     * @param {[type]} opt_options [description]
     * @param {number} frequence 轮询检查时间间隔，默认1s
     * @param {number} timeout 前驱处理最长等待时间，默认20s
     */
    function OrderController(order, opt_options) {
        var options = opt_options || {},
            i = 0, type;

        this._uid = 'oc-uid' + (+new Date()).toString(36); //唯一标识id
        this._state = {}; //状态记录器
        this._callback = {};  //每一种顺序类型的回调方法
        this._callbackArgs = {}; //回调的参数，在ready的时候可以传入
        this._callbackThis = {}; //回调的this对象，在ready的时候可以传入
        this._doneTimeoutTimer = {}; //超时的计时器句柄
        this._frequence = options.frequence || CHECK_FREQUENCE;
        this._timeout = options.timeout || DONE_TIMEOUT;

        this.order = order || [];

        while ((type = this.order[i++])) {
            this._state[type] = STATE_MAP.INIT;
        }

        this._checkTimer = setInterval(_getCheckHandler(this), this._frequence);
    }

    OrderController.allDone = function (oc) {
        var i = 0, type;

        while ((type = oc.order[i++])) {
            if (oc._state[type] !== STATE_MAP.DONE) {
                return false;
            }
        }
        return true;
    };


    OrderController.prototype = {
        has : function (type) {
            return ('|' + this.order.join('|') + '|').indexOf('|' + type + '|') !== -1;
        },
        ready : function (type, callback, args, thiz) {
            if (this.has(type)) {
                this._state[type] = STATE_MAP.READY;
                this._callback[type] = callback;
                this._callbackArgs[type] = args;
                this._callbackThis[type] = thiz;
            } else {
                callback.apply(thiz || null, args || []);
            }
        },
        done : function (type) {
            if (this.has(type)) {
                this._state[type] = STATE_MAP.DONE;
                this._doneTimeoutTimer[type] && clearTimeout(this._doneTimeoutTimer[type]);
                delete this._callback[type];
                delete this._callbackArgs[type];
                delete this._callbackThis[type];
                delete this._doneTimeoutTimer[type];
            }
        }
    };

    exports.OrderController = OrderController;

})(window, window.sinaadToolkit || window);
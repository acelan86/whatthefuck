/**
 * Box2.0
 * @class 创建一个附属在任意元素或者视口的盒子，并可以实现跟随，是大部分富媒体广告的基础
 * @usage
 *     new Box({
 *         position : {
 *             my : 'left+200 top+100',
 *             of : [window, #id] | 'window' | #id | dom | 'body',
 *             at : 'left-20 top'
 *         },
 *         follow : 1,
 *         minViewportWidth : 1000,
 *         width : 100,
 *         height : 100
 *     });
 * @constructor
 */
(function (window, document, core, undefined) {
    "use strict";

    function Box(options) {
        options = options || {};

        this.id = options.uid || ('sinaadToolkitBox' + Box.uid++);
        this.className = options.className || 'sinaad-toolkit-box';
        this.position = this._parsePosition(options.position);
        this.width = options.width || 100;
        this.height = options.height || 100;
        this.follow = options.follow || 0;
        this.zIndex = options.zIndex || 99999;
        this.autoShow = 'undefined' === typeof options.autoShow ? 1 : options.autoShow;
        this.minViewportWidth = options.minViewportWidth || 0;  //容器最小宽度
        this.useFix = this.follow && core.browser.isSupportFixed ? 1 : 0;

        //创建盒子
        var main = document.createElement('div');
        main.id = this.id;
        main.className = this.className;
        main.style.cssText = [
            'position:' + (this.useFix ? 'fixed' : 'absolute'),
            'width:' + this.width + 'px',
            'height:' + this.height + 'px',
            'z-index:' + this.zIndex,
            'display:' + (this.autoShow ? 'block' : 'none'),
            '-webkit-transition:.5s'
            //for test
            //'background-color:#ccc'
        ].join(';');
        document.body.insertBefore(main, document.body.firstChild);

        this.main = main;

        this.resetPositionHandler = this._getResetPositionHandler();
        //调整尺寸
        core.event.on(window, 'resize', this.resetPositionHandler);
        //页面滚动
        if (this.follow && !core.browser.isSupportFixed) {
            core.event.on(window, 'scroll', this.resetPositionHandler);
        }

        this.setPosition();
    }

    Box.uid = 0;

    Box.prototype = {
        /**
         * {
         *    pos : ['left', 'top'],
         *    offset : [0, 0]
         * }
         * @param  {[type]} strPosition [description]
         * @return {[type]}             [description]
         */
        _parseStringPosition : function (strPosition) {
            var tmp = (strPosition || '').match(/^([a-zA-Z]+)*([+|-]*\d+)*(?:px)*\s+([a-zA-Z]+)*([+|-]*\d+)*(?:px)*$/),
                pos = {};

            if (!tmp) {
                //core.error('Box:no valid pos');
                tmp = [];
            }
            pos.pos = [
                tmp[1] || 'left',
                tmp[3] || 'top'
            ];
            pos.offset = [
                tmp[2] ? parseInt(tmp[2], 10) : 0,
                tmp[4] ? parseInt(tmp[4], 10) : 0
            ];

            return pos;
        },
        /**
         * *******************************
         * string type : 
         * ======================== 
         *     'left top', 
         *     'left center',
         *     'left bottom',
         *     'center top',
         *     'center center',
         *     'center bottom',
         *     'right top',
         *     'right center',
         *     'right bottom'
         * ========================
         *     'x+offset, y+offset'
         * *********************************
         *
         *
         * *********************************
         * object type :
         * ========================
         *    {
         *        my : 'left top',
         *        at : 'left top',
         *        of : 'body'
         *    }
         * *********************************
         */
        _parsePosition : function (position) {
            var pos = {},
                of = [];

            if ('string' === typeof position) {
                pos.of = window;
                pos.at = position;
            } else {
                position = position || {};
                pos.of = position.of || window;
                pos.at = position.at;
                pos.my = position.my;
            }
            core.array.each(pos.of, function (o) {
                of.push(
                    'string' === typeof o ?
                        'body' === o ?
                            document.body :
                            'window' === o ?
                                window :
                                document.getElementById(o) :
                        (o || window)
                );
            });
            pos.of = of;
            pos.at = this._parseStringPosition(pos.at);
            //如果pos.my没有指明，则等同与使用pos.at.pos, 即right,top也是right,top对应
            pos.my = this._parseStringPosition(pos.my || pos.at.pos.join(' '));
            return pos;
        },
        _getResetPositionHandler : function () {
            var me = this,
                timer;
            return function () {
                timer && clearTimeout(timer);
                timer = setTimeout(function () {
                    me.setPosition();
                }, 100);
            };
        },
        _getSize : function (dom) {
            var size = [0, 0];
            if (window === dom || document.body === dom) {
                size = [core.page.getViewWidth(), core.page.getViewHeight()];
            } else {
                size = [parseInt(core.dom.getStyle(dom, 'width'), 10), parseInt(core.dom.getStyle(dom, 'height'), 10)];
            }
            return size;
        },
        _getPosition : function(dom) {
            var pos = [0, 0],
                tmp;
            if (window === dom || document.body === dom) {
                pos = [0, 0];
            } else {
                tmp = core.dom.getPosition(dom);
                pos = [tmp.left, tmp.top];
            }
            return pos;
        },
        getMain : function () {
            return this.main;
        },
        show : function () {
            this.getMain().style.display = 'block';
        },
        hide : function () {
            this.getMain().style.display = 'none';
        },
        setPosition : function () {
            /**
             * pos = {
             *     to : dom,
             *     at : {
             *         pos : ['left', 'top'],
             *         offset : [0, 0]
             *     },
             *     my : {
             *         pos : ['left', 'top'],
             *         offset : [0, 0]
             *     }
             * }
             */
            var main = this.getMain(),
                pos = this.position,
                of = pos.of,
                at = pos.at,
                my = pos.my,
                //计算对应的值，如果只有一个相对参考系，用唯一的这个参考系当垂直跟水平参考系
                hOfSize = this._getSize(of[0]),
                hOfPosition = this._getPosition(of[0]),
                vOfSize = of[1] ? this._getSize(of[1]) : hOfSize,
                vOfPosition = of[1] ? this._getPosition(of[1]) : hOfPosition,
                mainSize = this._getSize(main),
                viewWidth = core.page.getViewWidth(),
                overflowOffset = Math.min(window === of[0] && this.minViewportWidth ? (viewWidth / 2 - this.minViewportWidth / 2) : 0, 0); //水平方向的溢出补偿

            //console.log(vOfSize, vOfPosition, hOfSize, hOfPosition, mainSize);

            var x = hOfPosition[0] + my.offset[0] + at.offset[0] + (this.follow && !core.browser.isSupportFixed ? core.page.getScrollLeft() : 0);
            switch (my.pos[0]) {
                case 'center'   : x -= mainSize[0] / 2;                 break;
                case 'right'    : x -= mainSize[0] + overflowOffset;    break;
                default         : x += overflowOffset;                  break; //left    
            }
            switch (at.pos[0]) {
                case 'center'   : x += hOfSize[0] / 2;  break;
                case 'right'    : x += hOfSize[0];      break;
                default         : x += 0;               break; //left
            }

            var y = vOfPosition[1] + my.offset[1] + at.offset[1] + (this.follow && !core.browser.isSupportFixed ? core.page.getScrollTop() : 0);
            switch (my.pos[1]) {
                case 'center'   : y -= mainSize[1] / 2; break;
                case 'bottom'   : y -= mainSize[1];     break;
                default         : y += 0;               break; //top
            }
            switch (at.pos[1]) {
                case 'center'   : y += vOfSize[1] / 2;  break;
                case 'bottom'   : y += vOfSize[1];      break;
                default         : y += 0;               break; //top
            }

            main.style.left = x + 'px';
            main.style.top  = y + 'px';

            return;
        }
    };

    core.Box = Box;
})(window, document, window.sinaadToolkit);
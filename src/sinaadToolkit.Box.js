/**
 * Box2.0
 */
(function (window, core, undefined) {
    "use strict";

    /**
     * 用于展示广告的全局盒子
     * @param {[type]} options [description]
     */
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
            '-webkit-transition:.5s',
            //for test
            'border:1px solid #ccc'
        ].join(';');
        document.body.appendChild(main);

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
            var tmp = (strPosition || '').match(/^(\w+)([+|-]\d+)*(?:px)*\s(\w+)([+|-]\d+)*(?:px)*$/),
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
                }, 1000/60);
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
                mainSize = this._getSize(main);

            console.log(vOfSize, vOfPosition, hOfSize, hOfPosition, mainSize);

            var x = hOfPosition[0] + my.offset[0] + at.offset[0];
            switch (my.pos[0]) {
                case 'center'   : x -= mainSize[0] / 2; break;
                case 'right'    : x -= mainSize[0]; break;
                default         : x += 0; break; //left    
            }
            switch (at.pos[0]) {
                case 'center'   : x += hOfSize[0] / 2; break;
                case 'right'    : x += hOfSize[0]; break;
                default         : x += 0; break; //left
            }

            var y = vOfPosition[1] + my.offset[1] + at.offset[1];
            switch (my.pos[1]) {
                case 'center'   : y -= mainSize[1] / 2; break;
                case 'bottom'   : y -= mainSize[1]; break;
                default         : y += 0; break; //top
            }
            switch (at.pos[1]) {
                case 'center'   : y += vOfSize[1] / 2; break;
                case 'bottom'   : y += vOfSize[1]; break;
                default         : y += 0; break; //top
            }

            main.style.left = x + 'px';
            main.style.top  = y + 'px';

            return;

            // var element = this.getMain(),
            //     viewWidth = core.page.getViewWidth(),
            //     viewHeight = core.page.getViewHeight(),
            //     offsetTop = 0,
            //     offsetLeft = 0,
            //     hOffset = Math.min(this.minViewportWidth ? (viewWidth / 2 - this.minViewportWidth / 2) : 0, 0);

            // offsetTop = this.useFix ? 0 : core.page.getScrollTop() || 0;
            // offsetLeft = this.useFix ? 0 : core.page.getScrollLeft() || 0;


            // switch (at.pos[0]) {
            //     case 'center' :
            //         element.style.left = offsetLeft + (viewWidth - this.width) / 2 + offsetLeft + 'px';
            //         break;
            //     case 'left' :
            //         element.style.left = offsetLeft + hOffset + 'px';
            //         break;
            //     case 'right' :
            //         if (this.follow) {
            //             element.style.left = offsetLeft + (viewWidth - this.width) - hOffset + 'px';
            //         } else {
            //             element.style.right = hOffset + 'px';
            //         }
            //         break;
            //     default :
            //         element.style.left = offsetLeft + at.pos[0] + 'px';
            //         break;
            // }
            // switch (at.pos[1]) {
            //     case 'center' :
            //         element.style.top = (viewHeight - this.height) / 2 + offsetTop + 'px';
            //         break;
            //     case 'top' :
            //         element.style.top = offsetTop + 'px';
            //         break;
            //     case 'bottom' :
            //         if (this.follow) {
            //             element.style.top = offsetTop + (viewHeight - this.height) + 'px';
            //         } else {
            //             element.style.bottom = '0px';
            //         }
            //         break;
            //     default :
            //         element.style.top = offsetTop + pos.at.pos[1] + 'px';
            //         break;
            // }
        }
    };

    core.Box = Box;
})(window, window.sinaadToolkit);
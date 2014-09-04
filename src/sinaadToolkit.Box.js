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
            var pos = {};
            if ('string' === typeof position) {
                pos.at = position;
            } else {
                pos = position || {};
            }
            pos.of = 'string' === typeof pos.of ?
                        'body' === pos.of ?
                            document.body :
                            'window' === pos.of ?
                                window :
                                document.getElementById(pos.of) :
                        (pos.of || window);

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
                ofSize = this._getSize(of),
                ofPosition = this._getPosition(of),
                mainSize = this._getSize(main);


            console.log(ofSize, ofPosition, mainSize);

            var x = ofPosition[0] + my.offset[0] + at.offset[0];
            switch (my.pos[0]) {
                case 'center'   : x -= mainSize[0] / 2; break;
                case 'right'    : x -= mainSize[0]; break;
                default         : x += 0; break; //left    
            }
            switch (at.pos[0]) {
                case 'center'   : x += ofSize[0] / 2; break;
                case 'right'    : x += ofSize[0]; break;
                default         : x += 0; break; //left
            }

            var y = ofPosition[1] + my.offset[1] + at.offset[1];
            switch (my.pos[1]) {
                case 'center'   : y -= mainSize[1] / 2; break;
                case 'bottom'   : y -= mainSize[1]; break;
                default         : y += 0; break; //top
            }
            switch (at.pos[1]) {
                case 'center'   : y += ofSize[1] / 2; break;
                case 'bottom'   : y += ofSize[1]; break;
                default         : y += 0; break; //top
            }

            main.style.left = x + 'px';
            main.style.top  = y + 'px';

            return;

            var element = this.getMain(),
                viewWidth = core.page.getViewWidth(),
                viewHeight = core.page.getViewHeight(),
                offsetTop = 0,
                offsetLeft = 0,
                hOffset = Math.min(this.minViewportWidth ? (viewWidth / 2 - this.minViewportWidth / 2) : 0, 0);

            offsetTop = this.useFix ? 0 : core.page.getScrollTop() || 0;
            offsetLeft = this.useFix ? 0 : core.page.getScrollLeft() || 0;


            switch (at.pos[0]) {
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
                    element.style.left = offsetLeft + at.pos[0] + 'px';
                    break;
            }
            switch (at.pos[1]) {
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
                    element.style.top = offsetTop + pos.at.pos[1] + 'px';
                    break;
            }
        }
    };

    core.Box = Box;
})(window, window.sinaadToolkit);
(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";
    //常量定义
    var SIDE_CLOSE_BTN = 'http://d9.sina.com.cn/litong/zhitou/test/images/close-h.jpg',
        MAIN_CLOSE_BTN = "http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif",
        SIDE_CLOSE_BTN_SIZE = [120, 18],
        MAIN_CLOSE_BTN_SIZE = [66, 22],
        MAIN_SIZE = [1000, 90],
        SIDE_SIZE = [120, 270];
    /**
     * 跨栏广告
     * @param  {[type]} config   [description]
     * @param  {[type]} window   [description]
     * @param  {[type]} document [description]
     * @return {[type]}          [description]
     */
    function CoupletMedia(config) {
        /* 移动端不出广告 */
        if (sinaadToolkit.browser.mobile) {
            try {
                sinaadToolkit.debug('Media: In building couplet complete!');
                mediaControl.done(mediaControl.couplet);
            } catch(e) {}

            return;
        }

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        config.mainWidth = config.mainWidth || MAIN_SIZE[0];
        config.mainHeight = config.mainHeight || MAIN_SIZE[1];
        config.sideWidth = config.sideWidth || SIDE_SIZE[0];
        config.sideHeight = config.sideHeight || SIDE_SIZE[1];


        config.src = sinaadToolkit.array.ensureArray(config.src);
        config.type = sinaadToolkit.array.ensureArray(config.type);
        config.link = sinaadToolkit.array.ensureArray(config.link);

        this.config = config;
        this.pdps = config.pdps;

        this.deferred = new sinaadToolkit.Deferred();

        var left = this.left = new sinaadToolkit.Box({
            width : config.sideWidth,
            height : config.sideHeight + SIDE_CLOSE_BTN_SIZE[1],
            position : 'left ' + config.top || 0,
            autoShow : 1,
            minViewportWidth : config.mainWidth + 2 * config.sideWidth,
            zIndex : 10500,
            className : 'sinaads-couplet-side sinaads-couplet-side-left'
        });

        var right = this.right = new sinaadToolkit.Box({
            width : config.sideWidth,
            height : config.sideHeight + SIDE_CLOSE_BTN_SIZE[1],
            position : 'right ' + config.top || 0,
            autoShow : 1,
            minViewportWidth : config.mainWidth + 2 * config.sideWidth,
            zIndex : 10500,
            className : 'sinaads-couplet-side sinaads-couplet-side-right'
        });

        var main = this.main = new sinaadToolkit.Box({
            width : config.mainWidth,
            height : config.mainHeight,
            position : 'center ' + config.top || 0,
            zIndex : 10500
        });


        var mainContent = this.mainContent = document.createElement('div');
        mainContent.style.cssText = 'width:' + config.mainWidth + 'px;height:' + config.mainHeight + 'px;overflow:hidden;margin:0px auto;position:relative;';

        var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
        mainCloseBtn.style.cssText = 'width:' + MAIN_CLOSE_BTN_SIZE[0] + 'px;height:' + MAIN_CLOSE_BTN_SIZE[1] + 'px;position:absolute;top:' + config.mainHeight + 'px;right:0px;background:url(' + MAIN_CLOSE_BTN + ') no-repeat;cursor:pointer;';

        var leftContent = this.leftContent = document.createElement('div');
        leftContent.style.cssText = 'width:' + config.sideWidth + 'px;height:' + config.sideHeight + 'px;position:absolute;left:0px;top:0px;';
        leftContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.type[1],
            config.src[1],
            config.sideWidth,
            config.sideHeight,
            config.link[1] || config.link[0],
            config.monitor,
            config.pv
        );

        var leftCloseBtn = this.leftCloseBtn = document.createElement('div');
        leftCloseBtn.className = 'sinaads-couplet-side-close';
        leftCloseBtn.style.cssText = 'width:' + config.sideWidth + 'px;height:' + SIDE_CLOSE_BTN_SIZE[1] + 'px;position:absolute;left:0px;top:' + config.sideHeight + 'px;background:url(' + SIDE_CLOSE_BTN + ') no-repeat right center #ebebeb;cursor:pointer';

        var rightContent = this.rightContent = document.createElement('div');
        rightContent.style.cssText = 'width:' + config.sideWidth + 'px;height:' + config.sideHeight + 'px;position:absolute;left:0px;top:0px;';
        rightContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.type[2] || config.type[1],
            config.src[2] || config.src[1],
            config.sideWidth,
            config.sideHeight,
            config.link[2] || config.link[1] || config.link[0],
            config.monitor,
            config.pv
        );

        var rightCloseBtn = this.rightCloseBtn = document.createElement('div');
        rightCloseBtn.className = 'sinaads-couplet-side-close';
        rightCloseBtn.style.cssText = 'width:' + config.sideWidth + 'px;height:' + SIDE_CLOSE_BTN_SIZE[1] + 'px;position:absolute;left:0px;top:' + config.sideHeight + 'px;background:url(' + SIDE_CLOSE_BTN + ') no-repeat left center #ebebeb;cursor:pointer';


        main.getMain().appendChild(mainContent);
        main.getMain().appendChild(mainCloseBtn);

        left.getMain().appendChild(leftContent);
        left.getMain().appendChild(leftCloseBtn);
        right.getMain().appendChild(rightContent);
        right.getMain().appendChild(rightCloseBtn);


        sinaadToolkit.event.on(mainCloseBtn, 'click', this.getCloseMainHandler());
        sinaadToolkit.event.on(leftCloseBtn, 'click', this.getCloseSideHandler());
        sinaadToolkit.event.on(rightCloseBtn, 'click', this.getCloseSideHandler());
        sinaadToolkit.event.on(rightContent, 'mouseover', this.getHoverSideHandler());
        sinaadToolkit.event.on(leftContent, 'mouseover', this.getHoverSideHandler());

        // if (config.delay) {
        //     setTimeout(function () {
        //         THIS.show();
        //     }, config.delay * 1000);
        // }
        try {
            sinaadToolkit.debug('Media: In building couplet complete!');
            mediaControl.done(mediaControl.couplet);
        } catch(e) {}
    }
    CoupletMedia.prototype = {
        timer : null,
        aniTimer : null,
        isshow : 0,
        show : function () {
            var THIS = this;
            // if (this.isshow) {
            //     return;
            // }

            this.tmpWidth = 0;
            this.isshow = 1;
            clearTimeout(this.timer);
            this.mainContent.style.width = '0px';
            this.mainContent.innerHTML = sinaadToolkit.ad.createHTML(
                this.config.type[0],
                this.config.src[0],
                this.config.mainWidth,
                this.config.mainHeight,
                this.config.link[0],
                this.config.monitor,
                this.config.pv
            );
            this.main.show();

            this.aniTimer = setInterval(function () {
                if (THIS.tmpWidth < THIS.config.mainWidth) {
                    THIS.tmpWidth += (THIS.config.mainWidth - THIS.tmpWidth) / 4;
                    THIS.mainContent.style.width = THIS.tmpWidth + 'px';
                } else {
                    THIS.mainContent.style.width = THIS.config.mainWidth + 'px';
                    clearInterval(THIS.aniTimer);
                    THIS.deferred.resolve();
                }
            }, 50);

            THIS.timer = setTimeout(function () {
                THIS.hide();
            }, 8000);
        },
        hide : function () {
            this.main.hide();
            this.mainContent.innerHTML = '';
            this.isshow = 0;
            this.aniTimer && clearInterval(this.aniTimer);
            this.timer && clearTimeout(this.timer);
        },
        getCloseMainHandler : function () {
            var THIS = this;
            return function () {
                THIS.hide();
                THIS.mainIsClose = true; //主跨栏已经被主动关闭
            };
        },
        getHoverSideHandler : function () {
            var THIS = this;
            return function () {
                if (!THIS.mainIsClose) {
                    THIS.show();
                }
            };
        },
        getCloseSideHandler : function () {
            var THIS = this;
            return function () {
                THIS.hide();
                THIS.left.hide();
                THIS.right.hide();
            };
        }
    };

    sinaadToolkit.CoupletMedia = sinaadToolkit.CoupletMedia || CoupletMedia;

})(window, window.sinaadToolkit, window.sinaadsROC);
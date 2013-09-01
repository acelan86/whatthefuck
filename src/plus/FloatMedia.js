/**
 * 对联
 */
(function (window, sinaadToolkit, undefined) {
    "use strict";

    //常量定义
    var //SIDE_CLOSE_BTN = "http://d1.sina.com.cn/d1images/lmt/close2.gif",
        SIDE_CLOSE_BTN = 'http://d9.sina.com.cn/litong/zhitou/test/images/close-h.jpg',
        SIDE_CLOSE_BTN_SIZE = [40, 18],
        SIDE_SIZE = [120, 300];
        
    /**
     * 对联广告
     * @param  {[type]} config   [description]
     * @param  {[type]} window   [description]
     * @param  {[type]} document [description]
     * @return {[type]}          [description]
     */
    function FloatMedia(config) {
        if (sinaadToolkit.storage.get('FloatMedia' + config.pdps)) {
            sinaadToolkit.debug('sinaadToolkit.FloatMedia:对联广告已经关闭过，' + sinaadToolkit.storage.get('FloatMedia' + config.pdps));
            return;
        }

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        config.sideWidth = config.sideWidth || SIDE_SIZE[0];
        config.sideHeight = config.sideHeight || SIDE_SIZE[1];
        config.src = sinaadToolkit.array.ensureArray(config.src);
        config.type = sinaadToolkit.array.ensureArray(config.type);
        config.link = sinaadToolkit.array.ensureArray(config.link);

        this.config = config;

        this.deferred = new sinaadToolkit.Deferred();

        var left = this.left = new sinaadToolkit.Box({
            width : config.sideWidth,
            height : config.sideHeight,
            position : 'left ' + config.top || 0,
            autoShow : 1,
            minViewportWidth : (config.contentWidth || 1000) + 2 * config.sideWidth
        });

        var right = this.right = new sinaadToolkit.Box({
            width : config.sideWidth,
            height : config.sideHeight,
            position : 'right ' + config.top || 0,
            autoShow : 1,
            minViewportWidth : (config.contentWidth || 1000) + 2 * config.sideWidth
        });

        var leftContent = this.leftContent = document.createElement('div');
        leftContent.style.cssText = 'width:' + config.sideWidth + 'px;height:' + config.sideHeight + 'px;position:absolute;left:0px;top:0px;';
        leftContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.type[0],
            config.src[0],
            config.sideWidth,
            config.sideHeight,
            config.link[0],
            config.monitor
        );

        var leftCloseBtn = this.leftCloseBtn = document.createElement('div');
        leftCloseBtn.style.cssText = 'width:' + SIDE_CLOSE_BTN_SIZE[0] + 'px;height:' + SIDE_CLOSE_BTN_SIZE[1] + 'px;position:absolute;right:0px;top:0px;background:url(' + SIDE_CLOSE_BTN + ') no-repeat right center #ebebeb;cursor:pointer';

        var rightContent = this.rightContent = document.createElement('div');
        rightContent.style.cssText = 'width:' + config.sideWidth + 'px;height:' + config.sideHeight + 'px;position:absolute;left:0px;top:0px;';
        rightContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.type[1] || config.type[0],
            config.src[1] || config.src[0],
            config.sideWidth,
            config.sideHeight,
            config.link[1] || config.link[0],
            config.monitor
        );

        var rightCloseBtn = this.rightCloseBtn = document.createElement('div');
        rightCloseBtn.style.cssText = 'width:' + SIDE_CLOSE_BTN_SIZE[0] + 'px;height:' + SIDE_CLOSE_BTN_SIZE[1] + 'px;position:absolute;left:0px;top:0px;background:url(' + SIDE_CLOSE_BTN + ') no-repeat left center #ebebeb;cursor:pointer';

        left.getMain().appendChild(leftContent);
        left.getMain().appendChild(leftCloseBtn);
        right.getMain().appendChild(rightContent);
        right.getMain().appendChild(rightCloseBtn);

        sinaadToolkit.event.on(leftCloseBtn, 'click', this.getCloseSideHandler());
        sinaadToolkit.event.on(rightCloseBtn, 'click', this.getCloseSideHandler());

        // if (config.delay) {
        //     setTimeout(function () {
        //         THIS.show();
        //     }, config.delay * 1000);
        // }
    }
    FloatMedia.prototype = {
        getCloseSideHandler : function () {
            var THIS = this;
            return function () {
                sinaadToolkit.storage.set('FloatMedia' + THIS.config.pdps, '1', 24 * 60 * 60 * 1000);
                THIS.left.hide();
                THIS.right.hide();
            };
        }
    };

    sinaadToolkit.FloatMedia = sinaadToolkit.FloatMedia || FloatMedia;

})(window, window.sinaadToolkit);
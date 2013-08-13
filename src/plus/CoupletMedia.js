(function (window, undefind) {
    //常量定义
    var SIDE_CLOSE_BTN = "http://d1.sina.com.cn/d1images/lmt/close2.gif",
        MAIN_CLOSE_BTN = "http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif";
        
    /**
     * 跨栏广告
     * @param  {[type]} config   [description]
     * @param  {[type]} window   [description]
     * @param  {[type]} document [description]
     * @return {[type]}          [description]
     */
    function CoupletMedia(config) {
        var THIS = this;

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        this.config = config;

        this.deferred = new sinaadToolkit.Deferred();

        var left = this.left = new sinaadToolkit.Box({
            width : config.sideWidth,
            height : config.sideHeight + 48,
            position : 'left ' + config.top || 0,
            autoShow : 1
        });

        var right = this.right = new sinaadToolkit.Box({
            width : config.sideWidth,
            height : config.sideHeight + 48,
            position : 'right ' + config.top || 0,
            autoShow : 1
        });

        var main = this.main = new sinaadToolkit.Box({
            width : config.mainWidth,
            height : config.mainHeight,
            position : 'center ' + config.top || 0
        });


        var mainContent = this.mainContent = document.createElement('div');
        mainContent.style.cssText = 'width:' + config.mainWidth + 'px;height:' + config.mainHeight + 'px;overflow:hidden;margin:0px auto;position:relative;';

        var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
        mainCloseBtn.style.cssText = 'width:66px;height:22px;position:absolute;top:' + config.mainHeight + 'px;right:0px;background:url(' + MAIN_CLOSE_BTN + ') no-repeat;pointer:cursor;';

        var leftContent = this.leftContent = document.createElement('div');
        leftContent.style.cssText = 'width:' + config.sideWidth + 'px;height:' + config.sideHeight + 'px;position:absolute;left:0px;top:0px;';
        leftContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.type[1],
            config.src[1],
            config.sideWidth,
            config.sideHeight,
            config.link[1] || config.link[0],
            config.monitor
        );

        var leftCloseBtn = this.leftCloseBtn = document.createElement('div');
        leftCloseBtn.style.cssText = 'width:' + 25 + 'px;height:' + 48 + 'px;position:absolute;left:0px;top:' + config.sideHeight + 'px;background:url(' + SIDE_CLOSE_BTN + ') no-repeat;cursor:pointer';

        var rightContent = this.rightContent = document.createElement('div');
        rightContent.style.cssText = 'width:' + config.sideWidth + 'px;height:' + config.sideHeight + 'px;position:absolute;left:0px;top:0px;';
        rightContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.type[2] || config.type[1],
            config.src[1] || config.src[1],
            config.sideWidth,
            config.sideHeight,
            config.link[2] || config.link[1] || config.link[0],
            config.monitor
        );

        var rightCloseBtn = this.rightCloseBtn = document.createElement('div');
        rightCloseBtn.style.cssText = 'width:' + 25 + 'px;height:' + 48 + 'px;position:absolute;left:0px;top:' + config.sideHeight + 'px;background:url(' + SIDE_CLOSE_BTN + ') no-repeat;cursor:pointer';


        main.element.appendChild(mainContent);
        main.element.appendChild(mainCloseBtn);

        left.element.appendChild(leftContent);
        left.element.appendChild(leftCloseBtn);
        right.element.appendChild(rightContent);
        right.element.appendChild(rightCloseBtn);


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
                this.config.monitor
            );
            this.main.show();

            this.aniTimer = setInterval(function () {
                if (THIS.tmpWidth < THIS.config.mainWidth) {
                    THIS.tmpWidth += (THIS.config.mainWidth - THIS.tmpWidth) / 2;
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
            };
        },
        getHoverSideHandler : function () {
            var THIS = this;
            return function () {
                THIS.show();
            }
        },
        getCloseSideHandler : function () {
            var THIS = this;
            return function () {
                THIS.hide();
                THIS.left.hide();
                THIS.right.hide();
            }
        }
    };

    sinaadToolkit.CoupletMedia = sinaadToolkit.CoupletMedia || CoupletMedia;

})(window);
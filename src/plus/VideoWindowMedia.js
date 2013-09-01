(function (window, sinaadToolkit, undefined) {
    "use strict";

    //常量定义
    var CLOSE_NORMAL_BTN = "http://d1.sina.com.cn/shh/ws/2012/09/29/1/close1.gif",
        CLOSE_HOVER_BTN = "http://d1.sina.com.cn/shh/ws/2012/09/29/1/close2.gif";


    function VideoWindowMedia(config) {
        var THIS = this;

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        this.config = config;
        this.deferred = new sinaadToolkit.Deferred();

        var main = this.main = new sinaadToolkit.Box({
            width : config.width,
            height : config.height,
            position : 'right bottom',
            follow : 1
        });

        var mainWrap = this.mainWrap = document.createElement('div');
        mainWrap.style.cssText = 'position:absolute;left:0px;bottom:0px;width:' + config.width + 'px;height:0px;overflow:hidden;';
        
        var mainContent = this.mainContent = document.createElement('div');
        mainContent.style.cssText = 'position:absolute;width:' + config.width + 'px;height:' + config.height + 'px;left:0px;top:0px;';

        var closeBtn = this.closeBtn = document.createElement('div');
        closeBtn.style.cssText = 'cursor:pointer;z-index:999;position:absolute;width:42px;height:19px;right:7px;top:1px;';
        
        mainWrap.appendChild(closeBtn);
        mainWrap.appendChild(mainContent);
        main.getMain().appendChild(mainWrap);

        sinaadToolkit.event.on(closeBtn, 'click', this.getCloseHandler());
        sinaadToolkit.event.on(closeBtn, 'mouseover', function () {
            this.style.backgroundImage = 'url(' + CLOSE_HOVER_BTN + ')';
        });
        sinaadToolkit.event.on(closeBtn, 'mouseout', function () {
            this.style.backgroundImage = 'url(' + CLOSE_NORMAL_BTN + ')';
        });

        if (this.delay) {
            setTimeout(function () {
                THIS.show();
            }, this.delay * 1000);
        } else {
            this.show();
        }
    }

    VideoWindowMedia.prototype = {
        aniTimer : null,
        show : function () {
            var THIS = this;

            this.mainWrap.style.height = '0px';
            this.main.show();
            this.mainContent.innerHTML = sinaadToolkit.ad.createHTML(
                this.config.type,
                this.config.src,
                this.config.width,
                this.config.height,
                this.config.link,
                this.config.monitor
            );
            this.tmpHeight = 0;
            this.aniTimer = setInterval(function () {
                if (THIS.tmpHeight < THIS.config.height) {
                    THIS.tmpHeight += 10;
                    THIS.mainWrap.style.height = THIS.tmpHeight + 'px';
                } else {
                    THIS.mainWrap.style.height = THIS.config.height + 'px';
                    clearInterval(THIS.aniTimer);
                    THIS.deferred.resolve();
                }
            }, 20);
        },
        hide : function () {
            this.mainContent.innerHTML = '';
            this.aniTimer && clearInterval(this.aniTimer);
            this.main.hide();
        },
        getCloseHandler : function () {
            var THIS = this;
            return function () {
                THIS.hide();
            };
        }
    };

    sinaadToolkit.VideoWindowMedia = sinaadToolkit.VideoWindowMedia || VideoWindowMedia;
})(window, window.sinaadToolkit);
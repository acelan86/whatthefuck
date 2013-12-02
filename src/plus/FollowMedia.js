/**
 * 随行广告，首次改版出现在博客
 */
(function (window, sinaadToolkit, undefined) {
    "use strict";

    var MINI_REPLAY_BTN = 'http://d5.sina.com.cn/d1images/lmt/play.gif',
        MINI_CLOSE_BTN = 'http://d1.sina.com.cn/d1images/lmt/close1.jpg',
        MAIN_CLOSE_BTN = 'http://simg.sinajs.cn/blog7style/images/common/ad/closenew.jpg',
        MAIN_CLOSE_BTN_SIZE = [40, 18],
        MINI_CONTENT_SIZE = [25, 150],
        MINI_REPLAY_BTN_SIZE = [25, 24],
        MINI_CLOSE_BTN_SIZE = [25, 45];


    /**
     * monitor,
     * main{
     *   src :
     *   top :
     *   width :
     *   height :
     *   link : 
     *   type :
     * }
     * mini{
     *     src : 
     *     top : 
     *     link :
     *     type : 
     * }
     * delay 
     * duration
     */

    function FollowMedia(config) {
        var THIS = this;
        this.deferred = new sinaadToolkit.Deferred();

        var width = this.width = config.main.width,
            height = this.height = config.main.height;

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        this.config = config;
        
        var main = this.main = new sinaadToolkit.Box({
            width : width,
            height : height,
            position : 'right ' + (config.main.top || 'top'),
            follow : 1,
            zIndex : 10010
        });

        var mini = this.mini = new sinaadToolkit.Box({
            width : MINI_CONTENT_SIZE[0],
            height : MINI_CONTENT_SIZE[1] + MINI_CLOSE_BTN_SIZE[1] + MINI_REPLAY_BTN_SIZE[1],
            position : 'right ' + (config.mini.top || 'bottom'),
            follow : 1,
            zIndex : 10000
        });

        var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
        mainCloseBtn.style.cssText = [
            'width:' + MAIN_CLOSE_BTN_SIZE[0] + 'px',
            'height:' + MAIN_CLOSE_BTN_SIZE[1] + 'px',
            'position:absolute',
            'right:0px',
            'top:-' + MAIN_CLOSE_BTN_SIZE[1] + 'px',
            'z-index:9999',
            'background:url(' + MAIN_CLOSE_BTN +  ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');
        var miniCloseBtn = this.miniCloseBtn = document.createElement('div');
        miniCloseBtn.style.cssText = 'margin:0px;padding:0px;display:block;cursor:pointer;width:' + MINI_CLOSE_BTN_SIZE[0] + 'px;height:' + MINI_CLOSE_BTN_SIZE[1] + 'px;position:absolute;left:0px;top:' + (MINI_CONTENT_SIZE[1] + MINI_REPLAY_BTN_SIZE[1]) + 'px;background:url(' + MINI_CLOSE_BTN + ') no-repeat center;';
        var miniReplayBtn = this.miniReplayBtn = document.createElement("div");
        miniReplayBtn.style.cssText = 'width:' + MINI_REPLAY_BTN_SIZE[0] + 'px;height:' + MINI_REPLAY_BTN_SIZE[1] + 'px;position:absolute;left:0px;top:' + MINI_CONTENT_SIZE[1] + 'px;background:url(' + MINI_REPLAY_BTN + ') no-repeat center;margin:0px;padding:0px;display:block;cursor:pointer;';


        sinaadToolkit.event.on(miniCloseBtn, 'click', this.getCloseMiniHandler());
        sinaadToolkit.event.on(miniReplayBtn, 'click', this.getReplayHandler());
        sinaadToolkit.event.on(mainCloseBtn, 'click', this.getCloseMainHandler());
        
        var mainContent = this.mainContent = document.createElement('div');
        var miniContent = this.miniContent = document.createElement('div');

        main.getMain().appendChild(mainContent);
        main.getMain().appendChild(mainCloseBtn);

        mini.getMain().appendChild(miniContent);
        mini.getMain().appendChild(miniReplayBtn);
        mini.getMain().appendChild(miniCloseBtn);

        // document.body.insertBefore(main.getMain(), document.body.firstChild);
        // document.body.insertBefore(mini.getMain(), document.body.firstChild);

        if (this.delay) {
            setTimeout(function () {
                THIS.show();
            }, this.delay * 1000);
        } else {
            this.show();
        }

    }
    FollowMedia.prototype = {
        timer : null,
        show : function () {
            var THIS = this,
                config = this.config;

            clearTimeout(this.timer);
            this.miniContent.innerHTML = '';
            this.mainContent.innerHTML = sinaadToolkit.ad.createHTML(
                config.main.type,
                config.main.src,
                config.main.width,
                config.main.height,
                config.main.link,
                config.monitor
            );
            this.main.show();
            this.mini.hide();

            this.deferred.resolve();

            this.timer = setTimeout(function () {
                THIS.hide();
            },  config.duration * 1000 || 8000);
        },
        hide : function () {
            var config = this.config;

            clearTimeout(this.timer);
            this.mainContent.innerHTML = '';
            this.mini.show();
            this.main.hide();
            this.miniContent.innerHTML = sinaadToolkit.ad.createHTML(
                config.mini.type,
                config.mini.src,
                25,
                150,
                config.mini.link,
                config.monitor
            );
        },
        //关闭标签
        getCloseMiniHandler : function () {
            var THIS = this;
            return function () {
                clearTimeout(THIS.timer);
                THIS.mini.hide();
                THIS.miniContent.innerHTML = '';
            };
        },
        getReplayHandler : function () {
            var THIS = this;
            return function () {
                THIS.show();
            };
        },
        getCloseMainHandler : function () {
            var THIS = this;
            return function () {
                THIS.hide();
            };
        }
    };

    sinaadToolkit.FollowMedia = sinaadToolkit.FollowMedia || FollowMedia;

})(window, window.sinaadToolkit);

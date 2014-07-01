/**
 * 流媒体
 * @param  {[type]} window    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";

    var MAIN_CLOSE_ICON1 = 'http://d4.sina.com.cn/d1images/lmt/cls_77x31.gif',
        MAIN_CLOSE_ICON2 = 'http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif',
        REPLAY_ICON = 'http://d5.sina.com.cn/d1images/lmt/play.gif',
        MINI_CLOSE_ICON = 'http://d1.sina.com.cn/d1images/lmt/close1.jpg',
        MAIN_ZINDEX = 12000,
        MIN_ZINDEX = 10000,
        SHOW_COUNT = 2; //自动显示次数

    function StreamMedia(config) {
        var THIS = this;
        this.deferred = new sinaadToolkit.Deferred();

        //频次控制，24小时内只能自动播放2次
        var showCount = sinaadToolkit.storage.get('StreamMedia' + config.pdps);
        showCount = showCount ? (parseInt(showCount, 10) + 1) : 1;
        sinaadToolkit.storage.set('StreamMedia' + config.pdps, showCount, 24 * 60 * 60 * 1000);

        var width = this.width = config.main.width,
            height = this.height = config.main.height;

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        this.config = config;
        this.pdps = config.pdps;
        
        var main = this.main = new sinaadToolkit.Box({
            width : width,
            height : height,
            position : 'center ' + (config.main.top || (width > 320 ? '46' : 'center')),
            follow : 1,
            zIndex : MAIN_ZINDEX
        });
        var mini = this.mini = new sinaadToolkit.Box({
            width : 25,
            height : 219,
            position : 'right bottom',
            follow : 1,
            zIndex : MIN_ZINDEX
        });

        var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
        mainCloseBtn.style.cssText = [
            'width:' + (width > 375 ? 77 : 66) + 'px',
            'height:' + (width > 375 ? 31 : 22) + 'px',
            'position:absolute',
            'right:0px',
            'bottom:' + (width > 375 ? -31 : -22) + 'px',
            'z-index:' + MAIN_ZINDEX,
            'background:url(' + (width > 375 ? MAIN_CLOSE_ICON1 : MAIN_CLOSE_ICON2) + ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');
        var miniCloseBtn = this.miniCloseBtn = document.createElement('div');
        miniCloseBtn.style.cssText = 'margin:0px;padding:0px;display:block;cursor:pointer;width:25px;height:45px;position:absolute;left:0px;top:174px;background:url(' + MINI_CLOSE_ICON + ') no-repeat center;';
        var miniReplayBtn = this.miniReplayBtn = document.createElement("div");
        miniReplayBtn.style.cssText = 'width:25px;height:24px;position:absolute;left:0px;top:150px;background:url(' + REPLAY_ICON + ') no-repeat center;margin:0px;padding:0px;display:block;cursor:pointer;';


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

        //bug
        // document.body.insertBefore(main.getMain(), document.body.firstChild);
        // document.body.insertBefore(mini.getMain(), document.body.firstChild);

        if (this.delay) {
            setTimeout(function () {
                showCount > SHOW_COUNT ? THIS.hide() : THIS.show();
            }, this.delay * 1000);
        } else {
            showCount > SHOW_COUNT ? this.hide() : this.show();
        }

    }
    StreamMedia.prototype = {
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
                config.main.link || config.link,
                config.monitor,
                '',
                {
                    wmode : 'transparent'
                }
            );
            this.main.show();
            this.mini.hide();

            this.timer = setTimeout(function () {
                THIS.hide();
            },  config.duration || (this.width > 300 ? 8000 : 5000));
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
                config.mini.link || config.link,
                config.monitor
            );
            try {
                sinaadToolkit.debug('Media: In building stream complete!');
                mediaControl.done(mediaControl.stream);
            } catch(e) {}
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

    sinaadToolkit.StreamMedia = sinaadToolkit.StreamMedia || StreamMedia;

})(window, window.sinaadToolkit, window.sinaadsROC);

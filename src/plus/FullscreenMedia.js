/**
 * 全屏
 * @param  {[type]} window    [description]
 * @param  {[type]} undefined [description]
 * @return {[type]}           [description]
 */
(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";

    var MAIN_CLOSE_BTN = 'http://d1.sina.com.cn/d1images/fullscreen/cls_77x31.gif',
        MINI_CLOSE_BTN = 'http://d3.sina.com.cn/d1images/fullscreen/close.gif',
        REPLAY_BTN = 'http://d1.sina.com.cn/shh/tianyi/fs/rplBtn_25x100.swf',
        height = 0;

    function FullscreenMedia(config) {
        var element = document.getElementById('FullScreenWrap');
        if (!element) {
            return;
        }
        var THIS = this;

        this.deferred = new sinaadToolkit.Deferred();

        this.width = config.width;
        this.height = config.height + (config.hasClose ? 40 : 0);
        this.src = config.src;
        this.link = config.link;
        this.type = config.type;
        this.monitor = config.monitor;
        this.transitionStep = config.hasClose ? 90 : 98;
        this.replaySrc = config.replaySrc || REPLAY_BTN;
        this.replaySrcType = config.replaySrcType || 'flash';
        this.duration = config.duration || (config.hasClose ? 5000 : 8000);

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        var container = this.container = document.createElement('div');
        container.style.cssText = 'width:' + this.width + 'px;margin:0px auto;position:relative;';
        element.appendChild(container);

        var main = this.main = document.createElement('div');
        main.style.cssText = 'display:none;';

        var mainContent = this.mainContent = document.createElement('div');
        mainContent.style.cssText = 'position:relative;overflow:hidden;width:' + this.width + 'px;height:0px;margin:0;padding:0;';
        main.appendChild(mainContent);
        container.appendChild(main);

        if (config.hasClose) {
            var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
            mainCloseBtn.style.cssText = 'cursor:pointer;position:absolute;width:77px;height:31px;right:0px;top:' + this.height + 'px;background:url(' + MAIN_CLOSE_BTN + ') no-repeat;margin:0;padding:0;';

            var mini = this.mini = document.createElement('div');
            mini.style.cssText = 'width:25px;height:117px;position:absolute;left:' + this.width + 'px;top:0px;margin:0;padding:0;overflow:hidden;';

            var miniContent = this.miniContent = document.createElement('div');
            miniContent.style.cssText = 'position:absolute;left:0px;top:0px;width:25px;height:100px;overflow:hidden;margin:0;padding:0';
            
            var replayBtn = this.replayBtn = document.createElement('div');
            replayBtn.style.cssText = 'cursor:pointer;position:absolute;left:0px;top:0px;width:25px;height:100px;overflow:hidden;margin:0;padding:0;background:#fff;opacity:0;*filter:alpha(opacity=0);';

            var miniCloseBtn = this.miniCloseBtn = document.createElement('div');
            miniCloseBtn.style.cssText = 'cursor:pointer;width:25px;height:17px;position:absolute;right:0px;top:100px;background:url(' + MINI_CLOSE_BTN + ') no-repeat right;margin:0;padding:0;';
            
            miniContent.innerHTML = sinaadToolkit.ad.createHTML(
                this.replaySrcType,
                this.replaySrc,
                25,
                100
            );
            
            main.appendChild(mainCloseBtn);

            mini.appendChild(miniContent);
            mini.appendChild(replayBtn);
            mini.appendChild(miniCloseBtn);

            container.appendChild(mini);

            sinaadToolkit.event.on(this.mainCloseBtn, 'click', this.getCloseMainHandler());
            sinaadToolkit.event.on(this.miniCloseBtn, 'click', this.getCloseMiniHandler());
            sinaadToolkit.event.on(this.replayBtn, 'click', this.getReplayHandler());
        }

        if (this.delay) {
            setTimeout(function () {
                THIS.show();
            }, this.delay * 1000);
        } else {
            this.show();
        }

    }

    FullscreenMedia.prototype = {
        timer : null, //关闭时间
        aniTimer : null,  //动画时间
        show : function () {
            var THIS = this;

            clearTimeout(this.timer);

            this.mainContent.innerHTML = sinaadToolkit.ad.createHTML(
                this.type,
                this.src,
                this.width,
                this.height,
                this.link,
                this.monitor
            );
            this.main.style.display = 'block';

            if (this.mini) {
                this.mini.style.display = 'none';
            }

            this.expand(this.height, this.transitionStep, function () {
                THIS.deferred.resolve();
                THIS.timer = setTimeout(function () {
                    THIS.hide();
                }, THIS.duration);
            });
        },
        hide : function () {
            var THIS = this;

            clearTimeout(this.timer);
            this.fold(this.transitionStep, function () {
                THIS.main.style.display = 'none';
                THIS.mini && (THIS.mini.style.display = 'block');


                try { mediaControl.setDoneState('fullscreen'); } catch(e) {}
            });
        },
        expand : function (end, step, onexpandend) {
            var THIS = this;
            if (height < end) {
                height += step;
                this.mainContent.style.height = Math.min(end, height) + "px";
                this.aniTimer = setTimeout(function () {
                    THIS.expand(end, step, onexpandend);
                }, 100);
            } else {
                clearTimeout(this.aniTimer);
                onexpandend();
            }
        },
        fold : function (step, onfold) {
            var THIS = this;
            if (height > 0) {
                height -= step;
                this.mainContent.style.height = height + 'px';
                this.aniTimer = setTimeout(function () {
                    THIS.fold(step, onfold);
                }, 100);
            } else {
                clearTimeout(this.aniTimer);
                onfold();
            }
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
        },
        getCloseMiniHandler : function () {
            var THIS = this;
            return function () {
                clearTimeout(this.timer);
                THIS.mini.style.display = 'none';
            };
        }
    };

    sinaadToolkit.FullscreenMedia = sinaadToolkit.FullscreenMedia || FullscreenMedia;
})(window, window.sinaadToolkit, window.sinaadsMediaControl);

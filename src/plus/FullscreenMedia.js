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
        REPLAY_BTN = 'http://d2.sina.com.cn/litong/zhitou/sinaads/release/fullscreen_replay_btn.swf',
        height = 0,
        SHOW_COUNT = 2; //自动显示次数;

    function FullscreenMedia(config) {
        var element = document.getElementById('FullScreenWrap');
        if (!element) {
            try {
                sinaadToolkit.debug('Media: In building fullscreen complete!');
                mediaControl.done(mediaControl.fullscreen);
            } catch(e) {}
            return;
        }
        var THIS = this;

        this.deferred = new sinaadToolkit.Deferred();

        //频次控制，24小时内只能自动播放2次
        var showMain = sinaadToolkit.ad.getTimesInRange('FullscreenMedia' + config.pdps, SHOW_COUNT, 24 * 60 * 60 * 1000);

        this.width = config.width;
        this.height = config.height + (config.hasClose ? 40 : 0);
        this.contentHeight = config.height;
        this.src = config.src;
        this.link = config.link;
        this.type = config.type;
        this.monitor = config.monitor;
        this.pv = config.pv;
        this.transitionStep = config.hasClose ? 90 : 98;
        this.replaySrc = config.replaySrc || REPLAY_BTN;
        this.replaySrcType = config.replaySrcType || 'flash';
        this.duration = config.duration || (config.hasClose ? 8000 : 5000);
        this.pdps = config.pdps;
        this.replayFuncName = "fullscreenReplayFunc" + config.pdps;


        this.delay = config.delay ? parseInt(config.delay, 10) : 0;

        var container = this.container = document.createElement('div');
        container.style.cssText = 'width:' + this.width + 'px;margin:0px auto;position:relative;';
        element.appendChild(container);

        var main = this.main = document.createElement('div');
        main.className = 'sinaads-fullscreen-main';
        main.style.cssText = 'display:none;';

        var mainContent = this.mainContent = document.createElement('div');
        mainContent.style.cssText = 'position:relative;overflow:hidden;width:' + this.width + 'px;height:0px;margin:0;padding:0;';
        main.appendChild(mainContent);
        container.appendChild(main);

        if (config.hasClose) {
            var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
            mainCloseBtn.style.cssText = 'cursor:pointer;position:absolute;width:77px;height:31px;right:0px;top:' + this.contentHeight + 'px;background:url(' + MAIN_CLOSE_BTN + ') no-repeat;margin:0;padding:0;';

            var mini = this.mini = document.createElement('div');
            mini.style.cssText = 'width:25px;height:117px;position:absolute;left:' + this.width + 'px;top:0px;margin:0;padding:0;overflow:hidden;';

            var miniContent = this.miniContent = document.createElement('div');
            miniContent.style.cssText = 'position:absolute;left:0px;top:0px;width:25px;height:100px;overflow:hidden;margin:0;padding:0';
            
            var miniCloseBtn = this.miniCloseBtn = document.createElement('div');
            miniCloseBtn.style.cssText = 'cursor:pointer;width:25px;height:17px;position:absolute;right:0px;top:100px;background:url(' + MINI_CLOSE_BTN + ') no-repeat right;margin:0;padding:0;';
            
            main.appendChild(mainCloseBtn);
            mini.appendChild(miniContent);


            //根据是否传入replay元素来判断使用默认还是使用传入的replay元素进行关闭，如果是传入的，使用mask遮罩的方式进行点击事件挂接
            if (config.replaySrc) {
                var closeMask = document.createElement('div');
                closeMask.style.cssText = 'cursor:pointer;position:absolute;left:0px;top:0px;width:25px;height:100px;overflow:hidden;margin:0;padding:0;background:#fff;opacity:0;*filter:alpha(opacity=0);';

                miniContent.innerHTML = sinaadToolkit.ad.createHTML(
                    this.replaySrcType,
                    this.replaySrc,
                    25,
                    100,
                    this.monitor,
                    this.pv
                );
                mini.appendChild(closeMask);
                sinaadToolkit.event.on(closeMask, 'click', this.getReplayHandler());
            } else {
                //使用默认的replay按钮
                window[this.replayFuncName] = this.getReplayHandler();
                miniContent.innerHTML = sinaadToolkit.swf.createHTML({
                    url : REPLAY_BTN,
                    width : 25,
                    height : 100,
                    wmode : 'transparent',
                    allowScriptAccess : 'always',
                    vars : {
                        'replayFunc' : this.replayFuncName
                    }
                });
            }


            mini.appendChild(miniCloseBtn);
            container.appendChild(mini);

            sinaadToolkit.event.on(this.mainCloseBtn, 'click', this.getCloseMainHandler());
            sinaadToolkit.event.on(this.miniCloseBtn, 'click', this.getCloseMiniHandler());
        }

        if (this.delay) {
            setTimeout(function () {
                (config.hasClose && !showMain) ? THIS.hide() : THIS.show();
            }, this.delay * 1000);
        } else {
            (config.hasClose && !showMain) ? THIS.hide() : THIS.show();
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
                this.contentHeight,
                this.link,
                this.monitor,
                this.pv
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


                try {
                    sinaadToolkit.debug('Media: In building fullscreen complete!');
                    mediaControl.done(mediaControl.fullscreen);
                } catch(e) {}
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
})(window, window.sinaadToolkit, window.sinaadsROC);

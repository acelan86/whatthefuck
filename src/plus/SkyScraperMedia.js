/**
 * desc: 他们管这个广告叫 随屏扩展按钮
 * 擎天柱广告类型 左侧长条广告，展示5s后，收缩成小长条广告。鼠标移到小广告上，长广告展开，小广告隐藏。
 * 默认需要两个素材：
 *     长素材: size取sax 返回size
 *     短素材: 宽度默认与长素材相同 高度：270
 * demo: http://d1.sina.com.cn/litong/zhitou/zhangfei/demo/zd/edu.html
 * author: shixi_zhangdan@staff.sina.com.cn fedeoo[zhangfei1@staff.sina.com.cn]
 * date: 2014-08-08
 */

(function(window, sinaadToolkit, undefined) {
    "use strict";

    var MAIN_CLOSE_BTN = 'http://d9.sina.com.cn/litong/zhitou/test/images/close-h.jpg',
        MAIN_CLOSE_BTN_SIZE = [40, 18],
        MINI_CONTENT_HEIGHT = 270; // 小广告高度固定设置为270

    function SkyScraperMedia(config) {
        var THIS = this;

        var width = this.width = config.main.width,
            height = this.height = config.main.height,
            miniwidth = config.mini.width,
            miniHeight = this.miniHeight = MINI_CONTENT_HEIGHT;

        this.delay = config.delay ? parseInt(config.delay, 10) : 0;
        this.config = config;

        var main = this.main = new sinaadToolkit.Box({ // position值为px时 minViewportWidth无效
            width: width,
            height: height,
            position: config.left + ' ' + config.top,
            follow: 1,
            zIndex: 10010
        });

        var mini = this.mini = new sinaadToolkit.Box({
            width: miniwidth,
            height: miniHeight,
            position: config.left + ' ' + config.top,
            follow: 1,
            zIndex: 10000
        });
        var mainContent = this.mainContent = document.createElement('div');
        mainContent.style.cssText = 'width:' + width + 'px;height:' + height + 'px;position:absolute;right:0px;bottom:0px;';
        mainContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.main.type,
            config.main.src,
            width,
            height,
            config.main.link,
            config.monitor
        );
        var miniContent = this.miniContent = document.createElement('div');
        miniContent.style.cssText = 'width:' + miniwidth + 'px;height:' + miniHeight + 'px;position:absolute;right:0px;bottom:0px;';
        miniContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.mini.type,
            config.mini.src,
            miniwidth,
            miniHeight,
            config.link,
            config.monitor
        );

        var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
        mainCloseBtn.style.cssText = [
            'width:' + MAIN_CLOSE_BTN_SIZE[0] + 'px',
            'height:' + MAIN_CLOSE_BTN_SIZE[1] + 'px',
            'position:absolute',
            'right:0px',
            'top:0px',
            'bottom:' + MAIN_CLOSE_BTN_SIZE[1] + 'px',
            'z-index:9999',
            'background:url(' + MAIN_CLOSE_BTN + ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');
        var miniCloseBtn = this.miniCloseBtn = document.createElement('div');
        miniCloseBtn.style.cssText = [
            'width:' + MAIN_CLOSE_BTN_SIZE[0] + 'px',
            'height:' + MAIN_CLOSE_BTN_SIZE[1] + 'px',
            'position:absolute',
            'right:0px',
            'top:0px',
            'bottom:' + MAIN_CLOSE_BTN_SIZE[1] + 'px',
            'z-index:9999',
            'background:url(' + MAIN_CLOSE_BTN + ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');

        this.clientWidth = document.body.clientWidth;

        this.closeHandler = this.getCloseHandler();
        sinaadToolkit.event.on(miniCloseBtn, 'click', this.closeHandler);
        sinaadToolkit.event.on(mainCloseBtn, 'click', this.closeHandler);


        //注册mini的mouseover事件
        this.miniMouseOverHandler = this.getMiniMouseOverHandler();
        sinaadToolkit.event.on(this.miniContent, 'mouseover', this.miniMouseOverHandler);
        //注册的是窗口变化的事件
        this.resizeHandler = this.getResizeHandler();
        sinaadToolkit.event.on(window, 'resize', this.resizeHandler);


        main.getMain().appendChild(mainCloseBtn);
        main.getMain().appendChild(mainContent);

        mini.getMain().appendChild(miniCloseBtn);
        mini.getMain().appendChild(miniContent);
        this.timer = null;
        this.isMainClosed = false; //大图标是否被关闭了
        setTimeout(function() {
            THIS.show();
        }, this.delay * 1000);
    }
    SkyScraperMedia.prototype = {
        show: function() { //展示大图片调用的方法
            var THIS = this,
                config = this.config;
            this.mainContent.innerHTML = sinaadToolkit.ad.createHTML(
                config.main.type,
                config.main.src,
                config.main.width,
                config.main.height,
                config.main.link,
                config.monitor
            );
            this.main.show();
            clearTimeout(this.timer);
            this.timer = setTimeout(function() {
                THIS.hide();
                THIS.showMini();
            }, config.duration * 1000 || 8000);

            this.hideMini();
        },
        showMini: function() {
            var config = this.config;
            if (!!config.mini.src) { // 检查是否有小图片
                this.miniContent.innerHTML = sinaadToolkit.ad.createHTML(
                    config.mini.type,
                    config.mini.src,
                    config.mini.width,
                    this.miniHeight,
                    config.mini.link,
                    config.monitor
                );
                this.mini.show();
            }
        },
        hideMini: function() {
            this.miniContent.innerHTML = '';
            this.mini.hide();
        },
        hide: function() { //隐藏大图片调用的方法
            clearTimeout(this.timer);
            this.mainContent.innerHTML = '';
            this.main.hide();
        },
        getResizeHandler: function() {
            var THIS = this,
                config = this.config;
            var left = this.config.left;
            return function() {
                if (document.body.clientWidth < config.midWidth + (THIS.width + left) * 2) {
                    THIS.hide();
                    THIS.hideMini();
                } else if (THIS.isMainClosed) { // 关闭过，再次显示小的
                    THIS.hide();
                    THIS.showMini();
                } else {
                    THIS.show();
                }

            };
        },
        getCloseHandler: function() {
            var THIS = this;
            return function() {
                // clearTimeout(THIS.timer);
                THIS.hide();
                THIS.hideMini();
                sinaadToolkit.event.un(THIS.mainCloseBtn, 'click', THIS.closeHandler);
                sinaadToolkit.event.un(THIS.miniCloseBtn, 'click', THIS.closeHandler);
                sinaadToolkit.event.un(THIS.miniContent, 'mouseover', THIS.miniMouseOverHandler);
                sinaadToolkit.event.un(window, 'resize', THIS.resizeHandler);
            };
        },
        getMiniMouseOverHandler: function() { //当指针移动到mini时触发的事件
            var THIS = this;
            return function() {
                THIS.show();
            };
        }
    };

    sinaadToolkit.SkyScraperMedia = sinaadToolkit.SkyScraperMedia || SkyScraperMedia;

})(window, window.sinaadToolkit);
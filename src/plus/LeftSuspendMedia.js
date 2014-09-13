((function(window, sinaadToolkit, undefined) {
    "use strict";
    var CLOSE_BTN = 'http://d9.sina.com.cn/litong/zhitou/test/images/close-h.jpg',
        CLOSE_BTN_SIZE = [40, 18];


    function LeftSuspendMedia(config) {
        this.cookieKey = config.cookieKey;
        var width = this.width = config.width;
        var height = this.height = config.height;
        var main = this.main = new sinaadToolkit.Box({
            position: {
                of: [window, window],
                at: 'left top',
                my: 'left top+120px'
            },
            follow: 1,
            width: width,
            height: height + CLOSE_BTN_SIZE[1]
        });
        var mainContent = this.mainContent = document.createElement('div');
        mainContent.style.cssText = 'width:' + width + 'px;height:' + height + 'px;position:absolute;right:0px;bottom:0px;';
        mainContent.innerHTML = sinaadToolkit.ad.createHTML(
            config.type,
            config.src,
            width,
            height,
            config.link,
            config.monitor
        );
        var mainCloseBtn = this.mainCloseBtn = document.createElement('div');
        mainCloseBtn.style.cssText = [
            'width:' + width + 'px',
            'height:' + CLOSE_BTN_SIZE[1] + 'px',
            'position:absolute',
            'right:0px',
            'top:' + height + 'px',
            'z-index:10000',
            'background:url(' + CLOSE_BTN + ') no-repeat right center #ebebeb',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');
        // document.body.insertBefore(main.getMain(),document.body.firstChild);
        main.getMain().appendChild(mainCloseBtn);
        main.getMain().appendChild(mainContent);

        this.closeHandler = this.getCloseHandler();
        sinaadToolkit.event.on(mainCloseBtn, 'click', this.closeHandler);


    }
    LeftSuspendMedia.prototype = {
        resizeTimeout: null,
        getCloseHandler: function() {
            var THIS = this;
            return function() {
                THIS.mainContent.innerHTML = '';
                THIS.main.hide();
                if (!sinaadToolkit.storage.get(THIS.cookieKey)) {
                    sinaadToolkit.storage.set(THIS.cookieKey, '1', 10 * 60 * 1000);
                }

                sinaadToolkit.event.un(THIS.mainCloseBtn, 'click', THIS.closeHandler);

            };
        }
    };
    sinaadToolkit.LeftSuspendMedia = sinaadToolkit.LeftSuspendMedia || LeftSuspendMedia;
})(window, window.sinaadToolkit));
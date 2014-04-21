/**
 * 弹窗广告，各个位置的广告
 */
(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";

    var MAIN_CLOSE_ICON_FOR_CENTER = 'http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif',
        MAIN_CLOSE_ICON_FOR_OTHER = 'http://d1.sina.com.cn/shh/ws/2012/09/29/1/close1.gif',
        MAIN_ZINDEX = 11000,
        CLOSE_ZINDEX = 11010;


    function PopMedia(element, config) {
        var position = config.position || 'center center',
            buttonSize = [42, 22],
            buttonBackground = MAIN_CLOSE_ICON_FOR_OTHER,
            height = config.height,
            mainPadding = 0;

        if ('center center' === position) {
            buttonSize = [66, 22];
            buttonBackground = MAIN_CLOSE_ICON_FOR_CENTER;
            height = parseInt(height, 10) + buttonSize[1];
            mainPadding = buttonSize[1];
        }

        var main = this.main = new sinaadToolkit.Box({
            position: position,
            width : config.width,
            height : height,
            follow : config.follow || 1,
            autoShow : 1,
            zIndex : config.zIndex || MAIN_ZINDEX
        });

        var button = this.button = document.createElement('div');
        button.style.cssText = [
            'width:' + buttonSize[0] + 'px',
            'height:' + buttonSize[1] + 'px',
            'position:absolute',
            'right:0px',
            'top:0px',
            'z-index:' + CLOSE_ZINDEX,
            'background:url(' + buttonBackground + ') no-repeat',
            'margin:0',
            'padding:0',
            'cursor:pointer'
        ].join(';');

        element.style.cssText += ';display:block;padding-top:' + mainPadding + 'px';
        element.innerHTML = sinaadToolkit.ad.createHTML(
            config.type,
            config.src,
            config.width,
            config.height,
            config.link,
            config.monitor
        );

        main.getMain().appendChild(button);
        main.getMain().appendChild(element);

        sinaadToolkit.event.on(button, 'click', this._getCloseHandler());
    }

    PopMedia.prototype = {
        _getCloseHandler : function () {
            var me = this;
            return function () {
                me.hide();
            };
        },
        hide : function () {
            this.main.hide();
        }
    };

    sinaadToolkit.PopMedia = sinaadToolkit.PopMedia || PopMedia;

})(window, window.sinaadToolkit, window.sinaadsROC);
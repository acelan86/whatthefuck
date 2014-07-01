/**
 * 弹窗广告，各个位置的广告
 */
(function (window, sinaadToolkit, mediaControl, undefined) {
    "use strict";

    var MAIN_CLOSE_ICON_FOR_CENTER = 'http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif',
        MAIN_CLOSE_ICON_FOR_OTHER = 'http://d1.sina.com.cn/shh/ws/2012/09/29/1/close1.gif',
        MAIN_ZINDEX = 11000,
        CLOSE_ZINDEX = 11010,
        UID = 0;


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


        main.getMain().appendChild(button);
        main.getMain().appendChild(element);

        element.style.cssText += ';display:block;overflow:hidden;text-decoration:none;padding-top:' + mainPadding + 'px';
        element.innerHTML = '<ins style="text-decoration:none;margin:0px auto;display:block;overflow:hidden;width:' + config.width + 'px;height:' + config.height + 'px;"></ins>';
        element = element.getElementsByTagName('ins')[0];

        var adContent = config.src ? sinaadToolkit.ad.createHTML(
            config.type,
            config.src,
            config.width,
            config.height,
            config.link,
            config.monitor
        ) : '';   //广告内容， 如果没有src，则不渲染 

        switch (config.type[0]) {
            case 'text' :
            case 'image' :
            case 'url' :
            case 'adbox' :
            case 'flash' :
                element.innerHTML = adContent;
                break;
            default :
                //创建广告渲染的沙箱环境，并传递部分广告参数到沙箱中
                sinaadToolkit.sandbox.create(element, config.width + 'px', config.height + 'px', adContent, {
                    sinaads_uid             : 'PopMediaSandbox' + UID++,
                    sinaads_ad_pdps         : config.pdps,
                    sinaads_ad_width        : config.width,
                    sinaads_ad_height       : config.height
                });
                break;
        }

        sinaadToolkit.event.on(button, 'click', this._getCloseHandler());

        try {
            sinaadToolkit.debug('Media: In building pop(' + config.pdps + ')complete!');
            mediaControl.done(config.pdps);
        } catch (e) {}
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
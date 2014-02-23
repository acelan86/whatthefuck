(function (window, sinaadToolkit, undefined) {
    "use strict";

    var MAIN_CLOSE_BTN = 'http://d1.sina.com.cn/shh/tianyi/bg/audi_zty_cls1.jpg';//40×18

    function BgMedia (config) {

        var cookie = sinaadToolkit.cookie.get('bgAdCookie' + config.pdps);
        if (cookie === '0') { //关闭后一天不再显示
            return ;
        }
        var midBg = this.midBg = document.getElementById('bgAdWrap');
        if (!midBg) {
            return;
        }
        //body 设置背景
        this.config = config;
        var body  = document.body;
        //如果之前的cssText不以;结尾，在IE8下 样式显示不正确。
        body.style.cssText += ';background:url(' + config.src + ') no-repeat center ' + config.top + 'px;margin:0px;';

        midBg.style.cssText += ';position:relative;height: ' + config.headHeight + 'px;width: ' + config.midWidth + 'px;margin:0 auto;';
        midBg.innerHTML = '<a href="' + config.link + '" target="_blank" style="display:block;height:' + config.headHeight + 'px;width: ' + config.midWidth + 'px;"></a>';

        if (config.asideClickable) {
            //左右可点击
            var leftAd = this.leftAd = document.createElement('a');
            leftAd.setAttribute('href', config.link);
            leftAd.setAttribute('target', '_blank');

            var rightAd =  this.rightAd = document.createElement('a');
            rightAd.setAttribute('href', config.link);
            rightAd.setAttribute('target', '_blank');

            leftAd.style.cssText += ';position: absolute;height: ' + config.height + 'px;left:0px;top: ' + config.top + 'px';
            rightAd.style.cssText += ';position: absolute;height: ' + config.height + 'px;left:0px;top: ' + config.top + 'px';
            body.appendChild(leftAd);
            body.appendChild(rightAd);
        }
        

        var closeBtn = this.closeBtn = document.createElement('div');
        closeBtn.style.cssText += ';width: 40px;height: 18px;position:absolute;right:1px;top: 6px;background:url(' + MAIN_CLOSE_BTN + ') no-repeat right center #ebebeb;cursor:pointer';
        midBg.appendChild(closeBtn);

        //初始调整大小
        this.getResizeHandler()();

        this.closeHandler = this.getResizeHandler();
        sinaadToolkit.event.on(window, 'resize', this.closeHandler);
        sinaadToolkit.event.on(closeBtn, 'click', this.getCloseHandler());
    }

    BgMedia.prototype = {
        getResizeHandler: function () {
            var me = this;
            return function () {
                var clientWidth = document.body.clientWidth;
                var midWidth = me.config.midWidth;
                var midX = sinaadToolkit.dom.getPosition(document.getElementById('bgAdWrap')).left;

                var halfWidth = (clientWidth - midWidth) / 2;
                if (halfWidth < 0) {
                    halfWidth = 0;
                }

                if (me.config.asideClickable) {
                    me.leftAd.style.cssText += ';width:' + halfWidth + 'px;left: ' + (midX - halfWidth) + 'px';
                    me.rightAd.style.cssText += ';width:' + halfWidth + 'px;left: ' + (midX + midWidth) + 'px';
                }
            };
        },
        getCloseHandler: function () {
            var me = this;
            return function () {
                sinaadToolkit.cookie.set('bgAdCookie' + me.config.pdps, 0 , 24 * 60 * 60 * 1000);
                sinaadToolkit.event.un(window, 'resize', me.closeHandler);
                document.body.style.cssText += ';background:none;';
                me.midBg.style.display = 'none';
                
                if (me.config.asideClickable) {
                    me.leftAd.style.display = 'none';
                    me.rightAd.style.display = 'none';
                }
            };
        }
    };

    sinaadToolkit.BgMedia = sinaadToolkit.BgMedia || BgMedia;

})(window, window.sinaadToolkit);
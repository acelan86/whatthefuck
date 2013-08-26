/**
 * 博客tips
 */
(function (window, undefined) {

    sinaadToolkit.Tip = function (element, config) {
        this.relateElement = element;
        this.top = config.top || 0;
        this.element = document.createElement('div');
        this.element.style.cssText += ';border:1px solid #ccc;z-index:' + (config.zIndex || 9999) + ';display:none;position:absolute;width:' + config.width + 'px;height:' + config.height + 'px;overflow:hidden;';
        this.setPosition();
        document.body.insertBefore(this.element, document.body.firstChild);
        sinaadToolkit.event.on(window, 'resize', this.getResizeHandler());
    }
    sinaadToolkit.Tip.prototype = {
        show : function () {
            this.element.style.display = 'block';
        },
        hide : function () {
            this.element.style.display = 'none';
        },
        setPosition : function () {
            var pos = sinaadToolkit.dom.getPosition(this.relateElement),
                height = this.top || this.relateElement.offsetHeight || 0;
            this.element.style.left = pos.left + 'px';
            this.element.style.top = pos.top + height + 'px';
        },
        getResizeHandler : function () {
            var THIS = this;
            return function () {
                THIS.setPosition();
            }
        } 
    };

    function TipsMedia(element, config) {

        config.src = sinaadToolkit.array.ensureArray(config.src);
        config.type = sinaadToolkit.array.ensureArray(config.type);
        config.link = sinaadToolkit.array.ensureArray(config.link);

        this.config = config;
        element.style.display = 'block';
        element.innerHTML = sinaadToolkit.ad.createHTML(
            config.type[0],
            config.src[0],
            0,
            0,
            config.link[0] || '',
            config.monitor
        ) || '';

        if (config.src[1]) {
            var closeBtn = this.closeBtn = document.createElement('span');
            closeBtn.innerHTML = '×';
            closeBtn.style.cssText += ';position:absolute;right:6px;top:6px;line-height:10px;cursor:pointer;color:#8a8678;';

            var tipContent = this.tipContent = document.createElement('div');
            this.tip = new sinaadToolkit.Tip(element, {
                width : config.width,
                height : config.height,
                top : config.top || 0,
                zIndex : config.zIndex
            });
            this.tip.element.appendChild(tipContent);
            this.tip.element.appendChild(closeBtn);
            tipContent.innerHTML= sinaadToolkit.ad.createHTML(
                config.type[1],
                config.src[1],
                config.width,
                config.height,
                config.link[1] || config.link[0] || '',
                config.monitor
            );

            config.autoShow && this.tip.show();
            sinaadToolkit.event.on(closeBtn, 'click', this.getHideHandler());
        }
    }

    TipsMedia.prototype = {
        getHideHandler : function () {
            var THIS = this;
            return function () {
                THIS.tip.hide();
            }
        }
    };

    sinaadToolkit.TipsMedia = sinaadToolkit.TipsMedia || TipsMedia;

})(window);
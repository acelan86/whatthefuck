/**
 * 博客tips
 */
(function (window, undefined) {

    sinaadToolkit.Tip = function (element, config) {
        this.relateElement = element;
        this.top = config.top || 0;
        this.element = document.createElement('div');
        this.element.style.cssText += ';display:none;position:absolute;width:' + config.width + 'px;height:' + config.height + ';';
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
        element.innerHTML = config.src[0] || '';

        var closeBtn = this.closeBtn = document.createElement('div');
        closeBtn.style.cssText += ';cursor:pointer;position:absolute;width:20px;height:20px;background:#ccc;right:4px;top:4px;';

        var tipContent = this.tipContent = document.createElement('div');
        this.tip = new sinaadToolkit.Tip(element, {
            width : config.width,
            height : config.height,
            top : config.top || 0
        });
        this.tip.element.appendChild(tipContent);
        this.tip.element.appendChild(closeBtn);
        tipContent.innerHTML= sinaadToolkit.ad.createHTML(
            config.type[1],
            config.src[1],
            config.width,
            config.height,
            config.link,
            config.monitor
        );

        config.autoShow && this.tip.show();
        sinaadToolkit.event.on(closeBtn, 'click', this.getHideHandler());
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
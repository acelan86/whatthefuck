(function (window, undefined) {

    if (!window.sinaadToolkit) {
        throw new Error('请先引入依赖脚本，core.js');
        return;
    }

    var core = window.sinaadToolkit,
        sinaads = window.sinaads = window.sinaads || {};


    if (sinaads.stream) {
        return sinaads.stream;
    }

    var SINAADS_AD_TYPE = 'sinaads_stream';

    /**
     * config = {
     *     main : {
     *         src : xxx,
     *         link : xxx,
     *         width : xxx,
     *         height : xxx,
     *         vAlign : '',
     *         hAlign : '',
     *         follow : '',
     *     },
     *     mini : {
     *         src : xxx,
     *         link : xxx,
     *         pos : '',
     *         vAlign : '',
     *         hAlign : '',
     *         follow : ''
     *     }
     * }
     */
    /**
     * 容器基类
     * @param {[type]} config [description]
     */
    function Box(config) {
        var THIS = this;

        this.width = config.width || 0;
        this.height = config.height || 0;
        this.position = config.position || "center center";
        this.follow = config.follow || 0;

        this.positionStyle = this.follow ? (core.browser.isSupportFixed ? 'fixed' : 'absolute') : 'absolute';

        this.element = document.createElement('div');
        this.element.style.position = this.positionStyle;

        this.element.style.cssText += ';width:' + this.width + 'px;height:' + this.height + 'px;border:1px solid #ccc';

        this.setPosition();

        core.event.on(window, 'resize', function () {
            THIS.setPosition();
        });

        if (this.follow && !core.browser.isSupportFixed) {
            core.event.on(window, 'scroll', function () {
                THIS.setPosition();
            });
        }

        document.body.insertBefore(this.element, document.body.firstChild);

    }
    Box.prototype = {
        setPosition : function () {
            var position = this.position.split(' '),
                viewWidth = core.page.getViewWidth(),
                viewHeight = core.page.getViewHeight(),
                offsetTop = 0,
                offsetLeft = 0,
                left = 0,
                top = 0;

            if (this.follow) {
                offsetTop = core.browser.isSupportFixed ? 0 : core.page.getScrollTop() || 0;
                offsetLeft = core.browser.isSupportFixed ? 0 : core.page.getScrollLeft() || 0;
            }

            switch (position[0]) {
                case 'center' :
                    this.element.style.left = (viewWidth - this.width) / 2 + offsetLeft + 'px';
                    break;
                case 'left' :
                    this.element.style.left = offsetLeft + 'px';
                    break;
                case 'right' :
                    if (this.follow) {
                        this.element.style.left = offsetLeft + (viewWidth - this.width) + 'px'; 
                    } else {
                        this.element.style.right = '0px';
                    }
                    break;
                default :
                    this.element.style.left = offsetLeft + (parseInt(position[0], 10) || 0) + 'px';
                    break;
            }
            switch (position[1]) {
                case 'center' :
                    this.element.style.top = (viewHeight - this.height) / 2 + offsetTop + 'px';
                    break;
                case 'top' :
                    this.element.style.top = offsetTop + 'px';
                    break;
                case 'bottom' :
                    if (this.follow) {
                        this.element.style.top = offsetTop + (viewHeight - this.height) + 'px'; 
                    } else {
                        this.element.style.bottom = '0px';
                    }
                    break;
                default :
                    this.element.style.top = offsetTop + (parseInt(position[1], 10) || 0) + 'px';
                    break;
            }
        },
        fill : function (content) {
            this.element.innerHTML = content;
        }
    };

    var SINAADS_STREAM_UID = 0,
        SINAADS_STREAM_MAIN_CLOSE_ICON = '',
        SINAADS_STREAM_MINI_CLOSE_ICON = '',
        SINAADS_STREAM_REPLAY_ICON = '';

    sinaads.stream = function (config) {
        var main = new Box({
            width : config.main.width,
            height : config.main.height,
            position : config.main.position,
            follow : config.main.follow || 0
        });
        var mini = new Box({
            width : config.mini.width,
            height : config.mini.height,
            position : config.mini.position,
            follow : config.mini.follow || 1 
        });

        var mainIframeId = 'StreamMainIframe' + SINAADS_STREAM_UID++;

        //广告内容
        var mainFragment = core.ad.createHTML(
            config.main.type,
            config.main.src,
            config.main.width,
            config.main.height,
            config.main.link,
            config.main.monitor
        );

        core.sandbox.create(main.element, mainIframeId, main.width, main.height, mainFragment);


        var miniIframeId = 'StreamMiniIframe' + SINAADS_STREAM_UID++;

        //mini
        var miniFragment = core.ad.createHTML(
            config.mini.type,
            config.mini.src,
            config.mini.width,
            config.mini.height,
            config.mini.link,
            config.mini.monitor
        );

        core.sandbox.create(mini.element, miniIframeId, mini.width, mini.height, miniFragment);

    }
})(window);

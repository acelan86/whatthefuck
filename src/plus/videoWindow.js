(function (window, undefined) {
    //常量定义
    var SINAADS_AD_TYPE = 'sinaads_videoWindow' + window.sinaads_ad_pdps,
        SINAADS_AD_TYPE_CLOSE_PIC = "http://d1.sina.com.cn/shh/ws/2012/09/29/1/close1.gif",
        SINAADS_AD_TYPE_CLOSE_HOVER_PIC = "http://d1.sina.com.cn/shh/ws/2012/09/29/1/close2.gif";

    //获取所需变量及广告数据构造
    var data = window.sinaads_ad_data.content,
        config = {
            src : data.src,
            link : data.link,
            enabled : false,
            delay : window.sinaads_ad_delay || 0, //延迟播放秒数，默认为0
            replayMonitor: window.sinaads_ad_replay_mo || '', //重播监测地址
            downloadMonitor : window.sinaads_ad_download_mo || '', //下载数监测地址
            reposMonitor : window.sinaads_ad_repos_mo || '' //转发数监测地址
        };

    //引入核心包
    var core = window.sinaads.core;
    if (!core) {
        if (!core) {
            throw new Error('请先引入sinaads.core包，地址xxx');
            return;
        }
    }


    //判断是否iframe中执行
    if (window.top === window.self) {
        sinaads_videoWindow(config, window, window.document);
    } else {
        try {
            sinaads_videoWindow(config, window.top, window.top.document);
            /* 使用适当的代码以让广告对 iframe 进行转义，并展示该广告。该代码很有可能需要使用 DOM 函数并引用顶部窗口。*/
        } catch (e) {
            console.debug(e);
            /* 该广告无法显示在iframe中，可以显示一个适当的备用广告。该备用广告将仍位于该 iframe 中。*/
        }
    }

    /**
     * 视窗展示广告
     * @param  {[type]} config   [description]
     * @param  {[type]} window   [description]
     * @param  {[type]} document [description]
     * @return {[type]}          [description]
     */
    function sinaads_videoWindow(config, window, document){

        function getScrollTop() {
            return core.browser.isStrict ? document.documentElement.scrollTop : document.body.scrollTop;
        }
        function getScrollLeft() {
            return core.browser.isStrict ? document.documentElement.scrollLeft : document.body.scrollLeft;
        }

        if(core.browser.firefox) {
            return;
        }

        var containerId = SINAADS_AD_TYPE + 'Container',
            innerContainerId = SINAADS_AD_TYPE + 'Inner',
            movieId = SINAADS_AD_TYPE + 'Movie',
            container,
            docBody = document.body,
            position = core.browser.isSupportFixed ? 'fixed' : 'absolute',
            innerContainer,
            movie,
            timer = null;


        //创建主容器
        container = document.createElement('div');
        container.id = containerId;
        container.style.cssText = 'position:' + position + ';' +
                                  'right:0px;' + 
                                  'width:300px;' + 
                                  'height:297px;' + 
                                  'text-align:left;' + 
                                  'overflow:hidden;' + 
                                  'z-index:99999;' + 
                                  'visibility:' + (core.browser.ie ? 'hidden' : 'visible;');
        container.innerHTML = [
            '<div id="' + innerContainerId + '" style="position:absolute;bottom:-297px;right:0px;width:300px;height:297px;">',
                '<div style="position:absolute;z-index:999;top:1px;right:7px;">',
                    '<a href="javascript:void(0);">',
                        '<img src="' + SINAADS_AD_TYPE_CLOSE_PIC + '"' + 
                            ' onmouseover="this.src=\'' + SINAADS_AD_TYPE_CLOSE_HOVER_PIC + '\'"' + 
                            ' onmouseout="this.src=\'' + SINAADS_AD_TYPE_CLOSE_PIC + '\'"' + 
                            ' onclick="document.getElementById(\'' + containerId + '\').style.display=\'none\';document.getElementById(\'' + containerId + '\').innerHTML=\'\';" style="border:none" />',
                    '</a>',
                '</div>',
                '<div style="position:absolute;left:0px;top:0px;width:300px;height:297px;z-index:10;">',
                    core.swf.createHTML({
                        width : 300,
                        height : 297,
                        allowScriptAccess : 'always', 
                        id : movieId,
                        url : config.src,
                        wmode : 'opaque',
                        vars : {
                            url : escape(config.link),
                            rp : escape(config.replayMonitor),
                            dl : escape(config.downloadMonitor),
                            fw : escape(config.reposMonitor)
                        },
                        align : 'middle',
                        menu : false,
                        quality : 'hight',
                        bgcolor : '#ffffff'
                    }),
                '</div>',
                '<iframe style="width:100%;height:297px;" frameborder="0"></iframe>',
            '</div>'
        ].join('');
        docBody.insertBefore(container, docBody.firstChild);


        innerContainer = document.getElementById(innerContainerId);
        movie = core.swf.getMovie(movieId, window, document);

        if (config.delay) {
            setTimeout(function () {
                config.enabled = true;
            }, config.delay * 1000);
        }

        var timer = setInterval(function () {
            if(config.enabled){
                clearInterval(timer);
                start();
            }
        }, 200);

        function start(){
            try {
                movie.StopPlay();
            } catch (e) {
                
            }

            if (core.browser.isSupportFixed) {
                container.style.bottom = '0px';
            } else {
                setPosition();
            }
            if (window.attachEvent) {
                window.attachEvent('onresize', setPosition);
                window.attachEvent('onscroll', setPosition);
            } else if (window.addEventListener) {
                window.addEventListener('resize', setPosition, false);
                window.addEventListener('scroll', setPosition, false);
            }

            container.style.visibility = 'visible';

            var i = -297,
                transitionTimer = null,
                playTimer = null;

            transitionTimer = setInterval(function () {
                if (i < 0) {
                    i += 9;
                    innerContainer.style.bottom = i + 'px';
                } else {
                    clearInterval(transitionTimer);
                }
            }, 10);

            playTimer = setInterval(function () {
                if (movie.IsPlaying()) {
                    clearInterval(playTimer);
                } else {
                    movie.Play();
                }
            }, 100);
        }

        function setPosition(){
            if (!core.browser.isSupportFixed) {
                container.style.top = getScrollTop + docBody.clientHeight - 297 + 'px';
            }
        }
    }
})(window);
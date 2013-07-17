(function (window, undefined) {
    var SINAADS_AD_TYPE = 'sinaads_videoOpen',
        SINAADS_AD_TYPE_CLOSE_PIC = "http://d1.sina.com.cn/shh/ws/2012/09/29/1/close1.gif",
        SINAADS_AD_TYPE_CLOSE_HOVER_PIC = "http://d1.sina.com.cn/shh/ws/2012/09/29/1/close2.gif";

    var data = window.sinaads_ad_data.content,
        config = {
            src : data.src,
            link : data.link,
            replayMonitor: window.sinaads_ad_replay_mo, //重播监测地址
            downloadMonitor : window.sinaads_ad_download_mo, //下载数监测地址
            reposMonitor : window.sinaads_ad_repos_mo //转发数监测地址
        };

    var core = window.sinaads.core;

    if (!core) {
        if (!core) {
            throw new Error('请先引入sinaads.core包，地址xxx');
            return;
        }
    }

    if (window.top === window.self) {
        videoOpen(config, window, window.document);
        /* 广告不在 iframe 中。展示该广告。可以使用 document.write 展示该广告。*/
    } else {
        try {
            videoOpen(config, window.top, window.top.document);
            /* 使用适当的代码以让广告对 iframe 进行转义，并展示该广告。该代码很有可能需要使用 DOM 函数并引用顶部窗口。*/
        } catch (e) {
            document.write('由于跨域， 无法显示跨栏广告');
            console.debug(e);
            /* 该广告无法对该 iframe 进行转义。显示一个适当的备用广告。该备用广告将仍位于该 iframe 中。*/
        }
    }

    function videoOpen(config, window, document){
        if(core.browser.firefox) {
            return;
        }

        var containerId = SINAADS_AD_TYPE + 'Container',
            innerContainerId = SINAADS_AD_TYPE + 'Inner',
            movieId = SINAADS_AD_TYPE + 'Movie',
            container,
            docBody = core.browser.isStrict ? document.documentElement : document.body,
            position = !core.browser.ie || core.browser.ie >= 7 ? 'fixed' : 'absolute',
            innerContainer,
            movie,
            timer = null;

        container = document.createElement('div');
        container.id = containerId;
        container.style.cssText = 'position:' + position + ';' +
                                  'bottom:0;' + 
                                  'right:0;' + 
                                  'width:300px;' + 
                                  'height:297px;' + 
                                  'text-align:left;' + 
                                  'overflow:hidden;' + 
                                  'z-index:999999;' + 
                                  'visibility:' + (core.browser.ie ? 'hidden':'visible;');
        docBody.appendChild(container);

        container.innerHTML = [
            '<div id="' + innerContainerId + '" style="position:absolute;right:0;top:0px;width:300px;height:297px;">',
                '<div style="position:absolute;z-index:999;top:1px;right:7px;">',
                    '<a href="javascript:void(0)">',
                        '<img src="' + SINAADS_AD_TYPE_CLOSE_PIC + '"' + 
                            ' onmouseover="this.src=\'' + SINAADS_AD_TYPE_CLOSE_HOVER_PIC + '\'"' + 
                            ' onmouseout="this.src=\'' + SINAADS_AD_TYPE_CLOSE_PIC + '\'"' + 
                            ' onclick="document.getElementById(\'' + containerId + '\').style.display=\'none\';document.getElementById(\'' + containerId + '\').innerHTML=\'\';" style="border:none" />',
                    '</a>',
                '</div>',
                '<div style="position:absolute;left:0;top:0;width:300px;height:297px;z-index:10;">',
                    '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0" width="300" height="297" id="' + movieId +'" name="' + movieId + '" align="middle">',
                        '<param name="allowScriptAccess" value="always" />',
                        '<param name="movie" value="' + config.src + '" />',
                        '<param name="wmode" value="opaque" />',
                        '<param name="flashvars" value="url=' + escape(config.link) + '&rp=' + escape(config.replayMonitor) + '&dl=' + escape(config.downloadMonitor) + '&fw=' + escape(config.reposMonitor) + '" />',
                        '<param name="menu" value="false" />',
                        '<param name="quality" value="high" />',
                        '<param name="bgcolor" value="#ffffff" />',
                        '<embed src="' + config.src + '" id="' + movieId + '" name="' + movieId + '" allowScriptAccess="always" wmode="transeparent" menu="false" flashvars="url=' + escape(config.link) + '&rp=' + escape(config.replayMonitor) + '&dl=' + escape(config.downloadMonitor) + '&fw=' + escape(config.reposMonitor) + '" quality="high" bgcolor="#ffffff" width="300" height="297" align="middle" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" style="position:relative; z-index:2;" />',
                    '</object>',
                '</div>',
                '<iframe style="width:100%;height:297px;" frameborder="0"></iframe>',
            '</div>'
        ].join('');

        // Hook for IE
        // if (os.ie) {
        //  document.write('<script language=\"VBScript\"\>\n');
        //  document.write('On Error Resume Next\n');
        //  document.write('Sub videoPlayer_FSCommand(ByVal command, ByVal args)\n');
        //  document.write('    Call videoPlayer_DoFSCommand(command, args)\n');
        //  document.write('End Sub\n');
        //  document.write('</script\>\n');
        // }

        innerContainer = document.getElementById(innerContainerId);
        movie = core.swf.getMovie(movieId, window, document);

        try{
            movie.StopPlay();
        }catch(e){}

        //判断加载进度与播放开关
        if(!core.browser.ie) {
            config.enabled = true;
        }
        var timer = setInterval(function () {
            if(movie.PercentLoaded() >= 100 && config.enabled){
                clearInterval(timer);
                start();
            }
        }, 200);

        function start(){
            innerContainer.style.top = docBody.scrollTop + docBody.clientHeight + 'px';
            setLeft();
            setTop();
            if (window.attachEvent) {
                window.attachEvent('onresize', setLeft);
                window.attachEvent('onscroll', setTop);
            } else if (window.addEventListener) {
                window.addEventListener('resize', setLeft, false);
                window.addEventListener('scroll', setTop, false);
            }

            innerContainer.style.visibility = 'visible';

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
            }, 50);

            playTimer = setInterval(function () {
                if (movie.IsPlaying()) {
                    clearInterval(playTimer);
                } else {
                    movie.Play();
                }
            }, 100);
        }


        function setLeft(){
            container.style.left = docBody.clientWidth - 300 + 'px';
        }

        function setTop(){
            var scrollTop = docBody.scrollTop;
            container.style.top = (!core.browser.ie || core.browser.ie >= 7 ? 0 : scrollTop) + docBody.clientHeight - 297 + 'px';
        }
    }
})(window);
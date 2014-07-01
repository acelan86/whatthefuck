/**
 * 拉幕广告
 * @param  {[type]} lamu    [description]
 */
(function () {
    "use strict";
    var CLOSE_IMAGE = 'http://d4.sina.com.cn/d1images/lmt/cls_77x31.gif';

    //构造方法
    function LamuMedia(element, config) {
        this.element = element;
        this.width = config.width;
        this.height = config.height;
        this.src = config.src;
        this.link = config.link;
        this.type = config.type;
        this.monitor = config.monitor;
        
        this.timeout = 5000;
        this.show();
    }

    LamuMedia.prototype = {
        show: function () {
            var THIS = this;
            var sinaadToolkit = window.sinaadToolkit;
            var countText = document.createElement("span");
            this.element.style.cssText += ";position:absolute;top:0;left:0;width:"+ this.width +"px;height:"+ this.height +"px;";
            this.element.innerHTML = sinaadToolkit.ad.createHTML(this.type, this.src, this.width, this.height, this.link, this.monitor);
            countText.style.cssText += ";position:absolute;width:120px;height:22px;font:100 12px/22px '微软雅黑';top:0;left:0;border:1px dotted #ccc;background:#f5f5f5;box-shadow:1px 1px 5px #333;filter:alpha(opacity=80);opacity:0.8;padding:0 0 0 50px;";
            countText.innerHTML = "广告剩余 "+ this.timeout/1000 +" 秒";
            this.element.appendChild(countText);
            var closeButton = document.createElement('div');
            closeButton.style.cssText += ";position:absolute;width:77px;height:31px;top:0px;right:0px;background:url(" + CLOSE_IMAGE + ") left top no-repeat;";
            this.element.appendChild(closeButton);
            this.hide(countText);
            sinaadToolkit.event.on(closeButton, 'click', function () {
                THIS.close();
            });
        },
        hide: function (text) {
            var THIS = this;
            var count = this.timeout/1000;

            this.countTimer = setInterval(function(){
                if(count < 1){
                    THIS.close();
                    return;
                }
                text.innerHTML = "广告剩余 " + (count - 1) + " 秒";
                count--;
            }, 1000);
        },
        close : function () {
            var flashElement,
                timer;

            this.countTimer && clearInterval(this.countTimer);
                    
            this.element.style.display = "none";

            //播放器获取
            if (navigator.appName.indexOf("Microsoft") !== -1) {
                flashElement = window.myMovie;
            } else {
                flashElement = document.myMovie;
            }
            timer = setInterval(function () {
                if (flashElement && flashElement._dc_video_stop_lamu) {
                    timer && clearInterval(timer);
                    flashElement._dc_video_stop_lamu();
                }
            });
        }
    };

    // sinaads数据接口
    window.sinaadsRenderHandler = window.sinaadsRenderHandler || {};
    window.sinaadsRenderHandler.lamu = function (element, width, height, content, config) {
        content = content[0];
        var lamuMediaData = {
            pdps : config.sinaads_ad_pdps,
            src : content.src,
            type : content.type,
            link : content.link,
            width : width || 950,
            height : height || 516,
            monitor : content.monitor || []
        };
        window.lamuMedia = new LamuMedia(element, lamuMediaData);
    };

    //对外方法
    window._dc_video_get_lamu = function (/* channel */){
        var status = "",
            flashElement;
        // //关键词过滤
        // var key = parent.document.getElementsByTagName("meta");
        // var keywordsMatch = false;
        // for(var i = 0, il = key.length; i < il; i++) {
        //     if(key[i].getAttribute("name") === "keywords") {
        //         if(key[i].getAttribute("content").indexOf("中国好声音") >= 0){
        //             keywordsMatch = true;
        //         }
        //     }
        // }
        //播放器获取
        if (navigator.appName.indexOf("Microsoft") !== -1) {
            flashElement = window.myMovie;
        } else {
            flashElement = document.myMovie;
        }
        
        //频道过滤 && url过滤 && url过滤2 && 关键词过滤
        //if(channel !== "1006" && !location.search.match(/^\?opsubject_id=top\d{1,2}$/) && !location.href.match(/sports/g) && !keywordsMatch){

            //容器绑定
            var lamuholder = document.getElementById("myflashBox");
            var ins = document.createElement("ins");
            ins.id = "lamu";
            ins.className = "sinaads";
            ins.setAttribute("data-ad-pdps", "vposter");
            ins.setAttribute("data-ad-status", "async");
            lamuholder.parentNode.insertBefore(ins, lamuholder);

            window.sinaads = window.sinaads || [];
            window.sinaads.push({
                element: document.getElementById("lamu"),
                params: {
                    sinaads_success_handler: function () {
                        flashElement._dc_video_play_lamu(5000);
                    },
                    sinaads_fail_handler: function () {
                        flashElement._dc_video_play_lamu(1);
                    }
                }
            });
            status = "success";
        //} else {
        //     status = "fail";
        //     flashElement._dc_video_play_lamu(1);
        // }
        return status;
    };
})();

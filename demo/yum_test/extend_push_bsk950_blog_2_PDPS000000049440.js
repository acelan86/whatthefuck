/**
 * 扩展广告
 * @param  {[type]} extend    [description]
 */
(function () {
    "use strict";

    //素材配置
    var config = {
        main_pv: ["http://sax.sina.com.cn/view1"],
        extend_pv: ["http://sax.sina.com.cn/view2"],
        ad_click: ["http://sax.sina.com.cn/click"],
        main_size: sinaads_ad_width.split("px")[0] + "*" + sinaads_ad_height.split("px")[0],
        main_type: "flash",
        main_src: "http://d1.sina.com.cn/litong/zhitou/zhouyi/bsk_95090.swf",
        main_link: "",
        extend_size: "950*300",
        extend_type: "flash",
        extend_src: "http://d1.sina.com.cn/litong/zhitou/zhouyi/bsk_950300.swf",
        extend_link: "http://sina.com.cn",
        element: parent.document.getElementById(sinaadToolkitSandboxId),
        align: "tc",
        timeout: 12000,
        autoplay: 1,
        closebtn: 1,
        pushdown: 0
    }

    var mouseEvent = false;
    var sinaadToolkit = parent.sinaadToolkit;
    var outer = parent.document;

    //构造方法
    function ExtendMedia(config) {
        this.maxlimit = !!this.autoplay ? 2 : 3;
        this.timeout = config.timeout || 5000;
        this.hover = "";
        this.storage = "EX" + sinaads_ad_pdps;
        this.autoplay = config.autoplay;
        this.canclose = config.closebtn;
        this.pushdown = config.pushdown;
        this.align = config.align;

        this.element = config.element;
        this.left = sinaadToolkit.dom.getPosition(config.element).left;
        this.top = sinaadToolkit.dom.getPosition(config.element).top;
        this.main_width = config.main_size.split("*")[0];
        this.main_height = config.main_size.split("*")[1];
        this.main_type = config.main_type;
        this.main_src = config.main_src;
        this.main_link = config.main_link;

        this.extend_width = config.extend_size.split("*")[0];
        this.extend_height = config.extend_size.split("*")[1];
        this.extend_type = config.extend_type;
        this.extend_src = config.extend_src;
        this.extend_link = config.extend_link;

        this.main_pv = config.main_pv;
        this.extend_pv = config.extend_pv;
        this.ad_click = config.ad_click;

        this.show();

    }
    ExtendMedia.prototype = {
        show: function () {
            sinaadToolkit.ad.createHTML = function (type, src, width, height, link, monitor, tpl, opt_options) {
            var html = [],
                _html = '',
                config,
                tmpData = {},
                len = 0,
                i = 0;

            opt_options = opt_options || {};

            src = sinaadToolkit.array.ensureArray(src),
            type = sinaadToolkit.array.ensureArray(type),
            link = sinaadToolkit.array.ensureArray(link),
            monitor = sinaadToolkit.array.ensureArray(monitor);

            width += sinaadToolkit.isNumber(width) ? 'px' : '',
            height += sinaadToolkit.isNumber(height) ? 'px' : '';


            /**
             * 把所有的属性拉平，方便模板处理
             * src0, src1, src2 ... srcn
             * type0, type1, type2 ... typen
             * link0, link1, link2 ... linkn
             * monitor0, monitor1, monitor2 ... monitorn
             */
            sinaadToolkit.array.each(src, function (_src, i) {
                tmpData['src' + i] = _src;
                tmpData['type' + i] = type[i] || sinaadToolkit.ad.getTypeBySrc(_src, type[i]);
                tmpData['link' + i] = link[i];
                tmpData['monitor' + i] = '';
                tmpData['monitor1_1_' + i] = sinaadToolkit.monitor.createTrackingMonitor(sinaadToolkit.sio.IMG_1_1, monitor);
                tmpData['monitor1_1_' + i] = tmpData['monitor1_1_' + i] === sinaadToolkit.sio.IMG_1_1 ? '' : tmpData['monitor1_1_' + i];
            });
            tmpData.width = width;
            tmpData.height = height;
            tmpData.src = tmpData.src0 || '';
            tmpData.type = tmpData.type0 || '';
            tmpData.link = tmpData.link0 || '';
            tmpData.monitor = tmpData.monitor0 || '';
            tmpData.monitor1_1 = tmpData.monitor1_1_0 || '';
            //如果提供了模版，则使用模版来渲染广告
            //模版中可以含有参数type, src, width, height, monitor, link
            //现在主要用在智投文字链和图文方式
            if (tpl && 'string' === typeof tpl) {
                return sinaadToolkit.string.format(tpl, tmpData);
            }


            len = src.length;
            len = 1; //暂时先支持一个元素

            for (; i < len; i++) {
                //如果没有自定模版
                src = tmpData['src' + i];
                type = tmpData['type' + i];
                link = tmpData['link' + i];
                monitor = monitor.join('|');

                switch (type) {
                    case 'image' :
                        _html = '<img border="0" src="' + sinaadToolkit.url.ensureURL(src) + '" style="width:' + width + ';height:' + height + ';border:0" alt="' + src + '"/>';
                        //onclick与跳转同时发送会导致丢失移动端的监测
                        _html = link ? '<a href="' + link + '" target="_blank">' + _html + '</a>' : _html;
                        break;
                    case 'text' :
                        _html = link ? '<a href="' + link + '" target="_blank">' + src + '</a>' : src;
                        break;
                    case 'flash' :
                        var vars = {};
                        link && (vars.clickTAG = link);
                        _html = sinaadToolkit.swf.createHTML({
                            url : sinaadToolkit.url.ensureURL(src),
                            width : width,
                            height : height,
                            wmode : opt_options.wmode || 'opaque',
                            vars : vars,
                            id : opt_options.id || ''
                        });
                        if (link) {
                            _html = [
                                '<div style="width:' + width + ';height:' + height + ';position:relative;overflow:hidden;">',
                                    _html,
                                    '<a style="position:absolute;background:#fff;opacity:0;filter:alpha(opacity=0);width:' + width + ';height:' + height + ';left:0;top:0" href="' + link + '" target="_blank"></a>',
                                '</div>'
                            ].join('');
                        }
                        break;
                    case 'adbox' :
                    case 'url' :
                        config = {};
                        sinaadToolkit.iframe.init(config, width, height, false);
                        config.src = sinaadToolkit.url.ensureURL(src);
                        monitor && (config.name = 'clickTAG=' + encodeURIComponent(monitor));
                        _html = sinaadToolkit.iframe.createHTML(config);
                        break;
                    case 'js' :
                        _html = [
                            '<', 'script charset="utf-8" src="', sinaadToolkit.url.ensureURL(src), '"></', 'script>'
                            ].join('');
                        break;
                    default :
                        _html = src.replace(/\\x3c/g, '<').replace(/\\x3e/g, '>');
                        break;
                }
                html.push(_html);
            }
            return html.join(' ');
        }
        sinaadToolkit.swf.getMovie = function (name, context) {
                context = context || window;
                //ie9下, Object标签和embed标签嵌套的方式生成flash时,
                //会导致document[name]多返回一个Object元素,而起作用的只有embed标签
                var movie = navigator.appName.indexOf("Microsoft") != -1 ? context[name] : context.document[name],
                    ret;
                return sinaadToolkit.browser.ie === 9 ?
                    movie && movie.length ?
                        (ret = sinaadToolkit.array.remove(sinaadToolkit.toArray(movie), function (item) {
                            return item.tagName.toLowerCase() !== "embed";
                        })).length === 1 ? ret[0] : ret
                        : movie
                    : movie || context[name];
            }
            var maindom = document.createElement("div");
            maindom.innerHTML = sinaadToolkit.ad.createHTML(this.main_type, this.main_src, this.main_width + "px", this.main_height + "px", this.main_link, this.monitor, null, {id: "test"});
            document.body.insertBefore(maindom, document.body.firstChild);
            this.show_extend_handler = this._getShowExtendHandler();
            if(!this.autoplay){
                sinaadToolkit.event.on(this.element, "mouseover", this.show_extend_handler);
            }

            if(this.autoplay){
                var THIS = this;
                var orderTimer = setInterval(function () {
                    if (parent.sinaadsROC && parent.sinaadsROC._state["PDPS000000049874"] === 4) {
                        clearInterval(orderTimer);
                        THIS.show_extend();
                    }
                }, 500);
            }
        },
        _getShowExtendHandler : function () {
            var THIS = this;
            return function () {
                mouseEvent = true;
                THIS.show_extend();
            }
        },
        show_extend: function () {
            var This = this;
            //清除状态
            clearTimeout(this.hover);
            sinaadToolkit.event.un(this.element, "mouseover", this.show_extend_handler);
            //频次控制
            if(!sinaadToolkit.storage.get(this.storage) || sinaadToolkit.storage.get(this.storage) < this.maxlimit){
                parent.bsk_hideExtend = this.hideExtend = this._hideExtendHandler();
                // if(this.extend){
                    
                // }else{
                    var extend = this.extend = outer.createElement("div");
                    extend.id = this.storage;
                    extend.innerHTML = sinaadToolkit.ad.createHTML(this.extend_type, this.extend_src, this.extend_width + "px", this.extend_height + "px", this.extend_link, this.monitor, null, {wmode:"transparent"});
                    extend.style.cssText += ";display:none;position:absolute;z-index:12000;top:"+ this.top +"px;left:"+ this.left +"px;z-index:999999";
                    outer.body.insertBefore(extend, outer.body.firstChild);
                    if(this.canclose){
                        // if(this.closebtn){

                        // }else{
                            var closebtn = this.closebtn = outer.createElement("div");
                            closebtn.innerHTML = "<img src='http://d4.sina.com.cn/d1images/lmt/cls_77x31.gif' />";
                            closebtn.style.cssText += ";position:absolute;right:0;top:"+ this.extend_height +"px;cursor:pointer";
                            extend.insertBefore(closebtn, extend.firstChild);
                            sinaadToolkit.event.on(this.closebtn, "click", this.hideExtend);
                        // }
                    }
                // }
                if(this.pushdown){
                    this.extend.style.cssText += ";height:0;display:block;";
                    var pushi = 3;
                    var animation = function(){
                        // pushi++;
                        pushi = 10;
                        This.element.parentNode.style.height = (This.extend_height/10) * pushi + "px";
                        This.element.style.height = (This.extend_height/10) * pushi + "px";
                        This.extend.style.height = (This.extend_height/10) * pushi + "px";
                        if(pushi < 10){
                            setTimeout(animation, 50);
                        }
                    }
                    animation();
                }else{
                    this.extend.style.display = "block";    
                }
                this.align_extend(this.align);
                this.hide_extend(this.timeout);

                if(mouseEvent){
                    sinaadToolkit.event.on(this.extend, "mouseout", this.hideExtend);
                }
                sinaadToolkit.storage.set(this.storage, sinaadToolkit.storage.get(this.storage) ? (parseInt(sinaadToolkit.storage.get(this.storage), 10) + 1) : 1);
            }  

            
            

            // flash交互
            var swfFunc = setInterval(function () {
                var swf = sinaadToolkit.swf.getMovie("test", window);
                if(swf && swf.GotoFrame){
                    clearInterval(swfFunc);
                    try{
                    swf.GotoFrame(swf.TotalFrames() - 1);
                    swf.StopPlay();
                    }catch(e){}
                }
            }, 500);     
        },
        hide_extend: function (time) {
            var This = this;
            clearTimeout(this.hover);
            this.hover = setTimeout(function () {
                clearTimeout(This.hover);
                if(This.pushdown){
                    var pushi = 10;
                    var animation = function(){
                        // pushi--;
                        pushi = 3;
                        This.element.parentNode.style.height = (This.extend_height/10) * pushi + "px";
                        This.element.style.height = (This.extend_height/10) * pushi + "px";
                        This.extend.style.height = (This.extend_height/10) * pushi + "px";
                        if(pushi > 3){
                            setTimeout(animation, 50);
                        }else{
                            This.extend.style.display = "none";
                        }
                    }
                    animation();
                }else{
                    This.extend.style.display = "none";
                }

                // flash交互
                var swfFunc = setInterval(function () {
                    var swf = sinaadToolkit.swf.getMovie("test", window);
                    if(swf && swf.GotoFrame){
                        clearInterval(swfFunc);
                        try{
                        swf.GotoFrame(0);
                        swf.Play();
                        }catch(e){}
                    }
                }, 500);

                sinaadToolkit.event.on(This.element, "mouseover", This.show_extend_handler);
            } , time)
        },
        _hideExtendHandler : function () {
            var THIS = this;
            return function () {
                THIS.hide_extend(0);
            }
        },
        align_extend: function (conf) {
            this.left = sinaadToolkit.dom.getPosition(config.element).left;
            this.top = sinaadToolkit.dom.getPosition(config.element).top;
            this.deltaX = this.main_width - this.extend_width;
            this.deltaY = this.main_height - this.extend_height;
            this.extend.style.cssText += ";top:" + this.top + "px;left:" + this.left + "px;";
            switch (conf) {
                case "tl" :
                    this.extend.style.cssText += ";margin:0";
                    break;
                case "tc" :
                    this.extend.style.cssText += ";margin:0 0 0 " + this.deltaX/2 + "px";
                    break;
                case "tr" :
                    this.extend.style.cssText += ";margin:0 0 0 " + this.deltaX + "px";
                    break;
                case "ml" :
                    this.extend.style.cssText += ";margin:"+ this.deltaY/2 +"px 0 0 0";
                    break;
                case "mc" :
                    this.extend.style.cssText += ";margin:"+ this.deltaY/2 +"px 0 0 " + this.deltaX/2 + "px";
                    break;
                case "mr" :
                    this.extend.style.cssText += ";margin:"+ this.deltaY/2 +"px 0 0 " + this.deltaX + "px";
                    break;
                case "bl" :
                    this.extend.style.cssText += ";margin:"+ this.deltaY +"px 0 0 0";
                    break;
                case "bc" :
                    this.extend.style.cssText += ";margin:"+ this.deltaY +"px 0 0 " + this.deltaX/2 + "px";
                    break;
                case "br" :
                    this.extend.style.cssText += ";margin:"+ this.deltaY +"px 0 0 " + this.deltaX + "px";
                    break;
                default : //tc
                    this.extend.style.cssText += ";margin:0 0 0 " + this.deltaX/2 + "px";
            }
        }
    };
    var extend = new ExtendMedia(config);
})();
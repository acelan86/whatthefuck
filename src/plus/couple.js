(function (window, undefind) {
    //常量定义
    var SINAADS_AD_TYPE = 'sinaads_couple' + window.sinaads_ad_pdps,
        SINAADS_AD_TYPE_CLOSE_PIC = "http://d1.sina.com.cn/d1images/lmt/close2.gif",
        SINAADS_AD_TYPE_CLOSE_CENTER_PIC = "http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif";
        
    /**
     * 跨栏广告
     * @param  {[type]} config   [description]
     * @param  {[type]} window   [description]
     * @param  {[type]} document [description]
     * @return {[type]}          [description]
     */

    window.sinaads_couple = function (config) {
        var me = this;
        me.isext = false;
        me.ishide = false;
        me.timer = "";
        me.timer_ext = "";
        me.tmpWidth = 0;
        this.cmWrap = document.createElement("div");

        function crtEl(elname, style) {
            var newEl = document.createElement(elname);
            var extstyle = "";
            for (var i in style) {
                if ((/\bwidth\b|\bheight\b|left\b|right\b|top\b|bottom\b/g).test(i)) {
                    extstyle += ";" + i + ":" + style[i] + "px;";
                } else {
                    extstyle += ";" + i + ":" + style[i] + ";";
                }
            }
            newEl.style.cssText += extstyle;
            return newEl;
        }
        //构造容器:中
        this.ccWrap = new crtEl("div", {
            width: 0,
            height: 112,
            overflow: "hidden",
            margin: "0 auto",
            position: "relative"
        });
        this.cciWrap = new crtEl("div",{
            width: config.mainW,
            height: config.mainH
        });
        this.cciWrap.innerHTML = sinaadToolkit.ad.createHTML(config.type[0] || 'flash', config.src[0], config.mainW, config.mainH, config.link[0], config.monitor || []);
        
        this.ccClose = new crtEl("div",{
            width: 66,
            height: 22,
            position: "absolute",
            top: config.mainH,
            right: 0,
            background: "url("+ SINAADS_AD_TYPE_CLOSE_CENTER_PIC +") no-repeat",
            cursor: "pointer"
        });

        this.ccWrap.appendChild(this.ccClose);
        this.ccWrap.appendChild(this.cciWrap);
        //构造容器:左
        this.clWrap = new crtEl("div", {
            width: config.sideW,
            height: config.sideH,
            position: "absolute",
            left: 0,
            top: 0
        });
        this.cliWrap = new crtEl("div",{
            width: config.sideW,
            height: config.sideH
        });
        this.cliWrap.innerHTML = sinaadToolkit.ad.createHTML(config.type[1] || 'flash', config.src[1], config.sideW, config.sideH, config.link[1], config.monitor || []);

        this.clClose = new crtEl("div",{
            width: 25,
            height: 48,
            position: "absolute",
            top: config.sideH,
            right: 0,
            background: "url("+ SINAADS_AD_TYPE_CLOSE_PIC +") no-repeat",
            cursor: "pointer"
        });
        clWrap.appendChild(this.cliWrap);
        clWrap.appendChild(this.clClose);
        //构造容器:右
        this.crWrap = new crtEl("div", {
            width: config.sideW,
            height: config.sideH,
            position: "absolute",
            right: 0,
            top: 0
        });
        this.criWrap = new crtEl("div", {
            width: config.sideW,
            height: config.sideH
        })
        this.criWrap.innerHTML = sinaadToolkit.ad.createHTML(config.type[2] || 'flash', config.src[2], config.sideW, config.sideH, config.link[2], config.monitor || []);
        
        this.crClose = new crtEl("div",{
            width: 25,
            height: 48,
            position: "absolute",
            top: config.sideH,
            left: 0,
            background: "url("+ SINAADS_AD_TYPE_CLOSE_PIC +") no-repeat",
            cursor: "pointer"
        });
        crWrap.appendChild(this.criWrap);
        crWrap.appendChild(this.crClose);

        this.showCC = function () {
            if (!me.isext && !me.ishide) {
                me.isext = true;
                clearTimeout(me.timer);
                ccWrap.style.display = "block";
                me.timer_ext = setInterval(function () {
                    if (me.tmpWidth < config.mainW) {
                        me.tmpWidth += (1000 - me.tmpWidth)/2;
                        ccWrap.style.width = me.tmpWidth + "px";
                    } else {
                        ccWrap.style.width = "1000px";
                        clearInterval(me.timer_ext);
                    }
                }, 50);
            }
            me.timer = setTimeout(function () {
                me.hideCC();
            }, 8000);
        };
        this.hideCC = function () {
            me.isext = false;
            clearTimeout(me.timer_ext);
            clearTimeout(me.timer);
            ccWrap.style.display = "none";
            me.tmpWidth = 0;
        }
        this.hideCM = function () {
            cmWrap.style.display = "none";
            me.ishide = true;
            me.hideCC();
        }
        cmWrap.appendChild(this.ccWrap);
        cmWrap.appendChild(this.clWrap);
        cmWrap.appendChild(this.crWrap);
        clWrap.onmouseover = this.showCC;
        crWrap.onmouseover = this.showCC;
        clClose.onclick = this.hideCM;
        crClose.onclick = this.hideCM;
        ccClose.onclick = this.hideCC;
        cmWrap.style.cssText += ";position:absolute;width:100%;top:"+ config.top +"px";

        document.body.insertBefore(cmWrap, document.body.firstChild);
    }
})(window);
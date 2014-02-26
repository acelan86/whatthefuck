/**
 * [从右边推出来的广告]
 * @return {[type]} [description]
 */
(function(){
    "use strict";
    var mediaControl,
        shiftList = ['.main', '.top-search-wrap'], //左侧需要移动的DOM
        offsettop = 120,    //距顶部偏移量
        doms = [],
        ad_box;

    var clientW = document.documentElement.clientWidth;
    var oImg = new Image();
    oImg.src = 'http://d1.sina.com.cn/shh/lechan/20140219sina/1000-600.swf';
    function init(){
        // var clientH = document.documentElement.clientHeight;
        // ad_wrap.style.height = clientH+"px";
        // ad_wrap.style.overflow = "hidden";
        var i;
        for (i = shiftList.length - 1; i >= 0; i--) {
            doms = doms.concat(querySimpleSelector(shiftList[i]));
        }
        
        for (i = doms.length - 1; i >= 0; i--) {
            doms[i].style.position = 'relative';
        }
        ad_box = document.createElement('div');
        document.body.appendChild(ad_box);
        ad_box.style.cssText = 'width: 1000px; height: 600px; position: absolute; top: 46px; left:' + clientW + 'px; top:' + offsettop + 'px; display: block;';
        play();
    }
    /**
     * [querySimpleSelector 简单的选择器，仅支持#**id选择 .**类选择]
     * @param  {[String]} sel [#选择或.选择]
     * @return {[Array]}     [选择结果]
     */
    function querySimpleSelector (sel) {
        var result = [];
        if (sel.charAt(0) === '.') {
            result = getElementsByClassName(document, sel.slice(1));
        } else if (sel.charAt(0) === '#') {
            result.push(document.getElementById(sel.slice(1)));
        } else {
            result.push(document.getElementById(sel));
        }
        return result;
    }

    function getElementsByClassName (node, classname) {
        var a = [];
        var re = new RegExp('(^| )'+classname+'( |$)');
        var els = node.getElementsByTagName("*");
        for(var i=0, j= els.length; i < j; i++) {
            if(re.test(els[i].className)) {
                a.push(els[i]);
            }
        }
        return a;
    }
    function play () {
        var i;
        for (i = doms.length - 1; i >= 0; i--) {
            startMove(doms[i], {"left": "-1000"});
        }
        startMove(ad_box,{"left":(clientW - 1000)});
        getflash(ad_box,'http://d1.sina.com.cn/shh/lechan/20140219sina/1000-600.swf','fl1','1000','600','transparent');
        setTimeout(function(){
            end();
        }, 10000);
    }
    function end() {
        var i;
        // startMove(ad_main,{"left":"0"});
        for (i = doms.length - 1; i >= 0; i--) {
            startMove(doms[i], {"left": "0"});
        }
        startMove(ad_box,{"left":clientW},function(){
            ad_box.innerHTML = '';
            // ad_wrap.style.height = "auto";
            // ad_wrap.style.overflow = "visible"; 
            ad_box.style.display = 'none';
            try {
                mediaControl.done(mediaControl.stream);
            } catch(e) {}
        });
        
    }
    function getflash(container,src,id,w,h,wmode){
        var flash_obj ='<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="'+ id +'" name="'+ id +'" width="'+ w +'" height="'+ h +'" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"><param name="movie" value="'+ src +'" /><param name="quality" value="high" /><param name="bgcolor" value="#ffffff" /><param name="allowScriptAccess" value="always" /><param name="wmode" value="'+ wmode +'" /><embed src="'+ src +'" quality="high" bgcolor="#ffffff" width="'+ w +'" height="'+ h +'" id="'+ id +'" name="'+ id +'" align="middle" play="true" loop="true" quality="high" allowScriptAccess="always" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" wmode="'+ wmode +'"></embed></object>';
        container.innerHTML = flash_obj;
    }
    function startMove(obj,json,endFn){
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
            var bBtn = true;
            for(var attr in json){
                var iCur = 0;
                if(attr === 'opacity'){
                    if(Math.round(parseFloat(getStyle(obj,attr)) * 100) === 0){
                        iCur = Math.round(parseFloat(getStyle(obj,attr)) * 100);
                    } else{
                        iCur = Math.round(parseFloat(getStyle(obj,attr)) * 100) || 100;
                    }
                } else{
                    iCur = parseInt(getStyle(obj,attr), 10) || 0;
                }
                var iSpeed = (json[attr] - iCur)/8;
                iSpeed = iSpeed >0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
                if(iCur !== json[attr]){
                    bBtn = false;
                }
                if(attr === 'opacity'){
                    obj.style.filter = 'alpha(opacity=' +(iCur + iSpeed)+ ')';
                    obj.style.opacity = (iCur + iSpeed)/100;
                }
                else{
                    obj.style[attr] = iCur + iSpeed + 'px';
                }
            }
            if(bBtn){
                clearInterval(obj.timer);
                if(endFn){
                    endFn.call(obj);
                }
            }
        },30);
    }
    
    function getStyle(obj,attr){
        if(obj.currentStyle){
            return obj.currentStyle[attr];
        }
        else{
            return getComputedStyle(obj,false)[attr];
        }
    }
    init();
})();

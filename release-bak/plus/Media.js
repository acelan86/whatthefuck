/*!
 * sinaadToolkit.Media
 * @author acelan<xiaobin8[at]staff.sina.com.cn> zhouyi<zhouyi3[at]staff.sina.com.cn>
 * @version 1.0.0
 * 
 *                          $$!   ;$;
 *                    !$  $$$$  !$$$   ;;
 *                 $ *$$;$$$$$$$$$$;*$$$
 *                $$$$$$$$$$$$$$$$$$$$$
 *               $$$$$$;         o$$$$$o
 *              *$$$   *#####;     $$$$$
 *              $$$   &#$*!###     $$$$!
 *              $$$;  $#!!###$   ;$$$$
 *                $$$o  ;**   !$$$$!
 *          !$&&&&$!  o$$$$$$o;   ;$&###&!     ;o$&&##&$;
 *       ###########$ o####*  #############!  o############
 *     ;#####;        #####  $####    *####;          ####*
 *      ###########  o####   ####;    ####$  $######;o####
 *          ;*#####o ####$  ####&    !#### o####     ####
 *    ####$**&####$ ;####  o####     ####o &####$o$#####
 *   ;o########$    *###   ####!    &####   ;######&!
 *                 ###;
 *                  ##o
 *                 ;#!
 *                 ;
 */
!function(a,b,c,d){"use strict";function e(e){var g=b.cookie.get("bgAdCookie"+e.pdps);if("0"!==g){var h=this.midBg=document.getElementById("bgAdWrap");if(h){this.config=e;var i=document.body;i.style.cssText+=";background:url("+e.src[0]+") no-repeat center "+e.top+"px;margin:0px;",h.style.cssText+=";position:relative;height: "+e.headHeight+"px;width: "+e.midWidth+"px;margin:0 auto;",h.innerHTML='<a href="'+e.link[0]+'" target="_blank" style="display:block;height:'+e.headHeight+"px;width: "+e.midWidth+'px;"></a>';var j=(e.width-e.midWidth)/2,k=this.leftAd=document.createElement("div");k.id="bgLeftAd",k.style.cssText+=";position: absolute;height: "+e.height+"px;width:"+j+"px;left:0px;top: "+e.top+"px",i.appendChild(k);var l=this.rightAd=document.createElement("div");if(l.id="bgRightAd",l.style.cssText+=";position: absolute;height: "+e.height+"px;width:"+j+"px;left:0px;top: "+e.top+"px",i.appendChild(l),e.src[1]){var m=e.type[1]||e.type[0],n=e.src[1],o={};("flash"===m||/\.swf$/.test(n))&&(o={wmode:"transparent"}),k.innerHTML=b.ad.createHTML(m,n,j,e.height,e.link[1]||e.link[0],e.monitor,d,o),m=e.type[2]||e.type[1]||e.type[0],n=e.src[2]||e.src[1],o={},("flash"===m||/\.swf$/.test(n))&&(o={wmode:"transparent"}),l.innerHTML=b.ad.createHTML(m,n,j,e.height,e.link[2]||e.link[1]||e.link[0],e.monitor,d,o)}else if(e.asideClickable){var p=document.createElement("a");p.setAttribute("href",e.link[1]||e.link[0]),p.setAttribute("target","_blank"),p.style.cssText+=";display: block;height: "+e.height+"px;",k.appendChild(p),p=document.createElement("a"),p.setAttribute("href",e.link[2]||e.link[1]||e.link[0]),p.setAttribute("target","_blank"),p.style.cssText+=";display:block;height: "+e.height+"px;",l.appendChild(p)}var q=this.closeBtn=document.createElement("div");q.style.cssText+=";width: 40px;height: 18px;position:absolute;right:1px;top: 6px;background:url("+f+") no-repeat right center #ebebeb;cursor:pointer",h.appendChild(q),this.getResizeHandler()(),this.closeHandler=this.getResizeHandler(),b.event.on(a,"resize",this.closeHandler),b.event.on(q,"click",this.getCloseHandler());try{b.debug("Media: In building bg complete!"),c.done(c.bg)}catch(r){}}}}var f="http://d1.sina.com.cn/shh/tianyi/bg/audi_zty_cls1.jpg";e.prototype={getResizeHandler:function(){var a=this;return function(){var c=a.config.midWidth,d=b.dom.getPosition(document.getElementById("bgAdWrap")).left,e=(a.config.width-a.config.midWidth)/2;a.leftAd.style.left=d-e+"px",a.rightAd.style.left=d+c+"px"}},getCloseHandler:function(){var c=this;return function(){b.cookie.set("bgAdCookie"+c.config.pdps,0,864e5),b.event.un(a,"resize",c.closeHandler),document.body.style.cssText+=";background:none;",c.midBg.style.display="none",c.config.asideClickable&&(c.leftAd.style.display="none",c.rightAd.style.display="none")}}},b.BgMedia=b.BgMedia||e}(window,window.sinaadToolkit,window.sinaadsROC),function(a,b){"use strict";function c(c){this.delay=c.delay?parseInt(c.delay,10):0,c.src=b.array.ensureArray(c.src),c.type=b.array.ensureArray(c.type),c.link=b.array.ensureArray(c.link),c.offsettop=c.offsettop||n,c.expandpos=c.expandpos||o;var h=c.smallsize=c.smallsize||m,i=c.bigsize=c.bigsize||l;this.config=c,this.deferred=new b.Deferred;var j=this.leftSmallContent=d(h,{type:c.type[0],src:c.src[0],link:c.link[0],monitor:c.monitor}),k=this.leftSmallCloseBtn=e("small"),p=this.leftSmall=f("small","left "+c.offsettop);g(j,k,p);var q=this.leftBigContent=d(i,{type:c.type[1]||c.type[0],src:c.src[1],link:c.link[1]||c.link[0],monitor:c.monitor}),r=this.leftBigCloseBtn=e("big"),s=this.leftBig=f("big","left "+c.offsettop);g(q,r,s);var t=this.rightSmallContent=d(h,{type:c.type[2]||c.type[0],src:c.src[2]||c.src[0],link:c.link[2]||c.link[0],monitor:c.monitor}),u=this.rightSmallCloseBtn=e("small"),v=this.rightSmall=f("small","right "+c.offsettop);g(t,u,v);var w=this.rightBigContent=d(i,{type:c.type[3]||c.type[1]||c.type[0],src:c.src[3]||c.src[1],link:c.link[3]||c.link[1]||c.link[0],monitor:c.monitor}),x=this.rightBigCloseBtn=e("big"),y=this.rightBig=f("big","right "+c.offsettop);g(w,x,y),b.event.on(k,"click",this.getCloseSideHandler()),b.event.on(r,"click",this.getCloseSideHandler()),b.event.on(u,"click",this.getCloseSideHandler()),b.event.on(x,"click",this.getCloseSideHandler()),b.event.on(a,"scroll",this.getScrollHandler()),b.event.on(a,"resize",this.getResizeHandler()),this.isClose=!1,this.clientWidth=document.body.clientWidth,this.scrollTop=document.documentElement.scrollTop||document.body.scrollTop,this.show()}function d(a,c){var d=document.createElement("div");return d.style.cssText="width:"+a[0]+"px;height:"+a[1]+"px;position:absolute;left:0px;top:0px;",d.innerHTML=b.ad.createHTML(c.type,c.src,a[0],a[1],c.link,c.monitor),d}function e(a){var b,c,d;"big"===a?(b=j,c=l[1],d=h):(b=k,c=m[1],d=i);var e=document.createElement("div");return e.style.cssText="width:"+b[0]+"px;height:"+b[1]+"px;position:absolute;left:0px;top:"+c+"px;background:url("+d+") no-repeat right center #ebebeb;cursor:pointer",e}function f(a,c){var d,e;"big"===a?(d=l[0],e=l[1]+j[1]):(d=m[0],e=m[1]+k[1]);var f=new b.Box({width:d,height:e,position:c,autoShow:1,follow:!0,zIndex:10501});return f}function g(a,b,c){c.getMain().appendChild(a),c.getMain().appendChild(b)}var h="http://d1.sina.com.cn/d1images/close_btn/40x18_1.jpg",i="http://d1.sina.com.cn/d1images/close_btn/25x45_1.gif",j=[120,18],k=[25,45],l=[120,270],m=[25,270],n=100,o=700,p=1024;c.prototype={getResizeHandler:function(){var a=this;return function(){a.clientWidth=document.body.clientWidth,a.show()}},getScrollHandler:function(){var a=this;return function(){a.scrollTop=document.documentElement.scrollTop||document.body.scrollTop,a.show()}},show:function(){this.isClose||(this.scrollTop>this.config.expandpos&&this.clientWidth>p?(this.leftSmall.hide(),this.rightSmall.hide(),this.leftBig.show(),this.rightBig.show()):(this.leftSmall.show(),this.rightSmall.show(),this.leftBig.hide(),this.rightBig.hide()))},getCloseSideHandler:function(){var a=this;return function(){a.isClose=!0,a.leftSmall.hide(),a.leftBig.hide(),a.rightSmall.hide(),a.rightBig.hide()}}},b.CoupletExtMedia=b.CoupletExtMedia||c}(window,window.sinaadToolkit),function(a,b,c){"use strict";function d(a){this.delay=a.delay?parseInt(a.delay,10):0,a.mainWidth=a.mainWidth||i[0],a.mainHeight=a.mainHeight||i[1],a.sideWidth=j[0],a.sideHeight=j[1],a.src=b.array.ensureArray(a.src),a.type=b.array.ensureArray(a.type),a.link=b.array.ensureArray(a.link),this.config=a,this.pdps=a.pdps,this.deferred=new b.Deferred;var d=this.left=new b.Box({width:a.sideWidth,height:a.sideHeight+g[1],position:"left "+a.top||0,autoShow:1,minViewportWidth:a.mainWidth+2*a.sideWidth,zIndex:10500}),k=this.right=new b.Box({width:a.sideWidth,height:a.sideHeight+g[1],position:"right "+a.top||0,autoShow:1,minViewportWidth:a.mainWidth+2*a.sideWidth,zIndex:10500}),l=this.main=new b.Box({width:a.mainWidth,height:a.mainHeight,position:"center "+a.top||0,zIndex:10500}),m=this.mainContent=document.createElement("div");m.style.cssText="width:"+a.mainWidth+"px;height:"+a.mainHeight+"px;overflow:hidden;margin:0px auto;position:relative;";var n=this.mainCloseBtn=document.createElement("div");n.style.cssText="width:"+h[0]+"px;height:"+h[1]+"px;position:absolute;top:"+a.mainHeight+"px;right:0px;background:url("+f+") no-repeat;cursor:pointer;";var o=this.leftContent=document.createElement("div");o.style.cssText="width:"+a.sideWidth+"px;height:"+a.sideHeight+"px;position:absolute;left:0px;top:0px;",o.innerHTML=b.ad.createHTML(a.type[1],a.src[1],a.sideWidth,a.sideHeight,a.link[1]||a.link[0],a.monitor);var p=this.leftCloseBtn=document.createElement("div");p.style.cssText="width:"+g[0]+"px;height:"+g[1]+"px;position:absolute;left:0px;top:"+a.sideHeight+"px;background:url("+e+") no-repeat right center #ebebeb;cursor:pointer";var q=this.rightContent=document.createElement("div");q.style.cssText="width:"+a.sideWidth+"px;height:"+a.sideHeight+"px;position:absolute;left:0px;top:0px;",q.innerHTML=b.ad.createHTML(a.type[2]||a.type[1],a.src[2]||a.src[1],a.sideWidth,a.sideHeight,a.link[2]||a.link[1]||a.link[0],a.monitor);var r=this.rightCloseBtn=document.createElement("div");r.style.cssText="width:"+g[0]+"px;height:"+g[1]+"px;position:absolute;left:0px;top:"+a.sideHeight+"px;background:url("+e+") no-repeat left center #ebebeb;cursor:pointer",l.getMain().appendChild(m),l.getMain().appendChild(n),d.getMain().appendChild(o),d.getMain().appendChild(p),k.getMain().appendChild(q),k.getMain().appendChild(r),b.event.on(n,"click",this.getCloseMainHandler()),b.event.on(p,"click",this.getCloseSideHandler()),b.event.on(r,"click",this.getCloseSideHandler()),b.event.on(q,"mouseover",this.getHoverSideHandler()),b.event.on(o,"mouseover",this.getHoverSideHandler());try{b.debug("Media: In building couplet complete!"),c.done(c.couplet)}catch(s){}}var e="http://d9.sina.com.cn/litong/zhitou/test/images/close-h.jpg",f="http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif",g=[120,18],h=[66,22],i=[1e3,90],j=[120,270];d.prototype={timer:null,aniTimer:null,isshow:0,show:function(){var a=this;this.tmpWidth=0,this.isshow=1,clearTimeout(this.timer),this.mainContent.style.width="0px",this.mainContent.innerHTML=b.ad.createHTML(this.config.type[0],this.config.src[0],this.config.mainWidth,this.config.mainHeight,this.config.link[0],this.config.monitor),this.main.show(),this.aniTimer=setInterval(function(){a.tmpWidth<a.config.mainWidth?(a.tmpWidth+=(a.config.mainWidth-a.tmpWidth)/4,a.mainContent.style.width=a.tmpWidth+"px"):(a.mainContent.style.width=a.config.mainWidth+"px",clearInterval(a.aniTimer),a.deferred.resolve())},50),a.timer=setTimeout(function(){a.hide()},8e3)},hide:function(){this.main.hide(),this.mainContent.innerHTML="",this.isshow=0,this.aniTimer&&clearInterval(this.aniTimer),this.timer&&clearTimeout(this.timer)},getCloseMainHandler:function(){var a=this;return function(){a.hide(),a.mainIsClose=!0}},getHoverSideHandler:function(){var a=this;return function(){a.mainIsClose||a.show()}},getCloseSideHandler:function(){var a=this;return function(){a.hide(),a.left.hide(),a.right.hide()}}},b.CoupletMedia=b.CoupletMedia||d}(window,window.sinaadToolkit,window.sinaadsROC),function(a,b,c){"use strict";function d(a){this.delay=a.delay?parseInt(a.delay,10):0,a.sideWidth=a.sideWidth||g[0],a.sideHeight=a.sideHeight||g[1],a.src=b.array.ensureArray(a.src),a.type=b.array.ensureArray(a.type),a.link=b.array.ensureArray(a.link),a.top=a.top||h,this.config=a,this.pdps=a.pdps;var d=this.left=new b.Box({width:a.sideWidth,height:a.sideHeight,position:"left "+a.top,autoShow:1,minViewportWidth:(a.contentWidth||1e3)+2*a.sideWidth,zIndex:10500}),i=this.right=new b.Box({width:a.sideWidth,height:a.sideHeight,position:"right "+a.top,autoShow:1,minViewportWidth:(a.contentWidth||1e3)+2*a.sideWidth,zIndex:10500}),j=this.leftContent=document.createElement("div");j.style.cssText="width:"+a.sideWidth+"px;height:"+a.sideHeight+"px;position:absolute;left:0px;top:0px;",j.innerHTML=b.ad.createHTML(a.type[0],a.src[0],a.sideWidth,a.sideHeight,a.link[0],a.monitor);var k=this.leftCloseBtn=document.createElement("div");k.style.cssText="width:"+f[0]+"px;height:"+f[1]+"px;position:absolute;right:0px;top:0px;background:url("+e+") no-repeat right center #ebebeb;cursor:pointer";var l=this.rightContent=document.createElement("div");l.style.cssText="width:"+a.sideWidth+"px;height:"+a.sideHeight+"px;position:absolute;left:0px;top:0px;",l.innerHTML=b.ad.createHTML(a.type[1]||a.type[0],a.src[1]||a.src[0],a.sideWidth,a.sideHeight,a.link[1]||a.link[0],a.monitor);var m=this.rightCloseBtn=document.createElement("div");m.style.cssText="width:"+f[0]+"px;height:"+f[1]+"px;position:absolute;left:0px;top:0px;background:url("+e+") no-repeat left center #ebebeb;cursor:pointer",d.getMain().appendChild(j),d.getMain().appendChild(k),i.getMain().appendChild(l),i.getMain().appendChild(m),this.closeSideHandler=this.getCloseSideHandler(),b.event.on(k,"click",this.closeSideHandler),b.event.on(m,"click",this.closeSideHandler);try{b.debug("Media: In building float complete!"),c.done(c["float"])}catch(n){}}var e="http://d9.sina.com.cn/litong/zhitou/test/images/close-h.jpg",f=[40,18],g=[120,300],h=100;d.prototype={getCloseSideHandler:function(){var a=this;return function(){a.left.hide(),a.right.hide()}},destory:function(){b.event.un(this.leftCloseBtn,"click",this.closeSideHandler),b.event.un(this.rightCloseBtn,"click",this.closeSideHandler),this.left.remove(),this.right.remove()}},b.FloatMedia=b.FloatMedia||d}(window,window.sinaadToolkit,window.sinaadsROC),function(a,b){"use strict";function c(a){var c=this;this.deferred=new b.Deferred;var k=this.width=a.main.width,l=this.height=a.main.height;this.delay=a.delay?parseInt(a.delay,10):0,this.config=a,this.isHideMini=!this.config.mini.src;var m=this.main=new b.Box({width:k,height:l,position:"right "+(a.main.top||"top"),follow:1,zIndex:10010}),n=this.mini=new b.Box({width:h[0],height:h[1]+j[1]+i[1],position:"right "+(a.mini.top||"bottom"),follow:1,zIndex:1e4}),o=this.mainCloseBtn=document.createElement("div");o.style.cssText=["width:"+g[0]+"px","height:"+g[1]+"px","position:absolute","right:0px","top:-"+g[1]+"px","z-index:9999","background:url("+f+") no-repeat","margin:0","padding:0","cursor:pointer"].join(";");var p=this.miniCloseBtn=document.createElement("div");p.style.cssText="margin:0px;padding:0px;display:block;cursor:pointer;width:"+j[0]+"px;height:"+j[1]+"px;position:absolute;left:0px;top:"+(h[1]+i[1])+"px;background:url("+e+") no-repeat center;";var q=this.miniReplayBtn=document.createElement("div");q.style.cssText="width:"+i[0]+"px;height:"+i[1]+"px;position:absolute;left:0px;top:"+h[1]+"px;background:url("+d+") no-repeat center;margin:0px;padding:0px;display:block;cursor:pointer;",b.event.on(p,"click",this.getCloseMiniHandler()),b.event.on(q,"click",this.getReplayHandler()),b.event.on(o,"click",this.getCloseMainHandler());var r=this.mainContent=document.createElement("div"),s=this.miniContent=document.createElement("div");m.getMain().appendChild(r),m.getMain().appendChild(o),n.getMain().appendChild(s),n.getMain().appendChild(q),n.getMain().appendChild(p),this.delay?setTimeout(function(){c.show()},1e3*this.delay):this.show()}var d="http://d5.sina.com.cn/d1images/lmt/play.gif",e="http://d1.sina.com.cn/d1images/lmt/close1.jpg",f="http://simg.sinajs.cn/blog7style/images/common/ad/closenew.jpg",g=[40,18],h=[25,150],i=[25,24],j=[25,45];c.prototype={timer:null,show:function(){var a=this,c=this.config;clearTimeout(this.timer),this.mainContent.innerHTML=b.ad.createHTML(c.main.type,c.main.src,c.main.width,c.main.height,c.main.link,c.monitor),this.main.show(),this.miniContent.innerHTML="",this.mini.hide(),this.deferred.resolve(),this.timer=setTimeout(function(){a.hide()},1e3*c.duration||8e3)},hide:function(){var a=this.config;clearTimeout(this.timer),this.mainContent.innerHTML="",this.main.hide(),this.isHideMini||(this.mini.show(),this.miniContent.innerHTML=b.ad.createHTML(a.mini.type,a.mini.src,25,150,a.mini.link,a.monitor))},getCloseMiniHandler:function(){var a=this;return function(){clearTimeout(a.timer),a.mini.hide(),a.miniContent.innerHTML=""}},getReplayHandler:function(){var a=this;return function(){a.show()}},getCloseMainHandler:function(){var a=this;return function(){a.hide()}}},b.FollowMedia=b.FollowMedia||c}(window,window.sinaadToolkit),function(a,b,c){"use strict";function d(c){var d=document.getElementById("FullScreenWrap");if(d){var h=this;this.deferred=new b.Deferred,this.width=c.width,this.height=c.height+(c.hasClose?40:0),this.contentHeight=c.height,this.src=c.src,this.link=c.link,this.type=c.type,this.monitor=c.monitor,this.transitionStep=c.hasClose?90:98,this.replaySrc=c.replaySrc||g,this.replaySrcType=c.replaySrcType||"flash",this.duration=c.duration||(c.hasClose?5e3:8e3),this.pdps=c.pdps,this.replayFuncName="fullscreenReplayFunc"+c.pdps,this.delay=c.delay?parseInt(c.delay,10):0;var i=this.container=document.createElement("div");i.style.cssText="width:"+this.width+"px;margin:0px auto;position:relative;",d.appendChild(i);var j=this.main=document.createElement("div");j.style.cssText="display:none;";var k=this.mainContent=document.createElement("div");if(k.style.cssText="position:relative;overflow:hidden;width:"+this.width+"px;height:0px;margin:0;padding:0;",j.appendChild(k),i.appendChild(j),c.hasClose){var l=this.mainCloseBtn=document.createElement("div");l.style.cssText="cursor:pointer;position:absolute;width:77px;height:31px;right:0px;top:"+this.contentHeight+"px;background:url("+e+") no-repeat;margin:0;padding:0;";var m=this.mini=document.createElement("div");m.style.cssText="width:25px;height:117px;position:absolute;left:"+this.width+"px;top:0px;margin:0;padding:0;overflow:hidden;";var n=this.miniContent=document.createElement("div");n.style.cssText="position:absolute;left:0px;top:0px;width:25px;height:100px;overflow:hidden;margin:0;padding:0";var o=this.miniCloseBtn=document.createElement("div");if(o.style.cssText="cursor:pointer;width:25px;height:17px;position:absolute;right:0px;top:100px;background:url("+f+") no-repeat right;margin:0;padding:0;",j.appendChild(l),m.appendChild(n),c.replaySrc){var p=document.createElement("div");p.style.cssText="cursor:pointer;position:absolute;left:0px;top:0px;width:25px;height:100px;overflow:hidden;margin:0;padding:0;background:#fff;opacity:0;*filter:alpha(opacity=0);",n.innerHTML=b.ad.createHTML(this.replaySrcType,this.replaySrc,25,100),m.appendChild(p),b.event.on(p,"click",this.getReplayHandler())}else a[this.replayFuncName]=this.getReplayHandler(),n.innerHTML=b.swf.createHTML({url:g,width:25,height:100,wmode:"transparent",allowScriptAccess:"always",vars:{replayFunc:this.replayFuncName}});m.appendChild(o),i.appendChild(m),b.event.on(this.mainCloseBtn,"click",this.getCloseMainHandler()),b.event.on(this.miniCloseBtn,"click",this.getCloseMiniHandler())}this.delay?setTimeout(function(){h.show()},1e3*this.delay):this.show()}}var e="http://d1.sina.com.cn/d1images/fullscreen/cls_77x31.gif",f="http://d3.sina.com.cn/d1images/fullscreen/close.gif",g="http://d2.sina.com.cn/litong/zhitou/sinaads/release/fullscreen_replay_btn.swf",h=0;d.prototype={timer:null,aniTimer:null,show:function(){var a=this;clearTimeout(this.timer),this.mainContent.innerHTML=b.ad.createHTML(this.type,this.src,this.width,this.contentHeight,this.link,this.monitor),this.main.style.display="block",this.mini&&(this.mini.style.display="none"),this.expand(this.height,this.transitionStep,function(){a.deferred.resolve(),a.timer=setTimeout(function(){a.hide()},a.duration)})},hide:function(){var a=this;clearTimeout(this.timer),this.fold(this.transitionStep,function(){a.main.style.display="none",a.mini&&(a.mini.style.display="block");try{b.debug("Media: In building fullscreen complete!"),c.done(c.fullscreen)}catch(d){}})},expand:function(a,b,c){var d=this;a>h?(h+=b,this.mainContent.style.height=Math.min(a,h)+"px",this.aniTimer=setTimeout(function(){d.expand(a,b,c)},100)):(clearTimeout(this.aniTimer),c())},fold:function(a,b){var c=this;h>0?(h-=a,this.mainContent.style.height=h+"px",this.aniTimer=setTimeout(function(){c.fold(a,b)},100)):(clearTimeout(this.aniTimer),b())},getReplayHandler:function(){var a=this;return function(){a.show()}},getCloseMainHandler:function(){var a=this;return function(){a.hide()}},getCloseMiniHandler:function(){var a=this;return function(){clearTimeout(this.timer),a.mini.style.display="none"}}},b.FullscreenMedia=b.FullscreenMedia||d}(window,window.sinaadToolkit,window.sinaadsROC),function(a,b,c){"use strict";function d(a){var c=this;this.deferred=new b.Deferred;var d=b.storage.get("StreamMedia"+a.pdps);d=d?parseInt(d,10)+1:1,b.storage.set("StreamMedia"+a.pdps,d,864e5);var l=this.width=a.main.width,m=this.height=a.main.height;this.delay=a.delay?parseInt(a.delay,10):0,this.config=a,this.pdps=a.pdps;var n=this.main=new b.Box({width:l,height:m,position:"center "+(a.main.top||(l>320?"46":"center")),follow:1,zIndex:i}),o=this.mini=new b.Box({width:25,height:219,position:"right bottom",follow:1,zIndex:j}),p=this.mainCloseBtn=document.createElement("div");p.style.cssText=["width:"+(l>375?77:66)+"px","height:"+(l>375?31:22)+"px","position:absolute","right:0px","bottom:"+(l>375?-31:-22)+"px","z-index:"+i,"background:url("+(l>375?e:f)+") no-repeat","margin:0","padding:0","cursor:pointer"].join(";");var q=this.miniCloseBtn=document.createElement("div");q.style.cssText="margin:0px;padding:0px;display:block;cursor:pointer;width:25px;height:45px;position:absolute;left:0px;top:174px;background:url("+h+") no-repeat center;";var r=this.miniReplayBtn=document.createElement("div");r.style.cssText="width:25px;height:24px;position:absolute;left:0px;top:150px;background:url("+g+") no-repeat center;margin:0px;padding:0px;display:block;cursor:pointer;",b.event.on(q,"click",this.getCloseMiniHandler()),b.event.on(r,"click",this.getReplayHandler()),b.event.on(p,"click",this.getCloseMainHandler());var s=this.mainContent=document.createElement("div"),t=this.miniContent=document.createElement("div");n.getMain().appendChild(s),n.getMain().appendChild(p),o.getMain().appendChild(t),o.getMain().appendChild(r),o.getMain().appendChild(q),this.delay?setTimeout(function(){d>k?c.hide():c.show()},1e3*this.delay):d>k?this.hide():this.show()}var e="http://d4.sina.com.cn/d1images/lmt/cls_77x31.gif",f="http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif",g="http://d5.sina.com.cn/d1images/lmt/play.gif",h="http://d1.sina.com.cn/d1images/lmt/close1.jpg",i=12e3,j=1e4,k=2;d.prototype={timer:null,show:function(){var a=this,c=this.config;clearTimeout(this.timer),this.miniContent.innerHTML="",this.mainContent.innerHTML=b.ad.createHTML(c.main.type,c.main.src,c.main.width,c.main.height,c.main.link||c.link,c.monitor,"",{wmode:"transparent"}),this.main.show(),this.mini.hide(),this.timer=setTimeout(function(){a.hide()},c.duration||(this.width>300?8e3:5e3))},hide:function(){var a=this.config;clearTimeout(this.timer),this.mainContent.innerHTML="",this.mini.show(),this.main.hide(),this.miniContent.innerHTML=b.ad.createHTML(a.mini.type,a.mini.src,25,150,a.mini.link||a.link,a.monitor);try{b.debug("Media: In building stream complete!"),c.done(c.stream)}catch(d){}},getCloseMiniHandler:function(){var a=this;return function(){clearTimeout(a.timer),a.mini.hide(),a.miniContent.innerHTML=""}},getReplayHandler:function(){var a=this;return function(){a.show()}},getCloseMainHandler:function(){var a=this;return function(){a.hide()}}},b.StreamMedia=b.StreamMedia||d}(window,window.sinaadToolkit,window.sinaadsROC),function(a,b){"use strict";function c(a,c){if(c.src=b.array.ensureArray(c.src),c.type=b.array.ensureArray(c.type),c.link=b.array.ensureArray(c.link),this.config=c,a.style.display="block",a.innerHTML=b.ad.createHTML(c.type[0],c.src[0],0,0,c.link[0]||"",c.monitor)||"",c.src[1]){var d=this.closeBtn=document.createElement("span");d.innerHTML="\xd7",d.style.cssText+=";position:absolute;right:6px;top:6px;line-height:10px;cursor:pointer;color:#8a8678;";var e=this.tipContent=document.createElement("div");this.tip=new b.Tip(a,{width:c.width,height:c.height,top:c.top||0,left:c.left||0,zIndex:c.zIndex}),this.tip.element.appendChild(e),this.tip.element.appendChild(d),e.innerHTML=b.ad.createHTML(c.type[1],c.src[1],c.width,c.height,c.link[1]||c.link[0]||"",c.monitor),c.autoShow&&this.tip.show(),b.event.on(d,"click",this.getHideHandler())}}b.Tip=function(c,d){this.relateElement=c,this.top=d.top||0,this.left=d.left||0,this.element=document.createElement("div"),this.element.style.cssText+=";border:1px solid #ccc;z-index:"+(d.zIndex||9999)+";display:none;position:absolute;width:"+d.width+"px;height:"+d.height+"px;overflow:hidden;",this.setPosition(),document.body.insertBefore(this.element,document.body.firstChild),b.event.on(a,"resize",this.getResizeHandler())},b.Tip.prototype={show:function(){this.element.style.display="block"},hide:function(){this.element.style.display="none"},setPosition:function(){var a=b.dom.getPosition(this.relateElement),c=this.relateElement.offsetHeight||0;this.element.style.left=(this.left||a.left)+"px",this.element.style.top=(this.top||a.top+c)+"px"},getResizeHandler:function(){var a=this;return function(){a.setPosition()}}},c.prototype={getHideHandler:function(){var a=this;return function(){a.tip.hide()}}},b.TipsMedia=b.TipsMedia||c}(window,window.sinaadToolkit),function(a,b,c){"use strict";function d(c){var d=this;c.innerWidth=c.width,c.innerHeight=c.height,c.height=j,c.width=i,this.delay=c.delay?parseInt(c.delay,10):0,this.config=c,this.pdps=c.pdps,this.deferred=new b.Deferred;var k=this.main=new b.Box({width:c.width,height:c.height,position:"right bottom",follow:1,zIndex:c.zIndex||g}),l=this.mainWrap=document.createElement("div");l.style.cssText="position:absolute;left:0px;bottom:0px;width:"+c.width+"px;height:0px;overflow:hidden;";var m=this.mainContent=document.createElement("div");m.style.cssText="position:absolute;width:"+c.width+"px;height:"+c.height+"px;left:0px;top:0px;";var n=this.closeBtn=document.createElement("div");n.style.cssText="background:url("+e+") left top no-repeat;cursor:pointer;z-index:"+h+";position:absolute;width:42px;height:19px;right:7px;top:1px;",l.appendChild(m),l.appendChild(n),k.getMain().appendChild(l),b.event.on(n,"click",this.getCloseHandler()),b.event.on(n,"mouseover",function(b){var c=b||a.event,d=c.target||c.srcElement;d.style.background="url("+f+") left top no-repeat"}),b.event.on(n,"mouseout",function(b){var c=b||a.event,d=c.target||c.srcElement;d.style.background="url("+e+") left top no-repeat"}),this.delay?setTimeout(function(){d.show()},1e3*this.delay):this.show()}var e="http://d1.sina.com.cn/shh/ws/2012/09/29/1/close1.gif",f="http://d1.sina.com.cn/shh/ws/2012/09/29/1/close2.gif",g=11e3,h=11010,i=300,j=300;d.prototype={aniTimer:null,show:function(){var a=this;this.mainWrap.style.height="0px",this.main.show(),this.mainContent.innerHTML=b.ad.createHTML(this.config.type,this.config.src,this.config.width,this.config.height,"",this.config.monitor)+(this.config.link?'<a style="position:absolute;background:#fff;opacity:0;filter:alpha(opacity=0);width:'+this.config.innerWidth+"px;height:"+this.config.innerHeight+'px;left:0;top:24px" href="'+this.config.link+'" target="_blank"></a>':""),this.tmpHeight=0,this.aniTimer=setInterval(function(){if(a.tmpHeight<a.config.height)a.tmpHeight+=10,a.mainWrap.style.height=a.tmpHeight+"px";else{a.mainWrap.style.height=a.config.height+"px",clearInterval(a.aniTimer);try{b.debug("Media: In building videoWindow complete!"),c.done(c.videoWindow)}catch(d){}}},20)},hide:function(){this.mainContent.innerHTML="",this.aniTimer&&clearInterval(this.aniTimer),this.main.hide()},getCloseHandler:function(){var a=this;return function(){a.hide()}}},b.VideoWindowMedia=b.VideoWindowMedia||d}(window,window.sinaadToolkit,window.sinaadsROC);
/*
//@ sourceMappingURL=Media.js.map
*/
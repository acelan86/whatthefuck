/*!
 * sinaads monitor helper
 * @author fedeoo<zhangfei1[at]staff.sina.com.cn>
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
!function(a){"use strict";var b=function(){var a,b,c=window.name,d=location.search.substring(1),e=0,f={},g=[];if(c&&g.push(c),d&&g.push(d),c=g.join("&"))for(c=c.split("&"),e=0,a=c.length;a>e;e++)b=c[e],b&&(b=b.split("="),f[b[0]]?f[b[0]].push(b[1]):f[b[0]]=[b[1]]);return f}(),c={rnd:function(){return Math.floor(2147483648*Math.random()).toString(36)},log:function(a,b){var d=new Image,e="_sinaads_sio_log_"+c.rnd();window[e]=d,d.onload=d.onerror=d.onabort=function(){d.onload=d.onerror=d.onabort=null,window[e]=null,d=null},d.src=a+(b?"":(a.indexOf("?")>0?"&":"?")+e)},sendClickTag:function(){if(b.clickTAG&&b.clickTAG.length>0)for(var a=0,d=b.clickTAG.length;d>a;a++)c.log(decodeURIComponent(b.clickTAG[a]))}};a.sinaadsMoHelper=a.sinaadsMoHelper||c}(window);
/*
//@ sourceMappingURL=sinaadsMoHelper.js.map
*/
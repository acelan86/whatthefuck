/*!
 * sinaads monitor helper
 * @author acelan<xiaobin8[at]staff.sina.com.cn>
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
!function(a){"use strict";function b(a,b){var c="",d=0>a,e=String(Math.abs(a));return e.length<b&&(c=new Array(b-e.length+1).join("0")),(d?"-":"")+c+e}function c(a,c){function d(a,b){c=c.replace(a,b)}if("string"!=typeof c)return a.toString();var e=b,f=a.getFullYear(),g=a.getMonth()+1,h=a.getDate(),i=a.getHours(),j=a.getMinutes(),k=a.getSeconds();return d(/yyyy/g,e(f,4)),d(/yy/g,e(parseInt(f.toString().slice(2),10),2)),d(/MM/g,e(g,2)),d(/M/g,g),d(/dd/g,e(h,2)),d(/d/g,h),d(/HH/g,e(i,2)),d(/H/g,i),d(/hh/g,e(i%12,2)),d(/h/g,i%12),d(/mm/g,e(j,2)),d(/m/g,j),d(/ss/g,e(k,2)),d(/s/g,k),c}function d(a){var b=[];for(var c in a)b.push('"'+c+'":"'+a[c]+'"');return"{"+b.join(",")+"}"}var e=c(new Date,"yyyyMMddHH"),f=function(){for(var b,c=a.location.hash.substring(1).split("&"),d={},f="sinaads_server_preview",g=0;b=c[g++];)b=b.split("="),0===b[0].indexOf(f)&&(d[b[1]]=e);return d}();a.getSinaadsServerPreviewSlots=function(){return d(f)}}(window);
/*
//@ sourceMappingURL=sinaadsServerPreviewSlots.js.map
*/
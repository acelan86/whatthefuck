/*!
 * sinaads-dev version
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
!function(a,b,c){"use strict";function d(a){this.uid=a||"fc-uid"+(+new Date).toString(36),this.list={}}if(!b.FrequenceController)return d.prototype={has:function(a){return this.list[a]},register:function(a,b){b&&(this.list[a]=b)},disable:function(a){this.has(a)&&c.storage.set(this.uid+a+"_disabled",1,1e3*this.list[a])},isDisabled:function(a){return c.storage.get(this.uid+a+"_disabled")}},b.FrequenceController=d,d}(window,window.sinaadToolkit||window,window.sinaadToolkit),function(a,b){"use strict";function c(a,b){return function(){a.done(b)}}function d(a){for(var b,d,e=0;b=a.order[e++];)f(a,b)&&(a._state[b]=h.DOING,a._doneTimeoutTimer[b]=setTimeout(c(a,b),a._timeout),d=a._callback[b],"function"==typeof d?d.apply(a._callbackThis[b]||null,a._callbackArgs[b]||[]):a.done(b));g.allDone(a)&&a._checkTimer&&clearInterval(a._checkTimer)}function e(a){return function(){d(a)}}function f(a,b){for(var c,d=0;(c=a.order[d++])&&c!==b;)if(a._state[c]!==h.DONE)return!1;return a._state[b]?a._state[b]===h.READY:!0}function g(a,b){var c,d=b||{},f=0;for(this._uid="oc-uid"+(+new Date).toString(36),this._state={},this._callback={},this._callbackArgs={},this._callbackThis={},this._doneTimeoutTimer={},this._frequence=d.frequence||i,this._timeout=d.timeout||j,this.order=a||[];c=this.order[f++];)this._state[c]=h.INIT;this._checkTimer=setInterval(e(this),this._frequence)}if(!b.OrderController){var h={INIT:1,READY:2,DOING:3,DONE:4},i=1e3,j=12e3;g.allDone=function(a){for(var b,c=0;b=a.order[c++];)if(a._state[b]!==h.DONE)return!1;return!0},g.prototype={has:function(a){return-1!==("|"+this.order.join("|")+"|").indexOf("|"+a+"|")},ready:function(a,b,c,d){this.has(a)?(this._state[a]=h.READY,this._callback[a]=b,this._callbackArgs[a]=c,this._callbackThis[a]=d):b.apply(d||null,c||[])},done:function(a){this.has(a)&&(this._state[a]=h.DONE,this._doneTimeoutTimer[a]&&clearTimeout(this._doneTimeoutTimer[a]),delete this._callback[a],delete this._callbackArgs[a],delete this._callbackThis[a],delete this._doneTimeoutTimer[a])}},b.OrderController=g}}(window,window.sinaadToolkit||window);
/*
//@ sourceMappingURL=sinaads.dev.js.map
*/
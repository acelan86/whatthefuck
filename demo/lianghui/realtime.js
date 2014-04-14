// 201402111553
//version 2.0.1 快讯前logo赞助广告 201402271428  xiaobin8@
//version 2.0.0 使用IO.WebPush3(WebSockets)加载数据 201401061547 daichang
//version 1.8.6 (可上线)添加 isrightmsg 在某些频道下阻止弹窗,20130329添加更多频道 @王鑫
//version 1.8.5 (可上线)添加_preventTanChuang_开关
//version 1.8.4 (可上线)修复safari bug
//version 1.8.3 (可上线)自动计算宽度，并增加了5px的余量
//version 1.8.2 (可上线)去掉弹窗描述必填的限制
//version 1.8.1 (可上线)以B版完全上线，但时间紧迫，所以代码尚未重构
//version 1.8   (可上线)增加A,B版测试代码，A,B各50%几率，用.sina.com.cn 级别cookie记录， cookie的有效期一年，之后会做清除处理
//version 1.7.2 增加单击标题、内容、详细，弹出浏览器新窗口同时，关闭新闻快讯弹框 by xiaolong1
//version 1.7.1 修改样式，半透明阴影，按钮等
//version 1.7 修改样式,添加suda统计代码 daichang add 20121210
//version 1.6     切换接口地址，其它未变
//version 1.5.1   增加强制js刷新的标识; expose env
//version 1.4.9.9 try line 300
//version 1.4.9.8 修改轮询的bug
//version 1.4.9.7 suda + pageview url
//version 1.4.9.6 suda + url  ... 可上线(9.17 16:45)
//version 1.4.9.5 suda修改
//version 1.4.9  加suda统计代码
//version 1.4.8  5分钟后刷新时间变为原来的150秒，2小时后停止刷新, 不删flash
//version 1.4.3
//log
//  上线前工作:DEBUG, 开关, KEY, temp, toremove, 清通道, version, 中文, console.log, alert
//
//
/*!
* sina.com.cn/license
* svn:../ui/task/others/12Q3/0829_实时弹窗/
* 201401061526
* [${p_id},${t_id},${d_id}] published at ${publishdate} ${publishtime}
*/

//广告数据
;(function () {
    "use strict";

    var KEY = 'sinaads_rtw_';

    var logos = {
            //总赞 ：素材地址， 曝光地址，连接地址，投放时间，展现次数
            'zz' : [
                'http://d1.sina.com.cn/litong/zhitou/sinaads/demo/lianghui2014/whh.png',
                'http://sax.sina.com.cn/click?type=1',
                '',
                ['2014-3-5 0:0:0~2014-3-5 23:59:59', '2014-3-12 0:0:0~2014-3-12 23:59:59'],
                1
            ],
            //深度 ： 素材地址，曝光地址，链接地址，投放时间
            'sd' : [
                'http://d1.sina.com.cn/litong/zhitou/sinaads/demo/lianghui2014/gl.png',
                'http://sax.sina.com.cn/click?type=2',
                '',
                ['2014-3-4 0:0:0~2014-3-4 23:59:59', '2014-3-10 0:0:0~2014-3-10 23:59:59'],
                1
            ]
            //聚焦 ： 素材地址，曝光地址，连接地址，投放时间
            //'jj' : [
            //  'http://d1.sina.com.cn/litong/zhitou/sinaads/demo/lianghui2014/3.jpg',
            //  'http://sax.sina.com.cn/click?type=3',
            //  'http://sina.com.cn',
            //  '2014-2-27 0:0:0~2014-2-30 23:59:59',
            //  1
            //]
        },
        imgs = [];

    /**
     * 广告日程判断
     * @param {Mix} ranges 排期时间段，可以是一个字符串，或者一个数据，表示多个时间段例如:
     * [
     *   '2013-6-21',                              //2013-6-21全天
     *   '2013-6-22~2013-6-23',                    //2013-6-22到2013-6-23全天
     *   '2013-6-24 12:3:4~2013-6-25 12:13:20',    //2013-6-24 12:3:4到2013-6-25 12:13:20
     *   '9:00:00~12:59:59',                       //每天9:00:00到12:59:59
     *   '9:00:00~8:59:59'                         //9:00:00 到第二天早上 8:59:59
     * ] 或者
     * 其中一个字符串当参数
     *
     * @usage
     *   var schedule = new Schedule(ranges);
     *   检查是否在排期内的方法
     *   schedule.check('2013-06-21 6:0:0');  一个Date对象或者日期字符串即可 
     */

    function Schedule(ranges) {
        ranges = 'string' === typeof ranges ? [ranges] : ranges || [];

        this.ranges = [];

        var range,
            i = 0,
            len = ranges.length,
            start,
            end,
            now = new Date(),
            todayStr = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate();

        for(; i < len; i++) {
            range = ranges[i].replace(/\-/g, '/').split('~');

            start = range[0];
            end = range[1] ? range[1] : range[0]; //"2013-6-21" -> "2013-06-21, 2013-06-21"

            //"2013-6-21" -> '2013-6-21 0:0:0'
            if (start.indexOf(':') === -1) {
                start += ' 0:0:0';
            }
            if (end.indexOf(':') === -1) {
                end += ' 0:0:0';
            }

            //"10:0:0" -> "2013-6-21 10:0:0" today 10:0:0
            if (start.indexOf('/') === -1) {
                start = todayStr + ' ' + start;
            }
            if (end.indexOf('/') === -1) {
                end = todayStr + ' ' + end;
            }

            start = +this.parse(start);
            end = +this.parse(end);

            //后面的时间比前面的小，则表明跨天，增加一天时间
            if (end <= start) {
                end += 1000 * 60 * 60 * 24;
            }

            this.ranges[i] = [start, end];
        }
    }

    Schedule.prototype = {
        /**
         * 检查是否在日程范围内
         * @param  {String | Date} time 要检查的日期
         * @return {Boolean}            是否在日程内
         */
        check : function (time) {
            var ranges = this.ranges,
                i = 0,
                range,
                result = ranges.length <= 0;

            time = time ? (+this.parse(time)) : (+new Date());//没给时间，使用当前时间检查

            while (!result && (range = ranges[i++])) {
                result = time >= range[0] && time <= range[1];
            }
            return result;
        },
        /**
         * 解析方法
         * @tangram T.date.parse
         */
        parse : function (time) {
            var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
            if ('string' === typeof time) {
                if (reg.test(time) || isNaN(Date.parse(time))) {
                    var d = time.split(/ |T/),
                        d1 = d.length > 1 ?
                                d[1].split(/[^\d]/) :
                                [0, 0, 0],
                        d0 = d[0].split(/[^\d]/);
                    return new Date(d0[0] - 0,
                                    d0[1] - 1,
                                    d0[2] - 0,
                                    d1[0] - 0,
                                    d1[1] - 0,
                                    d1[2] - 0);
                } else {
                    return new Date(time);
                }
            }
             
            return time;
        }
    };

    /*
    //usage
    //test 2013-6-21
    var schedule = new Schedule([
        //'2013-6-21',                              //2013-6-21全天
        //'2013-6-22~2013-6-23',                    //2013-6-22到2013-6-23全天
        //'2013-6-24 12:3:4~2013-6-25 12:13:20',    //2013-6-24 12:3:4到2013-6-25 12:13:20
        //'9:00:00~12:59:59',                        //每天9:00:00到12:59:59
        '9:00:00~8:59:59'                         //9:00:00 到第二天早上 8:59:59
    ]);
    schedule.check(+new Date('2013/6/21 8:0:0'));
    */

    ;(function(exports,name) {
        var fns = [];
        var isReady = 0;
        var iframeStore = null;
        var EXPORTNAME = name||'___SinaadsCrossDomainStorage___';
        var HANDLE = EXPORTNAME + '.onReady';
        var opt = {
            domain: 'sina.com.cn',
            url: 'http://news.sina.com.cn/iframe/87/store.html'
        };
        var ERROR = {
            domain: 'fail to set domain!'
        };
        var loadStore = function() {
            if(iframeStore){
                return;
            }
            try {
                document.domain = opt.domain;
            } catch (e) {
                throw new Error(ERROR.domain);
            }
            var node = document.getElementById(EXPORTNAME);
            if(node){
                node.parentNode.removeChild(node);
            }
            var iframeWrap = document.createElement('div');
            var doc = document.body;
            var iframe = '<iframe src="' + opt.url + '?handle=' + HANDLE + '&domain=' + opt.domain + '" frameborder="0"></iframe>';
            var px = '-'+1e5+'em';
            iframeWrap.style.position = 'absolute';
            iframeWrap.style.left = px;
            iframeWrap.style.top = px;
            iframeWrap.className = 'hidden';
            iframeWrap.id = EXPORTNAME;
            iframeWrap.innerHTML = iframe;
            doc.insertBefore(iframeWrap, doc.childNodes[0]);
        };

        var checkReady = function() {
            if (!isReady) {
                loadStore();
            }
            return isReady;
        };
        var CrossDomainStorage = {};
        CrossDomainStorage.ready = function(fn) {
            if (!checkReady()) {
                //ifrmae还没加载
                fns.push(fn);
                return;
            }
            fn(iframeStore);
        };
        CrossDomainStorage.onReady = function(store) {
            if (isReady) {
                return;
            }
            isReady = 1;
            iframeStore = store;
            if (fns) {
                while (fns.length) {
                    fns.shift()(store);
                }
            }
            fns = null;
        };
        CrossDomainStorage.config = function(o) {
            if (!o) {
                return;
            }
            for (var i in o) {
                if (o.hasOwnProperty(i)) {
                    opt[i] = o[i] || opt[i];
                }
            }
            return this;
        };
        exports[EXPORTNAME] = CrossDomainStorage;
    })(window);

    var XDomainStorage = window.___SinaadsCrossDomainStorage___;


    try {
        document.execCommand('BackgroundImageCache', false, true);
    } catch(e) {}

    for (var i = 0, len = logos.length; i < len, imgs[i]; i++) {
        imgs[i] = new Image();
        imgs[i].src = logos[i][0];
    }

    window.sinaadsRealtimeWindowAD = {
        get : function (cb) {
            XDomainStorage.ready(function(storage){
                var logo,
                    now = new Date(),
                    nowMonth = now.getMonth(),
                    nowDate = now.getDate();

                for (var key in logos) {
                    logo = logos[key];
                    //是否在投放期内
                    if (!new Schedule(logo[3]).check()) {
                        logo = [];
                        continue;
                    }
                    //是否今天展现过
                    var lastshow = storage.get(KEY + key),
                        show = new Date(),
                        showMonth,
                        showDate,
                        lastshowTime,
                        lastshowCount = 0;
                    if (lastshow) {
                        lastshowTime = parseInt((lastshow + '').split('|')[0], 10);
                        show.setTime(lastshowTime);
                        showMonth = show.getMonth();
                        showDate = show.getDate();
                        if (showMonth === nowMonth && showDate === nowDate) {
                            lastshowCount = parseInt((lastshow + '').split('|')[1], 10) || 1;
                            if (lastshowCount >= (parseInt(logo[4], 10) || 1)) {
                                logo = [];
                                continue;
                            }
                        }
                    }
                    storage.set(KEY + key, +new Date() + '|' + (++lastshowCount));
                    break;
                }
                cb && cb(logo);
            });
        }
    };
})();


(function(){
//if is iframe, return.
if ((window.top !== window.self)||window._preventTanChuang_) {
    return;
}
//$fx
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('q $1y(g){7(g.18&&g.18==1)8 h=g;t 7(1z(g).19(/^#([^$]+)$/i)){8 h=1A.1B(K.$1+\'\');7(!h)9 Q}t 9 Q;7(W(h.6)!=\'X\'&&h.6){h.6.R();9 h};h.1C=0.1;h.6={};h.6.4=[];h.6.C=0;7(W(h.L)!=\'X\')1a{1b h.L}1c(1d){h.L=Q}8 k={\'1e|1f|1D|1E|1g|1h|1F|1G|1H|1i|1j\':\'1I\',\'1J\':\'1K\',\'E\':\'\'};8 l=!!1L.1M.19(/1N/1O);8 m={1k:S,H:5,D:\'\'};8 n={E:q(a,b){a=u(a);7(z(a)){7(l){8 c=(T K(\'1l\\\\s*\\\\(E\\\\s*=\\\\s*(\\\\d+)\\\\)\')).Y(h.v.1m+\'\');7(c)9 u(c[1]);t 9 1}t{9 Z.1P((h.v.E?1Q(h.v.E):1)*S)}}t{a=Z.1R(S,Z.1S(0,a));7(l){h.v.1T=1;h.v.1m=\'1l(E=\'+a+\');\'}t{h.v.E=a/S}}},\'1i\':q(a,b){a=u(a);8 x=0,y=0;8 c=(T K(\'^(-?\\\\d+)[^\\\\d\\\\-]+(-?\\\\d+)\')).Y(h.v.U+\'\');7(c){x=u(c[1]);y=u(c[2])}7(z(a))9 x;t{h.v.U=a+b+\' \'+y+b}},\'1j\':q(a,b){a=u(a);8 x=0,y=0;8 c=(T K(\'^(-?\\\\d+)[^\\\\d\\\\-]+(-?\\\\d+)\')).Y(h.v.U+\'\');7(c){x=u(c[1]);y=u(c[2])}7(z(a))9 y;t{h.v.U=x+b+\' \'+a+b}}};8 o={1g:q(){9 u(h.1U)},1h:q(){9 u(h.1V)},1e:q(){8 a=0;A(8 b=h;b;b=b.1n)a+=u(b.1W);9 a},1f:q(){8 a=0;A(8 b=h;b;b=b.1n)a+=u(b.1X);9 a}};h.1o=q(){3.6.R();9 3};h.1p=q(a,b){7(h.6.4[3.6.C].I)9 3;8 b=u(b);3.6.4[z(b)?3.6.C:b].10=a;9 3};h.1q=q(c){8 d=3.6.C;7(3.6.4[d].I)9 3;A(8 p 1r m){7(!c[p])c[p]=m[p]};7(!c.D){A(8 e 1r k)7((T K(e,\'i\').1Y(c.r))){c.D=k[e];1Z}};c.J=(c.J&&c.J.B)?c.J:q(){};c.M=(c.M&&c.M.B)?c.M:q(){};7(!3.6[c.r]){7(n[c.r])3.6[c.r]=n[c.r];t{8 f=3;3.6[c.r]=q(a,b){7(W(a)==\'X\')9 u(f.v[c.r]);t f.v[c.r]=u(a)+b}}};7(z(c.F)){7(z(3.6[c.r]()))7(o[c.r])c.F=o[c.r]();t c.F=0;t c.F=3.6[c.r]()}c.11=c.F;3.6[c.r](c.F,c.D);3.6.4[d].w.20(c);9 3};h.1s=q(a,b,c){8 d=h.6.C;7(3.6.4[d].I){9 3}1t(q(){7(h.6.4[d].I)9 h;h.6.4[d].I=12;7(h.6.4[d].N>0)9 h;h.6.4[d].13=(a&&a.B)?a:q(){};h.6.4[d].1u=(c&&c.B)?c:q(){};7(!z(b))h.6.4[d].V=b;A(8 i=0;i<h.6.4[d].w.G;i++){h.6.4[d].w[i].J.B(h);h.6.O(d,i)}},h.6.4[d].10);9 3};h.1v=q(a,b){3.6.4[!z(b)?b:3.6.C].14=a;9 3};h.1w=q(a){3.6.4[!z(a)?a:3.6.C].15=12;9 3};h.1x=q(){A(8 i=0;i<3.6.4.G;i++){A(8 j=0;j<3.6.4[i].w.G;j++){8 a=3.6.4[i].w[j];7(z(a.11))3.6[a.r](\'\',\'\');t 3.6[a.r](a.11,a.D)}}8 b=[\'6\',\'1p\',\'1q\',\'1o\',\'1s\',\'1v\',\'1w\',\'1x\'];A(8 i=0;i<b.G;i++)1a{1b 3[b[i]]}1c(1d){3[b[i]]=Q}3.L=12};h.6.R=q(){8 a=3.4.G;3.C=a;3.4[a]={};3.4[a].V=1;3.4[a].15=16;3.4[a].w=[];3.4[a].N=0;3.4[a].P=0;3.4[a].10=0;3.4[a].14=16;3.4[a].I=16;3.4[a].13=q(){};9 3};h.6.O=q(a,b){7(!3.4[a]||3.4[a].15||h.L)9;8 c=3.4[a].w[b];8 d=3[c.r]();7((c.H>0&&d+c.H<=c.17)||(c.H<0&&d+c.H>=c.17)){7(!3.4[a].14)3[c.r](d+c.H,c.D);8 e=3;1t(q(){7(e.O)e.O(a,b)},c.1k)}t{3[c.r](c.17,c.D);3.4[a].N++;c.M.B(h);7(3.4[a].w.G==3.4[a].N){3.4[a].N=0;3.4[a].P++;3.4[a].1u.B(h,3.4[a].P);7(3.4[a].P<3.4[a].V||3.4[a].V==-1){A(8 i=0;i<3.4[a].w.G;i++){3[c.r](c.F,3.4[a].w[i].D);3.4[a].w[i].J.B(h,3.4[a].P);3.O(a,i)}}t{3.4[a].13.B(h)}}}};h.6.R();9 h}',62,125,'|||this|sets||_fx|if|var|return|||||||||||||||||function|type||else|parseInt|style|_queue|||isNaN|for|call|_currSet|unit|opacity|from|length|step|_isrunning|onstart|RegExp|_fxTerminated|onfinish|_effectsDone|_process|_loopsDone|null|_addSet|100|new|backgroundPosition|_loops|typeof|undefined|exec|Math|_holdTime|_initial|true|_onfinal|_paused|_stoped|false|to|nodeType|match|try|delete|catch|err|left|top|width|height|backgroundx|backgroundy|delay|alpha|filter|offsetParent|fxAddSet|fxHold|fxAdd|in|fxRun|setTimeout|_onloop|fxPause|fxStop|fxReset|fx|String|document|getElementById|fxVersion|right|bottom|margin|padding|spacing|px|font|pt|navigator|userAgent|MSIE|ig|round|parseFloat|min|max|zoom|offsetWidth|offsetHeight|offsetLeft|offsetTop|test|break|push'.split('|'),0,{}));

    //lxl begin
    (function(){
        //env
        var env = {
            //static
            DEBUG: false,
            version: '2.0.0',
            SOCKET_API:'newspush.sinajs.cn',
            JS_POLL_VAR: 'live_NEWSPUSH',
            // JS_POLL_VAR:'test_NEWSPUSH',
            JS_POLL_PERIOD: 6 * 1000,
            COOKIE_KEY_TIMESTAMP: 'lxlrttp',
            COOKIE_KEY_STATUS: 'lxlrtst',
            CSS_ID: 'realTimeWindowStyle',
            isIe6: (!-[1,] && !window.XMLHttpRequest),
            //fn
            ready: null,
            ua:(function(){
                var uas = {};
                var ua = navigator.userAgent.toLowerCase();
                uas.isIOS = /\((iPhone|iPad|iPod)/i.test(ua);
                return uas;
            })()
        };

        //util
        (function(){
            //log
            env.log = function (msg) {
                env.DEBUG && window.console && window.console.log && window.console.log(msg);
            };
            env.log('version: ' + env.version);

            env.trim = function (str) { if(!str) return ''; return str.replace(/(^\s*)|(\s*$)/g, "") };
            env.encodeHTML = function(str){
                var div = document.createElement('div');
                div.appendChild(document.createTextNode(str));
                return div.innerHTML.replace(/\s/g, '&nbsp;');
            };

            /**
             * DOMReady
             *
             * @fileOverview
             *    Cross browser object to attach functions that will be called
             *    immediatly when the DOM is ready.
             *    Released under MIT license.
             * @version 2.0.1
             * @author Victor Villaverde Laan
             * @link http://www.freelancephp.net/domready-javascript-object-cross-browser/
             * @link https://github.com/freelancephp/DOMReady
             */
            (function () {
                /**
                 * @namespace DOMReady
                 */
                var DOMReady = (function () {
                    // Private vars
                    var me = {};
                    var fns = [],
                        isReady = false,
                        errorHandler = null,
                        run = function (fn, args) {
                            try {
                                // call function
                                fn.apply(me, args || []);
                            } catch(err) {
                                // error occured while executing function
                                if (errorHandler)
                                    errorHandler.call(me, err);
                            }
                        },
                        ready = function () {
                            isReady = true;

                            // call all registered functions
                            for (var x = 0; x < fns.length; x++)
                                run(fns[x].fn, fns[x].args || []);

                            // clear handlers
                            fns = [];
                        };

                    /**
                     * Set error handler
                     * @static
                     * @param {Function} fn
                     * @return {DOMReady} For chaining
                     */
                    me.setOnError = function (fn) {
                        errorHandler = fn;

                        // return this for chaining
                        return me;
                    };

                    /**
                     * Add code or function to execute when the DOM is ready
                     * @static
                     * @param {Function} fn
                     * @param {Array} args Arguments will be passed on when calling function
                     * @return {DOMReady} For chaining
                     */
                    me.add = function (fn, args) {
                        // call imediately when DOM is already ready
                        if (isReady) {
                            run(fn, args);
                        } else {
                            // add to the list
                            fns[fns.length] = {
                                fn: fn,
                                args: args
                            };
                        }

                        // return this for chaining
                        return me;
                    };

                    // for all browsers except IE
                    if (window.addEventListener) {
                        window.document.addEventListener('DOMContentLoaded', function () { ready(); }, false);
                    } else {
                        // for IE
                        // code taken from http://ajaxian.com/archives/iecontentloaded-yet-another-domcontentloaded
                        (function(){
                            // check IE's proprietary DOM members
                            if (!window.document.uniqueID && window.document.expando)
                                return;

                            // you can create any tagName, even customTag like <document :ready />
                            var tempNode = window.document.createElement('document:ready');

                            try {
                                // see if it throws errors until after ondocumentready
                                tempNode.doScroll('left');

                                // call ready
                                ready();
                            } catch (err) {
                                setTimeout(arguments.callee, 0);
                            }
                        })();
                    }

                    return me;
                })();

                env.ready = function (fn) {
                    DOMReady.add(fn);
                };
            })();
            env.addEvent = function (elem, evt, fn) {
                if (!elem) {
                    return;
                }
                if (elem.addEventListener) {
                    elem.addEventListener(evt, fn, false);
                } else if (elem.attachEvent) {
                    elem.attachEvent('on' + evt, fn);
                }
            };

            env.dom = {};
            env.dom.byId = function (id) {
                return document.getElementById(id) || null;
            };
            //var IE6_SCROLLBAR_WIDTH = 16
            env.viewportSize = function () {
                 var viewportwidth;
                 var viewportheight;
                 var docWidth, docHeight;

                 //docWidth = document.documentElement.scrollWidth;
                 //docHeight = document.documentElement.scrollHeight;

                 if (typeof window.innerWidth != 'undefined') {
                      viewportwidth = window.innerWidth,
                      viewportheight = window.innerHeight
                 } else if (typeof document.documentElement != 'undefined'
                     && typeof document.documentElement.clientWidth !=
                     'undefined' && document.documentElement.clientWidth != 0) {
                       viewportwidth = document.documentElement.clientWidth,
                       viewportheight = document.documentElement.clientHeight
                 } else {
                       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
                       viewportheight = document.getElementsByTagName('body')[0].clientHeight
                 }
                 return {
                    //w: (docHeight - viewportheight > 0) ? viewportwidth - IE6_SCROLLBAR_WIDTH : viewportwidth,
                    //h: (docWidth - viewportwidth > 0) ? viewportheight - IE6_SCROLLBAR_WIDTH : viewportheight
                    w: viewportwidth,
                    h: viewportheight
                 }
            };
            //doc position just for ie6
            (function(){
                if (!env.isIe6) {
                    env.docScrollPosition = function(){ return null; };
                    return;
                }
                var scrollTop = document.body ? (window.pageYOffset
                                    || document.documentElement.scrollTop
                                    || document.body.scrollTop
                                    || 0) : 0;
                var scrollLeft = document.body ? (window.pageXOffset
                                    || document.documentElement.scrollLeft
                                    || document.body.scrollLeft
                                    || 0) : 0;
                env.addEvent(window, 'scroll', function(e){
                    if (!document.body) {
                        return;
                    }
                    scrollTop = document.body ? (window.pageYOffset
                                    || document.documentElement.scrollTop
                                    || document.body.scrollTop
                                    || 0) : 0;
                    scrollLeft = document.body ? (window.pageXOffset
                                    || document.documentElement.scrollLeft
                                    || document.body.scrollLeft
                                    || 0) : 0;
                });

                env.docScrollPosition = function(){
                    if (!document.body) {
                        return null;
                    }
                    return {
                        top: scrollTop,
                        left: scrollLeft
                    };
                };
            })();

            //cookie
            function setCookie (name, value, expires, path, domain, secure) {
                try {
                    var today = new Date();
                    today.setTime( today.getTime() );
                    if (expires) {
                        expires = expires * 1000 * 60 * 60 * 24;
                    }
                    var expires_date = new Date(today.getTime() + (expires));
                    document.cookie = name + "=" + escape( value ) +
                        ((expires) ? ";expires=" + expires_date.toGMTString() : "" ) +
                        ((path) ? ";path=" + path : "" ) +
                        ((domain) ? ";domain=" + domain : "" ) +
                        ((secure) ? ";secure" : "" );
                } catch (e) {}
            };
            function getCookie(check_name) {
                try {
                    var a_all_cookies = document.cookie.split(';');
                    var a_temp_cookie = '';
                    var cookie_name = '';
                    var cookie_value = '';
                    var b_cookie_found = false; // set boolean t/f default f
                    for (i = 0; i < a_all_cookies.length; i++) {
                        // now we'll split apart each name=value pair
                        a_temp_cookie = a_all_cookies[i].split('=');

                        // and trim left/right whitespace while we're at it
                        cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

                        // if the extracted name matches passed check_name
                        if (cookie_name == check_name) {
                            b_cookie_found = true;
                            // we need to handle case where cookie has no value but exists (no = sign, that is):
                            if (a_temp_cookie.length > 1) {
                                cookie_value = unescape(a_temp_cookie[1].replace(/^\s+|\s+$/g, ''));
                            }
                            // note that in cases where cookie is initialized but no value, null is returned
                            return cookie_value;
                            break;
                        }
                        a_temp_cookie = null;
                        cookie_name = '';
                    }
                    if (!b_cookie_found) {
                        return null;
                    }
                } catch (e) {}
            };
            env.setCookie = setCookie;
            env.getCookie = getCookie;

            //get script
            var _getJsData = function(url,dispose){
                var scriptNode = document.createElement("script");
                scriptNode.type = "text/javascript";
                scriptNode.setAttribute('charset', 'gb2312');
                scriptNode.onreadystatechange = scriptNode.onload = function(){
                    if (!this.readyState || this.readyState == "loaded" || this.readyState == "complete"){
                        if(dispose){dispose()};
                        scriptNode.onreadystatechange = scriptNode.onload = null;
                        scriptNode.parentNode.removeChild(scriptNode);
                    }
                };
                scriptNode.src = url;
                document.getElementsByTagName("head")[0].appendChild(scriptNode);
            };
            env.getScript = _getJsData;

            //suda script get
            function GetSuda () {
                this._init.apply(this, arguments);
            };
            GetSuda.prototype = {
                hasGot: false,
                _get: function(){
                    env.log('got suda!');
                    this.hasGot = true;
                    for (var i = 0; i < this._readyFn.length; i++) {
                        this._readyFn[i]();
                    }
                },
                _init: function(){
                    var that = this;
                    this._readyFn = [];
                    if (window.GB_SUDA && window.GB_SUDA._S_uaTrack) {
                        env.log('got suda!');
                        this.hasGot = true;
                    } else {
                        //env.getScript('http://tjs.sjs.sinajs.cn/open/analytics/js/suda.js', function(){
                        env.getScript('http://i3.sinaimg.cn/unipro/pub/suda_s_v851c.js', function(){
                            if (window.GB_SUDA && window.GB_SUDA._S_uaTrack) {
                                that._get.call(that);
                            }
                        });
                    }
                },
                _readyFn: null,
                ready: function(fn){
                    if (typeof fn !== 'function') {
                        return;
                    }
                    if (this.hasGot) {
                        fn();
                        return;
                    }
                    this._readyFn.push(fn);
                }
            };
            env.getSuda = new GetSuda();

            env.uaTrack = function(key,val,val2){
                if(typeof _S_uaTrack == 'function'){
                    try{
                        _S_uaTrack(key, val,val2);
                    }catch(e){}
                }
            };
        })();
        //RealTime Message [Class]
        //todo
        (function(){
            //[Class] RealTimeMessage
            function RealTimeMessage(){
                this._init.apply(this, arguments);
            };
            RealTimeMessage.prototype = {
                onMsg: function (fn) {
                    this.onMsgFn = this.onMsgFn || [];
                    if (typeof fn === 'function') {
                        this.onMsgFn.push(fn);
                    }
                },
                onMsgFn: null,

                _curTimeStamp: 0, //弹窗口实时时间戳,用于校准，避免出现这个窗口的弹出框关上后，在未设置cookie之前，新数据进来了，就又弹窗了。
                _msg: function (msg) {
                    env.log('blackbox data in'+((new Date()).getTime()));
                    var lastTimeStamp, that = this,
                        __u, __m, __l;
                    if(typeof msg[0] == 'undefind'){
                        return;
                    }
                    info = msg[0];
                    if (typeof info == 'undefined'||!info) {
                        env.log('get empty data!');
                        return;
                    }

                    if (info.t < 0) {
                        env.log('get data, but info.t < 0. clear tunnel');
                        this._curTimeStamp = parseInt(info.i);
                        that._setMsgCookie(info);
                        return;
                    }

                    //temp
                    __u = env.trim(info.u);
                    __m = env.trim(info.m);
                    //__l = env.trim(info.l);
                    if (!__u || !__m) {
                        env.log('empty msg...');
                        return;
                    }
                    if (__u.toLowerCase().indexOf('http') !== 0) {
                        env.log('url is wrong!');
                        return;
                    }

                    //temp
                    if (parseInt(info.i) < 1346399822) {
                        env.log('older than 1346399822!');
                        env.log('info.i = ' + info.i);
                        return;
                    }
                    lastTimeStamp = env.getCookie(env.COOKIE_KEY_TIMESTAMP) || 0;
                    if (parseInt(info.i) > parseInt(lastTimeStamp) && parseInt(info.i) > this._curTimeStamp) {
                        that._setMsgCookie(info);
                        if (!that.onMsgFn || that.onMsgFn.length === 0) {
                            env.log('got final data, no onmsg fn');
                            return;
                        }
                        this._curTimeStamp = parseInt(info.i);

                        for (var i = 0; i < that.onMsgFn.length; i++) {
                            that.onMsgFn[i](info);
                        }
                    } else {
                        env.log('get data! old data!');
                        env.log('lastTimeStamp: ' + lastTimeStamp);
                        env.log('newTimeStamp: ' + info.i);
                        env.log('title: ' + info.m);
                    }
                },
                _setMsgCookie:function(info){
                    setTimeout(function(){
                        env.setCookie(env.COOKIE_KEY_TIMESTAMP, info.i, 100, '/', '.sina.com.cn');
                    },1e3);
                },
                _init: function(){
                    var that = this;
                    if(!IO||!IO.WebPush3){
                        return;
                    }
                    this.WebPush = new IO.WebPush3(env.SOCKET_API, [env.JS_POLL_VAR], function(msg){
                        that._msg(msg[env.JS_POLL_VAR]);
                    }, {format: 'json', local: true, interval: 12});
                }
            };
            env.RealTimeMessage = RealTimeMessage;
        })();

        //RealTime Window [Class]
        //todo
        (function(){
            function RealTimeWindow(){
                this._init.apply(this, arguments);
            };
            RealTimeWindow.prototype = {
                //ab: 'a', //a,b test, tmp code
                msg: null,
                showing: false,
                container: null,
                idPre: null,
                _closeIntervalId: null,
                _show: function(url,c_id){
                    var that = this;
                    this.showing = true;
                    //version b here goes...
                    this.container.style.visibility = 'hidden';
                    this.container.style.display = 'block';
                    this.container.style.width = 'auto';
                    this.container.style.width = 64
                        + env.dom.byId(that.idPre + 'Md').offsetWidth + 39 + 5 + 'px';
                    if (that.container.offsetWidth > env.viewportSize().w) {
                        that.container.style.left = (env.docScrollPosition() ?
                            env.docScrollPosition().left : 0) + 'px';
                    } else {
                        that.container.style.left = (env.docScrollPosition() ?
                            env.docScrollPosition().left : 0)
                            + (env.viewportSize().w/2 - that.container.offsetWidth/2)
                            + 'px';
                    }
                    this.container.style.visibility = 'visible';
                    if (env.isIe6) {
                        $fx(this.container).fxAdd({type:'top', from: parseInt(this.container.style.top), to:parseInt(this.container.style.top) - 49, step: 2, delay:12}).fxRun();
                    } else {
                        $fx(this.container).fxAdd({type:'bottom', from: -49, to:0, step: 2, delay:12}).fxRun();
                    }
                    env.getSuda.ready(function(){
                        env.log('suda pageview!');//加载触发的suda
                        env.uaTrack('newspopnew', 'pageview_'+c_id, url);
                    });
                },
                _close: function(nocookie){
                    env.log('real time window close!');
                    this.container.style.display = 'none';
                    var that = this;
                    var cookie = env.getCookie(env.COOKIE_KEY_STATUS).replace('_o', '_c');
                    if (!nocookie) {
                        env.setCookie(env.COOKIE_KEY_STATUS, cookie, 100, '/', '.sina.com.cn');
                    }
                    if (this._closeIntervalId) {
                        clearInterval(this._closeIntervalId);
                        this._closeIntervalId = null;
                    }
                    this.showing = false;

                    //version b here goes...
                    if (env.isIe6) {
                        this.container.style.top = parseInt(this.container.style.top) + 49 + 'px';
                    } else {
                        this.container.style.bottom = '-49px';
                    }
                },
                _isRightMsg:function(){
                    var dict = {
                        '1':'all',
                        '28':'ent',
                        '6':'sports',
                        '2':'tech',
                        '31':'finance',
                        '20':'baby',
                        '8':'eladies',
                        '434':'health',
                        '1081':'collection',
                        '622':'style',
                        '42':'edu',
                        '54':'astro',
                        '1443':'fo',
                        '112':'book',
                        '1488':'history'
                    };
                    var url = location.href;
                    var host = url.split('?')[0];
                    var sinacn = '.sina.com.cn';
                    var isRightChannel = function(channel){
                        return (host).indexOf(channel+sinacn)!==-1;
                    };
                    return function(info){
                        var index = info.c;
                        var channel = dict[index];
                        //不在字典的不弹窗
                        if(typeof channel=='undeinfed'){
                            //不在列表的为其它频道
                            return false;
                        }else if(channel=='all'){
                            //新闻中心
                            return true;
                        }else{
                            //检查是否该频道页面
                            return isRightChannel(channel);
                        }
                    };
                }(),
                _render: function (info) {
                    //不是合适的频道信息不显示
                    if(!this._isRightMsg(info)){
                        return;
                    }
                    var title, url, msg, time,
                        that = this, oldCookie;
                    if (!info.m || !info.u || !info.i) {
                        env.log('valid info!');
                        return;
                    }
                    title = info.m;
                    url = info.u;
                    msg = info.l;
                    time = info.i;
                    c_id = info.c;
                    oldCookie = env.getCookie(env.COOKIE_KEY_STATUS);
                    if (oldCookie && parseInt(oldCookie) === parseInt(time) && oldCookie.indexOf('_c') >= 0) {
                        return;
                    }
                    (this._closeIntervalId) && (clearInterval(this._closeIntervalId));
                    if (this.showing) {
                        this._close.call(this, true);
                        this._renderDOM.call(this, title, url, msg, c_id);
                    } else {
                        this._renderDOM.call(this, title, url, msg, c_id);
                    }
                    env.setCookie(env.COOKIE_KEY_STATUS, time + '_o', 100, '/', '.sina.com.cn');
                    this._closeIntervalId = setInterval(function(){
                        var cookie = env.getCookie(env.COOKIE_KEY_STATUS);
                        var isOpen = !!(cookie && cookie.indexOf('_o') >= 0);
                        if (!isOpen) {
                            that._close.call(that);
                        }
                    }, 100);
                },
                _addSudaClick: function(url,c_id){
                    //click title summary details close
                    var that = this;

                    //version b goes here
                    var sudaKey = 'newspopnew';
                    env.dom.byId(that.idPre + 'CloseBtn').onclick = function(){//点击关闭触发的suda
                        that._close.call(that);
                        env.getSuda.ready(function(){
                            env.log('suda close!');

                            env.uaTrack(sudaKey, 'close_'+c_id);

                        });
                    };
                    env.dom.byId(that.idPre + 'Title').onclick = function(){//点击标题触发的suda
                        that._close.call(that);
                        env.getSuda.ready(function(){
                            env.log('suda title!');

                            env.uaTrack(sudaKey, 'click_'+c_id, url);
                            env.uaTrack(sudaKey, 'title_'+c_id, url);
                        });
                    };
                    env.dom.byId(that.idPre + 'Detail').onclick = function(){//点击详细触发的suda
                        that._close.call(that);
                        env.getSuda.ready(function(){
                            env.log('suda details!');
                            env.uaTrack(sudaKey, 'click_'+c_id, url);
                            env.uaTrack(sudaKey, 'details_'+c_id, url);
                        });
                    };
                },
                _renderDOM : function (title, url, msg, c_id) {
                    var THIS = this;
                    try {
                        window.sinaadsRealtimeWindowAD.get(function (ad) {
                            THIS.__renderDOM(title, url, msg, c_id, ad);
                        }); 
                    } catch(e) {
                        THIS.__renderDOM(title, url, msg, c_id, []);
                    }      
                },
                __renderDOM: function (title, url, msg ,c_id, ad) {
                    var that = this, i, clickA;
                    var html = [];
                    title = env.encodeHTML(title);
                    //version b dom here goes...
                    html.push('<div class="rtw2-in rtw2-cfx">');
                        ad[0] && html.push(
                            '<div class="rtw2-ad">',
                                ad[1] ? '<iframe src="' + ad[1] + '" width=1 height=1 marginwidth=0 marginheight=0 hspace=0 vspace=0 frameborder=0 scrolling=no bordercolor="#000000" style="position:absolute;top:-1px;"></iframe>' : '',
                                ad[2] ? '<a class="rtw2-ad-inner" href="' + ad[2] + '" target="_blank" style="background:url(' + ad[0] + ') center center no-repeat;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=noscale, src=\'' + ad[0] + '\');_background:none;"></a>' : '<span class="rtw2-ad-inner" style="background:url(' + ad[0] + ') center center no-repeat;_filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=noscale, src=\'' + ad[0] + '\');_background:none;"></span>',
                            '</div>'
                        );
                        html.push('<div class="rtw2-lt">');
                        html.push('</div>');

                        html.push('<div class="rtw2-md" id="' + this.idPre + 'Md">');
                            html.push('<a class="rtw2-md-title" hidefocus id="' + this.idPre + 'Title" href="' + url + '" target="_blank">' + title + '</a>');
                            html.push('<a class="rtw2-md-detail" hidefocus id="' + this.idPre + 'Detail" href="' + url + '" target="_blank">详细&gt;&gt;</a>');
                        html.push('</div>');
                        html.push('<div class="rtw2-close" >');
                            html.push('<a id="' + this.idPre + 'CloseBtn"  class="rtw2-close-btn" href="javascript:void(0);" hidefocus></a>');
                        html.push('</div>');
                    html.push('</div>');
                    html = html.join('');
                    env.log(html);
                    this.container.innerHTML = html;
                    //suda start
                    that._addSudaClick(url,c_id);
                    //suda end
                    this._show.call(this, url , c_id);
                },
                _init: function(){
                    var that = this, styleNode, css;
                    this.idPre = 'rtw' + (new Date()).getTime().toString() + Math.round(Math.random() * 10000).toString();

                    if (!env.dom.byId(env.CSS_ID)) {
                        //new style
                        var newStyle = [];
                        function appendStyle (css) {
                            var style = document.createElement('style');
                            style.type = 'text/css';
                            try {
                                style.appendChild(document.createTextNode(css));
                            } catch (e) {
                                if (style.styleSheet) {
                                    try {
                                        oldCss = style.styleSheet.cssText;
                                    } catch( e) {
                                        oldCss = '';
                                    }
                                    style.styleSheet.cssText = oldCss + css;
                                } else {}
                            }
                            document.getElementsByTagName('head')[0].appendChild(style);
                        }

                        //b version style here goes...
                        newStyle.push('.rtw2-cfx:after {content:"\0020";display:block;height:0;clear:both;}');
                        newStyle.push('.rtw2-cfx {zoom:1;}');
                        newStyle.push('.real-time-window {z-index:60000; display:block; height:50px; line-height:50px; /* adadd overflow:hidden;  */ zoom:1;}');
                        newStyle.push('.real-time-window .rtw2-in { height:50px; line-height:50px; }');
                        newStyle.push('.real-time-window .rtw2-lt { display:inline; float:left; width:61px; height:50px; background:url(http://i3.sinaimg.cn/dy/deco/2013/0331/mmx_tc_ico_main.png) 0 0 no-repeat #f9f5ec; zoom:1; }');
                        newStyle.push('.real-time-window .rtw2-md { display:inline; float:left; background:#f9f5ec; height:48px; line-height:48px; zoom:1; border-top:1px solid #f6e3c9;border-bottom:1px solid #f6e3c9;}');
                        newStyle.push('.real-time-window a.rtw2-md-title { font-family:"Microsoft YaHei","微软雅黑","SimHei","黑体" !important; display:inline-block; height:48px; line-height:48px; padding:0 5px; font-size:16px; }');
                        newStyle.push('.real-time-window a.rtw2-md-title:link { color:#122E67 !important; text-decoration:none !important; }');
                        newStyle.push('.real-time-window a.rtw2-md-title:hover { color:#ff8400 !important; text-decoration:underline !important; }');
                        newStyle.push('.real-time-window a.rtw2-md-title:visited { color:#52687e !important; text-decoration:none !important; }');
                        newStyle.push('.real-time-window a.rtw2-md-detail {font-family:"SimSun","宋体","Arial Narrow" !important; display:inline-block; height:48px; line-height:48px; padding:0 5px; font-size:16px; display:none;}');
                        newStyle.push('.real-time-window a.rtw2-md-detail:link { color:#22c4ff; text-decoration:none; }');
                        newStyle.push('.real-time-window a.rtw2-md-detail:hover { color:#22c4ff; text-decoration:underline !important; }');
                        newStyle.push('.real-time-window a.rtw2-md-detail:visited { color:#22c4ff; text-decoration:none; }');
                        newStyle.push('.real-time-window .rtw2-close { display:inline; width:42px; height:38px; float:left; background:url(http://i3.sinaimg.cn/dy/deco/2013/0331/mmx_tc_ico_main.png) -61px 0 no-repeat; padding-top:12px; _filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true,sizingMethod=scale, src="http://i0.sinaimg.cn/dy/deco/2013/0331/mmx_tc_ico_right.png"); _background:none; zoom:1;}');
                        newStyle.push('.real-time-window .rtw2-close-btn{ width:26px; height:25px; display:block;background:url(http://i3.sinaimg.cn/dy/deco/2013/0331/mmx_tc_ico_main.png) no-repeat -103px 0 #f9f5ec;}');
                        newStyle.push('.real-time-window .rtw2-close-btn:hover{ background-position: right 0; }');

                        /**
                         * ad
                         */
                        newStyle.push('.real-time-window .rtw2-ad{position:absolute;left:-64px;height:51px;background:#e01700;padding-left:4px;}');
                        newStyle.push('.real-time-window .rtw2-ad .rtw2-ad-inner{display:block;width:60px;height:51px;margin-left:4px;}');
                        newStyle = newStyle.join('\n ');
                        appendStyle(newStyle);
                    }
                    var div = document.createElement('div');
                    div.className = 'real-time-window';
                    div.style.display = 'none';

                    //b version basic dom here goes...
                    if (env.isIe6) {
                        div.style.position = 'absolute';
                        //div.style.left = (env.docScrollPosition() ? env.docScrollPosition().left + 3 : 3) + 'px';
                        div.style.left = '0px';
                        div.style.top = (env.docScrollPosition() ?
                            env.docScrollPosition().top + env.viewportSize().h
                            : 10000) + 'px';
                        env.addEvent(window, 'scroll', function(e){
                            setTimeout(function(){
                                if (that.showing) {
                                    if (that.container.offsetWidth > env.viewportSize().w) {
                                        that.container.style.left = (env.docScrollPosition() ?
                                            env.docScrollPosition().left : 0) + 'px';
                                    } else {
                                        that.container.style.left = (env.docScrollPosition() ?
                                            env.docScrollPosition().left : 0)
                                            + (env.viewportSize().w/2 - that.container.offsetWidth/2)
                                            + 'px';
                                    }
                                    that.container.style.top = (env.docScrollPosition() ?
                                        env.docScrollPosition().top + env.viewportSize().h - 49
                                        : 10000) + 'px';
                                } else {
                                    that.container.style.top = (env.docScrollPosition() ?
                                    env.docScrollPosition().top + env.viewportSize().h
                                    : 10000) + 'px';
                                }
                            }, 0);
                        });
                        env.addEvent(window, 'resize', function(e){
                            setTimeout(function(){
                                if (that.showing) {
                                    if (that.container.offsetWidth > env.viewportSize().w) {
                                        that.container.style.left = (env.docScrollPosition() ?
                                            env.docScrollPosition().left : 0) + 'px';
                                    } else {
                                        that.container.style.left = (env.docScrollPosition() ?
                                            env.docScrollPosition().left : 0)
                                            + (env.viewportSize().w/2 - that.container.offsetWidth/2)
                                            + 'px';
                                    }
                                    that.container.style.top = (env.docScrollPosition() ?
                                        env.docScrollPosition().top + env.viewportSize().h - 49
                                        : 10000) + 'px';
                                } else {
                                    that.container.style.top = (env.docScrollPosition() ?
                                    env.docScrollPosition().top + env.viewportSize().h
                                    : 10000) + 'px';
                                }
                            }, 0);
                        });
                    } else {
                        div.style.position = 'fixed';
                        div.style.left = '0px';
                        div.style.bottom = '-49px';
                        env.addEvent(window, 'resize', function(e){
                            setTimeout(function(){
                                if (that.showing) {
                                    // hack ios6.1.2 screenfull position fixed
                                    if(env.ua.isIOS){
                                        document.body.scrollTop = document.body.scrollTop+1;
                                    }
                                    if (that.container.offsetWidth > env.viewportSize().w) {
                                        that.container.style.left = '0px';
                                    } else {
                                        that.container.style.left = env.viewportSize().w/2
                                            - that.container.offsetWidth/2
                                            + 'px';
                                    }
                                }
                            }, 0);
                       });
                    }
                    var appendFn = function(){
                        var body = document.getElementsByTagName('body');
                        if (!body || body.length === 0) {
                            setTimeout(appendFn, 200);
                            return;
                        }
                        body = body[0];
                        if (!body.childNodes || body.childNodes.length === 0) {
                            setTimeout(appendFn, 200);
                            return;
                        }
                        body.insertBefore(div, body.childNodes[0]);
                        that.container = div;
                        that.msg = new env.RealTimeMessage();
                        that.msg.onMsg(function(info){
                            that._render.call(that, info);
                        });
                    };
                    appendFn();
                }
            };

            env.RealTimeWindow = RealTimeWindow;
            //window.__env = env;  //temp
        })();

        //App Main
        //todo
        (function(){
            env.getScript('http://woocall.sina.com.cn/lib/IO.WebPush3.js',function(){
                var app = new env.RealTimeWindow();
                if (!window.realTimeWindow){
                    window.realTimeWindow = app;
                } else{
                    window._realTimeWindow_ = app;
                }

            });
        })();


        //expose
        window.__realtimeMessageEnv__ = env;
    })();

})();
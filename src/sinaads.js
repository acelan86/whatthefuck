/*!
 * sinaads
 * 新浪统一商业广告脚本
 * 负责使用pdps(新浪广告资源管理码)向广告引擎请求数据并处理广告渲染
 * @author acelan <xiaobin8[at]staff.sina.com.cn>
 * @version 1.0.0
 * @date 2013-08-08
 */

 /** 
  * @useage
  *     window.sinaadsPreloadData = [pdps1, pdps2, pdps3, ..., pdpsn]; 批量加载的代码
  *     (window.sinaads = window.sinaads || []).push({}); 投放一个位置
  *     (window.sinaads = window.sinaads || []).push({
  *         element : HTMLDOMElement,
  *         params : {
  *             sinaads_ad_width : xx,
  *             sinaads_ad_height : xxx,
  *             sinaads_ad_pdps : xxxx,
  *             ...
  *         }
  *     });
  *
  *
  * @info
  *    _sinaadsTargeting : 保存本页中的定向信息
  *    _SINAADS_CONF_SAX_REQUEST_TIMEOUT = 10 //设置sax请求超时时间，单位秒
  */
 (function (window, core, undefined) {
    "use strict";

    //页面url转换成唯一hash值，用于标记页面唯一的广告位
    var PAGE_HASH = 'sinaads_' + core.hash(window.location.host.split('.')[0] + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));

    var seed = {
        /**
         * 获取轮播计数值，如果没有，自动生成一个，有的话自动加1
         * @param  {String} pdps 是否为特殊的广告计数值，比如视窗有特殊计数要求，如果PDPS为空则为全局适用计数值
         * @return {Number}      计数值
         */
        get : function (pdps) {
            var key = PAGE_HASH + (pdps || '');

            if (!core[key]) {
                core[key] = parseInt(core.storage.get(key), 10) || core.rand(1, 100);
                //大于1000就从0开始，防止整数过大
                core.storage.set(key, core[key] > 1000 ? 1 : ++core[key], 30 * 24 * 60 * 60 * 1000); //默认一个月过期
            }
            return core[key];
        }
    };

    if (!core.enterTime) {
        core.enterTime = core.now();
    }

    //var IMPRESS_URL = 'http://123.126.53.109/impress.php';
    //var IMPRESS_URL =  'http://123.126.53.109:5677/impress';
    //var IMPRESS_URL = 'http://sax.sina.com.cn/newimpress';
    var IMPRESS_URL = 'http://sax.sina.com.cn/newimpress';
    var SAX_TIMEOUT = parseInt(window._SINAADS_CONF_SAX_REQUEST_TIMEOUT || 30, 10) * 1000; //请求数据超时时间

    core.PLUS_RESOURCE_URL = core.RESOURCE_URL + '/release/plus/Media.js';

    /**
     * 判断是否为sina商业广告节点且为未完成状态
     */
    //1.class=sinaads 
    //2.data-sinaads-status !== "done"
    function _isPenddingSinaad(element) {
        return (/(^| )sinaads($| )/).test(element.className) && "done" !== element.getAttribute("data-ad-status");
    }

    /**
     * 判断是否为sina商业广告节点且为异步插入的节点
     */
    //1.class=sinaads 
    //2.data-sinaads-status === "async"
    function _isAsyncSinaAd(element) {
        return (/(^| )sinaads($| )/).test(element.className) && "async" === element.getAttribute("data-ad-status");
    }
    /**
     * 如果有id参数，则获取id为当前id的未渲染元素，如果没有提供id，则从现有的元素中获取一个待渲染广告元素
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    function _getSinaAd(id) {
        var inss = document.getElementsByTagName("ins"),
            i = 0,
            len = inss.length,
            ins;
        for (ins = inss[i]; i < len; ins = inss[++i]) {
            if (_isPenddingSinaad(ins) && ((!id && !_isAsyncSinaAd(ins)) || ins.id === id)) {
                return ins;
            }
        }
        return null;
    }

    /**
     * 获取定向关键词, 全局只获取一次
     */
    
    //var targeting = window._sinaadsTargeting = window._sinaadsTargeting || (function () {
    function getTargeting() {
        var targeting = core._sinaadsTargeting;

        function clearEntryTag() {
            core.cookie.remove('sinaads_entry', {domain: '.sina.com.cn', path: '/'});
            core.storage.remove('sinaads_entry');
        }

        if (!targeting) {
            var metaNodes = document.getElementsByTagName('head')[0].getElementsByTagName('meta'),
                metas = {},
                meta,
                key,
                content,
                len = metaNodes.length,
                i = 0,
                entry,
                ip;

            targeting = {};
            /* 先将所有的meta节点的name和content缓存下来, 缓存是为了提高查找效率, 不用每次都去遍历 */
            for (; i < len; i++) {
                meta = metaNodes[i];
                if (meta.name) {
                    key = meta.name.toLowerCase();
                    content = core.string.trim(meta.content);
                    if (!metas[key]) {
                        metas[key] = [];
                    }
                    content && (metas[key].push(content));
                }
            }
            /* 拆解出name = ^sinaads_ 的key, 并得到真实的key值
             * 如果name=sinaads_key的content为空，则查找name=key的content作为内容
             */
            for (var name in metas) {
                if (name.indexOf('sinaads_') === 0) {
                    key = name.replace('sinaads_', ''); //因为以sinaads_开头，因此replace的一定是开头那个，不用使用正则/^sinaads_/匹配，提高效率
                    targeting[key] = metas[name].join(',') || metas[key].join(',');
                }
            }

            if ((entry = core.cookie.get('sinaads_entry') || core.storage.get('sinaads_entry'))) {
                targeting.entry = entry;
                /**
                 * @todo
                 * 这里有个问题，如果获取到entry后保存到全局，然后立刻清除，如果iframe里面的广告需要获取entry的话则获取不到
                 * 但是如果在unload的时候清除，可能会有用户没有关闭当前文章，又打开了另外一个文章，这时候entry也没有清除
                 * 所以最终使用了延时5s删除
                 */
                var timer = setTimeout(clearEntryTag, 5000);
                core.event.on(window, 'beforeunload', function () {
                    timer && clearTimeout(timer);
                    clearEntryTag();
                });
            }

            /* 模拟ip定向 */
            if ((ip = core.cookie.get('sinaads_ip') || core.storage.get('sinaads_ip'))) {
                targeting.ip = ip;
                core.cookie.remove('sinaads_ip');
                core.storage.remove('sinaads_ip');
            }

            core._sinaadsTargeting = targeting;
            core.debug('sinaads:Targeting init,', targeting);
        }
        return targeting;
    }

    /**
     * 数据模块
     * @return {[type]} [description]
     */
    var modelModule = (function () {
        var _cache = window._sinaadsCacheData = window._sinaadsCacheData || {};
        function _adapter(ad) {
            var networkMap = {
                    '1' : 'http://d3.sina.com.cn/litong/zhitou/union/tanx.html?pid=',
                    '2' : 'http://d3.sina.com.cn/litong/zhitou/union/google.html?pid=',
                    '3' : 'http://d3.sina.com.cn/litong/zhitou/union/yihaodian.html?pid=',
                    '4' : 'http://d3.sina.com.cn/litong/zhitou/union/baidu.html?pid=',
                    '5' : 'http://js.miaozhen.com/mzad_iframe.html?_srv=MZHKY&l='
                },
                size = ad.size.split('*'),
                engineType = ad.engineType;

            if (!ad.content && ad.value) {
                core.debug('sinaads:Old data format, need adapter(pdps)', ad.id);
                ad.content = [];
                core.array.each(ad.value, function (value) {
                    if (engineType === 'network') {
                        value.content = {
                            src : [networkMap['' + value.manageType] + value.content + '&w=' + size[0] + '&h=' + size[1]],
                            type : ['url']
                        };
                    }
                    if (engineType === 'dsp' && parseInt(value.manageType, 10) !== 17) {
                        value.content = {
                            src : [value.content],
                            type : ['html']
                        };
                    }
                    ad.content.push(value.content);
                });
                delete ad.value;
            }

            core.array.each(ad.content, function (content, i) {
                var type, link;

                type = core.array.ensureArray(content.type);
                link = core.array.ensureArray(content.link);

                core.array.each(content.src, function (src, i) {
                    type[i] = core.ad.getTypeBySrc(src, type[i]);
                });
                // 通栏  950*90 tl
                // 画中画 300*250 hzh
                // 矩形 250*230 jx
                // 短通栏 640*90 dtl
                // 大按钮 300*120 dan
                // 小按钮 240*120 xan
                // 跨栏 1000*90 kl
                // 背投  750*450 bt
                // 文字链 wzl
                ad.type = ({
                    'lmt'   : 'stream',
                    'kl'    : 'couplet',
                    'sc'    : 'videoWindow',
                    'hzh'   : 'embed',
                    'tl'    : 'embed',
                    'jx'    : 'embed',
                    'dtl'   : 'embed',
                    'an'    : 'embed',
                    'dan'   : 'embed',
                    'xan'   : 'embed',
                    'wzl'   : 'textlink',
                    'ztwzl' : 'zhitoutextlink',
                    'qp'    : 'fullscreen',
                    'fp'    : 'turning',
                    'dl'    : 'float',
                    'tip'   : 'tip',
                    'bt'    : 'bp',
                    'sx'    : 'follow',
                    'kzdl'  : 'coupletExt'
                }[ad.type]) || ad.type || 'embed';

                ad.content[i] = content;
            });

            return ad;
        }

        return {
            /**
             * 获取广告数据
             * @param  {Array} pdps 广告pdps
             * @return {Deferred}      promise调用对象
             */
            request : function (pdps, rotateCount) {
                var start = core.now(),
                    deferred = new core.Deferred(),
                    params = [],
                    isLoaded = false,
                    _pdps = [];

                //判断pdps相关数据是否存在，如果存在，直接返回，否则，请求后渲染
                core.array.each(pdps, function (str) {
                    isLoaded = !!_cache[str];
                    if (isLoaded) {
                        core.debug('sinaads:current pdps data is loaded, render immedietly. ', str, _cache[str]);
                    } else {
                        _pdps.push(str);
                    }
                });

                if (isLoaded) {
                    deferred.resolve();
                } else {
                    var targeting = getTargeting();

                    core.debug('sinaads:current pdps data is unload, load immedietly. ' + _pdps.join(), _cache);
                    
                    params = [
                        'adunitid=' + _pdps.join(','),                   //pdps数组
                        'rotate_count=' + rotateCount,                    //轮播数
                        'TIMESTAMP=' + core.enterTime.toString(36),         //时间戳
                        'referral=' + encodeURIComponent(core.url.top)  //当前页面url
                    ];


                    for (var key in targeting) {
                        params.push('tg' + key + '=' + encodeURIComponent(targeting[key]));
                    }

                    core.sio.jsonp(IMPRESS_URL + '?' + params.join('&'), function (data) {
                        if (data === 'nodata') {
                            core.debug('sinaads:' + _pdps.join() + '. No register in SAX. ');
                            deferred.reject();
                        } else {
                            core.debug('sinaads:request data ready. ', params, core.now(), core.now() - start, data);
                            //缓存数据到list中
                            //这里每次循环都reject可能会有问题
                            var notAllContentNull = false; //是否此次请求所有的广告都没有内容
                            core.array.each(data.ad, function (ad) {
                                ad = _adapter ? _adapter(ad) : ad;
                                if (ad.content instanceof Array && ad.content.length > 0) {
                                    _cache[ad.id] = ad;
                                    notAllContentNull = true;
                                } else {
                                    core.debug('sinaads:' + ad.id + '. cannot found data. ');
                                }
                            });
                            /**
                             * cookie mapping
                             * 每次请求如果有mapping需要对应就发送请求
                             * @type {Number}
                             */
                            core.array.each(data.mapUrl, function (url) {
                                core.debug('sinaads:data ready, send cookie mapping. ' + url, params, core.now());
                                url && core.sio.log(url, 1);
                            });
                            if (notAllContentNull) {
                                deferred.resolve();
                            } else {
                                deferred.reject();
                            }
                        }
                    }, {
                        timeout : SAX_TIMEOUT,
                        onfailure : function () {
                            core.debug('sinaads:request timeout, via ' + _pdps.join());
                            deferred.reject();
                        }
                    });
                }

                return deferred;
            },
            get : function (pdps) {
                return _cache[pdps];
            },
            add : function (pdps, data) {
                _cache[pdps] = data;
            }
        };
    })();

    /**
     * 显示广告模块
     */
    var viewModule = (function () {
        var handlerMap = window.sinaadsRenderHandler = window.sinaadsRenderHandler || {};

        /**
         * 注册渲染方法
         * @param  {[type]} type    [description]
         * @param  {[type]} handler [description]
         * @return {[type]}         [description]
         */
        function _register(type, handler) {
            !handlerMap[type] && (handlerMap[type] = handler);
        }

        function _render(type, element, width, height, content, config) {
            var handler = handlerMap[type],
                /**
                 * _next {
                 *     type:type, //有后续步骤，即需要进行格式化类型跟内容的后续操作
                 *     content: content
                 * }
                 * 比如，一开始是couplet类型，当格式化后，让它按照embed方式来处理
                 */
                _next;
            if ('function' === typeof handler) {
                _next = handler(element, width, height, content, config);
            }
            //上面的处理将媒体类型改变，按照新类型再执行一边render方法
            if (_next && (_next.type !== type)) {
                _render(_next.type, element, width, height, _next.content, config);
            }
        }

        /**
         * 注册一批方法
         */
        
        return {
            render : _render, //渲染方法
            register : _register,  //注册方法
            handlerMap : handlerMap
        };
    })();

    /** 注册一些常用的广告媒体类型显示方法 */
    viewModule.register('couplet', function (element, width, height, content, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/CoupletMedia.js';
        
        content = content[0]; //只用第一个内容
        //是跨栏，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        //这里认为如果couplet类型给的是素材的话，那么素材必须大于1个，否则为html类型
        if (content.src.length === 1) {
            switch (content.type[0]) {
                case 'js' :
                    core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                    break;
                case 'html' :
                    core.dom.fill(element, content.src[0]);
                    break;
                default :
                    break;
            }
        } else {
            //注入跨栏数据
            var CoupletMediaData = {
                src         : content.src,
                type        : content.type,
                link        : content.link,
                mainWidth   : width,
                mainHeight  : height,
                top         : config.sinaads_couple_top || 0,
                monitor     : content.monitor || [],
                delay       : config.sinaads_ad_delay || 0
            };
            if (core.CoupletMediaData) {
                new core.CoupletMedia(CoupletMediaData);
            } else {
                core.sio.loadScript(RESOURCE_URL, function () {
                    new core.CoupletMedia(CoupletMediaData);
                });
            }
        }
    });

    viewModule.register('videoWindow', function (element, width, height, content, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/VideoWindowMedia.js';

        content = content[0];
        element.style.cssText = 'position:absolute;top:-9999px';


        //暴露个变量供第三方使用监测链接
        //WTF，如果多个video就shi了
        window.sinaadsVideoWindowMonitor = content.monitor;

        switch (content.type[0]) {
            case 'js' :
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            case 'html' :
                core.dom.fill(element, content.src[0]);
                break;
            default :
                var VideoWindowMediaData = {
                    src     : content.src[0],
                    type    : content.type[0],
                    width   : width,
                    height  : height,
                    link    : content.link[0],
                    monitor : content.monitor,
                    delay   : config.sinaads_ad_delay || 0
                };
                if (core.VideoWindowMedia) {
                    new core.VideoWindowMedia(VideoWindowMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.VideoWindowMedia(VideoWindowMediaData);
                    });
                }
                break;
        }
    });

    viewModule.register('stream', function (element, width, height, content, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/StreamMedia.js';
        
        content = content[0];
        //流媒体，隐藏掉该区块
        element.style.cssText = 'position:absolute;top:-9999px';

        //暴露个变量供第三方使用监测链接
        //WTF，如果多个video就shi了
        window.sinaadsStreamMonitor = content.monitor;

        if (content.src.length === 1) {
            //生成一个用于渲染容器到页面中
            var streamContainer = document.createElement('div');
            streamContainer.id = 'SteamMediaWrap';
            document.body.insertBefore(streamContainer, document.body.firstChild);

            switch (content.type[0]) {
                case 'js' :
                    //富媒体供应商提供的js
                    core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                    break;
                case 'html' :
                    core.dom.fill(element, content.src[0]);
                    break;
                default :
                    break;
            }
        } else {
            //这里认为如果给的是素材的话，那么素材必须大于1个，否则为js类型
            //注入流媒体数据
            var StreamMediaData = {
                main : {
                    type    : content.type[0] || 'flash',
                    src     : content.src[0] || '',
                    link    : content.link[0] || '',
                    width   : width,
                    height  : height
                },
                mini : {
                    src     : content.src[1] || '',
                    type    : content.type[1] || 'flash',
                    link    : content.link[1] || content.link[0] || ''
                },
                monitor : content.monitor,
                delay : config.sinaads_ad_delay || 0
            };
            if (core.StreamMedia) {
                new core.StreamMedia(StreamMediaData);
            } else {
                core.sio.loadScript(RESOURCE_URL, function () {
                    new core.StreamMedia(StreamMediaData);
                });
            }
        }
    });


    viewModule.register('fullscreen', function (element, width, height, content, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/FullscreenMedia.js';

        content = content[0];
        element.style.cssText = 'position:absolute;top:-9999px';

        switch (content.type[0]) {
            case 'js' :
                //富媒体供应商提供的js
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            case 'html' :
                core.dom.fill(element, content.src[0]);
                break;
            default :
                //是全屏广告，隐藏掉改区块
                var FullScreenMediaData = {
                    type        : content.type[0] || '',
                    src         : content.src[0] || '',
                    link        : content.link[0] || '',
                    monitor     : content.monitor,
                    width       : width,
                    height      : height,
                    hasClose    : config.sinaads_fullscreen_close || 0,
                    delay       : config.sinaads_ad_delay || 0
                };
                if (core.FullscreenMedia) {
                    new core.FullscreenMedia(FullScreenMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.FullscreenMedia(FullScreenMediaData);
                    });
                }
                break;
        }
    });

    viewModule.register('bp', function (element, width, height, content, config) {
        /**
         * ie(null), firefox(null), safari(undefined)窗口拦截情况下window句柄
         * opera, chrome拦截情况下有window句柄
         * 当参数长度小于2083时，ie, chrome, firefox可以直接使用javascript:'html'方式打开窗口
         * 当参数长度大于2083时，使用拿到窗口句柄然后document.write方式写入
         * ie下拿到窗口句柄的情况下，设置了document.domain的主页面打开的空白页面会报没有权限错误
         * 其他浏览器不会
         * 最终放弃，使用原始方法进行背投处理
         *
         * 如果参数长度大于2000，从后面依此放弃monitor或者link内容，直到合适，无奈之举
         */
        content = content[0];
        //是背投广告，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        var par = [
            content.type[0],
            content.src[0],
            content.link[0],
            width,
            height
        ];
        core.array.each(content.monitor, function (url) {
            if (url) {
                par.push(url);
            }
        });
        while (par.join('${}').length > 2000) {
            par.pop();
        }

        window.open(
            'http://d1.sina.com.cn/litong/zhitou/sinaads/release/pbv5.html?' + par.join('${}'),
            'sinaads_bp_' + config.sinaads_ad_pdps,
            'width=' + width + ',height=' + height
        );
        // var key = 'sinaads_bp_content_' + core.rnd();
        // window[key] = [
        //     '<!doctype html>',
        //     '<html>',
        //         '<head>',
        //             '<meta charset="utf-8">',
        //             '<title>新浪广告</title>',
        //             '<', 'script src="' + core.TOOLKIT_URL + '"></', 'script>',
        //         '</head>',
        //         '<body style="margin:0;padding:0;">',
        //             core.ad.createHTML(
        //                 content.type[0],
        //                 content.src[0],
        //                 width,
        //                 height,
        //                 content.link[0],
        //                 monitor
        //             ),
        //         '</body>',
        //     '</html>'
        // ].join('');

        // var contentEncode = content.replace('\'', '\\\''),
        //     win, doc;
        // //如果内容在2000个字节以下
        // if (contentEncode.length <= 2000) {
        //     core.debug('sinaads:资源长度小于2000, 直接渲染');
        //     window.open("javascript:'" + contentEncode + "'", 'sinaads_bp_' + config.sinaads_ad_pdps, 'width=' + width + ',height=' + height);
        // } else {
        //     win = window.open('about:blank', 'sinaads_bp_' + config.sinaads_ad_pdps, 'width=' + width + ',height=' + height);
        //     try {
        //         doc = win.document;
        //         if (doc) {
        //             core.debug('sinaads:采用document.write方式渲染');
        //             doc.write(content);
        //         } else {
        //             window.alert('xxxx');
        //         }
        //     } catch (e) {
        //         window.alert('catch' + e.message);
        //     }
        // }
    });

    viewModule.register('float', function (element, width, height, content, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/FloatMedia.js';

        content = content[0];
        element.style.cssText = 'position:absolute;top:-99999px';
        var FloatMediaData = {
            type : content.type,
            src : content.src,
            top : config.sinaads_float_top || 0,
            monitor : content.monitor,
            link : content.link,
            delay : config.sinaads_ad_delay || 0,
            sideWidth : width,
            sideHeight : height,
            pdps : config.sinaads_ad_pdps
        };
        if (core.FloatMedia) {
            new core.FloatMedia(FloatMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.FloatMedia(FloatMediaData);
            });
        }
    });

    viewModule.register('turning', function (element, width, height, content, config) {
        var src = [],
            link = [],
            monitor = [],
            mo,
            len = content.length;
        core.array.each(content, function (content) {
            content.src && content.src[0] && (src.push(content.src[0]));
            content.link && content.link[0] && (link.push(content.link[0]));
            mo = core.array.ensureArray(content.monitor).join('|');
            mo && monitor.push(mo);
        });
        content = [
            {
                src : [
                    core.swf.createHTML({
                        id : 'TurningMedia' + config.sinaads_uid,
                        url : 'http://d3.sina.com.cn/litong/zhitou/sinaads/release/picshow_new.swf',
                        width : width,
                        height : height,
                        vars : {
                            ad_num : len,
                            pics : src.join('§'),
                            urls : link.join('§'),
                            monitor : monitor.join('§'),
                            pic_width : width - 5,
                            pic_height : height - 5,
                            flip_time : config.sinaads_turning_flip_duration * 1000 || 300,
                            pause_time : config.sinaads_turning_flip_delay * 1000 || 4000,
                            wait_time : config.sinaads_turning_wait * 1000 || 1000
                        }
                    })
                ],
                type : ['html'],
                link : []
            }
        ];
        return {
            type : 'embed',
            content : content
        }; //使用embed来解析
    });

    viewModule.register('textlink', function (element, width, height, content, config) {
        var tpl = config.sinaads_ad_tpl || '',
            html = [];
        core.array.each(content, function (content, i) {
            html.push(core.ad.createHTML(content.type, content.src, 0, 0, content.link, content.monitor, core.isFunction(tpl) ? tpl(i) : tpl));
        });
        element.style.cssText += ';text-decoration:none';
        element.innerHTML = html.join('');
    });

    viewModule.register('zhitoutextlink', viewModule.handlerMap.textlink);


    viewModule.register('tip', function (element, width, height, content, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/TipsMedia.js';

        content = content[0];
        var TipsMediaData = {
                width : width,
                height : height,
                src : content.src,
                type : content.type,
                link : content.link,
                monitor : content.monitor,
                autoShow : 1,
                top : config.sinaads_tip_top || 0,
                left : config.sinaads_tip_left || 0,
                zIndex : config.sinaads_ad_zindex || 0
            };
        if (core.TipsMedia) {
            new core.TipsMedia(element, TipsMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.TipsMedia(element, TipsMediaData);
            });
        }
    });
    viewModule.register('follow', function (element, width, height, content, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/FollowMedia.js';

        content = content[0];
        var FollowMediaData = {
                main : {
                    width : width,
                    height : height,
                    src : content.src[0] || '',
                    type : content.type[0] || '',
                    link : content.link[0] || '',
                    top : config.sinaads_follow_top || 0
                },
                mini : {
                    src : content.src[1] || '',
                    type : content.type[1] || '',
                    link : content.link[1] || content.link[0] || '',
                    top : config.sinaads_follow_mini_top || 'bottom'
                },
                monitor : content.monitor,
                delay : config.sinaads_ad_delay || 0,
                duration : config.sinaads_ad_duration || 5
            };
        if (core.FollowMedia) {
            new core.FollowMedia(FollowMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.FollowMedia(FollowMediaData);
            });
        }
    });

    /**
     * 创建常规广告的曝光请求html
     * @param  {[type]} element [description]
     * @param  {[type]} config  [description]
     * @return {[type]}         [description]
     */
    viewModule.register('embed', function (element, width, height, content, config) {
        //暂时让embed只支持一个广告
        content = content[0];

        var uid         = config.sinaads_uid,
            type        = content.type || '',
            link        = content.link || '',
            src         = content.src || '',
            pdps        = config.sinaads_ad_pdps,
            tpl         = config.sinaads_ad_tpl || '',
            adContent;

        /**
         * 自适应宽度, 针对图片和flash
         */
        if (config.sinaads_ad_fullview && (type === 'flash' || type === 'image')) {
            width = '100%';
            height = 'auto';
        } else {
            width += 'px';
            height += 'px';
        }

        element.style.cssText += ';display:block;overflow:hidden;text-decoration:none;';
        element.innerHTML = '<ins style="text-decoration:none;margin:0px auto;display:block;overflow:hidden;width:' + width + ';height:' + height + ';"></ins>';
        element = element.getElementsByTagName('ins')[0];

        adContent = src ? core.ad.createHTML(type, src, width, height, link, content.monitor, core.isFunction(tpl) ? tpl(0) : tpl) : ''; //广告内容， 如果没有src，则不渲染 

        if (tpl) {
            element.innerHTML  = adContent; //广告内容， 如果没有src，则不渲染
        } else {
            switch (type[0]) {
                case 'text' :
                case 'image' :
                case 'url' :
                case 'adbox' :
                case 'flash' :
                    element.innerHTML = adContent;
                    break;
                default :
                    //创建广告渲染的沙箱环境，并传递部分广告参数到沙箱中
                    core.sandbox.create(element, width, height, adContent, {
                        sinaads_uid             : uid,
                        sinaads_ad_pdps         : pdps,
                        sinaads_ad_width        : width,
                        sinaads_ad_height       : height
                    });
                    break;
            }
        }
    });

    viewModule.register('coupletExt', function (element, width, height, content, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/CoupletExtMedia.js';
        
        content = content[0]; //只用第一个内容
        //是对联，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        //这里认为如果couplet类型给的是素材的话，那么素材必须大于1个，否则为html类型
        if (content.src.length >= 4) {
            //注入跨栏数据
            var CoupletExtMediaData = {
                src         : content.src,
                type        : content.type,
                link        : content.link,
                width       : width,
                height      : height,
                offettop    : config.sinaads_coupletext_offettop || 100,
                expandpos   : config.sinaads_coupletext_expandpos || 700,
                smallsize   : config.sinaads_coupletext_smallsize,
                bigsize     : config.sinaads_coupletext_bigsize,
                monitor     : content.monitor || []
            };
            if (core.CoupletExtMediaData) {
                new core.CoupletExtMedia(CoupletExtMediaData);
            } else {
                core.sio.loadScript(RESOURCE_URL, function () {
                    new core.CoupletExtMedia(CoupletExtMediaData);
                });
            }
        }
    });

    /**
     * 初始化广告对象
     * @param  {object} config 配置项
     */
    function _init(conf) {
        var element = conf.element,    //广告容器
            config = conf.params || {};   //广告配置

        //从config.element中得到需要渲染的ins元素，如果没有，则获取页面上未完成状态的广告节点
        if (element) {
            if (!_isPenddingSinaad(element) && (element = element.id && _getSinaAd(element.id), !element)) {
                core.debug("sinaads:Rendering of this element has been done. Stop rendering.", element);
            }
            if (!("innerHTML" in element)) {
                core.debug("sinaads:Cannot render this element.", element);
            }
        //没有对应的ins元素, 获取一个待初始化的ins, 如果没有，抛出异常
        } else if (element = _getSinaAd(), !element) {
            core.debug("sinaads:Rendering of all elements in the queue is done.");
            return;
        }

        //置成完成状态，下面开始渲染
        element.setAttribute("data-ad-status", "done");

        //记录所在位置，留用
        var pos = core.dom.getPosition(element);
        element.setAttribute('data-ad-offset-left', pos.left);
        element.setAttribute('data-ad-offset-top', pos.top);

        //全局唯一id标识，用于后面为容器命名
        config.sinaads_uid = (window.sinaads_uid ? ++window.sinaads_uid : window.sinaads_uid = 1);

        //将data-xxx-xxxx,转换成sinaads_xxx_xxxx，并把值写入config
        //这里因为上面设置了data-ad-status属性, 所以sinaads-ad-status的状态也会被写入conf
        for (var attrs = element.attributes, len = attrs.length, i = 0; i < len; i++) {
            var attr = attrs[i];
            if (/data-/.test(attr.nodeName)) {
                var key = attr.nodeName.replace("data", "sinaads").replace(/-/g, "_");
                config.hasOwnProperty(key) || (config[key] = attr.nodeValue);
            }
        }

        //获取page_url 广告所在页面url
        config.sinaads_page_url = core.url.top;

        var frequence = config.sinaads_frequence = config.sinaads_frequence || 0, //请求频率，默认为0， 即每次刷新都请求
            pdps = config.sinaads_ad_pdps,
            disableKey = PAGE_HASH + pdps + '_disabled';

        //如果该pdps不是处于禁止请求状态，发请求，否者直接进入失败处理
        if (!core.storage.get(disableKey)) {
            modelModule.request(pdps, seed.get(frequence ? pdps : null))
                .done(function () {
                    //增加广告加载结束标志sinaads-done
                    core.dom.addClass(element, 'sinaads-done');
                    var adData = modelModule.get(config.sinaads_ad_pdps);
                    //如果有频率限制，则在成功时写入频率限制数据
                    if (frequence) {
                        core.storage.set(disableKey, 1, frequence * 1000);
                    }
                    render(element, adData, config);
                    core.isFunction(config.sinaads_success_handler) && config.sinaads_success_handler(element, adData, config);
                })
                .fail(function () {
                    core.dom.addClass(element, 'sinaads-fail');
                    /* 广告位不能为空 */
                    if (config.sinaads_cannot_empty) {
                        //@todo 渲染默认数据
                        core.debug('Use Default ad data.');
                    }
                    core.isFunction(config.sinaads_fail_handler) && config.sinaads_fail_handler(element, config);
                });
        } else {
            core.isFunction(config.sinaads_fail_handler) && config.sinaads_fail_handler();
        }
    }


    /**
     * 根据广告媒体类型渲染广告
     */
    function render(element, data, config) {
        if (!data) {
            core.debug('sinaads:' + config.sinaads_ad_pdps + ', Cannot render this element because the data is unavilable.');
            return;
        }
        var start = core.now(),
            size    = data.size.split('*'),
            width   = config.sinaads_ad_width || (config.sinaads_ad_width = Number(size[0])) || 0,
            height  = config.sinaads_ad_height || (config.sinaads_ad_height = Number(size[1])) || 0;

        core.array.each(data.content, function (content, i) {
            core.debug('sinaads:Processing the impression of the ' + (i + 1) + ' creative of ad unit ' + config.sinaads_ad_pdps);

            content.src    = core.array.ensureArray(content.src);
            content.link   = core.array.ensureArray(content.link);
            content.type   = core.array.ensureArray(content.type);
            //content.sinaads_content_index = i;  //带入该内容在广告中的序号
            
            var monitor = content.monitor,
                pv = content.pv,
                link = content.link,
                //pid = content.pid ? 'sudapid=' + content.pid : '';
                pid = ''; //暂时封闭功能

            //如果存在pid为每个link加上pid
            core.array.each(link, function (url, i) {
                var hashFlag,
                    hash = '',
                    left = url;
                if (pid && url) {
                    hashFlag = url.indexOf('#');
                    if (hashFlag !== -1) {
                        hash = url.substr(hashFlag);
                        left = url.substr(0, hashFlag);
                    }
                    link[i] = left + (left.indexOf('?') !== -1 ? '&' : '?') + pid + hash;
                }
            });

            /* 解析曝光，并注入模版值，发送曝光 */
            core.array.each(pv, function (url, i) {
                pv[i] = core.monitor.parseTpl(url, config);
                core.debug('sinaads:Recording the impression of ad unit ' + config.sinaads_ad_pdps + ' via url ' + url);
                pv[i] && core.sio.log(pv[i]);
            });
            /* 解析监控链接，注入模版， 后续使用*/
            core.array.each(monitor, function (url, i) {
                monitor[i] = core.monitor.parseTpl(url, config);
                core.debug('sinaads:Recording the click of ad unit ' + config.sinaads_ad_pdps + ' via url ' + url);
            });
        });

        /** 
         * 按照媒体类型渲染广告
         */
        viewModule.render(
            config.sinaads_ad_type || data.type,
            element,
            width,
            height,
            data.content,
            config
        );


        //如果需要高亮广告位，则在广告位外部加上高亮标记
        if (data.highlight && (config.sinaads_ad_type || data.type) === 'embed') {
            element.style.outline = '2px solid #f00';
        }

        core.debug('sinaads:Ads Rendering is complete. (time elpased:' + (core.now() - start) + 'ms)');
    }


    /**
     * 初始化方法，处理js加载成功之前压入延迟触发的广告位，
     * 并将后续广告压入方法置成内部初始化方法
     */
    function init() {
        core.debug('sinaads:Begin to scan and render all ad placeholders.' + core.now());

        /* 在脚本加载之前注入的广告数据存入在sinaads数组中，遍历数组进行初始化 */
        var preloadAds = window.sinaads;
        if (preloadAds && preloadAds.shift) {
            for (var ad, len = 50; (ad = preloadAds.shift()) && 0 < len--;) {
                _init(ad);
            }
        }
        //在脚本加载之后，sinaad重新定义，并赋予push方法为初始化方法
        window.sinaads = {push : _init};
    }


    /**
     * 查找是否有需要填充的预览数据，一次只允许预览一个广告位
     */
    (function () {
        if (window._sinaadsPreviewDone) {
            return;
        }
        window._sinaadsPreviewDone = true;

        var query = window.location.hash.substring(1).split('&'),
            preview = {},
            keys = ['pdps', 'src', 'size'], //必需有的key
            i = 0,
            key,
            q;
        while ((q = query[i++])) {
            q = q.split('=');
            if (q[0].indexOf('sinaads_preview_') === 0) {
                key = q[0].replace('sinaads_preview_', '');
                if (key && q[1] && !preview[key]) {
                    preview[key] = q[1];
                    core.array.remove(keys, key);
                }
            }
        }
        //只有满足三个参数齐全才进行预览数据填充
        if (keys.length === 0) {
            core.debug('sinaads:Ad Unit ' + preview.pdps +  ' is for preview only. ', preview);
            //构造一个符合展现格式的数据放入到初始化数据缓存中
            modelModule.add(preview.pdps, {
                content : [
                    {
                        src : preview.src.split('|'),
                        link : (preview.link || '').split('|'),
                        monitor : (preview.monitor || '').split('|'),
                        pv : (preview.pv || '').split('|'),
                        type : (preview.type || '').split('|')
                    }
                ],
                size : preview.size,
                id : preview.pdps,
                type : 'embed',
                highlight : preview.highlight || false
            });
        }
    })();



    /* 判断是否有需要预加载的数据，加载完成后执行初始化操作，否则执行初始化操作 */
    var preloadData = window.sinaadsPreloadData = window.sinaadsPreloadData || [];
    if (!preloadData.done) {
        if (preloadData instanceof Array && preloadData.length > 0) {
            core.debug('sinaads:Data preload of bulk requests. ' + preloadData.join(','));
            //预加载不允许加载频率不为0的请求，比如视窗，这个需要人工控制
            modelModule.request(preloadData, seed.get()).done(init).fail(init);
        } else {
            init();
        }
    }
    window.sinaadsPreloadData.done = 1; //处理完成

})(window, window.sinaadToolkit);
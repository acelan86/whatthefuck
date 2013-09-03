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
  *     window.sinaadsPerloadData = [pdps1, pdps2, pdps3, ..., pdpsn]; 批量加载的代码
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
  */
 (function (window, core, undefined) {
    "use strict";

    /**
     * 计数种子，每次加载获取cookie或者storage中的这个值，如果没有，随机生成1个值
     */
    if (!core.seed) {
        var _pathname = window.location.pathname,
            _host = window.location.host,
            KEY = _host.split('.')[0] + _pathname.substring(0, _pathname.lastIndexOf('/'));

        core.debug('sinaads: 当前页面种子key为:' + KEY);

        KEY = 'sinaads_' + core.hash(KEY);

        core.seed = parseInt(core.storage.get(KEY), 10) || core.rand(0, 100);
        //大于1000就从0开始，防止整数过大
        core.storage.set(KEY, core.seed > 1000 ? 0 : ++core.seed, 30 * 24 * 60 * 60 * 1000); //默认一个月过期
    }

    //var IMPRESS_URL = 'http://123.126.53.109/impress.php';
    //var IMPRESS_URL =  'http://123.126.53.109:8527/impress.php';
    var IMPRESS_URL = 'http://sax.sina.com.cn/impress.php';

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
            if (_isPenddingSinaad(ins) && (!id || ins.id === id)) {
                return ins;
            }
        }
        return null;
    }


    /**
     * 获取定向关键词, 全局只获取一次
     */
    var targeting = window._sinaadsTargeting = window._sinaadsTargeting || (function () {
        var metaNodes = document.getElementsByTagName('head')[0].getElementsByTagName('meta'),
            targeting = {},
            metas = [],
            entry,
            i = 0,
            len = metaNodes.length;
        //metas = Array.prototype.slice.call(metaNodes)在ie下报错’缺少 JScript 对象‘
        for (; i < len; i++) {
            metas.push(metaNodes[i]);
        }
        core.array.each(metas, function (meta) {
            if (meta.name.indexOf('sinaads_') === 0) {
                targeting[meta.name.split('_')[1]] = meta.content;
            }
        });
        if ((entry = core.cookie.get('sinaads_entry') || core.storage.get('sinaads_entry'))) {
            targeting.entry = entry;
            core.cookie.remove('sinaads_entry');
            core.storage.remove('sinaads_entry');
        }

        core.debug('sinaads: 取得定向信息', targeting);

        return targeting;
    })();


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
                core.debug('sinaads: 老数据格式，需要进行数据适配(pdps)', ad.id);
                ad.content = ad.value;
                delete ad.value;
            }

            core.array.each(ad.content, function (content, i) {
                var manageType = content.manageType,
                    type,
                    link;

                content = content.content;
                type = core.array.ensureArray(content.type);
                link = core.array.ensureArray(content.link);

                if (engineType === 'network') {
                    content = {
                        src : [networkMap['' + manageType] + content + '&w=' + size[0] + '&h=' + size[1]],
                        type : ['url']
                    };
                }
                if (ad.engineType === 'dsp' && parseInt(manageType, 10) !== 17) {
                    content = {
                        src : [content],
                        type : ['html']
                    };
                }

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
                    'lmt' : 'stream',
                    'kl' : 'couplet',
                    'sc' : 'videoWindow',
                    'hzh' : 'embed',
                    'tl' : 'embed',
                    'jx' : 'embed',
                    'dtl' : 'embed',
                    'an' : 'embed',
                    'dan' : 'embed',
                    'xan' : 'embed',
                    'wzl' : 'textlink',
                    'ztwzl' : 'zhitoutextlink',
                    'qp' : 'fullscreen',
                    'fp' : 'turning',
                    'dl' : 'float',
                    'tip' : 'tip',
                    'bt' : 'bp',
                    'sx' : 'follow'
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
            request : function (pdps) {
                var start = core.now(),
                    deferred = new core.Deferred(),
                    params = [],
                    isLoaded = false,
                    _pdps = [];


                //判断pdps相关数据是否存在，如果存在，直接返回，否则，请求后渲染
                core.array.each(pdps, function (str) {
                    isLoaded = !!_cache[str];
                    if (isLoaded) {
                        core.debug('sinaads: 当前pdps数据已加载，直接渲染（pdps, 数据）', str, _cache[str]);
                    } else {
                        _pdps.push(str);
                    }
                });

                if (isLoaded) {
                    deferred.resolve();
                } else {
                    core.debug('sinaads: 当前pdps数据未加载，立即加载数据（pdps, 全局缓存数据）' + _pdps.join(), _cache);
                    params = [
                        'adunitid=' + _pdps.join(','),                   //pdps数组
                        'rotate_count=' + core.seed,                    //轮播数
                        'TIMESTAMP=' + core.now().toString(36),         //时间戳
                        'referral=' + encodeURIComponent(core.url.top)  //当前页面url
                    ];


                    for (var key in targeting) {
                        params.push('tg' + key + '=' + encodeURIComponent(targeting[key]));
                    }

                    core.sio.jsonp(IMPRESS_URL + '?' + params.join('&'), function (data) {
                        if (data === 'nodata') {
                            core.debug('sinaads: ' + _pdps.join() + '-该广告位没有获取到可用的数据');
                            deferred.reject();
                        } else {
                            core.debug('sinaads: 获取数据完成（参数，时间，耗时ms，结果数据）', params, core.now(), core.now() - start, data);
                            //缓存数据到list中
                            core.array.each(data.ad, function (ad) {
                                ad = _adapter ? _adapter(ad) : ad;
                                if (ad.content instanceof Array && ad.content.length > 0) {
                                    _cache[ad.id] = ad;
                                }
                            });
                            /**
                             * cookie mapping
                             * 每次请求如果有mapping需要对应就发送请求
                             * @type {Number}
                             */
                            core.array.each(data.mapUrl, function (url) {
                                core.debug('sinaads: 取得数据，且需要mapping, 发送cookie mapping（url，参数，时间）' + url, params, core.now());
                                url && core.sio.log(url, 1);
                            });
                        }
                        deferred.resolve();
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

        function _render(type, element, width, height, content, monitor, config) {
            var handler = handlerMap[type],
                _type = type;
            if ('function' === typeof handler) {
                _type = handler(element, width, height, content, monitor, config) || type;
            }
            //上面的处理将媒体类型改变，按照新类型再执行一边render方法
            if (_type !== type) {
                _render(_type, element, width, height, content, monitor, config);
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
    viewModule.register('couplet', function (element, width, height, content, monitor, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/CoupletMedia.js';
        //是跨栏，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        //这里认为如果couplet类型给的是素材的话，那么素材必须大于1个，否则为html类型
        if (content.src.length === 1) {
            switch (content.type[0]) {
                case 'js' :
                    core.sio.loadScript(content.src[0]);
                    break;
                case 'html' :
                    return 'embed'; //某dsp插入一轮，比如乐居
            }
        }
        if (content.src.length > 1) {
            //注入跨栏数据
            var CoupletMediaData = {
                src         : content.src,
                type        : content.type,
                link        : content.link,
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

    viewModule.register('videoWindow', function (element, width, height, content, monitor, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/VideoWindowMedia.js';
        element.style.cssText = 'position:absolute;top:-9999px';
        if (content.type[0] !== 'js') {
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
        } else {
            core.sio.loadScript(content.src[0]);
        }
    });

    viewModule.register('stream', function (element, width, height, content, monitor, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/StreamMedia.js';
        //流媒体，隐藏掉该区块
        element.style.cssText = 'position:absolute;top:-9999px';
        if (content.src.length === 1 && content.type[0] === 'js') {
            //富媒体供应商提供的js
            //生成一个用于渲染容器到页面中
            var streamContainer = document.createElement('div');
            streamContainer.id = 'SteamMediaWrap';
            document.body.insertBefore(streamContainer, document.body.firstChild);
                
            core.sio.loadScript(content.src[0]);
        }
        //这里认为如果给的是素材的话，那么素材必须大于1个，否则为js类型
        if (content.src.length > 1) {
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


    viewModule.register('fullscreen', function (element, width, height, content, monitor, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/FullscreenMedia.js';
        element.style.cssText = 'position:absolute;top:-9999px';
        if (content.src.length === 1 && content.type[0] === 'js') {
            //富媒体供应商提供的js
            core.sio.loadScript(content.src[0]);
        } else {
            //是全屏广告，隐藏掉改区块
            var FullScreenMediaData = {
                type        : content.type[0] || '',
                src         : content.src[0] || '',
                link        : content.link[0] || '',
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
        }
    });

    viewModule.register('bp', function (element, width, height, content) {
        //是背投广告，隐藏掉改区块
        element.style.cssText = 'position:absolute;top:-9999px';
        //这里规定背投的素材不能是js或者代码片段，而且只能有1个
        window.open('http://d1.sina.com.cn/d1images/pb/pbv4.html?' + content.link[0] + '${}' + content.type[0] + '${}' + content.src[0]);
        content.src = [];
    });

    viewModule.register('float', function (element, width, height, content, monitor, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/FloatMedia.js';
        element.style.cssText = 'position:absolute;top:-99999px';
        var FloatMediaData = {
            type : content.type,
            src : content.src,
            top : config.sinaads_float_top || 0,
            monitor : monitor,
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

    viewModule.register('turning', function (element, width, height, content, monitor, config) {
        content.src = [
            core.swf.createHTML({
                id : 'TurningMedia' + config.sinaads_uid,
                url : 'http://d3.sina.com.cn/d1images/fanpai/picshow.swf',
                width : width,
                height : height,
                vars : {
                    ad_num : content.src.length,
                    pics : content.src.join('§'),
                    urls : content.link.join('§'),
                    pic_width : width - 5,
                    pic_height : height - 5,
                    flip_time : config.sinaads_turning_flip_duration * 1000 || 300,
                    pause_time : config.sinaads_turning_flip_delay * 1000 || 4000,
                    wait_time : config.sinaads_turning_wait * 1000 || 1000
                }
            })
        ];
        content.type = ['html'];
        return 'embed'; //使用embed来解析
    });

    viewModule.register('textlink', function (element, width, height, content, monitor, config) {
        var fragmentNode = document.createElement('span');
        fragmentNode.innerHTML = core.ad.createHTML('text', content.src[0], 0, 0, content.link[0], monitor, config.sinaads_ad_tpl || '');
        element.style.cssText += ';text-decoration:none';
        element.appendChild(fragmentNode);
        //element.innerHTML = core.ad.createHTML('text', content.src[0], 0, 0, content.link[0], monitor, config.sinaads_ad_tpl || '');
    });

    viewModule.register('zhitoutextlink', viewModule.handlerMap.textlink);


    viewModule.register('tip', function (element, width, height, content, monitor, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/TipsMedia.js';
        var TipsMediaData = {
                width : width,
                height : height,
                src : content.src,
                type : content.type,
                link : content.link,
                monitor : monitor,
                autoShow : 1,
                top : config.sinaads_tip_top || 0,
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
    viewModule.register('follow', function (element, width, height, content, monitor, config) {
        var RESOURCE_URL = core.PLUS_RESOURCE_URL || core.RESOURCE_URL + '/src/plus/FollowMedia.js';
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
                monitor : monitor,
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
    viewModule.register('embed', function (element, width, height, content, monitor, config) {
        var uid         = config.sinaads_uid,
            iframeId    = 'sinaads_iframe_' + uid,
            type        = content.type[0] || '',
            link        = content.link[0] || '',
            src         = content.src[0] || '',
            pdps        = config.sinaads_ad_pdps,
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

        element.style.cssText += ';display:block;overflow:hidden;';
        element.innerHTML = '<ins style="margin:0px auto;display:block;overflow:hidden;width:' + width + ';height:' + height + ';"></ins>';
        element = element.getElementsByTagName('ins')[0];

        adContent = src ? core.ad.createHTML(type, src, width, height, link, monitor) : ''; //广告内容， 如果没有src，则不渲染

        switch (type) {
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
                    sinaads_async_iframe_id : iframeId,
                    sinaads_ad_pdps         : pdps,
                    sinaads_ad_width        : width,
                    sinaads_ad_height       : height
                });
                break;
        }
    });



    /**
     * 初始化广告对象
     * @param  {object} config 配置项
     */
    function _init(config) {
        var element = config.element;      //广告容器

        config = config.params || {};   //广告配置

        //从config.element中得到需要渲染的ins元素，如果没有，则获取页面上未完成状态的广告节点
        if (element) {
            if (!_isPenddingSinaad(element) && (element = element.id && _getSinaAd(element.id), !element)) {
                core.debug("sinaads: 该元素已经被渲染完成，无需渲染", element);
            }
            if (!("innerHTML" in element)) {
                core.debug("sinaads: 无法渲染该元素", element);
            }
        //没有对应的ins元素, 获取一个待初始化的ins, 如果没有，抛出异常
        } else if (element = _getSinaAd(), !element) {
            core.debug("sinaads: 所有待渲染的元素都已经被渲染完成");
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


        modelModule.request(config.sinaads_ad_pdps).done(function () {
            render(element, modelModule.get(config.sinaads_ad_pdps), config);
            core.isFunction(config.sinaads_success_handler) && config.sinaads_success_handler();
        }).fail(function () {
            core.isFunction(config.sinaads_fail_handler) && config.sinaads_fail_handler();
        });
    }


    /**
     * 根据广告媒体类型渲染广告
     */
    function render(element, data, config) {
        if (!data) {
            core.debug('sinaads: ' + config.sinaads_ad_pdps + '数据没有获取到, 无法渲染');
            return;
        }
        var start = core.now();

        var size    = data.size.split('*'),
            width   = config.sinaads_ad_width || (config.sinaads_ad_width = Number(size[0])) || 0,
            height  = config.sinaads_ad_height || (config.sinaads_ad_height = Number(size[1])) || 0;

        core.array.each(data.content, function (content, i) {
            core.debug('sinaads: 处理' + config.sinaads_ad_pdps + '第' + (i + 1) + '个内容的广告展现');

            content.src    = core.array.ensureArray(content.src);
            content.link   = core.array.ensureArray(content.link);
            content.type   = core.array.ensureArray(content.type);
            
            var monitor = content.monitor,
                pv = content.pv;

            /* 解析曝光，并注入模版值，发送曝光 */
            core.array.each(pv, function (url, i) {
                pv[i] = core.monitor.parseTpl(url, config);
                core.debug('sinaads: ' + config.sinaads_ad_pdps + '发送曝光' + url);
                pv[i] && core.sio.log(pv[i]);
            });
            /* 解析监控链接，注入模版， 后续使用*/
            core.array.each(monitor, function (url, i) {
                monitor[i] = core.monitor.parseTpl(url, config);
                core.debug('sinaads: ' + config.sinaads_ad_pdps + '处理监测链接' + url);
            });

            /** 
             * 按照媒体类型渲染广告
             */
            viewModule.render(
                config.sinaads_ad_type || data.type,
                element,
                width,
                height,
                content,
                monitor,
                config
            );
        });

        core.debug('sinaads: 渲染广告完毕(耗时ms)', core.now() - start);
    }


    /**
     * 初始化方法，处理js加载成功之前压入延迟触发的广告位，
     * 并将后续广告压入方法置成内部初始化方法
     */
    function init() {
        core.debug('sinaads: 进入扫描渲染广告流程' + core.now());
        /* 在脚本加载之前注入的广告数据存入在sinaads数组中，遍历数组进行初始化 */
        var perloadAds = window.sinaads;
        if (perloadAds && perloadAds.shift) {
            for (var ad, len = 50; (ad = perloadAds.shift()) && 0 < len--;) {
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

        var query = window.location.search.substring(1).split('&'),
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
        //只有满足四个参数齐全才进行预览数据填充
        if (keys.length === 0) {
            core.debug('sinaads: 广告位' + preview.pdps + '为预览广告位（预览数据）', preview);
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
                type : 'embed'
            });
        }
    })();



    /* 判断是否有需要预加载的数据，加载完成后执行初始化操作，否则执行初始化操作 */
    var perloadData = window.sinaadsPerloadData = window.sinaadsPerloadData || [];
    if (!perloadData.done) {
        if (perloadData instanceof Array && perloadData.length > 0) {
            core.debug('sinaads: 预加载批量请求数据（预加载pdps列表）' + perloadData.join(','));
            modelModule.request(perloadData).done(init).fail(init);
        } else {
            init();
        }
    }
    window.sinaadsPerloadData.done = 1; //处理完成

})(window, window.sinaadToolkit);
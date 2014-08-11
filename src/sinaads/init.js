/**
 * 初始化方法
 * @return {[type]} [description]
 */
var _init = (function (core, model, view, controller) {
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
    //2.data-ad-status === "async"
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
     * 根据广告媒体类型渲染广告
     */
    function render(element, data, config) {
        if (!data) {
            core.debug('sinaads:' + config.sinaads_ad_pdps + ', Cannot render this element because the data is unavilable.');
            return;
        }
        var mediaType = config.sinaads_ad_type || data.type,
            start = core.now(),
            size    = data.size.split('*'),
            width   = config.sinaads_ad_width || (config.sinaads_ad_width = Number(size[0])) || 0,
            height  = config.sinaads_ad_height || (config.sinaads_ad_height = Number(size[1])) || 0,
            _exParams = model.getExParamsQueryString(); //获取额外参数

        core.array.each(data.content, function (content, i) {
            core.debug('sinaads:Processing the impression of the ' + (i + 1) + ' creative of ad unit ' + config.sinaads_ad_pdps);

            content.src    = core.array.ensureArray(content.src);
            content.link   = core.array.ensureArray(content.link);
            content.type   = core.array.ensureArray(content.type);
            //content.sinaads_content_index = i;  //带入该内容在广告中的序号
            
            var monitor = [],
                pv = content.pv,
                link = content.link;
                //pid = content.pid ? 'sudapid=' + content.pid : '';
                //pid = ''; //暂时封闭功能

            /* 解析曝光，并注入模版值，发送曝光 
               曝光还是需要使用iframe进行处理，因为有些曝光是通过地址引入一段脚本实现，如果用img log的话没法执行脚本，会丢失曝光
               比如allyes，在曝光连接会返回document.write('<img src="impress.log"/>')
               这里需要修改方案
            */
            core.array.each(pv, function (url, i) {
                //增加额外参数
                if (_exParams && url && (url.indexOf('sax.sina.com.cn\/view') !== -1 || url.indexOf('sax.sina.com.cn\/dsp\/view') !== -1)) {
                    url += (url.indexOf('?') !== -1 ? '&' : '?') + _exParams;
                }

                pv[i] = core.monitor.parseTpl(url, config);
                core.debug('sinaads:Recording the impression of ad unit ' + config.sinaads_ad_pdps + ' via url ' + url);
                //修改下这里的曝光监测的log, 不需要使用随机参数发送，而是在曝光值替换的时候将{__timestamp__} 替换成当前值，因为可能有些第三方监测会直接把url
                //后面的内容当作跳转连接传递，造成allyes.com/url=http://d00.sina.com.cn/a.gif&_sio_kdflkf请求跳转后为http://d00.sina.com.cn/a.gif&_sio_kdflkf，这个连接是个404的请求
                //如果是背投，先不发送曝光
                //如果不加随机数，会造成曝光缓存
                //('bp' !== mediaType) && pv[i] && core.sio.log(pv[i]);
                pv[i] && core.sio.log(pv[i]);
            });
            /**
             * 解析监控链接，注入模版， 后续使用
             * 增加过滤出saxclick和saxdspclick链接，并按照逆序方式压入，先saxclick后saxdspclick
             * 由于后续拼接需要逆序进行包裹，所以这里实际需要dspclick在前面则需要dspclick后压入
             */
            // core.array.each(monitor, function (url, i) {
            //     //为sax monitor兼容一定是二跳的方案
            //     if (url && (url.indexOf('sax.sina.com.cn\/click') !== -1 || url.indexOf('sax.sina.com.cn\/dsp\/click') !== -1)) {
            //         url = url.replace(/&url=$/, '') + '&url=';
            //     }
            //     monitor[i] = core.monitor.parseTpl(url, config);
            //     core.debug('sinaads:Processing the click of ad unit ' + config.sinaads_ad_pdps + ' via url ' + url);
            // });
            // 
            var _dspMonitorURL,
                _mfpMonitorURL,
                _saxMonitorURL;

            core.array.each(content.monitor, function (url) {
                //为sax monitor兼容一定是二跳的方案
                if (url && url.indexOf('sax.sina.com.cn\/click') !== -1) {
                    url = url.replace(/&url=$/, '') +
                        (_exParams ? '&' + _exParams : '') + //增加额外参数
                        '&url=';                             //加上&url=

                    _saxMonitorURL = core.monitor.parseTpl(url, config);
                } else if (url && url.indexOf('sax.sina.com.cn\/dsp\/click') !== -1) {
                    url = url.replace(/&url=$/, '') +
                        (_exParams ? '&' + _exParams : '') + //增加额外参数
                        '&url=';                             //加上&url=

                    _dspMonitorURL = core.monitor.parseTpl(url, config);
                } else if (url && url.indexOf('sax.sina.com.cn\/mfp\/click') !== -1) {
                    url = url.replace(/&url=$/, '') +
                        (_exParams ? '&' + _exParams : '') + //增加额外参数
                        '&url=';                             //加上&url=

                    _mfpMonitorURL = core.monitor.parseTpl(url, config);
                } else {
                    url = core.monitor.parseTpl(url, config);
                    url && monitor.push(url);
                }
                core.debug('sinaads:Processing the click of ad unit ' + config.sinaads_ad_pdps + ' via url ' + url);
            });

            _saxMonitorURL && monitor.push(_saxMonitorURL);
            _mfpMonitorURL && monitor.push(_mfpMonitorURL);
            _dspMonitorURL && monitor.push(_dspMonitorURL);


            //如果存在pid为每个link加上pid
            core.array.each(link, function (url, i) {
                //link增加monitor处理
                link[i] = core.monitor.createTrackingMonitor(url, monitor);
                // var hashFlag,
                //     hash = '',
                //     left = url;
                // if (pid && url) {
                //     hashFlag = url.indexOf('#');
                //     if (hashFlag !== -1) {
                //         hash = url.substr(hashFlag);
                //         left = url.substr(0, hashFlag);
                //     }
                //     link[i] = left + (left.indexOf('?') !== -1 ? '&' : '?') + pid + hash;
                // }
            });

            content.monitor = monitor;
        });

        /** 
         * 按照媒体类型渲染广告
         */
        view.render(
            mediaType,
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

        core.debug('sinaads:Ads Rendering is complete. (pdps:' + config.sinaads_ad_pdps + ', time elpased:' + (core.now() - start) + 'ms)');
    }


    /**
     * 广告请求成功，有广告的情况下处理
     * @param  {[type]} element [description]
     * @param  {[type]} config  [description]
     * @return {[type]}         [description]
     */
    function _done(element, config) {
        var pdps = config.sinaads_ad_pdps;

        //向展现顺序控制器中注册执行方法
        controller.orderController.ready(pdps, function (element, pdps, frequence, disableKey, data, config) {
            //增加广告加载结束标志sinaads-done
            core.dom.addClass(element, 'sinaads-done');

            //如果有频率限制，则在成功时写入频率限制数据
            controller.frequenceController.disable(pdps);

            render(element, data, config);
            core.isFunction(config.sinaads_success_handler) && config.sinaads_success_handler(element, data, config);
        }, [
            element,
            pdps,
            config.sinaads_frequence || 0,
            PAGE_HASH + pdps + '_disabled',
            model.get(pdps),
            config
        ]);
    }

    function _fail(element, config) {
        var pdps = config.sinaads_ad_pdps;
        controller.orderController.ready(pdps, function (element, config) {
            controller.orderController.done(config.sinaads_ad_pdps);
            core.dom.addClass(element, 'sinaads-fail');
            /* 广告位不能为空 */
            if (config.sinaads_cannot_empty) {
                //@todo 渲染默认数据
                core.debug('Use Default ad data.');
            }
            core.isFunction(config.sinaads_fail_handler) && config.sinaads_fail_handler(element, config);
        },
        [
            element,
            config
        ]);
    }

    function _getRequestDoneHandler(element, config) {
        return function () {
            var delay = config.sinaads_ad_delay;
            //处理延时
            if (delay && (delay = parseInt(delay, 10))) {
                setTimeout(function () {
                    _done(element, config);
                }, delay * 1000);
            } else {
                _done(element, config);
            }
        };
    }
    function _getRequestFailHandler(element, config) {
        return function () {
            _fail(element, config);
        };
    }

    return function (conf) {
        var element = conf.element,    //广告容器
            config = conf.params || {};   //广告配置

        //从config.element中得到需要渲染的ins元素，如果没有，则获取页面上未完成状态的广告节点
        if (element) {
            if (!_isPenddingSinaad(element) && (element = element.id && _getSinaAd(element.id), !element)) {
                core.debug("sinaads:Rendering of this element has been done. Stop rendering.", element);
                return;
            }
            if (!("innerHTML" in element)) {
                core.debug("sinaads:Cannot render this element.", element);
                return;
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
        config.sinaads_uid = UUID++;

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

        var pdps = config.sinaads_ad_pdps;

        //保存pdps的坐标到全局
        try {
            window._sinaadsADPosition = window._sinaadsADPosition || {};
            window._sinaadsADPosition[pdps] = [pos.left, pos.top];
        } catch (e) {}

        /* 处理本地轮播数据2014-04-29 acelan*/
        var localData = config.sinaads_ad_data,
            rotateCount = 0;
        if (localData) {
            //如果localData不是数组，把内容作为数组元素
            localData = core.array.ensureArray(localData);
            rotateCount = localData.length <= 1 ? 0 : (model.getSeed(pdps) % localData.length);
            model.add(pdps, localData[rotateCount]);
            core.debug('sinaads: Use local data in count ' + rotateCount);
        }


        //注册一个频率控制器
        controller.frequenceController.register(pdps, config.sinaads_frequence || 0);

        //如果该pdps不是处于禁止请求状态，发请求，否者直接进入失败处理
        if (!controller.frequenceController.isDisabled(pdps)) {
            model.request(pdps)
                .done(_getRequestDoneHandler(element, config))
                .fail(_getRequestFailHandler(element, config));
        } else {
            _fail(element, config);
        }
    };
})(core, modelModule, viewModule, controllerModule);


/**
 * 初始化数据模型，并在初始化完成后处理js加载成功之前压入延迟触发的广告位，
 * 并将后续广告压入方法置成内部初始化方法
 */
modelModule.init(function () {
    core.debug('sinaads:Begin to scan and render all ad placeholders.' + core.now());
    /* 在脚本加载之前注入的广告数据存入在sinaads数组中，遍历数组进行初始化 */
    var preloadAds = window.sinaads;
    if (preloadAds && preloadAds.shift) {
        for (var ad, len = 100; (ad = preloadAds.shift()) && 0 < len--;) {
            _init(ad);
        }
    }
    //在脚本加载之后，sinaad重新定义，并赋予push方法为初始化方法
    window.sinaads = {push : _init};
});
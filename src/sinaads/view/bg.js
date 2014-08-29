(function (core, view) {
    view.register('bg', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering bp.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/BgMedia.js';
        content = content[0];

        window.sinaadsROC.bg = config.sinaads_ad_pdps;
        window.sinaadsBgClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsBgViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        var bgMediaData = {
            pdps : config.sinaads_ad_pdps,
            src : content.src,
            type : content.type,
            link : content.link,
            width : width || 1600,
            height : height || config.sinaads_bg_height,
            midWidth : config.sinaads_bg_midWidth || 1000,
            headHeight : config.sinaads_bg_headHeight || 30,
            top : 'undefined' !== typeof config.sinaads_bg_top ? config.sinaads_bg_top : 46,
            asideClickable: config.sinaads_bg_asideClick,
            monitor : content.origin_monitor || [],
            pv : content.pv || []
        };
        if (core.BgMedia) {
            new core.BgMedia(bgMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.BgMedia(bgMediaData);
            });
        }
    });

})(core, viewModule);
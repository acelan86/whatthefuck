(function (core, view) {
    view.register('bg', function (element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/BgMedia.js';
        content = content[0];
        var bgMediaData = {
            pdps : config.sinaads_ad_pdps,
            src : content.src[0] || '',
            type : content.type || '',
            link : content.link[0] || '',
            width : width || 1600,
            height : height || config.sinaads_bg_height,
            midWidth : config.sinaads_bg_midWidth || 1000,
            headHeight : config.sinaads_bg_headHeight || 30,
            top : config.sinaads_bg_top || 120,
            asideClickable: config.sinaads_bg_asideClick || true,
            monitor : content.monitor || []
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
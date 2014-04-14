(function (core, view) {
    var fmManager = window.sinaadsFloatMediaManager || {};
    view.register('float', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering float.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/FloatMedia.js';

        window.sinaadsROC['float'] = config.sinaads_ad_pdps;

        content = content[0];
        element.style.cssText = 'position:absolute;top:-99999px';
        if (content.src.length === 1 && 'js' === content.type[0]) {
            core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
            window.sinaadsROC.done(window.sinaadsROC['float']);
        } else {
            var FloatMediaData = {
                type : content.type,
                src : content.src,
                top : config.sinaads_float_top || 0,
                monitor : content.monitor,
                link : content.link,
                sideWidth : width,
                sideHeight : height,
                pdps : config.sinaads_ad_pdps,
                contentWidth : config.sinaads_ad_contentWidth //当小于这个值时候对联两边隐藏
            };
            if (core.FloatMedia) {
                fmManager[config.sinaads_ad_pdps] = new core.FloatMedia(FloatMediaData);
            } else {
                core.sio.loadScript(RESOURCE_URL, function () {
                    fmManager[config.sinaads_ad_pdps] = new core.FloatMedia(FloatMediaData);
                });
            }
        }
    });
    window.sinaadsFloatMediaManager = fmManager;
})(core, viewModule);
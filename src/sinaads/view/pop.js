(function (core, view) {
    view.register('pop', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering pop.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/PopMedia.js';
        content = content[0];


        window.sinaadsPopClickTAG = core.monitor.stringify(core.array.ensureArray(content.origin_monitor));
        window.sinaadsPopViewTAG = core.monitor.stringify(core.array.ensureArray(content.pv));

        switch (content.type[0]) {
            case 'js' :
                core.sio.loadScript(content.src[0], null, {charset: 'gb2312'});
                break;
            default :
                var popMediaData = {
                    pdps : config.sinaads_ad_pdps,
                    src : content.src,
                    type : content.type,
                    link : content.link,
                    width : width || 300,
                    height : height || 250,
                    position : config.sinaads_pop_position || 'center center',
                    monitor : content.origin_monitor || [],
                    pv : content.pv || []
                };

                if (core.PopMedia) {
                    new core.PopMedia(element, popMediaData);
                } else {
                    core.sio.loadScript(RESOURCE_URL, function () {
                        new core.PopMedia(element, popMediaData);
                    });
                }
                break;
        }
    });
})(core, viewModule);
(function (core, view) {
    view.register('pop', function (element, width, height, content, config) {
        core.debug('sinaads:Rendering pop.');
        var RESOURCE_URL = PLUS_RESOURCE_URL || './src/plus/PopMedia.js';
        content = content[0];

        var popMediaData = {
            pdps : config.sinaads_ad_pdps,
            src : content.src,
            type : content.type,
            link : content.link,
            width : width || 300,
            height : height || 250,
            position : config.sinaads_pop_position || 'center center',
            monitor : content.monitor || []
        };

        if (core.PopMedia) {
            new core.PopMedia(element, popMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function () {
                new core.PopMedia(element, popMediaData);
            });
        }
    });
})(core, viewModule);
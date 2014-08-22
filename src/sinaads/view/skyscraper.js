//加点注释看看能不能变,,反正就是变了，再试一试，呵呵呵。。。
(function(core, view) {
    view.register('skyscraper', function(element, width, height, content, config) {
        var RESOURCE_URL = PLUS_RESOURCE_URL||'./src/plus/SkyscraperMedia.js';

        content = content[0];
        var skyscraperMediaData = {
            main: {
                width: width,
                height: height,
                src: content.src[0] || '',
                type: content.type[0] || '',
                link: content.link[0] || ''

            },
            mini: {
                src: content.src[1] || '',
                type: content.type[1] || '',
                link: content.link[1] || content.link[0] || '',
                width: config.sinaads_mini_width || width //此处的mini width，如果页面没有传入配置的参数，就使用和大素材一致的宽度
            },
            monitor: content.monitor,
            duration: config.sinaads_ad_duration || 5,
            midWidth: config.sinaads_ss_mdWidth || 950,
            top: config.sinaads_ss_top || 0,
            left: config.sinaads_ss_left || 0,
            pdps:config.sinaads_ad_pdps
        };
        if (core.SkyScraperMedia) {
            new core.SkyScraperMedia(skyscraperMediaData);
        } else {
            core.sio.loadScript(RESOURCE_URL, function() {
                new core.SkyScraperMedia(skyscraperMediaData);
            });
        }
    });
})(core, viewModule);
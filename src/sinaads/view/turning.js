(function (core, view) {
    view.register('turning', function (element, width, height, content, config) {
        var src = [],
            link = [],
            monitor = [],
            len = content.length;

        core.array.each(content, function (content) {
            content.src && content.src[0] && (src.push(content.src[0]));
            content.link && content.link[0] && (link.push(content.link[0]));
        });
        content = [
            {
                src : [
                    core.swf.createHTML({
                        id : 'TurningMedia' + config.sinaads_uid,
                        url : 'http://d3.sina.com.cn/litong/zhitou/sinaads/release/picshow_new.swf',
                        width : width,
                        height : height,
                        wmode : 'transparent',
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
})(core, viewModule);
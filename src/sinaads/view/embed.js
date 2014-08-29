(function (core, view) {
    /**
     * 创建常规广告的曝光请求html
     * @param  {[type]} element [description]
     * @param  {[type]} config  [description]
     * @return {[type]}         [description]
     */
    view.register('embed', function (element, width, height, content, config) {
        //暂时让embed只支持一个广告
        content = core.array.ensureArray(content);
        content = content[0];

        var uid         = config.sinaads_uid,
            type        = content.type || '',
            link        = content.link || '',
            src         = content.src || '',
            pdps        = config.sinaads_ad_pdps,
            tpl         = config.sinaads_ad_tpl || '',
            adContent;

        //如果是ios设备且类型为flash 退出，不渲染广告，但这里有曝光已经发送
        // if (core.browser.iphone && core.browser.ipad && 'flash' === type) {
        //     //保证嵌入式广告的顺序也可以被控制
        //     try {
        //         window.sinaadsROC.done(pdps);
        //     } catch (e) {}
        //     return;
        // }
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

        adContent = src ? core.ad.createHTML(type, src, width, height, link, content.origin_monitor, content.pv, core.isFunction(tpl) ? tpl(0, type, src, width, height, link, content.origin_monitor) : tpl) : ''; //广告内容， 如果没有src，则不渲染 

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
        //保证嵌入式广告的顺序也可以被控制
        try {
            window.sinaadsROC.done(pdps);
        } catch (e) {}
    });
})(core, viewModule);

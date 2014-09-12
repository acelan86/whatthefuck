(function (core, view) {
    function _textLink(element, width, height, content, config) {
        var tpl = config.sinaads_ad_tpl || '',
            html = [];
        core.array.each(content, function (content, i) {
            html.push(core.ad.createHTML(content.type, content.src, 0, 0, content.link, content.origin_monitor, content.pv, core.isFunction(tpl) ? tpl(i, content) : tpl));
        });
        element.style.cssText += ';text-decoration:none';
        element.innerHTML = html.join('');
    }

    view.register('textlink', _textLink);
    view.register('zhitoutextlink', _textLink);
})(core, viewModule);
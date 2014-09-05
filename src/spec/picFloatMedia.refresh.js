(function (window, undefined) {
    "use strict";
    
    function requestFloatMedia() {
        var pdps = 'PDPS000000049177';

        var inss = document.getElementsByTagName('ins'),
            len = inss.length,
            element;
        for (var i = 0; i < len; i++) {
            if (inss[i].getAttribute('data-ad-pdps') === pdps) {
                element = inss[i];
            }
        }
        element.removeAttribute('data-ad-status');
        delete window._sinaadsCacheData[pdps];
        window.removeSeed(pdps);
        window.refreshEnterTime();
        window.sinaads.push({
            element : element,
            params : {
                sinaads_frequence : 30
            }
        });
    }
    window.requestFloatMedia = requestFloatMedia;

})(window);
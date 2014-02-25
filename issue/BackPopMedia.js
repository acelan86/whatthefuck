(function (window, sinaadToolkit, undefined) {
    "use strict";

    var _init = function () {
        var debug = (location.hostname.indexOf('.taobao.com') == -1);
        if (sinaadToolkit.cookie.get('_tb_defaultbackpop_') == 1 && !debug)
            return;    

        var nowDate = new Date();
        var nowTime =nowDate.getHours()*3600 + nowDate.getMinutes()*60 + nowDate.getSeconds();
        var DAY = 24*3600;
        var leaveTime = DAY - nowTime;
        sinaadToolkit.cookie.set('_tb_defaultbackpop_', 1, leaveTime/DAY, document.domain, '/');    

        var popuped = false;
        var popAd = function _popAd() {
            if (popuped) return;
            popuped = true;
            var purl='http://www.taobao.com/promotion/defaultbackpop.html';
            var w=760;
            var h=480;
            var adPopup = window.open('about:blank', '_blank','width='+w+',height='+h+', ...');
            adPopup.blur();
            adPopup.opener.focus();
            adPopup.location = purl;
            sinaadToolkit.event.un(document.body, 'click', _popAd);
            return adPopup;
        }
        try {
            popAd();
        } catch (e) {
            alert('aaaa');
            popuped = false;
            sinaadToolkit.event.on(document.body, 'click', popAd);
        }
    }
    _init();
})(window, window.sinaadToolkit);
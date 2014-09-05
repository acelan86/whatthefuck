(function() {
    var setCookie = function (key, value, options) {
        options = options || {};

        // 计算cookie过期时间
        var expires = options.expires;
        if ('number' === typeof options.expires) {
            expires = new Date();
            expires.setTime(expires.getTime() + options.expires);
        }
        document.cookie =
            key + "=" + value +
            (options.path ? "; path=" + options.path : "") +
            (expires ? "; expires=" + expires.toGMTString() : "") +
            (options.domain ? "; domain=" + options.domain : "") +
            (options.secure ? "; secure" : '');

    }
    
    
    
    
    var addEvent = function(obj, eventType, func) {
        if(obj.attachEvent) {
            obj.attachEvent("on" + eventType, func);
        } else {
            obj.addEventListener(eventType, func, false);
        }
    };
    /**
     * 定向标识(点击后种下)
     * @param  {String} 文字链的容器id
     * @param  {String} 标识值
     * @param  {String} 点击监测 
     */
    var sinaads_entry_fn = function(id,value,url){
        var links;
        try {
            links = document.getElementById(id).getElementsByTagName("a");
        }catch(e) {
            links = [];
        }
        
        for (var i = 0, len = links.length; i < len; i++) {
            addEvent(links[i], "mousedown", function() {
                setCookie("sinaads_entry",value,{"path":"/","domain":".sina.com.cn","expires":24*3600000}); 

                if(url){
                    var _clickStat = new Image();
                    _clickStat.src = url + "&_=" + new Date().getTime() + "&url=";
                }
            });
        }
        
    }
    
    sinaads_entry_fn("syncad_1","fangtai");
    
})();
;(function(exports,name) {
    var fns = [];
    var isReady = 0;
    var iframeStore = null;
    var EXPORTNAME = name||'___SinaadsCrossDomainStorage___';
    var HANDLE = EXPORTNAME + '.onReady';
    var opt = {
        domain: 'sina.com.cn',
        url: 'http://news.sina.com.cn/iframe/87/store.html'
    };
    var ERROR = {
        domain: 'fail to set domain!'
    };
    var loadStore = function() {
        if(iframeStore){
            return;
        }
        try {
            document.domain = opt.domain;
        } catch (e) {
            throw new Error(ERROR.domain);
        }
        var node = document.getElementById(EXPORTNAME);
        if(node){
            node.parentNode.removeChild(node);
        }
        var iframeWrap = document.createElement('div');
        var doc = document.body;
        var iframe = '<iframe src="' + opt.url + '?handle=' + HANDLE + '&domain=' + opt.domain + '" frameborder="0"></iframe>';
        var px = '-'+1e5+'em';
        iframeWrap.style.position = 'absolute';
        iframeWrap.style.left = px;
        iframeWrap.style.top = px;
        iframeWrap.className = 'hidden';
        iframeWrap.id = EXPORTNAME;
        iframeWrap.innerHTML = iframe;
        doc.insertBefore(iframeWrap, doc.childNodes[0]);
    };

    var checkReady = function() {
        if (!isReady) {
            loadStore();
        }
        return isReady;
    };
    var CrossDomainStorage = {};
    CrossDomainStorage.ready = function(fn) {
        if (!checkReady()) {
            //ifrmae还没加载
            fns.push(fn);
            return;
        }
        fn(iframeStore);
    };
    CrossDomainStorage.onReady = function(store) {
        if (isReady) {
            return;
        }
        isReady = 1;
        iframeStore = store;
        if (fns) {
            while (fns.length) {
                fns.shift()(store);
            }
        }
        fns = null;
    };
    CrossDomainStorage.config = function(o) {
        if (!o) {
            return;
        }
        for (var i in o) {
            if (o.hasOwnProperty(i)) {
                opt[i] = o[i] || opt[i];
            }
        }
        return this;
    };
    exports[EXPORTNAME] = CrossDomainStorage;
})(window);

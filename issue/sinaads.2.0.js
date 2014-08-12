(function (core, exports, undefined) {
    "use strict";

    var model = {};

    model.cache = {};

    model.request = function (pdps) {
        var deferred = new Deferred();
        core.sio.jsonp('newimpress?adunit=' + pdps.join(','), function (ads) {
            for (var i = 0, len = ads.length; i < len; i++) {
                model.cache[ads[i].pdps] = ads[i];
            }
            deferred.resolve(model.cache);
        });
        return deferred;
    };

    exports.model = model;
})(sinaadToolkit, window);


function render(ins, data) {
    //render ins use data
}

function scan(callback) {
    //get ins pdps
    callback(pdps);
}


/**
 * 初始化
 */
function init() {
    scan(function (ins, pdps) {
        model.request(pdps)
            .done(function (data) {
                render(ins, data);
            });
    });
}
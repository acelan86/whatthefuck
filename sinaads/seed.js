/**
 * 页面种子，用于根据是否有频率来获取相应的轮播数
 */
var seed = (function (uid, controller) {
    var _cache = {};
    return {
        get : function (key) {
            var seedkey = uid + (controller.frequenceController.has(key) ? key : '');

            if (!_cache[seedkey]) {
                _cache[seedkey] = parseInt(core.storage.get(seedkey), 10) || core.rand(1, 100);
                //大于1000就从0开始，防止整数过大
                core.storage.set(seedkey, _cache[seedkey] > 1000 ? 1 : ++_cache[seedkey], 30 * 24 * 60 * 60 * 1000); //默认一个月过期
            }
            return _cache[seedkey];
        }
    };
})(PAGE_HASH, controllerModule);
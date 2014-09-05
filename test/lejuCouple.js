leju.conf.url = "http://adm.leju.sina.com.cn/get_ad_list/PG_514AC47514A055";
leju.conf.defaultUrl = "http://d3.sina.com.cn/litong/zhitou/leju/news.js";
var position = "couplet";
var lejuMedia = leju.getData();
lejuMedia.then(function (data) {
    var data = data[position][0];
    var win;
    try {
        var parent = window.parent;
        parent.lejuCoupleData = {
            src : [data.params.bar, data.params.left, data.params.right],
            link : data.params.link,
            top : 10,
            mainW : sinaads_ad_width,
            mainH : sinaads_ad_height,
            sideW : 25,
            sideH : 300
        };
        if (!parent.sinaads_couple) {
            parent.sinaadToolkit.sio.loadScript("./src/plus/couple.js", function () {
                parent.sinaads_couple(parent.lejuCoupleData);
            });
        } else {
            parent.sinaads_couple(parent.lejuCoupleData);
        }
    } catch (e) {
        alert(e.message);
    }
});
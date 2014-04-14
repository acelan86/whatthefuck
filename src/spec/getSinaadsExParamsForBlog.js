/**
 * 获取impress额外参数 for blog.sina.com.cn
 * 从文章中解析出博文id，和博主id
 * @author acelan (xiaobin8[at]staff.sina.com.cn)
 */
(function (exports, undefined) {
    "use strict";

    var linkNodes = document.getElementsByTagName('head')[0].getElementsByTagName('link'),
        len = linkNodes.length,
        rssLink,
        aid,
        uid;

    //从location中获取aid example: blog.sina.com.cn/s/blog_50861ae80102e99u.html?tj=1
    aid = (window.location.href || '').match(/\/blog_([A-Za-z0-9]*)\./);

    //从RSS link中获取uid  example: http://blog.sina.com.cn/rss/1350965992.xml
    for (var i = 0; i < len; i++) {
        if ('RSS' === linkNodes[i].title.upperCase() && (rssLink = linkNodes[i].href)) {
            uid =
                parseInt(
                    rssLink
                        .substring(rssLink.lastIndexOf('/') + 1)
                        .replace('.xml', ''),
                10);
            break;
        }
    }

    //export ex params for sinaadsExParams
    exports.sinaadsExParams = exports.sinaadsExParams || {};
    aid && aid[1] && (exports.sinaadsExParams.blogArticalId = aid[1]);
    uid && (exports.sinaadsExParams.blogUserId = uid);

})(window);

//for test
console.log(window.sinaadsExParams);
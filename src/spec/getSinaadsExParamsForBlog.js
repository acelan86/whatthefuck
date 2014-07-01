/**
 * 获取impress额外参数 for blog.sina.com.cn
 * 从文章中解析出博文id，和博主id
 * @author acelan (xiaobin8[at]staff.sina.com.cn)
 */
(function (exports, blogScope, undefined) {
    "use strict";

    var linkNodes = document.getElementsByTagName('head')[0].getElementsByTagName('link'),
        len = linkNodes.length,
        rssLink,
        aid = blogScope.aid,
        uid = blogScope.uid;

    //从location中获取aid example: blog.sina.com.cn/s/blog_50861ae80102e99u.html?tj=1
    if (!aid) {
        aid = (window.location.href || '').match(/\/blog_([A-Za-z0-9]*)\./);
        aid = aid ? aid[1] : null;
    }

    //从RSS link中获取uid  example: http://blog.sina.com.cn/rss/1350965992.xml
    if (!uid) {
        for (var i = 0; i < len; i++) {
            if ('RSS' === linkNodes[i].title.toUpperCase() && (rssLink = linkNodes[i].href)) {
                uid =
                    parseInt(
                        rssLink
                            .substring(rssLink.lastIndexOf('/') + 1)
                            .replace('.xml', ''),
                    10);
                break;
            }
        }
    }

    //export ex params for sinaadsExParams
    exports.sinaadsExParams = exports.sinaadsExParams || {};
    aid && (exports.sinaadsExParams.blogArticleId = aid);
    uid && (exports.sinaadsExParams.blogUserId = uid);

})(
    window,
    window.scope ? {uid : window.scope.$uid, aid : window.scope.$articleid} : {}
);

//for test
//console.log(window.sinaadsExParams);
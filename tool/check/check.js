var http = require('http');
var fs = require('fs');
var readylist = require('./pdps.js').list;
var pdpsinfo = require('./pdpsinfo.js').pdpsinfo;
var count = 0;
var argPDPS = (process.argv[2] || '').split(',');

var checklist = argPDPS && argPDPS.length > 0 && argPDPS[0] ? argPDPS : (function (data) {
    var list = [];
    for (var key in readylist) {
        if (readylist.hasOwnProperty(key)) {
            list.push(key);
        }
    }
    return list
})(readylist);

var succ = {
    list : [],
    add : function (pdps, src) {
        succ.list.push({ pdps: pdps, src: src });
    },
    dump : function () {
        var info = ['检查通过的pdps, 总计' + succ.list.length + '个'];
        succ.list.forEach(function (item, i) {
            info.push('\n\t' + item.pdps + '\n\t' + (pdpsinfo[item.pdps] || '未录入') + '\n\t' + (readylist[item.pdps] ? '已接管' : '未接管') + '\n\t' + JSON.stringify(item.src) + '\n\thttp://d1.sina.com.cn/litong/zhitou/sinaads/getAdCode.html?' + item.pdps + '\n');
        });
        return info.join('');
    }
};
var warn = {
    list : [],
    add : function (pdps, reason) {
        warn.list.push ({ pdps: pdps, reason: reason });
    },
    dump : function () {
        var info = ['可能是天窗的pdps, 总计' + warn.list.length + '个'];
        warn.list.forEach(function (item, i) {
            info.push('\n\t' + item.pdps + '\n\t' + (pdpsinfo[item.pdps] || '未录入') + '\n\t' + (readylist[item.pdps] ? '已接管' : '未接管') + '\n\t' + item.reason + '\n\thttp://d1.sina.com.cn/litong/zhitou/sinaads/getAdCode.html?' + item.pdps + '\n');
        });
        return info.join('');
    }
};
var fail = {
    list : [],
    add : function (pdps, reason) {
        fail.list.push ({ pdps: pdps, reason: reason });
    },
    dump : function () {
        var info = ['检查失败的pdps, 总计' + fail.list.length + '个'];
        fail.list.forEach(function (item, i) {
            info.push('\n\t' + item.pdps + '\n\t' + (pdpsinfo[item.pdps] || '未录入') + '\n\t' + (readylist[item.pdps] ? '已接管' : '未接管') + '\n\t' + item.reason + '\n\thttp://d1.sina.com.cn/litong/zhitou/sinaads/getAdCode.html?' + item.pdps + '\n');
        });
        return info.join('');
    }
}



checklist.forEach(function (pdps, i) {
    var sax = 'http://sax.sina.com.cn/impress.php?',
        callback = 'sinaads_check_robot_' + new Date().getTime().toString(36),
        params = [
            'adunitid=' + pdps,
            'TIMESTAMP=' + new Date().getTime().toString(36),
            'referral=' + encodeURIComponent('http://sinaads.robot.sina.com.cn'),
            'rotate_count=' + 1,
            'callback=' + callback
        ].join('&');

    var responseBody = '';

    var options = {
      hostname: 'sax.sina.com.cn',
      port: 80,
      path: '/impress.php?' + params,
      method: 'get',
      header: {
        'Cookie': 'U_TRS1=000000d3.99e719f1.51c12378.c89b1e33; SINAGLOBAL=61.135.152.211_1371612024.955334; UOR=,,; vjuids=460fb730a.13fe54b3c28.0.c43b2288; mvsign=v%3DK%3FJwYfCS%24%5BAG%23u%2FnRal%3D; sso_info=v02m6alo5qztKWRk5yljoOgpZCjoKWRk5yljoOgpZCjoKWRk5SlkJOYpY6DoKWRk5SlkJOYpY6DoKWRk5yljoOgpZCjhKWRk5SljoOUpY6TkKWRk5SlkJSUpY6UkKadlqWkj5OIsoyzhLSNg4C5jZOUwA==; ArtiFSize=14; U_TRS2=000000d3.90ba3ff2.52243fcb.5760624d; Apache=61.135.152.211_1378107339.987071; ULV=1378107549972:17:2:2:61.135.152.211_1378107339.987071:1378107339775; SINA_NEWS_CUSTOMIZE_city=%u5317%u4EAC; _ipuba=pub_u%3Dzhouyi3%26pub_t%3D9c2931fd53640304dee7f2b7994f8d82; __utma=269849203.1059777662.1372045200.1372241716.1378187321.4; __utmc=269849203; __utmz=269849203.1372241716.3.2.utmcsr=blog.sina.com.cn|utmccn=(referral)|utmcmd=referral|utmcct=/s/blog_908b9f3e01012huh.html; lxlrtst=1378199856_o; lxlrttp=1378199856; ULOGIN_IMG=xd-b5bbad5c194287282d52ed04df7c043e2d27; SGUID=1371612028420_35914480; rotatecount=0; vjlast=1378257374.1378257640.10',
        'Referer': 'http://robot.sinaads.sina.com.cn',
        'User-Agent':'sinaads robot'
      }
    };

    //console.log(sax + params);

    var req = http.request(options, function(res) {
        //console.log('STATUS: ' + res.statusCode);
        //console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        if (res.statusCode !== 200) {
            fail.add(pdps, '服务器状态错误');
        }
        res.on('data', function (chunk) {
            responseBody += chunk;
        });
        res.on('end', function () {
            count++;
            var data = responseBody.replace(callback + '(', '').replace(/\)$/, '');
            if (data) {
                try {
                    data = JSON.parse(data);
                    if (data === "nodata") {
                        warn.add(pdps, '广告位为空');
                    } else {
                        //console.log(chunk);
                        if (data.ad && data.ad[0] && data.ad[0].value && data.ad[0].value[0]) {
                            succ.add(pdps, data.ad[0].value[0].content.src || data.ad[0].value[0].content);
                        } else {
                            warn.add(pdps, '广告位数据为空');
                        }
                    }
                } catch (e) {
                    fail.add(pdps, '广告内容解析失败，' + JSON.stringify(data));
                    data = null;
                }
            } else {
                fail.add(pdps, '返回数据为空字符串');
            }
            if (count === checklist.length) {
                var time = new Date();
                var logStr = '';
                logStr += '下面为' + new Date() + '线上所有接管广告位的数据检查情况(请重点关注天窗和失败的位置)：\n\n';
                logStr +='共' + checklist.length + '个\n\t正常' + succ.list.length + '个\n\t警告' + warn.list.length + '个\n\t失败' + fail.list.length + '个\n\n============================\n';
                logStr += [
                    warn.dump(),
                    fail.dump()
                    //succ.dump()
                ].join('\n\n============================\n');
                fs.writeFileSync('result' + /*time.getFullYear() + time.getMonth() + time.getDate() + time.getHours() +*/ '.log', logStr);
            }
        });
    });

    req.on('error', function(e) {
      fail.add(pdps, '请求失败,' + e.message);
    });

    // write data to request body
    // req.write('data\n');
    // req.write('data\n');
    req.end();
});
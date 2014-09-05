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
    add : function (pdps, src, link) {
        succ.list.push({ pdps: pdps, src: src, link: link });
    },
    dump : function () {
        var info = ['检查通过的pdps, 总计' + succ.list.length + '个'];
        succ.list.forEach(function (item, i) {
            info.push('\n\t' + item.pdps + '\n\t' + (pdpsinfo[item.pdps] || '未录入') + '\n\t' + (readylist[item.pdps] ? '已接管' : '未接管') + '\n\t' + JSON.stringify(item.src) + '\n\t' + JSON.stringify(item.link) + '\n\thttp://d1.sina.com.cn/litong/zhitou/sinaads/getAdCode.html?' + item.pdps + '\n');
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
        'Cookie': 'Cookie:U_TRS1=000000d3.99e719f1.51c12378.c89b1e33; SINAGLOBAL=61.135.152.211_1371612024.955334; UOR=,,; vjuids=460fb730a.13fe54b3c28.0.c43b2288; mvsign=v%3DK%3FJwYfCS%24%5BAG%23u%2FnRal%3D; SGUID=1371612028420_35914480; __utma=269849203.1059777662.1372045200.1378877184.1379467889.8; __utmz=269849203.1378877184.7.5.utmcsr=games.sina.com.cn|utmccn=(referral)|utmcmd=referral|utmcct=/; sso_info=v02m6alo5qztKWRk5iljpOUpY6DoKWRk5iljpSUpY6UjKWRk5ilkKOUpY6EiKWRk6ClkJSYpY6TlKadlqWkj5OMtY2DiLWNk4C1jKOQwA==; U_TRS2=000000f3.1ebe12a4.523f99e1.fa64639c; Apache=61.135.152.218_1379899876.819534; ULV=1379899969351:19:4:1:61.135.152.218_1379899876.819534:1378874758140; ArtiFSize=14; lxlrtst=1380077610_o; lxlrttp=1380077610; SINA_NEWS_CUSTOMIZE_city=%u5317%u4EAC; SUS=SID-2231440955-1380174230-XD-xyo3v-386bdf770527d8825090cedb61059c9e; ALF=1382766230; ; SUE=es%3D2642e35fa72b908becfd33b01949892c%26ev%3Dv1%26es2%3D30ef8d8f881da43a64bdd15e0254dce0%26rs0%3DUVrKWl0fROoghHLRCpne37klvUOcTOFP4Y05GGgPXMSsT%252BzPq25fr25z5Lj1N6dYbfb8fRILZ3jLdBF4sSliHKdqYPbfxJ99wdfdthAozsN5vYuxgGysLjpayLhDnmRKjTEz%252B2cOzpuRYD3SCuePmYAYowGeRw18x16nW%252FJQaLg%253D%26rv%3D0; SUP=cv%3D1%26bt%3D1380174230%26et%3D1380269403%26d%3D40c3%26i%3D9c9e%26us%3D1%26vf%3D0%26vt%3D0%26ac%3D2%26st%3D0%26lt%3D7%26uid%3D2231440955%26user%3D79480491%2540qq.com%26ag%3D4%26name%3D79480491%2540qq.com%26nick%3D%25E7%2588%25B8%25E7%2588%25B8%25E5%25A6%2588%25E5%25A6%2588%25E7%2588%25B1%25E5%2585%2594%25E5%25AE%259D%26sex%3D1%26ps%3D0%26email%3D%26dob%3D%26ln%3D%26os%3D%26fmp%3D%26lcp%3D2012-03-28%252015%253A46%253A59; vjlast=1380185960; rotatecount=8; ULOGIN_IMG=xd-7bcd02e0185b38daa6e90e9cca31749d333f',
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
                            var content = data.ad[0].value[0].content;
                            if (content.monitor) {
                                //console.log(JSON.stringify(content.monitor));
                                for (var i = 0, len = content.monitor.length; i < len; i++) {
                                    console.log(content.monitor[i]);
                                    if (content.monitor[i].length > 2000) {
                                        console.log(pdps + '\tmonitor长度过长');
                                    }
                                }
                            }
                            if (content.src && content.src.length > 0 && content.src[0].indexOf('.html') === -1 && content.src[0].indexOf('.js') === -1 &&!(content.link && content.link.length > 0 && content.link[0])) {
                                warn.add(pdps, JSON.stringify(content.src) + '\t广告必须有链接，但链接为空');
                            } else {
                                succ.add(pdps, data.ad[0].value[0].content.src || data.ad[0].value[0].content, content.link);
                            }
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
		logStr += '\n\n==================\n' + succ.dump();
                //console.log(logStr);
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

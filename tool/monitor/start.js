var exec = require('child_process').exec,
    mysql = require('mysql'),
    conf = require('./conf/config.js'),
    monitor_list = require(conf.checklistPath).checklist;

//连接数据库
var connection = mysql.createConnection({
    host: conf.mysql.host,
    port: conf.mysql.port,
    user: conf.mysql.user,
    password: conf.mysql.password
});
connection.connect();
connection.query("use " + conf.mysql.dbname);

var result = {},
    i = 0;

console.log('总计检查:' + monitor_list.length + '个，预计耗时' + monitor_list.length * conf.phantomjs.wait + '秒。');


function runPhantom() {
    var pdps = monitor_list[i++];
    if (pdps) {
        console.log('Monitor:' + pdps);
        exec([conf.phantomjs.path, conf.phantomjs.file, conf.pageurl + '?' + pdps, conf.phantomjs.wait].join(' '), function (error, stdout, stderr) {
            var reqs = JSON.parse(stdout),
                req,
                info,
                httpResult = '',
                httpCode = 0;

            for (var url in reqs) {
                req = {};
                info = '成功';
                if (!reqs[url].end) {
                    info = '失败：请求超时';
                } else {
                    httpCode = reqs[url].end.status,
                    httpResult = reqs[url].end.text || '';
                    if (httpCode > 399) {
                        info = '失败：状态码错误, ' + httpCode;
                    }
                }
                var sql = "INSERT INTO `" + conf.mysql.tablename + "` (`pdps`, `url`, `http_code`, `description`, `http_result`) VALUES('" + pdps + "', '" + url + "', '" + httpCode + "', '" + info + "', '" + httpResult + "')";
                //console.log(sql);
                connection.query(sql, function (err, rows) {
                    //console.log(err, rows);
                });
            }
            runPhantom();
        });
    } else {
        connection.end();
    }
}

runPhantom();





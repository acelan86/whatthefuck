exports.root = '/Users/xiaobinlan/github/sinaads/tool/monitor/';

/**
 * 数据库配置
 * @type {Object}
 */
exports.mysql = {
    host : '127.0.0.1',
    port : 3306,
    user : 'root',
    password : '',
    dbname : 'monitor',
    tablename : 'monitor'
};

/**
 * phantomjs执行相关配置
 * @type {Object}
 */
exports.phantomjs = {
    path : 'phantomjs',
    file : exports.root + 'check.js',
    wait : 2 //秒
};

/**
 * 模拟广告的页面，用于phantom抓取
 * @type {[type]}
 */
exports.pageurl = exports.root + 'ad.html';

/**
 * 检查的列表
 * @type {Array}
 */
exports.checklistPath = exports.root + 'checklist.js';
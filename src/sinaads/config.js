//页面url转换成唯一hash值，用于标记页面唯一的广告位
var UUID = 1;
var PAGE_HASH = 'sinaads_' + core.hash(window.location.host.split('.')[0] + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/')));
var IMPRESS_URL = 'http://sax.sina.com.cn/newimpress'; //向广告引擎请求正式广告的地址
var SERVER_PREVIEW_IMPRESS_URL = 'http://sax.sina.com.cn/preview'; //向广告引擎请求服务端预览广告的地址
// var PLUS_RESOURCE_URL = core.RESOURCE_URL + '/release/plus/Media.js';
var PLUS_RESOURCE_URL = 'http://d1.sina.com.cn/litong/zhitou/zhangfei/demo/skyscraper/Media.full.js';
//PLUS_RESOURCE_URL = ''; //测试富媒体分文件用
var SAX_TIMEOUT = parseInt(window._SINAADS_CONF_SAX_REQUEST_TIMEOUT || 30, 10) * 1000; //请求数据超时时间
var PAGE_MEDIA_ORDER = window._SINAADS_CONF_PAGE_MEDIA_ORDER || []; //渲染顺序配置
var PAGE_MEDIA_DONE_TIMEOUT = (window._SINAADS_CONF_PAGE_MEDIA_DONE_TIMEOUT || 20) * 1000; //渲染媒体执行超时时间
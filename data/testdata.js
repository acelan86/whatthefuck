_sinaadsCacheData = window._sinaadsCacheData || {};

/**
 *  测试数据填充区域
 */
//乐居顶通
_sinaadsCacheData["PDPS000000047211"] = {
    size : "1000*90",
    type : 'embed',
    content : {
        pv : ["http://baidu.com/?leju", "http://baidu.com/?leju2"],
        type : ['html'],
        src :  [
            [
                '\\x3cscript src="http://d3.sina.com.cn/litong/zhitou/sinaads/release/sinaadToolkit.js" charset="utf-8" \\x3e\\x3c/script\\x3e',
                '\\x3cscript\\x3e',
                    'var pdpsid = "PDPS_514AD44785ED12";',
                    'function lejuDataCallback(data) {',
                        'data = data ? data.data || {} : {};',
                        'if (data && (data = data.params)) {',
                            'var el = document.createElement("div");',
                            'el.innerHTML = sinaadToolkit.ad.createHTML(',
                                'sinaadToolkit.ad.getTypeBySrc(data.src),',
                                'data.src,',
                                'window.sinaads_ad_width,',
                                'window.sinaads_ad_height,',
                                'data.link',
                            ');',
                            'document.body.appendChild(el);',
                        '}',
                    '}',
                    'window.onload = function () {',
                        'sinaadToolkit.sio.loadScript("http://adm.leju.sina.com.cn/get_one_ad/" + pdpsid + "?callback=lejuDataCallback");',
                    '};',
                '\\x3c/script\\x3e'
            ].join('\n')
        ],
        monitor : ["http://leju.com"],
        link : ['http://leju.com']
    }
};

//翻牌广告
_sinaadsCacheData["PDPS000000000100"] = {
    size : "125*95",
    type : 'turning',
    content : [
        {
            pv : ['http://123.126.53.109/click?type=3&t=MjAxMy0wOC0xOSAwOToyOTo1Nwk2MS4xMzUuMTUyLjIxMQkJLQlQRFBTMDAwMDAwMDQ3MjExCTZlNjJhZWVlLTczZmYtNDNlZS04Y2U0LWQzMDBhODIyM2Q2NAlmMDlkZTAzNGJlYjgJZjA5ZGUwMzRiZWI4CV92X3pvbmU6MzAyMDAwLDMwMjAwMHx2X3pvbmU6MzAyMDAwLDMwMjAwMHxwb3M6UERQUzAwMDAwMDA0NzIxMSxQRFBTMDAwMDAwMDQyMTM1LFBEUFMwMDAwMDAwMDY0NTAsUERQUzAwMDAwMDA0MjEzNQkJMzAyMDA'],
            type : ['image', 'image', 'image'],
            src : [
                'http://d5.sina.com.cn/201304/03/483869_jiaoyuzuocefp01-jmb.jpg',
                'http://d3.sina.com.cn/201304/03/483870_jiaoyuzuocefp02-jmb.jpg',   
                'http://d3.sina.com.cn/200912/31/205332_12090.jpg'
            ],
            monitor : ["http://stream.com"],
            link : ['http://sina.allyes.com/main/adfclick?db=sina&bid=538707,604995,610265&cid=0,0,0&sid=613325&advid=2618&camid=93524&show=ignore&url=http://www.gjjy.org.cn/', 'http://sina.allyes.com/main/adfclick?db=sina&bid=538707,604995,610265&cid=0,0,0&sid=613325&advid=2618&camid=93524&show=ignore&url=http://www.gjjy.org.cn/']
        }
    ]
};
//tip广告
_sinaadsCacheData["PDPS000000000300"] = {
    size : "300*100",
    type : 'tip',
    content : [
        {
            pv : ['http://123.126.53.109/click?type=3&t=MjAxMy0wOC0xOSAwOToyOTo1Nwk2MS4xMzUuMTUyLjIxMQkJLQlQRFBTMDAwMDAwMDQ3MjExCTZlNjJhZWVlLTczZmYtNDNlZS04Y2U0LWQzMDBhODIyM2Q2NAlmMDlkZTAzNGJlYjgJZjA5ZGUwMzRiZWI4CV92X3pvbmU6MzAyMDAwLDMwMjAwMHx2X3pvbmU6MzAyMDAwLDMwMjAwMHxwb3M6UERQUzAwMDAwMDA0NzIxMSxQRFBTMDAwMDAwMDQyMTM1LFBEUFMwMDAwMDAwMDY0NTAsUERQUzAwMDAwMDA0MjEzNQkJMzAyMDA'],
            type : ['text', 'image', 'image'],
            src : [
                '我是text',
                'http://d3.sina.com.cn/201304/03/483870_jiaoyuzuocefp02-jmb.jpg',   
                'http://d3.sina.com.cn/200912/31/205332_12090.jpg'
            ],
            monitor : ["http://stream.com"],
            link : ['http://sina.allyes.com/main/adfclick?db=sina&bid=538707,604995,610265&cid=0,0,0&sid=613325&advid=2618&camid=93524&show=ignore&url=http://www.gjjy.org.cn/', 'http://sina.allyes.com/main/adfclick?db=sina&bid=538707,604995,610265&cid=0,0,0&sid=613325&advid=2618&camid=93524&show=ignore&url=http://www.gjjy.org.cn/']
        }
    ]
};

_sinaadsCacheData["PDPS000000000400"] = {
    size : "150*140",
    type : 'follow',
    content : [{
        pv : [],
        type : ['image', 'image'],
        src : [
            'http://d3.sina.com.cn/201307/23/502937_sinaAPP_140x150.jpg',
            'http://d3.sina.com.cn/201307/23/502938_sinaAPP_25x150.jpg'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};
// //跨栏广告
// _sinaadsCacheData["PDPS000000006450"] = {
//     size : "1000*90",
//     type : 'couplet',
//     content : [
//         {
//             pv : ['http://123.126.53.109/click?type=3&t=MjAxMy0wOC0xOSAwOToyOTo1Nwk2MS4xMzUuMTUyLjIxMQkJLQlQRFBTMDAwMDAwMDQ3MjExCTZlNjJhZWVlLTczZmYtNDNlZS04Y2U0LWQzMDBhODIyM2Q2NAlmMDlkZTAzNGJlYjgJZjA5ZGUwMzRiZWI4CV92X3pvbmU6MzAyMDAwLDMwMjAwMHx2X3pvbmU6MzAyMDAwLDMwMjAwMHxwb3M6UERQUzAwMDAwMDA0NzIxMSxQRFBTMDAwMDAwMDQyMTM1LFBEUFMwMDAwMDAwMDY0NTAsUERQUzAwMDAwMDA0MjEzNQkJMzAyMDA'],
//             type : ['image', 'image', 'image'],
//             src : [
//                 'http://d1.sina.com.cn/201307/31/504121_100090news_tl04_0801.jpg', //中部大图
//                 'http://d5.sina.com.cn/201307/31/504120_25300ls_kl_bt_0801.jpg',   //左边栏
//                 'http://d5.sina.com.cn/201307/31/504120_25300ls_kl_bt_0801.jpg'    //右边栏
//             ],
//             monitor : ["http://stream.com"],
//             link : ['http://stream.com', 'http://stream.sina.com.cn']
//         }
//     ]
// };

// 流媒体广告
_sinaadsCacheData["PDPS000000000066"] = {
    size : "1000*450",
    type : 'stream',
    content : [{
        pv : [],
        type : ['flash', 'flash'],
        src : [
            'http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fc1715.swf',
            'http://rm.sina.com.cn/bj_chuanyang/yhd20130701/fb1.swf'
            //'http://rm.sina.com.cn/bj-icast/mv/cr/2013/07/129132/31641/code.js'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};

//全屏广告
_sinaadsCacheData["PDPS000000000067"] = {
    size : "1000*400",
    type : 'fullscreen',
    content : [{
        pv : [],
        type : ['js'],
        src : [
            //'http://d1.sina.com.cn/201308/06/504904_sina-fulls-1000X450-0806-CC.jpg'
            'http://d1.sina.com.cn/litong/zhitou/sinaads/data/134753.js'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};

//视窗广告
_sinaadsCacheData["PDPS000000000068"] = {
    size : "300*297",
    type : 'videoWindow',
    content : [{
        pv : [],
        type : [/*'flash'*/'js'],
        src : [
            //'http://d1.sina.com.cn/rwei/shijia2012/shichuang1129/300x250.swf'
            'http://rm.sina.com.cn/bj_chuanyang/bm20130812/3169.js'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};

//对联广告
_sinaadsCacheData["PDPS000000000070"] = {
    size : "120*300",
    type : 'float',
    content : [{
        pv : [],
        type : ['image'],
        src : [
            'http://d2.sina.com.cn/201306/07/495662_100x300tech-diulian_1.jpg'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};


//文字链广告
_sinaadsCacheData["PDPS000000000081"] = {
    size : "0*0",
    type : 'textlink',
    content : [{
        pv : [],
        type : ['text'],
        src : [
            '我是文字链1'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};
//文字链广告
_sinaadsCacheData["PDPS000000000082"] = {
    size : "0*0",
    type : 'textlink',
    content : [{
        pv : [],
        type : ['text'],
        src : [
            '我是文字链2'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};
//文字链广告
_sinaadsCacheData["PDPS000000000083"] = {
    size : "0*0",
    type : 'textlink',
    content : [{
        pv : [],
        type : ['text'],
        src : [
            '我是文字链3'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};
//文字链广告
_sinaadsCacheData["PDPS000000000084"] = {
    size : "0*0",
    type : 'textlink',
    content : [{
        pv : [],
        type : ['text'],
        src : [
            '我是文字链4'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};
//文字链广告
_sinaadsCacheData["PDPS000000000085"] = {
    size : "0*0",
    type : 'textlink',
    content : [{
        pv : [],
        type : ['text'],
        src : [
            '我是文字链5'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};
//文字链广告
_sinaadsCacheData["PDPS000000000086"] = {
    size : "0*0",
    type : 'textlink',
    content : [{
        pv : [],
        type : ['text'],
        src : [
            '我是文字链6'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};
//文字链广告
_sinaadsCacheData["PDPS000000000087"] = {
    size : "0*0",
    type : 'textlink',
    content : [{
        pv : [],
        type : ['text'],
        src : [
            '我是文字链7'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};
//文字链广告
_sinaadsCacheData["PDPS000000000088"] = {
    size : "0*0",
    type : 'textlink',
    content : [{
        pv : [],
        type : ['text'],
        src : [
            '我是文字链8'
        ],
        monitor : ["http://stream.com"],
        link : ['http://stream.com', 'http://stream.sina.com.cn']
    }]
};

//智投文字链广告
_sinaadsCacheData["PDPS000000000050"] = {
    size : "0*0",
    type : 'zhitoutextlink',
    content : [
        {
            pv : [],
            type : ['text'],
            src : [
                '我是排名第一的文字链'
            ],
            monitor : ["http://stream.com"],
            link : ['http://stream.com', 'http://stream.sina.com.cn']
        },
        {
            pv : [],
            type : ['text'],
            src : [
                '我是排名第二的文字链'
            ],
            monitor : ["http://stream.com"],
            link : ['http://stream.com', 'http://stream.sina.com.cn']
        },
        {
            pv : [],
            type : ['text'],
            src : [
                '我是排名第三的文字链'
            ],
            monitor : ["http://stream.com"],
            link : ['http://stream.com', 'http://stream.sina.com.cn']
        },
        {
            pv : [],
            type : ['text'],
            src : [
                '我是排名第四的文字链'
            ],
            monitor : ["http://stream.com"],
            link : ['http://stream.com', 'http://stream.sina.com.cn']
        }
    ]
};
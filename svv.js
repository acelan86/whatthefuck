// last update at 2014-04-21 22:00:02
var _dc_mv = new Array();
var _dc_tv = new Array();
_dc_mv[0] = "http://video.sina.com.cn/movie/detail/iam";
_dc_mv[1] = "http://video.sina.com.cn/movie/detail/xsls";
_dc_mv[2] = "http://video.sina.com.cn/movie/detail/ss";
_dc_mv[3] = "http://video.sina.com.cn/movie/detail/yh";
_dc_mv[4] = "http://video.sina.com.cn/movie/detail/ywhlc";
_dc_tv[0] = "http://video.sina.com.cn/movie/detail/xinshu";
_dc_tv[1] = "http://video.sina.com.cn/movie/detail/hynz";
_dc_tv[2] = "http://video.sina.com.cn/movie/detail/sbtj";
_dc_tv[3] = "http://video.sina.com.cn/movie/detail/fhsy";
_dc_tv[4] = "http://video.sina.com.cn/movie/detail/ys";

// last update at 2014-04-21 22:00:01
var _dc_gold = new Array('snddj', 'yytb', 'lctdct?opsubject_id=movie_golden', 'wdfqsbd?opsubject_id=movie_golden', 'shuihu?opsubject_id=movie_golden', 'aqgy2?opsubject_id=movie_golden');
var _dc_guan = new Array('');
var _dc_qing = new Array('hzppqxf', 'xflqm', 'lglf', 'wdmlrs', 'jyjf', 'mmzawyc', 'mq', 'mqsth', 'wdcn', 'bbbz', 'fars', 'yangfu', 'qqxb', 'nswxd', 'jhxd', 'bxd', 'fqxd', 'newsstt', 'xjhshd', 'njzadjz', 'jyendyb', 'jyendeb');

// get_opsubject_id
function dc_video_get_opsubject_id(pos) {
    var lasturl = document.referrer;
   if(_dc_video_get_cookie("uclAd")){
        if(pos == "head"){
            _dc_video_delete_cookie("uclAd", "/", "sina.com.cn");
        }
        return "laliga";
} 
   // for skyscraper
    var m = window.location.href.match(/.+\/o\.shtml(\?.*)?$/);
    if (m != undefined) {
        return "prevent";
    }
    // for sports focus player
    if (window.location.href == 'http://video.sina.com.cn/sports/') {
        return "prevent";
    }

    // shouji
    var p = window.location.pathname.match(/^\/teleplay\/shouji\/.+/);
    if (p != undefined) {
        return 'prevent';
    }

    // nba movie    
    var p = window.location.href.match(/^http\:\/\/sports\.sina\.com\.cn\/nba\/video\/movie\/association\/bos\/.*/);
    if (p != undefined) {
        return 'prevent';
    }

    // tmp
    var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/ent\/y\/2010\-08\-28\/191461129353\.html.*/);
    if (p != undefined) {
        return 'prevent';
    }
    var p = window.location.href.match(/^http\:\/\/baby\.sina\.com\.cn\/tv\/jiangtang\/cuiyutao_.*/);
    if (p != undefined) {
        return 'prevent';
    }
    // normal
    var p = window.location.search.match(/opsubject_id=([^&]+)/);
    if (p != undefined) {
        return p[1];
    }
//  zhongguohaoshengyin    ent-3847   
var p = window.location.href.match(/^http\:\/\/ent\.sina\.com\.cn\/f\/voice\//);
if (p != undefined) {
         return 'ent-3847';
}
  //  nbachina2012     nab zhongguo 2012  
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/z\/sports\/nba\/chinagames2012\//);
if (p != undefined) {
         return 'nbachina2012';
}
  //  zhongwang2012    zhongwang 2012   
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/z\/sports\/tennis\/chinaopen12\//);
if (p != undefined) {
         return 'zhongwang2012';
}
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/sports\/t\/chinaopen12\//);
if (p != undefined) {
         return 'zhongwang2012';
}
  //  zhongwang2012    zhongwang 2012   
var p = window.location.href.match(/^http\:\/\/sports\.sina\.com\.cn\/tennis\/chinaopen12\//);
if (p != undefined) {
return 'zhongwang2012';
}

  //  nbachina2012     nab zhongguo 2012  
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/sports\/nbachina\//);
if (p != undefined) {
    return 'nbachina2012';
}
  //  dawosi 2012davos       
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/finance\/davos\//);
if (p != undefined) {
    return '2012davos';
}
  //ouguan   ucl     
var p = window.location.href.match(/^http\:\/\/sports\.sina\.com\.cn\/g\/video\/uclvideo\//);
if (p != undefined) {
    return 'ucl';
}
  // ouguan  ucl       
var p = window.location.href.match(/^http\:\/\/sports\.sina\.com\.cn\/uclvideo\//);
if (p != undefined) {
    return 'ucl';
}

//  yingchao pl       
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/sports\/pl\//);
if (p != undefined) {
    return 'pl';
}

  //  yingchao pl     
var p = window.location.href.match(/^http\:\/\/sports\.sina\.com\.cn\/g\/video\/plvideo\//);
if (p != undefined) {
    return 'pl';
}

  //  xijia laliga    
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/sports\/laliga\//);
if (p != undefined) {
    return 'laliga';
}
  //  xijia laliga    
var p = window.location.href.match(/^http\:\/\/sports\.sina\.com\.cn\/g\/video\/laligavideo\//);
if (p != undefined) {
    return 'laliga';
}
  //  yijia seriea   
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/sports\/seriea\//);
if (p != undefined) {
    return 'seriea';
}
  //  yijia seriea   
var p = window.location.href.match(/^http\:\/\/sports\.sina\.com\.cn\/g\/video\/serieavideo\//);
if (p != undefined) {
    return 'seriea';
}
var p = lasturl.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/zqgold\//);   
if (p != undefined) {                                                                    
    return '2012aoyun_jinpai';                                                             
}                                                                                        
                                                                                         
//  2012lundunaoyun jinpaishipinku                                                       
var p = lasturl.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/allgold\//);  
if (p != undefined) {                                                                    
    return '2012aoyun_jinpai';                                                             
}                                                                                        
                                                                                         
// 2012lundunaoyun juntuan                                                               
var p = lasturl.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/chinagold\//);
if (p != undefined) {                                                                    
    return '2012aoyun_jinpai';                                                             
}                                                                                        
                                                                                         
//   2012lundunaoyun xiangmuye                                                               
var p = lasturl.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/allsports\//);
if (p != undefined) {                                                                    
    return '2012aoyun_jijin';                                                              
} 
//  2012lundunaoyun   zhibo
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/24hour\//);
if (p != undefined) {
    return '2012aoyun_zhibo';
}

//  2012lundunaoyun   open 
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/p\/olympic\/open\//);
if (p != undefined) {
    return '2012aoyun_kbm';
}
// 2012lundunaoyun   openceremony
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/openceremony\//);
if (p != undefined) {
    return '2012aoyun_kbm';
}
// 2012lundunaoyun   closeceremony
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/closeceremony\//);
if (p != undefined) {
        return '2012aoyun_kbm';
}
//  2012lundunaoyun   close 
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/p\/olympic\/close\//);
if (p != undefined) {
    return '2012aoyun_kbm';
}

//  jinpai_yingji
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/p\/olympic\/\w+\/gold\//);
if (p != undefined) {
    return '2012aoyun_jinpai1';
}

//  jinpai_yingji
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/p\/olympic\/gold\//);
if (p != undefined) {
    return '2012aoyun_jinpai1';
}

//  2012aoyun_shoujin
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/gold\/chinafirst\//);
if (p != undefined) {
    return '2012aoyun_jinpai';
}

  // lundunaoyun tongtou02
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/p\/olympic\//);
if (p != undefined) {
    return '2012aoyun';
}

//  lundunaoyun  tongtou03
var p = window.location.href.match(/^http\:\/\/2012\.sina\.com\.cn\//);
if (p != undefined) {
    return '2012aoyun';
}

  //  2012lundunaoyun hjx
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/hjx\//);
if (p != undefined) {
    return '2012aoyun_hjx';
}
  //  2012lundunaoyun gdg
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/gdg\//);
if (p != undefined) {
    return '2012aoyun_gdg';
}
  //  2012lundunaoyun  jpbb
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/goldnews\//);
if (p != undefined) {
    return '2012aoyun_jpbb';
}
  //  2012lundunaoyun  gjft
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/video\/championtalk\//);
if (p != undefined) {
    return '2012aoyun_gjft';
}
  //  2012lundunaoyun    lhd
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\/lhd\//);
if (p != undefined) {
    return '2012aoyun_lhd';
}
 //lundunaoyun tongtou01
var p = window.location.href.match(/^http\:\/\/video\.2012\.sina\.com\.cn\//);
if (p != undefined) {
        return '2012aoyun';
}
var p = window.location.href.match(/^http\:\/\/euro2012\.sina\.com\.cn\/video\//);
if (p != undefined) {
    return '2012euro1';
}
var p = window.location.href.match(/^http\:\/\/video\.euro2012\.sina\.com\.cn\//);
if (p != undefined) {
    return '2012euro2';
}
var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/sports\/euro2012\/v\//);
if (p != undefined) {
    return '2012euro2';
}
    var p = window.location.href.match(/^http\:\/\/ent\.sina\.com\.cn\/f\/yscw2012\/.*/);
    if (p != undefined) {
        return '2012cw';
    }
    var p = window.location.href.match(/^http\:\/\/ent\.sina\.com\.cn\/f\/v\/zbsxp\/.*/);
    if (p != undefined) {
        return '2012cw';
    }
    // 2011chunwan
    var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/ent\/v\/m\/.*/);
    if (p != undefined) {
        return '2011chunwan';
    }
    var p = window.location.href.match(/^http\:\/\/ent\.sina\.com\.cn\/f\/v\/2011yscw\/.*/);
    if (p != undefined) {
        return '2011chunwan';
    }
    var p = window.location.href.match(/^http\:\/\/ent\.sina\.com\.cn\/f\/v\/hntvchunwanvideo\/.*/);
    if (p != undefined) {
        return '2011chunwan';
    }

    // facetoface
    var p = window.location.href.match(/^http\:\/\/finance\.sina\.com\.cn\/facetoface\/.*/);
    if (p != undefined) {
        return 'facetoface';
    }
    var p = window.location.href.match(/^http\:\/\/p4p\.sina\.com\.cn\/test\/sina\/chao\/other\/delivery\/.*/);
    if (p != undefined) {
        return 'facetoface';
    }


    // stocks
    var p = window.location.href.match(/^http\:\/\/finance\.sina\.com\.cn\/(video|gsbb)\/.*/);
    if (p != undefined) {
        return 'stocksreport';
    }
    var p = window.location.href.match(/^http\:\/\/p4p\.sina\.com\.cn\/test\/sina\/chao\/other\/delivery2\/.*/);
    if (p != undefined) {
        return 'stocksreport';
    }


    // starshow
    var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/starshow\/.*/);
    if (p != undefined) {
        return 'starshow';
    }

    // weiboshow
    var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/weiboshow\/.*/);
    if (p != undefined) {
        return 'weiboshow';
    }

    // 2010
    var p = window.location.host.match(/^(2010)\.sina\.com\.cn$/);
    if (p != undefined) {
        return p[1];
    }
    var p = window.location.host.match(/^video.(2010).sina.com.cn$/);
    if (p != undefined) {
        return p[1];
    }

    // area
    var v_region = "";
    if(window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/.*/) != null
    || window.location.href.match(/^http\:\/\/p4p\.sina\.com\.cn\/.*/) != null) {
        _metas = document.getElementsByTagName('meta');
        var v_area = '';
        for(i = 0; i < _metas.length; i++ ) {
            v_area = _metas[i].getAttribute("content");
            v_area = v_area ? v_area.match(/鍦板尯:([^;]+);/) : null;
            if(v_area != null) {
                v_region = v_area[1];
                break;
            }
        }
    }

    // korea
    if(v_region == "闊╁浗") {
        return 'korea_movie';
    }

    // china mob
    if(window.location.href.match(/^http\:\/\/live\.video\.sina\.com\.cn\/play\/video\/chatshow\/(6909|6911|6912|6915|6917|6918|6919|6920|6943|6944|6950|6951|6955|6979|6980|6991|6995|7002|7003|7006|7007|7016|7017|7039|7040|7056)\//) != null) 
    {
        return 'chinamobilechatshow';
    }
    var p = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/starshow\/2010\-04\-21\/17\.html/);
    if (p != undefined) {
        return 'chinamobilechatshow';
    }
    if(window.location.href.match(/^http\:\/\/live\.video\.sina\.com\.cn\/play\/baby\/yuyue\/1328\.html/) != null) 
    {
        return 'chinamobilechatshow';
    }
    if(window.location.href.match(/^http\:\/\/live\.video\.sina\.com\.cn\/play\/ent\/chatshow\/1297\.html/) != null) 
    {
        return 'chinamobilechatshow';
    }
    if(window.location.href.match(/^http\:\/\/live\.video\.sina\.com\.cn\/play\/book\/chatshow\/6761\.html/) != null) 
    {
        return 'chinamobilechatshow';
    }
    if(window.location.href.match(/^http\:\/\/live\.video\.sina\.com\.cn\/play\/eladies\/chatshow\/(6625|6683)\.html/) != null) 
    {
        return 'chinamobilechatshow';
    }

    // for rank
    /*
    m = window.location.href.match(/(http.+)\/[^\/]*\.s?html?/);
    if (m != undefined) {
        var r = _dc_mv.toString().indexOf(m[1]);
        if (r >= 0) {
            return "movie_home_movielist";
        }
        var r = _dc_tv.toString().indexOf(m[1]);
        if (r >= 0) {
            return "movie_home_tvlist";
        }
    }
    */
    m = window.location.href.match(/http:\/\/video\.sina\.com\.cn\/m\/([^\.]+)_.+\.html/);
    if (m != undefined) {
        var r = _dc_mv.toString().indexOf('/movie/' + m[1] + '/');
        if (r >= 0) {
            return "movie_home_movielist";
        }
        var r = _dc_tv.toString().indexOf('/teleplay/' + m[1] + '/');
        if (r >= 0) {
            return "movie_home_tvlist";
        }
    }
    
    // for gold
    m = window.location.href.match(/http:\/\/video\.sina\.com\.cn\/m\/([^\.]+)_.+\.html/);
    if (m != undefined) {
        var a = ',' + _dc_gold.join(',') + ',';
        var b = ',' + _dc_guan.join(',') + ',';
        var c = ',' + _dc_qing.join(',') + ',';
        var r = c.indexOf(',' + m[1] + ',');
        if (r >= 0) {
            return "movie_qing";
        }
        var r = a.indexOf(',' + m[1] + ',');
        if (r >= 0) {
            return "movie_golden";
        }
        var r = b.indexOf(',' + m[1] + ',');
        if (r >= 0) {
            return "movie_guanfang";
        }
    }
    
    // chinamobile to 2010/12/31
    var p1 = window.location.href.match(/^http\:\/\/live\.video\.sina\.com\.cn\/play\/ent\/chatshow\/.*/);
    var p2 = window.location.href.match(/^http\:\/\/live\.video\.sina\.com\.cn\/play\/sports\/chatshow\/.*/);
    var p3 = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/starshow\/.*/);
    var p4 = window.location.href.match(/^http\:\/\/live\.video\.sina\.com\.cn\/play\/book\/chatshow\/.*/);
    var p5 = window.location.href.match(/^http\:\/\/video\.sina\.com\.cn\/p\/book\/.*/);
    
    if (p1 != undefined || p2 != undefined || p3 != undefined || p4 != undefined || p5 != undefined) {
        return 'chinamobile';
    }

    // vblogweb
    var p = window.location.pathname.match(/([^\/]+)\/([^\/]*)/);
    if (p != undefined) {
        if (p[1] == 'v' || p[1] == 'playlist') {
            return 'vblogwebsub';
        } else if (p[1] == 'p') {
            return 'websub';
        }
    }

    // shishang
    if (window.location.href == 'http://eladies.sina.com.cn/z/quanminshishang/index.shtml') {
        return "eladies-596";
    }

    // finance-1597-focus
    if (window.location.href == 'http://finance.sina.com.cn/focus/Davos_Tianjin/index.shtml') {
        return "finance-1597-focus";
    }
    var p = window.location.href.match(/^http\:\/\/ent\.sina\.com\.cn\/bn\/entreport\/.*/);
    if (p != undefined) {
        return 'entreport';
    }  
    return "";
}

// utility function called by _dc_video_get_cookie()
function _dc_video_get_cookie_val(offset) {
    var endstr = document.cookie.indexOf(";", offset);
    if(endstr == -1) {
        endstr = document.cookie.length;
    }
    return unescape(document.cookie.substring(offset, endstr));
}

// primary function to retrieve cookie by name
function _dc_video_get_cookie(name) {
    var arg = name + "=";
    var alen = arg.length;
    var clen = document.cookie.length;
    var i = 0;
    while(i < clen) {
        var j = i + alen;
        if (document.cookie.substring(i, j) == arg) {
            return _dc_video_get_cookie_val(j);
        }
        i = document.cookie.indexOf(" ", i) + 1;
        if(i == 0) break;
    }
    return "";
}

// store cookie value with optional details as needed
function _dc_video_set_cookie(name, value, expires, path, domain, secure) {
    if (expires) {
        var L = new Date();
        var z = new Date(L.getTime()+ expires * 60000);
        expires = z.toGMTString();
    }
    document.cookie = name + "=" + escape(value) +
        ((expires) ? ";expires=" + expires : "") +
        ((path) ? ";path=" + path : ";path=/") +
        ((domain) ? ";domain=" + domain : "") +
        ((secure) ? ";secure" : "") + ";";
}

// remove the cookie by setting ancient expiration date
function _dc_video_delete_cookie(name, path, domain) {
    if(_dc_video_get_cookie(name)) {
        document.cookie = name + "=" +
            ((path) ? ";path=" + path : ";path=/") +
            ((domain) ? ";domain=" + domain : "") +
            ";expires=Thu, 01-Jan-70 00:00:01 GMT;";
    }
}

// get_user_id
function dc_video_get_user_id() {
    if (arguments.length >= 1) {
        if (arguments[0] == '1') {
            return _dc_video_get_rotation('all', 1);
            //var s = _dc_video_get_cookie('SUP');
            //if (s == "") {
            //    return "";
            //}
            //var p = s.match(/uid=([^&]+)/);
            //if (p != undefined) {
            //    return p[1];
            //}
            //return "";
        }
    }
    return _dc_video_get_cookie('ADVERTISER_ID');
}

// get_channel_id
function dc_video_get_channe_id() {
    var p = window.location.host.match(/([^\.]+)\.sina\.com\.cn/);
    if (p != undefined) {
        if (p[1] == 'yuntv') {
            return p[1];
        }
    }
    
    // ji jing
    var p = window.location.href.match(/http:\/\/sports\.sina\.com\.cn\/z\//);
    if (p != undefined) {
        return 'plvideo';
    }
    
    var p = window.location.href.match(/http:\/\/sports.sina.com.cn\/plvideo\//);
    if (p != undefined) {
        return 'plvideo';
    }
    
    // normal
    var r = "www";
    var p = window.location.host.match(/([^\.]+)\.sina\.com\.cn/);
    if (p != undefined) {
        r = p[1];
    }

    var p = window.location.pathname.match(/([^\/]+)\/([^\/]*)/);
    if (p != undefined) {
        if (p[1] != 'p') {
            return r + "_" + p[1];
        } else {
            return r + "_" + p[2];
        }
    }
    return "";
}

// get_topic_id
function dc_video_get_topic_id() {
    // for live
    var p = window.location.href.match(/http:\/\/huangjx\.2010\.sina\.com\.cn\/play\/([^\/]+)\//);
    if (p != undefined) {
        return p[1];
    }
    var p = window.location.href.match(/http:\/\/live\.video\.sina\.com\.cn\/play\/([^\/]+)\//);
    if (p != undefined) {
        return p[1];
    }

    // for baby jiangtang
    var p = window.location.href.match(/http:\/\/baby\.sina\.com\.cn\/tv\//);
    if (p != undefined) {
        return 'baby_jiangtang';
    }

    // for category
    p = window.location.href.match(/http:\/\/movie\.video\.sina\.com\.cn\/category\/([^\/]+)\//);
    if (p != undefined) {
        return p[1];
    }
    
    // for teleplay
    p = window.location.href.match(/http:\/\/movie\.video\.sina\.com\.cn\/teleplay\/([^\/]+)\//);
    if (p != undefined) {
        return p[1];
    }

    // for movie
    p = window.location.href.match(/http:\/\/movie\.video\.sina\.com\.cn\/movie\/([^\/]+)\//);
    if (p != undefined) {
        return p[1];
    }
    
    // for new
    p = window.location.href.match(/http:\/\/video\.sina\.com\.cn\/m\/([^\_\/]+)\_/);
    if (p != undefined) {
        return p[1];
    }


    //zhiyi1 add 20100926
    p = window.location.href.match(/http:\/\/video\.sina\.com\.cn\/movie\/detail\/([^\/]+)/);
    if (p != undefined) {
        return p[1];   
    } 


    
    // normal
    var metas = document.getElementsByTagName("meta");
    for (var i = 0; i < metas.length; i++) {
        if (metas[i].name == "topicName") {
            //return encodeURI(metas[i].content);
            return metas[i].content;
        }
    }
    return "";
}

var _dc_video_cur_rotation = {}; // rotation no

// get ratation no
function _dc_video_get_rotation(pos, is_get_cur) {
    if (!(pos)) {
        pos = 'all';
    }
    // corner, pause same as head
    if (pos == 'corner') {
        pos = 'head';
        is_get_cur = 1;
    }
    if (pos == 'pause') {
        pos = 'head';
        is_get_cur = 1;
    }

    if (pos == 'head2') {
        pos = 'head';
        is_get_cur = 1;
    }   
    if (pos == 'trail') {
        pos = 'head';
        is_get_cur = 1;
    }
    if (pos == 'dynamic_boder') {
       pos = 'head';
       is_get_cur = 1;
    }
    if (pos == 'head') {
        is_get_cur = 1;
    }
    
    if ((is_get_cur) && _dc_video_cur_rotation[pos] > 0) {
        return _dc_video_cur_rotation[pos];
    }
    var rotation_num = {};
    rotation_num[pos] = 4; // max rotation number
    
    var timeout = false;
    var c_name = 'DCVideoRat_' + pos + escape(dc_video_get_opsubject_id(pos));
    var rotation_id = parseInt(_dc_video_get_cookie(c_name));
    if (isNaN(rotation_id)) {
        rotation_id = 0;
    }
    if (rotation_id == 0) {
        rotation_id = Math.floor(Math.random() * 1000) % rotation_num[pos] + 1;
        _dc_video_set_cookie(c_name, rotation_id, timeout);
    } else {
        rotation_id = parseInt(rotation_id) + 1;
        if (rotation_id > 4) {
            rotation_id = 1;
        }
        _dc_video_set_cookie(c_name, rotation_id, timeout);
    }
    //get body rotation_id;
    var bodyRotation_id=document.getElementById('rotatorAD_id');
    if (bodyRotation_id
        && parseInt(bodyRotation_id.value)!=0) {
          rotation_id=parseInt(bodyRotation_id.value);
    }
    _dc_video_cur_rotation[pos] = rotation_id;
    return 'function' === typeof window.sinaadsGetSeed ? (window.sinaadsGetSeed() % 4 === 0 ? 4 : window.sinaadsGetSeed() % 4) : _dc_video_cur_rotation[pos];
}
function _get_current_url () {
 return location.href;
}
// set iask info
var dc_video_iask_info = {}; // iask_info
function dc_video_set_iask_info(vid, srctp, srcid, subid, cid) {
    if (vid != undefined) {
        dc_video_iask_info['vid'] = vid;
    } else {
        dc_video_iask_info['vid'] = '';
    }
    if (srctp != undefined) {
        dc_video_iask_info['srctp'] = srctp;
    } else {
        dc_video_iask_info['srctp'] = '';
    }
    if (srcid != undefined) {
        dc_video_iask_info['srcid'] = srcid;
    } else {
        dc_video_iask_info['srcid'] = '';
    }
    if (subid != undefined) {
        dc_video_iask_info['subid'] = subid;
    } else {
        dc_video_iask_info['subid'] = '';
    }
    if (cid != undefined) {
        dc_video_iask_info['cid'] = cid;
    } else {
        dc_video_iask_info['cid'] = '';
    }
}

/**
 * 获取需要进行服务端预览的广告位，并暴露在window.sinaadsServerPreviewSlots变量中
 * @author acelan(xiaobin8[at]staff.sina.com.cn)
 */
!(function (window, undefined) {

    "use strict";

    var cookie = {
        _isValidKey : function (key) {
            return (new RegExp("^[^\\x00-\\x20\\x7f\\(\\)<>@,;:\\\\\\\"\\[\\]\\?=\\{\\}\\/\\u0080-\\uffff]+\x24")).test(key);
        },
        _getRaw : function (key) {
            if (cookie._isValidKey(key)) {
                var reg = new RegExp("(^| )" + key + "=([^;]*)(;|\x24)"),
                    result = reg.exec(document.cookie);
                     
                if (result) {
                    return result[2] || null;
                }
            }
            return null;
        },
        _setRaw : function (key, value, options) {
            if (!cookie._isValidKey(key)) {
                return;
            }
             
            options = options || {};

            // 计算cookie过期时间
            var expires = options.expires;
            if ('number' === typeof options.expires) {
                expires = new Date();
                expires.setTime(expires.getTime() + options.expires);
            }
             
            document.cookie =
                key + "=" + value +
                (options.path ? "; path=" + options.path : "") +
                (expires ? "; expires=" + expires.toGMTString() : "") +
                (options.domain ? "; domain=" + options.domain : "") +
                (options.secure ? "; secure" : '');

        },
        get : function (key) {
            var value = cookie._getRaw(key);
            if ('string' === typeof value) {
                value = decodeURIComponent(value);
                return value;
            }
            return null;
        },
        set : function (key, value, options) {
            cookie._setRaw(key, encodeURIComponent(value), options);
        },
        remove : function (key, options) {
            options = options || {};
            options.expires = new Date(0);
            cookie._setRaw(key, '', options);
        }
    };

    function padNumber(source, length) {
        var pre = "",
            negative = (source < 0),
            string = String(Math.abs(source));
     
        if (string.length < length) {
            pre = (new Array(length - string.length + 1)).join('0');
        }
     
        return (negative ?  "-" : "") + pre + string;
    }

    function formatDate(source, pattern) {
        if ('string' !== typeof pattern) {
            return source.toString();
        }
     
        function replacer(patternPart, result) {
            pattern = pattern.replace(patternPart, result);
        }
         
        var pad     = padNumber,
            year    = source.getFullYear(),
            month   = source.getMonth() + 1,
            date2   = source.getDate(),
            hours   = source.getHours(),
            minutes = source.getMinutes(),
            seconds = source.getSeconds();
     
        replacer(/yyyy/g, pad(year, 4));
        replacer(/yy/g, pad(parseInt(year.toString().slice(2), 10), 2));
        replacer(/MM/g, pad(month, 2));
        replacer(/M/g, month);
        replacer(/dd/g, pad(date2, 2));
        replacer(/d/g, date2);
     
        replacer(/HH/g, pad(hours, 2));
        replacer(/H/g, hours);
        replacer(/hh/g, pad(hours % 12, 2));
        replacer(/h/g, hours % 12);
        replacer(/mm/g, pad(minutes, 2));
        replacer(/m/g, minutes);
        replacer(/ss/g, pad(seconds, 2));
        replacer(/s/g, seconds);
     
        return pattern;
    }

    function stringify(obj) {
        var str = [];
        for (var key in obj) {
            str.push('"' + key + '":"' + obj[key] + '"');
        }
        return '{' + str.join(',') + '}';
    }

    var top = (function () {
            var top;
            try {
                top = window.top.location.href;
            } catch (e) {}
            top = top || ((window.top === window.self) ?  window.location.href : window.document.referrer);
            return top;
        })(),
        _hash = (top.split('#')[1] || '').split('?')[0] || '',
        _query = (top.split('?')[1] || '').split('#')[0] || '',
        par = (_hash + '&' + _query)
            .replace(/</g, '')
            .replace(/>/g, '')
            .replace(/"/g, '')
            .replace(/'/g, '');

    //cookie.set('sinaads_ip', '111.111.111.111');

    var sinaadsServerPreviewSlots = (function () {
        var query = par.split('&'),
            slots = {},
            key = 'sinaads_server_preview', //必需有的key
            q,
            i = 0,
            len = 0,
            date = formatDate(new Date(), 'yyyyMMddHH'),
            ip = '',
            deliveryId = '',
            pdps = '';

        for (i = 0, len = query.length; i < len; i++) {
            if ((q = query[i])) {
                q = q.split('=');

                if (q[0] === key && q[1]) {
                    q = decodeURIComponent(q[1]).split('|');

                    pdps = q[0] || pdps;
                    date = q[1] || date;
                    ip = q[2] || ip;
                    deliveryId = q[3] || deliveryId;

                    if (pdps) {
                        slots[pdps] = [];
                        date && slots[pdps].push(encodeURIComponent(date));
                        ip && slots[pdps].push('tgip=' + encodeURIComponent(ip));
                        deliveryId && slots[pdps].push('deid=' + encodeURIComponent(deliveryId));
                        slots[pdps] = slots[pdps].join('&');
                    }
                }
            }
        }
        return slots;
    })();


    window.getSinaadsServerPreviewSlots = function () {
        return stringify(sinaadsServerPreviewSlots);
    };

})(window);

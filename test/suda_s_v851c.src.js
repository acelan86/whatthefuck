/**
 * Sina Analytics Gather
 * 新浪数据采集客户端
 */
(function(){
var suda_version='V=2.1.12';
var win = window, doc = document, nav = navigator,
	ua = nav.userAgent, scr = win.screen, loc = win.location.href;
var prtl = 'https:'==win.location.protocol ? 'https://s': 'http://',
	domain = 'beacon.sina.com.cn';
var a_gif = prtl + domain + '/a.gif?', g_gif = prtl + domain + '/g.gif?',
	f_gif = prtl + domain + '/f.gif?', e_gif = prtl + domain + '/e.gif?',
	i_gif = prtl + 'beacon.sinauda.com' + '/i.gif?';
// 页面的 referrer
var sudaRef = doc.referrer.toLowerCase();
// 用到的 cookie 名
var cookie_SINAGLOBAL = "SINAGLOBAL",
	cookie_For_Flash="FSINAGLOBAL",
	cookie_Apache = "Apache",
	cookie_ULV = "ULV",
	cookie_SUP = "SUP",
	cookie_UOR = "UOR",
	cookie__s_acc = "_s_acc",
	cookie__s_tentry = "_s_tentry",
	restorefromls=false,
	restorefrometag=false,
	isdomain=(document.domain=="sina.com.cn")?true:false;
var count = 0;
var inFrame = false, isMetaFresh = false;
// 登录用户信息
var loginUserInfo = "";
// 记录日常统计及性能统计的配置默认值
var commonType = 16777215, performance = 0, filter, interval = 0;
// 记录默认统计的参数，以便后续调用
var sudaPageid = "", sudaExt1 = "", sudaExt2 = "";
// 记录 gatherMore/acTrack/uaTrack的参数，以便后续调用
var sudaInfo = [], acTrackInfo = [], uaTrackInfo = [];
var sudaGlobalCount = 0;
var fsudaGlobalCount = 0;

//读取用户flashid
var local_unique = '';
var ls_loaded = false;
var etag_loaded = false;

function createFlashIFrame(){
	var iframe=document.createElement('iframe');
	iframe.src=prtl + domain + '/data.html?'+new Date().getTime();
	iframe.id='sudaDataFrame';
	iframe.style.height='0px';
	iframe.style.width='1px';
	iframe.style.overflow='hidden';
	iframe.frameborder='0';
	iframe.scrolling='no';
	document.getElementsByTagName("head")[0].appendChild(iframe);
	//document.body.appendChild(iframe);
}
//控制cookie白名单ifrmae
function createCkctlFrame(){
	var iframe=document.createElement('iframe');
	// iframe.src='http://test.sina.com.cn/suda/ckctl.html';
	iframe.src=prtl + domain + '/ckctl.html';
	iframe.id='ckctlFrame';
	iframe.style.height='0px';
	iframe.style.width='1px';
	iframe.style.overflow='hidden';
	iframe.frameborder='0';
	iframe.scrolling='no';
	document.getElementsByTagName("head")[0].appendChild(iframe);
	//document.body.appendChild(iframe);
}
function createEtagTag(){		
	var spt=document.createElement('script');
	spt.src=prtl + domain + '/h.js';
	document.getElementsByTagName("head")[0].appendChild(spt);	
}
// 取得 Meta
function getMeta(metaName, pidx) {
	var pMeta = doc.getElementsByName(metaName);
	var idx = (pidx > 0) ? pidx : 0;
	return (pMeta.length > idx) ? pMeta[idx].content : "";
}

// 取得所有sudameta
// 2014-05-07
//扩展获取普通meta中的内容分类标签
function getSudaMeta(){
	var pMeta = doc.getElementsByName('sudameta');
	var meta = [];
	for(var idx =0; idx<pMeta.length; idx++){
		var content = pMeta[idx].content;
		if(content){
			//匹配key1:val1; key2:val2这种情况
			if(content.indexOf(';')!=-1){
				var temps = content.split(';');
				for(var i=0;i<temps.length;i++){
					var temp = trim(temps[i]);
					if(!temp)continue;
					meta.push(temp);
				}
			}else{
				meta.push(content);
			}
		}
	}
	// 扩展获取普通meta中的内容分类标签	
	var nMeta= doc.getElementsByTagName('meta');
	for (var idx=0,len=nMeta.length;idx<len;idx++){
		var mnode=nMeta[idx];
		if(mnode.name=="tags"){		
			meta.push("content_tags:"+encodeURI(mnode.content));
		}		
	}
	
	return meta;
}

// 从字符串 src 中查找 k+sp 和  e 之间的字符串，如果 k==e 且 k 只有一个，或者 e 不存在，从 k+sp 截取到字符串结束
function stringSplice(src, k, e, sp) {
	if (src == "") { return ""; }
	sp = (sp == "") ? "=" : sp;
	k += sp;
	var ps = src.indexOf(k);
	if (ps < 0) {
		return "";
	}
	ps += k.length;
	var pe = src.indexOf(e, ps);
	if (pe < ps) {
		pe = src.length;
	}
	return src.substring(ps, pe);
}
// 读 Cookie
function getCookie (ckName) {
	if (undefined == ckName || "" == ckName) {
		return "";
	}
	return stringSplice(doc.cookie, ckName, ";", "");
}
// 写 Cookie
function setCookie (ckName, ckValue, ckDays, ckDomain) {
	if (ckValue != null) {
		if ((undefined == ckDomain) || (null == ckDomain)) {
			ckDomain = 'sina.com.cn';
		}
		if ((undefined == ckDays) || (null == ckDays) || ('' == ckDays)) {
			doc.cookie = ckName + "=" + ckValue + ";domain=" + ckDomain + ";path=/";
		} else {
			var now = new Date();
			var time = now.getTime();
			time = time + 86400000 * ckDays;
			now.setTime(time);
			time = now.getTime();
			doc.cookie = ckName + "=" + ckValue + ";domain=" + ckDomain + ";expires=" + now.toUTCString() + ";path=/";
		}
	}
}
/*
function support_ls(){
	return  !(window.attachEvent && !window.opera);
}*/
//读取localStorage
function get_suda_ls(name){
	try{		
		var ls=document.getElementById('sudaDataFrame').contentWindow.storage;
		return ls.get(name);		
	}catch (e){
		//debug@		util.log(e);
		return false;
	};
}
//设置localStorage
function set_suda_ls(name,value){
	try{		
		var ls=document.getElementById('sudaDataFrame').contentWindow.storage;
		ls.set(name,value);
		return true;
	}catch (e){
		return false;
	}
}

function get_uid_from_localstorage(){
	//使用localstorage缓存uid
	var vlen=15;
	var etag=window.SUDA.etag;
	//判断本域可操作
	if(!isdomain){return '-';}
	//debug@	util.log('isdomain:'+isdomain);
	if(sudaGlobalCount==0){		
		createFlashIFrame();//插入localstorage的iframe
		createEtagTag();//插入Etag的script
	}	
	if(etag && etag!=undefined){//etag是否读到
		etag_loaded=true;
	}
	//读取iframe中对象
	ls_gid=get_suda_ls(cookie_SINAGLOBAL);
	//debug@	util.log('ls_gid:'+ls_gid);
	//debug@	util.log('etag:'+etag);
	if(ls_gid===false || etag_loaded==false){
		//debug@		util.log('didnt get LS or etag');
		//debug@		util.log('didnt get LS or etag'+(ls_gid===false)+(etag_loaded==false));
		return false;//增强代码未加载完返回false
	}else{
		//debug@		util.log('LS or Etag cache ready');
		ls_loaded=true;			
	}	
	//localStorage内容可用时
	if(ls_gid && ls_gid.length>vlen){
		setCookie(cookie_SINAGLOBAL, ls_gid, 3650);				
		restorefromls=true;
		//debug@		util.log('LS => cookie:'+ls_gid);
		return ls_gid;
	}
	else{//localStorage内容也不可用	
		if(etag && etag.length>vlen){
			//debug@    util.log('Etag => cookie:'+etag);
			setCookie(cookie_SINAGLOBAL, etag, 3650);			
			restorefrometag=true;			
		}
		var tmp=0,looptime=500;
		var e = setInterval(
			//延时补种localstorage
			(function () {
				var ck_gid = getCookie(cookie_SINAGLOBAL);				
				if(etag_loaded){
					//debug@					util.log('etag=>cookie');
					ck_gid=etag;
				}
				//debug@				util.log('etag=>cookie'+ck_gid);
				tmp += 1;			
				if(tmp>3){
					clearInterval(e);
				}
				if (ck_gid.length>vlen) {
					clearInterval(e);
					set_suda_ls(cookie_SINAGLOBAL, ck_gid);					
				}
			}), looptime);				
		return etag_loaded?etag:getCookie(cookie_SINAGLOBAL);
	}
}
// 事件绑定
function addEvent(sNode, sEventType, oFunc) {
	var oElement = sNode;
	if (oElement == null) {
		return false;
	}
	sEventType = sEventType || 'click';
	if ((typeof oFunc).toLowerCase() != "function") {
		return;
	}
	if (oElement.attachEvent) {
		oElement.attachEvent('on' + sEventType, oFunc);
	}
	else if (oElement.addEventListener) {
		oElement.addEventListener(sEventType, oFunc, false);
	}
	else {
		oElement['on' + sEventType] = oFunc;
	}
	return true;
}
function getEvent(){
	if (window.event != null) {
		return window.event;
	} else {
		if (window.event){
			return window.event;
		}
		var o = arguments.callee.caller;
		var e;
		var n = 0;
		while (o != null && n < 40) {
			e = o.arguments[0];
			if (e && (e.constructor == Event || e.constructor == MouseEvent || e.constructor == KeyboardEvent)) {
				return e;
			}
			n++;
			o = o.caller;
		}
		return e;
	}
}
function fixEvent(e){
	e = e || getEvent();
	if (!e.target) {
		e.target = e.srcElement;
		e.pageX = e.x;
		e.pageY = e.y;
	}
	if (typeof e.layerX == 'undefined') 
		e.layerX = e.offsetX;
	if (typeof e.layerY == 'undefined') 
		e.layerY = e.offsetY;
	return e;
}
function trim(str){
	if(typeof str !== 'string'){
		throw 'trim need a string as parameter';
	}
	var len = str.length;
	var s = 0;
	var reg = /(\u3000|\s|\t|\u00A0)/;
	
	while(s < len){
		if(!reg.test(str.charAt(s))){
			break;
		}
		s += 1;
	}
	while(len > s){
		if(!reg.test(str.charAt(len - 1))){
			break;
		}
		len -= 1;
	}
	return str.slice(s, len);
}
function isArray(o){
	return Object.prototype.toString.call(o) === '[object Array]';
}
function queryToJson(QS, isDecode){
	var _Qlist = trim(QS).split("&");
	var _json  = {};
	var _fData = function(data){
		if(isDecode){
			try{
				return decodeURIComponent(data);
			}catch (e){
				return data;
			}
		}else{
			return data;
		}
	};
	for(var i = 0, len = _Qlist.length; i < len; i++){
		if(_Qlist[i]){
			var _hsh = _Qlist[i].split("=");
			var _key = _hsh[0];
			var _value = _hsh[1];
			
			// 如果只有key没有value, 那么将全部丢入一个$nullName数组中
			if(_hsh.length < 2){
				_value = _key;
				_key = '$nullName';
			}
			// 如果缓存堆栈中没有这个数据
			if(!_json[_key]) {
				_json[_key] = _fData(_value);
			}
			// 如果堆栈中已经存在这个数据，则转换成数组存储
			else {
				if(isArray(_json[_key]) != true) {
					_json[_key] = [_json[_key]];
				}
				_json[_key].push(_fData(_value));
			}
		}
	}
	return _json;
}
function foreach(arr, func){
	for(var i = 0, len = arr.length; i < len; i ++){
		func(arr[i], i);
	}
}
// 取得域名
function getHost(sUrl) {
	var r = new RegExp('^http(?:s)?\://([^/]+)', 'im');
	if (sUrl.match(r)) {
		return sUrl.match(r)[1].toString();
	} else {
		return "";
	}
}
//sso 内容解码 内部有嵌入函数
function ssoDecode(inputString) {
try{	

	var sso_keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
	var sso_keys_urlsafe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';
	
	var arr2utf8 = function (arr) {
		var out = "", i = 0;
		for(; i < arr.length; i++) {
			out += "%"+byte2Hex(arr[i]);
		}
		return decodeURIComponent(out);
	};
	var byte2Hex = function (b) {
		var str = "0" + b.toString(16);
		return str.length <= 2?str:str.substr(1);
	};
	
	var sso_encoder_b64_decode= function(input, keys_type, returntype ){
		if (typeof(input) == 'string' ) {
			input = input.split('');
		}
		var indexOf = function (arr, obj) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] == obj) {
					return i;
				}
			}
			return -1;
		}
		var arr_code = [];
		var chr1, chr2, chr3 = '';
		var enc1, enc2, enc3, enc4 = '';
		if (input.length%4 != 0){
			//return returntype=="array"?[]:''; // 由于原来的PHP端的base64有点瑕疵，这里不做长度判断
		}
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		var keys = sso_keys.split('');
		if (keys_type == "urlsafe") {
			base64test = /[^A-Za-z0-9\-_\=]/g;
			keys = sso_keys_urlsafe.split('');
		}
		var i = 0;
		if (keys_type == "binnary") {
			keys = [];
			for (i = 0; i <= 64; i++) {
				keys[i] = i+128;
			}
		}
		if (keys_type != "binnary" && base64test.exec(input.join(''))){
			return returntype=="array"?[]:'';
		}
		i = 0;
		do {
			enc1 = indexOf(keys, input[i++]);
			enc2 = indexOf(keys, input[i++]);
			enc3 = indexOf(keys, input[i++]);
			enc4 = indexOf(keys, input[i++]);

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;
			arr_code.push(chr1);
			if (enc3 != 64 && enc3 != -1){
				arr_code.push(chr2);
			}
			if (enc4 != 64 && enc4 != -1){
				arr_code.push(chr3);
			}
			chr1 = chr2 = chr3 = '';
			enc1 = enc2 = enc3 = enc4 = '';
		} while (i < input.length);
		if (returntype == "array") {
			return arr_code;
		}
		var str = '', j = 0;
		for(; j < arr_code.lenth; j++ ) {
			str += String.fromCharCode(arr_code[j]);
		}
		return str;
	};
	
	var arr_code = [];
	var version = inputString.substr(0,3);
	var body = inputString.substr(3);
	
	switch (version) {		
		case "v01":
			for(var i = 0; i < body.length; i+= 2) {
				arr_code.push(parseInt(body.substr(i,2), 16));
			}
			return decodeURIComponent(arr2utf8(sso_encoder_b64_decode(arr_code, "binnary", "array")));
			break;
		case "v02":
			arr_code = sso_encoder_b64_decode(body, "urlsafe", "array");
			return arr2utf8(sso_encoder_b64_decode(arr_code, "binnary", "array"));
			break;
		default:
			return decodeURIComponent(inputString);
	}
}catch (e){return '';}
}
/* 新浪子域名提取，不再扔掉 sina.com.cn
// 取得所属sina的子域名，如果不在sina下，就返回完整的
function getDomain(sHost) {
	var p = sHost.indexOf('.sina.');
	if (p > 0) {
		return sHost.substr(0, p);
	} else {
		return sHost;
	}
}
*/
var CI = {
	// 取得屏幕尺寸
	screenSize : function (){
		return (commonType & 8388608 == 8388608) ? scr.width + "x" + scr.height : "";
	},
	// 取得屏幕色深
	colorDepth : function (){
		return (commonType & 4194304 == 4194304) ? scr.colorDepth : "";
	},
	// 取得 appCode
	appCode : function (){
		return (commonType & 2097152 == 2097152) ? nav.appCodeName : "";
	},
	// 取得 appName
	appName : function (){
		return (commonType & 1048576 == 1048576)
						? ((nav.appName.indexOf('Microsoft Internet Explorer') > -1) ? 'MSIE' : nav.appName)
						: "";
	},
	// 取得 cpu
	cpu : function (){
		return (commonType & 524288 == 524288) ? (nav.cpuClass || nav.oscpu) : "";
	},
	// 取得 platform
	platform : function (){
		return (commonType & 262144 == 262144) ? (nav.platform) : "";
	},
	// 取得 JS 版本号
	jsVer : function () {
		if(commonType & 131072 != 131072){return "";}
		// TODO 这是旧 SUDA 的方法，等待重写
		var p,
		appsign,
		appver,
		jsver = 1.0,
		isN6 = 0,
		navigatorAppName = (nav.appName.indexOf('Microsoft Internet Explorer') > -1) ? 'MSIE' : nav.appName,
		navigatorAppVersion = nav.appVersion;
		if ('MSIE' == navigatorAppName) {
			appsign = 'MSIE';
			p = navigatorAppVersion.indexOf(appsign);
			if (p >= 0) {
				appver = window.parseInt(navigatorAppVersion.substring(p + 5));
				if (3 <= appver) {
					jsver = 1.1;
					if (4 <= appver) {
						jsver = 1.3;
					}
				}
			}
		} else if (("Netscape" == navigatorAppName) || ("Opera" == navigatorAppName) || ("Mozilla" == navigatorAppName)) {
			jsver = 1.3;
			appsign = 'Netscape6';
			p = navigatorAppVersion.indexOf(appsign);
			if (p >= 0) {
				jsver = 1.5;
			}
		}
		return jsver;
	},
	// 取得网络连接类型
	network : function () {
		if(commonType & 65536 != 65536){return "";}
		var ct = "";
		// android 2.2 webkit 新 API
		ct = (nav.connection && nav.connection.type) ? nav.connection.type : ct;
		try {
			doc.body.addBehavior("#default#clientCaps");
			ct = doc.body.connectionType;
		} catch(e) {
			ct = "unkown";
		}
		return ct;
	},
	// 取得系统语言
	language : function () {
		return (commonType & 32768 == 32768) ? (nav.systemLanguage || nav.language) : "";
	},
	// 取得时区
	timezone : function () {
		return (commonType & 16384 == 16384) ? (new Date().getTimezoneOffset() / 60) : "";
	},
	// 取得 Flash 版本
	flashVer : function () {
		if(commonType & 8192 != 8192){return "";}
		var pl = nav.plugins,
			flash, item, desc;
		// 如果 navigator.plugins 里有插件信息
		if(pl && pl.length){
			for(var key in pl){
				item = pl[key];
				if(item.description == null){ continue; }
				if(flash != null){ break; }
				desc = item.description.toLowerCase();
				if(desc.indexOf("flash") != -1){
					flash = item.version ? parseInt(item.version) : desc.match(/\d+/); 
					continue;
				}
			}
		} else if (window.ActiveXObject) {
			for (var i = 10; i >= 2; i--) {
				try {
					var object = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
					if (object) {
						flash = i;
						break;
					}
				} catch(e) {}
			}
		} else if (ua.indexOf("webtv/2.5") != -1) {
			flash = 3;
		} else if (ua.indexOf("webtv") != -1) {
			flash = 2;
		}
		// TODO 检查 JAVA 和 Flash 支持情况
		return flash;
	},
	// 取得是否支持 Java
	javaEnabled : function () {
		if(commonType & 4096 != 4096){return "";}
		var pl = nav.plugins,
			java = nav.javaEnabled(), item, desc;
		if(java == true){
			return 1;
		}
		// 如果 navigator.plugins 里有插件信息
		if(pl && pl.length){
			for(var key in pl){
				item = pl[key];
				if(item.description == null){ continue; }
				if(java != null){ break; }
				desc = item.description.toLowerCase();
				if(desc.indexOf("java plug-in") != -1){
					java = parseInt(item.version);
					continue;
				}
			}
		} else if (window.ActiveXObject) {
			java = (new ActiveXObject("JavaWebStart.IsInstalled") != null);
		}
		// TODO 检查 JAVA 和 Flash 支持情况
		return java ? 1 : 0;
	}
};

var PI = {
	// 获取 page ID，从 META (name="publishid")中获取
	pageId : function (pageid) {
		var pid = pageid || sudaPageid,
			defaultPageID = "-9999-0-0-1";
		if ((undefined == pid) || ("" == pid)) {
			try {
				var metaTxt = getMeta("publishid");
				if ("" != metaTxt) {
					var pbidList = metaTxt.split(",");
					if (pbidList.length > 0) {
						if (pbidList.length >= 3) {
							defaultPageID = "-9999-0-" + pbidList[1] + "-" + pbidList[2];
						}
						pid = pbidList[0];
					}
				} else {
					pid = "0";
				}
			} catch(e) {
				pid = "0";
			}
			pid = pid + defaultPageID;
		}
		return pid;
	},
	// 获取会话活动页面数，从 cookie _s_upa 中获取，这事一个 session 级 cookie，每次访问自动加 1
	// 从商业推广过来的(URL 含有 spr_???)，此数字自动加 10000
	sessionCount : function () {
		var count = getCookie("_s_upa");
		if (count == "") {
			count = 0;
		}
		return count;
	},
	// 获取 SUDA 统计执行次数
	excuteCount : function () {
		return SUDA.sudaCount;
	},
	// 获取页面 document.referer
	referrer : function () {
		if(commonType & 2048 != 2048){return "";}
		var re = /^[^\?&#]*.swf([\?#])?/;
		// 如果页面 Referer 为空，从 URL 中获取
		if ((sudaRef == "") || (sudaRef.match(re))) {
			var ref = stringSplice(loc, "ref", "&", "");
			if (ref != "") {
				return escape(ref);
			}
		}
		return escape(sudaRef);
	},
	// 获取当前页是否为浏览器默认首页
	isHomepage : function () {
		if(commonType & 1024 != 1024){return "";}
		var isHome = "";
		try {
			doc.body.addBehavior("#default#homePage");
			isHome = doc.body.isHomePage(loc) ? "Y": "N";
		} catch(e) {
			isHome = "unkown";
		}
		return isHome;
	},
	// 获取广告模板号，从 META (name="stencil") 中获取
	PGLS : function () {
		return (commonType & 512 == 512) ? getMeta("stencil") : "";
	},
	// 获取专题号，从 META (name="subjectid") 中获取
	ZT : function () {
		if(commonType & 256 != 256){return "";}
		var zt = getMeta('subjectid');
		zt.replace(",", ".");
		zt.replace(";", ",");
		return escape(zt);
	},
	// 获取媒体来源，从 META (name="mediaid") 中获取
	mediaType : function () {
		return (commonType & 128 == 128) ? getMeta("mediaid") : "";
	},
	// 获取页面 DOM 数
	domCount : function () {
		return (commonType & 64 == 64) ? doc.getElementsByTagName("*").length : "";
	},
	// 获取页面 iframe 数
	iframeCount : function () {
		return (commonType & 32 == 32) ? doc.getElementsByTagName("iframe").length : "";
	}
};
var UI = {
	// 获取 cookie SINAGLOBAL 中保存的信息
	visitorId : function () {
		var vlen=15;
		var gid = getCookie(cookie_SINAGLOBAL);			
		if(gid.length>vlen && sudaGlobalCount==0){
			//直接取cookie
			return gid;				
		}
		else{//cookie uid不存在或不合法
			return
		}		
	},
	// 获取  flash 中保存的信息
	fvisitorId : function (fid) {
		if(!fid){
			var fid = getCookie(cookie_For_Flash);
			return fid;
		}else{
			setCookie(cookie_For_Flash, fid, 3650);	//保存3650天
		}
	},
	// 获取页面 cookie Apache，如果不存在就赋一个随机数
	sessionId : function () {
		var sid = getCookie(cookie_Apache);
		if ("" == sid) {
			// sendFinalRequest(d_gif);
			var now = new Date();
			sid = Math.random() * 10000000000000 + "." + now.getTime();
			// setCookie(cookie_Apache, sid);
		}
		return sid;
	},
	//获取 flash cookie
	flashCookie: function(gid){
		if(gid){
			//flashData.write("local_unique",gid,24*360);	//保存3650天
		}else{
			return local_unique;
		}
	},
	// 获取页面 last Visit
    //本次时间戳:总次数:当前月:当前周:sessionid:上一次时间戳
	lastVisit : function () {
		var sid = getCookie(cookie_Apache);
		var lvi = getCookie(cookie_ULV);
		var lva = lvi.split(":");
		var lvr = "", lvn;
		// 如果 cookie ULV 正常
		if (lva.length >= 6) {
			if (sid != lva[4]) {
				lvn = new Date();
				var lvd = new Date(window.parseInt(lva[0]));
				lva[1] = window.parseInt(lva[1]) + 1;
				// 月份变了重置月总次数
				if (lvn.getMonth() != lvd.getMonth()) {
					lva[2] = 1;
				} else {
					lva[2] = window.parseInt(lva[2]) + 1;
				}
				// 超过一周，重置周总次数
				if (((lvn.getTime() - lvd.getTime()) / 86400000) >= 7) {
					lva[3] = 1;
				} else {
					if (lvn.getDay() < lvd.getDay()) {
						lva[3] = 1;
					} else {
						lva[3] = window.parseInt(lva[3]) + 1;
					}
				}
				lvr = lva[0] + ":" + lva[1] + ":" + lva[2] + ":" + lva[3];
				lva[5] = lva[0];
				lva[0] = lvn.getTime();
				setCookie(cookie_ULV, lva[0] + ":" + lva[1] + ":" + lva[2] + ":" + lva[3] + ":" + sid + ":" + lva[5], 360);
			} else {
				lvr = lva[5] + ":" + lva[1] + ":" + lva[2] + ":" + lva[3];
			}
		} else {
			lvn = new Date();
			lvr = ":1:1:1";
			setCookie(cookie_ULV, lvn.getTime() + lvr + ":" + sid + ":", 360);
		}
		return lvr;
	},
	// 获取页面用户信息
	userNick : function () {
		if (loginUserInfo != "") {
			return loginUserInfo;
		}
		var sup = unescape(getCookie(cookie_SUP));
		if (sup != "") {
			var ag = stringSplice(sup, "ag", "&", "");
			var user = stringSplice(sup, "user", "&", "");
			var uid = stringSplice(sup, "uid", "&", "");
			var sex = stringSplice(sup, "sex", "&", "");
			var bday = stringSplice(sup, "dob", "&", "");
			loginUserInfo = ag + ":" + user + ":" + uid + ":" + sex + ":" + bday;
			return loginUserInfo;
		} else {
			return "";
		}
	},
	// 
	userOrigin : function () {
		if(commonType & 4 != 4){return "";}
		var uoc = getCookie(cookie_UOR);
		var upa = uoc.split(":");
		if (upa.length >= 2) {
			return upa[0];
		} else {
			return "";
		}
	},
	// 
	advCount : function () {
		return (commonType & 2 == 2) ? getCookie(cookie__s_acc) : "";
	},
	// 设置 cookie UOR
	setUOR: function() {
		var uoc = getCookie(cookie_UOR),
		uor = "",
		uol = "",
		up_t = "",
		up = "",
		currLoc = loc.toLowerCase(),
		ref = doc.referrer.toLowerCase();
		var re = /[&|?]c=spr(_[A-Za-z0-9]{1,}){3,}/;
		var ct = new Date();
		if (currLoc.match(re)) {
			up_t = currLoc.match(re)[0];
		} else {
			if (ref.match(re)) {
				up_t = ref.match(re)[0];
			}
		}
		if (up_t != "") {
			up_t = up_t.substr(3) + ":" + ct.getTime();
		}
		if (uoc == "") {
			if (getCookie(cookie_ULV) == "") {
				uor = getHost(ref);
				uol = getHost(currLoc);
			}
			setCookie(cookie_UOR, uor + "," + uol + "," + up_t, 365);
		} else {
			var ucg = 0,
			uoa = uoc.split(",");
			if (uoa.length >= 1) {
				uor = uoa[0];
			}
			if (uoa.length >= 2) {
				uol = uoa[1];
			}
			if (uoa.length >= 3) {
				up = uoa[2];
			}
			if (up_t != "") {
				ucg = 1;
			} else {
				var upa = up.split(":");
				if (upa.length >= 2) {
					var upd = new Date(window.parseInt(upa[1]));
					if (upd.getTime() < (ct.getTime() - 86400000 * 30)) {
						ucg = 1;
					}
				}
			}
			if (ucg) {
				setCookie(cookie_UOR, uor + "," + uol + "," + up_t, 365);
			}
		}
	},
	setAEC : function(eid) {
		if ("" == eid) {
			return;
		}
		var acc = getCookie(cookie__s_acc);
		if (acc.indexOf(eid + ",") < 0) {
			acc = acc + eid + ",";
		}
		setCookie(cookie__s_acc, acc, 7);
	},
	//获取sso_info
	ssoInfo : function () {
		var info = unescape(ssoDecode(getCookie('sso_info')));		
		if (info != "") {
			if(info.indexOf('uid=')!=-1){
				var uid = stringSplice(info, "uid", "&", "");
				return escape('uid:'+uid);
			}else{
				var uname= stringSplice(info, "u", "&", "");
				return escape('u:'+unescape(uname));
			}
		} else {
			return "";
		}
	},
    //获取通行证SUBP cookie
    subp : function(){
        return getCookie('SUBP');
    }
};

// 统计信息
var D = {
	// -- 日常统计信息开始 --
	'CI' : function () {
		var data = [
			'sz:' + CI.screenSize(),
			'dp:' + CI.colorDepth(),
			'ac:' + CI.appCode(),
			'an:' + CI.appName(),
			'cpu:' + CI.cpu(),
			'pf:' + CI.platform(),
			'jv:' + CI.jsVer(),
			'ct:' + CI.network(),
			'lg:' + CI.language(),
			'tz:' + CI.timezone(),
			'fv:' + CI.flashVer(),
			'ja:' + CI.javaEnabled()
			];
		return 'CI=' + data.join("|");
	},
	'PI' : function (pid) {
		var data = [
			'pid:' + PI.pageId(pid),
			'st:' + PI.sessionCount(),
			'et:' + PI.excuteCount(),
			'ref:' + PI.referrer(),
			'hp:' + PI.isHomepage(),
			'PGLS:' + PI.PGLS(),
			'ZT:' + PI.ZT(),
			'MT:' + PI.mediaType(),
			'keys:',
			'dom:' + PI.domCount(),
			'ifr:' + PI.iframeCount()
			];
		return 'PI=' + data.join("|");
	},
	'UI' : function () {
		var data = [
			'vid:' + UI.visitorId(),
			'sid:' + UI.sessionId(),
			'lv:' + UI.lastVisit(),
			'un:' + UI.userNick(),
			'uo:' + UI.userOrigin(),
			'ae:' + UI.advCount(),
			'lu:' + UI.fvisitorId(),
			'si:' + UI.ssoInfo(),
			'rs:' + (restorefromls?1:0),
			'dm:' + (isdomain?1:0),
            'su:' + UI.subp()
			];
		return 'UI=' + data.join("|");
	},
	'EX' : function (extInfo1, extInfo2) {
		if(commonType & 1 != 1){return "";}
		extInfo1 = (null != extInfo1) ? extInfo1 || "" : sudaExt1;
		extInfo2 = (null != extInfo2) ? extInfo2 || "" : sudaExt2;
		return "EX=ex1:" + extInfo1 + "|ex2:" + extInfo2;
	},
	'MT' : function(){
		return 'MT=' + getSudaMeta().join('|');
	},
	// -- 日常统计信息结束 --
	// 版本号
	'V' : function () {
		return suda_version;
	},
	// 随机数
	'R' : function () {
		return 'gUid_' + new Date().getTime();
	}
};
// 微博定制功能，植入 cookie
function setEntry() {
	var e = "-",
		ref = doc.referrer.toLowerCase(),
		currLoc = loc.toLowerCase();
	if ("" == getCookie(cookie__s_tentry)) {
		if ("" != ref) {
			e = getHost(ref);
		}
		setCookie(cookie__s_tentry, e, "", "weibo.com");
	}
	var vlogin = /weibo.com\/reg.php/;
	if (currLoc.match(vlogin)) {
		var sharehost = stringSplice(unescape(currLoc), "sharehost", "&", "");
		var appkey = stringSplice(unescape(currLoc), "appkey", "&", ""); // 注册来源的APPKEY
		if ("" != sharehost) {
			setCookie(cookie__s_tentry, sharehost, "", "weibo.com");
		}
		setCookie("appkey", appkey, "", "weibo.com");
	}
}
// 发送最终请求
function sendFinalRequest (url, opts) {
	// 拼数据
	createRequest(url, opts);
}
// 发送请求
function createRequest (url, opts) {
	opts = opts || {};
	var img = new Image(), timer;
	if(opts && opts.callback && typeof opts.callback == 'function'){
		img.onload = function(){
			clearTimeout(timer);
			timer = null;
			opts.callback(true);
		}
	}
	SUDA.img = img;
	img.src = url;
	timer = setTimeout(function(){
		if(opts && opts.callback && typeof opts.callback == 'function'){
			opts.callback(false);
			img.onload = null;
		}
	}, opts.timeout || 2000);
}

// 采集日常统计数据 页面流量数据
function gatherCommon (pid, ext1, ext2){
	SUDA.sudaCount ++;
	//如果未加载完localstorage则延时
	if(!UI.visitorId() && !get_uid_from_localstorage()){
		if(sudaGlobalCount < 3){			
			sudaGlobalCount ++;						
			setTimeout(gatherCommon, 500);			
			return;
		}
		//超时		
	}
	var url = a_gif + [D.V(), D.CI(), D.PI(pid), D.UI(), D.MT(), D.EX(ext1, ext2), D.R()].join("&");
	createRequest(url);
	//第三方cookie sudauda.com URL
	// var i_url=i_gif+D.R();
	// createRequest(i_url);
	//缔元信汽车频道cookie Mapping
	if(window.location.host.search('auto.sina.com.cn')>=0){
		wrating_url="http://m.wrating.com/m.gif?a=&c=860010-2370010112&mcookie="+UI.visitorId()+"&"+D.R()+"=";
		createRequest(wrating_url);
	}
}

//自动调用
function gatherCommon2 (pid, ext1, ext2){
	if (inFrame || isMetaFresh) {
		return;
	}
	if (SUDA.sudaCount != 0)
	{
		return;
	}	
	gatherCommon(pid, ext1, ext2);
}

// 行为统计 acTrack
function acTrack (eid, p) {
	if (("" == eid) || (undefined == eid)) {
		return;
	}
	UI.setAEC(eid);
	if (0 == p) {
		return;
	}
	var s = "AcTrack||" + getCookie(cookie_SINAGLOBAL) + "||" + getCookie(cookie_Apache) + "||" + UI.userNick() + "||" + eid + "||";
	var url = e_gif + s + "&gUid_" + new Date().getTime();
	sendFinalRequest(url);
}
// 行为统计 uaTrack
function uaTrack (acode, aext, href,opts) {
	opts = opts || {};
	if(!href){
		href='';
	}else{
		href=escape(href);
	};
	var s = "UATrack||" + getCookie(cookie_SINAGLOBAL) + "||" + getCookie(cookie_Apache) + "||" + UI.userNick() + "||" + acode + "||" + aext + "||" + PI.referrer() + "||" + href + "||" + (opts.realUrl||"") + "||" + (opts.ext||"");
	var url = e_gif+ s + "&gUid_" + new Date().getTime();
	sendFinalRequest(url,opts);
}
// SUDA 行为统计代理
function trackAgent(e){
	var evt = fixEvent(e);
	var el = evt.target;
	var sudaAcTrack = "", sudaUaTrack = "", href = "";
	var trackData;
	if(el != null && el.getAttribute && (!el.getAttribute('suda-uatrack') && !el.getAttribute('suda-actrack') && !el.getAttribute('suda-data'))){
		while(el != null && el.getAttribute && (!!el.getAttribute('suda-uatrack') || !!el.getAttribute('suda-actrack') || !!el.getAttribute('suda-data')) == false){
			if(el == doc.body){
				return;
			}
			el = el.parentNode;
		}
	}
	if(el == null || el.getAttribute == null){
		return;
	}
	sudaAcTrack = el.getAttribute('suda-actrack') || '';
	sudaUaTrack = el.getAttribute('suda-uatrack') || el.getAttribute('suda-data') || '';
	sudaUrls = el.getAttribute('suda-urls') || '';
	/*
	 * suda-data 格式
	 * <span suda-data="key=clickbtn&value=1900-1-01||click||home">
	 * value说明：多个不同的参数使用||分割，遵守默认suda的数据格式
	 */
	if(sudaUaTrack){
		trackData = queryToJson(sudaUaTrack);
		// 20111226 SUDA 行为统计增加一个功能，即在点击链接时得到href的值，并用于数据统计
		if(el.tagName.toLowerCase() == "a"){
			//href = escape(el.href);
			href = el.href;
		}
        opts={}
        opts.ext=(trackData['ext']||'');
		trackData['key'] && SUDA.uaTrack && SUDA.uaTrack(trackData['key'], trackData['value']||trackData['key'], href,opts);
	}
	if(sudaAcTrack){
		trackData = queryToJson(sudaAcTrack);
		trackData['key'] && SUDA.acTrack && SUDA.acTrack(trackData['key'], trackData['value']||trackData['key']);
	}
}
// --------------主流程开始-------------
// 如果 SUDA 是已经存在的数组
if(window.SUDA && Object.prototype.toString.call(window.SUDA) === '[object Array]'){
	for(var i = 0, len = SUDA.length; i < len; i ++){
		switch(SUDA[i][0]){
			case "setGatherType":
				commonType = SUDA[i][1];
				break;
			case "setGatherInfo":
				// 获取需要统计的信息
				sudaPageid = SUDA[i][1] || sudaPageid;
				sudaExt1 = SUDA[i][2] || sudaExt1;
				sudaExt2 = SUDA[i][3] || sudaExt2;
				break;
			case "setPerformance":
				performance = SUDA[i][1];
				break;
			case "setPerformanceFilter":
				filter = SUDA[i][1];
				break;
			case "setPerformanceInterval":
				interval = SUDA[i][1] * 1 || 0;
				// 防止有人乱输入非数字字符
				interval = isNaN(interval) ? 0 : interval;
				break;
			case "setGatherMore":
				sudaInfo.push(SUDA[i].slice(1));
				break;
			case "acTrack":
				acTrackInfo.push(SUDA[i].slice(1));
				break;
			case "uaTrack":
				uaTrackInfo.push(SUDA[i].slice(1));
				break;
		}
	}
}
// 获得当前页面是否在 iframe 里
inFrame = (function(minH, minW) {
	if (win.top == win) {
		return false;
	} else {
		try {
			if (doc.body.clientHeight == 0) {
				return false;
			}
			return ((doc.body.clientHeight >= minH) && (doc.body.clientWidth >= minW)) ? false : true;
		} catch(e) {
			return true;
		}
	}
})(320, 240);
// 获得当前页面是否有刷新的 META
isMetaFresh = (function() {
	return false;
//	var ph = doc.getElementsByTagName('head')[0].innerHTML;
//	var reg = /<meta\s*http-equiv\s*=((\s*refresh\s*)|('refresh')|("refresh"))\s*content\s*=/i;
//	return reg.test(ph);
})();

//setEntry();
UI.setUOR();
var sid = UI.sessionId();
//if(!UI.visitorId()){	UI.visitorId(sid); }

// 公开的方法
window.SUDA = window.SUDA || [];
// suda 统计执行的次数
SUDA.sudaCount = SUDA.sudaCount || 0;
SUDA.log = function () {
	gatherCommon.apply(null, arguments);
};
SUDA.acTrack = function () {
	acTrack.apply(null, arguments);
};
SUDA.uaTrack = function () {
	uaTrack.apply(null, arguments);
};

// 监听页面的点击事件，如果含有 suda-uatrack 或者 suda-actrack，就进行行为统计
addEvent(doc.body, 'click', trackAgent);

//与旧suda代码兼容
window.GB_SUDA = SUDA;
GB_SUDA._S_pSt = function(){
	//gatherCommon.apply(null, arguments);
}
GB_SUDA._S_acTrack = function(){
	acTrack.apply(null, arguments);
}
GB_SUDA._S_uaTrack = function(){
	uaTrack.apply(null, arguments);
}
window._S_pSt = function(){
	//gatherCommon.apply(null, arguments);
}
window._S_acTrack = function(){
	acTrack.apply(null, arguments);
}
window._S_uaTrack = function(){
	uaTrack.apply(null, arguments);
}

window._S_PID_ = '';

//自动调用
gatherCommon2();

//setTimeout( function(){createCkctlFrame();} ,1000);
//白名单调用
try{
	createCkctlFrame();	
}catch (e){}


})();
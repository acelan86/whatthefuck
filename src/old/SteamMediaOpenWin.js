/**流媒体广告 begin**/

function SteamMediaOpenWin() {

  var THIS = this;//设置指针
  var d = SteamMediaData;//加载数据
  var tmpLeft = 0;
  window.SteamMediaFlag = false;
  var w = document.getElementById("SteamMediaWrap");

  this.stimer = null;
  this.stimer_pos = null;

   //流媒体构造函数
   THIS.initAdSM = function (u, t, l, w, h, tp, ol, om) {

     //容器构造
     //主容器
     THIS.smWrap = document.getElementById("SteamMediaWrap");
     THIS.smWrap.style.cssText = 'width:' + w + 'px;height:0px;margin:0px auto;display:block;';
     //触发部分
     THIS.seWrap = document.createElement("div");
     THIS.seWrap.id = "seWrap";
     THIS.seWrap.style.cssText = 'width:' + w + 'px;height:' + h + 'px;position:fixed;left:0px;top:10px;z-index:9999;background:none;margin:0;padding:0;display:none;';
     if (!sinaadToolkit.browser.isSupportFixed) {
     	THIS.seWrap.style.position = "absolute";
     }
     THIS.smWrap.appendChild(THIS.seWrap);

	 THIS.seDiv = document.createElement("div");
	 THIS.seDiv.id = "seDiv";
	 THIS.seDiv.style.width = w + "px";
	 THIS.seDiv.style.height = h + "px";
	 THIS.seDiv.style.background = "none";
	 THIS.seDiv.style.margin = "0";
	 THIS.seDiv.style.padding = "0";
	 THIS.seDiv.style.display = "block";
	 THIS.seWrap.appendChild(THIS.seDiv);
     if (w > 375) {
     	THIS.seCls = document.createElement("div");
     	THIS.seCls.id = "seCls";
     	THIS.seCls.style.width = 77 + "px";
     	THIS.seCls.style.height = 31 + "px";
     	THIS.seCls.style.position = "absolute";
     	THIS.seCls.style.right = 0 + "px";
     	THIS.seCls.style.bottom = -31 + "px";
     	THIS.seCls.style.zIndex = "9999";
     	THIS.seCls.style.background = "url(http://d4.sina.com.cn/d1images/lmt/cls_77x31.gif) no-repeat";
     	THIS.seCls.style.margin = "0";
     	THIS.seCls.style.padding = "0";
     	THIS.seCls.style.display = "block";
     } else {
     	THIS.seCls = document.createElement("div");
     	THIS.seCls.id = "seCls";
     	THIS.seCls.style.width = 66 + "px";
     	THIS.seCls.style.height = 22 + "px";
     	THIS.seCls.style.position = "absolute";
     	THIS.seCls.style.right = 0 + "px";
     	THIS.seCls.style.bottom = -22 + "px";
     	THIS.seCls.style.zIndex = "9999";
     	THIS.seCls.style.background = "url(http://d2.sina.com.cn/d1images/lmt/cls_66x22.gif) no-repeat";
     	THIS.seCls.style.margin = "0";
     	THIS.seCls.style.padding = "0";
     	THIS.seCls.style.display = "block";
     }
     THIS.seCls.style.cursor = "pointer";

     THIS.seWrap.appendChild(THIS.seCls);

     if (om >= 0) {

     	THIS.seIfm = document.createElement("iframe");
     	THIS.seIfm.id = "seIfm";
     	THIS.seIfm.style.width = w + "px";
     	THIS.seIfm.style.height = h + "px";
     	THIS.seIfm.style.position = "absolute";
     	THIS.seIfm.style.left = 0 + "px";
     	THIS.seIfm.style.top = 0 + "px";
     	THIS.seIfm.style.zIndex = "-1";
     	THIS.seIfm.style.background = "#fff";
     	THIS.seIfm.style.margin = "0";
     	THIS.seIfm.style.padding = "0";
       	THIS.seIfm.frameBorder = 0;
       	THIS.seWrap.appendChild(THIS.seIfm);
     }

     //标签部分
     THIS.stWrap = document.createElement("div");
     THIS.stWrap.id = "stWrap";
     THIS.stWrap.style.width = 25 + "px";
     THIS.stWrap.style.height = 219 + "px";
     THIS.stWrap.style.position = "fixed";
     THIS.stWrap.style.right = 0 + "px";
     THIS.stWrap.style.bottom = 0 + "px";
     THIS.stWrap.style.zIndex = "9999";
     THIS.stWrap.style.margin = "0";
     THIS.stWrap.style.padding = "0";
     THIS.stWrap.style.display = "none";
     if (!sinaadToolkit.browser.isSupportFixed) {
     	THIS.stWrap.style.position = "absolute";
     }
     THIS.smWrap.appendChild(THIS.stWrap);

	 THIS.stDiv = document.createElement("div");
	 THIS.stDiv.id = "stDiv";
	 THIS.stDiv.style.width = 25 + "px";
	 THIS.stDiv.style.height = 150 + "px";
	 THIS.stDiv.style.background = "none";
	 THIS.stDiv.style.margin = "0";
	 THIS.stDiv.style.padding = "0";
	 THIS.stDiv.style.display = "block";
	 THIS.stWrap.appendChild(THIS.stDiv);

	 THIS.srBtn = document.createElement("div");
	 THIS.srBtn.id = "srBtn";
	 THIS.srBtn.style.width = 25 + "px";
	 THIS.srBtn.style.height = 24 + "px";
	 THIS.srBtn.style.position = "absolute";
	 THIS.srBtn.style.left = 0 + "px";
	 THIS.srBtn.style.top = 150 + "px";
	 THIS.srBtn.style.background = "url(http://d5.sina.com.cn/d1images/lmt/play.gif) no-repeat center";
	 THIS.srBtn.style.margin = "0";
	 THIS.srBtn.style.padding = "0";
	 THIS.srBtn.style.display = "block";
     THIS.srBtn.style.cursor = "pointer";
     THIS.stWrap.appendChild(THIS.srBtn);


     THIS.scBtn = document.createElement("div");
     THIS.scBtn.id = "scBtn";
     THIS.scBtn.style.width = 25 + "px";
     THIS.scBtn.style.height = 45 + "px";
     THIS.scBtn.style.position = "absolute";
     THIS.scBtn.style.left = 0 + "px";
     THIS.scBtn.style.top = 174 + "px";
     THIS.scBtn.style.background = "url(http://d1.sina.com.cn/d1images/lmt/close1.jpg) no-repeat center";
     THIS.scBtn.style.margin = "0";
     THIS.scBtn.style.padding = "0";
     THIS.scBtn.style.display = "block";
     THIS.scBtn.style.cursor = "pointer";
     THIS.stWrap.appendChild(THIS.scBtn);

     //获取位置
	 THIS.getSMPos = function(){
       	if (ol < 0) {
       		tmpLeft = THIS.smWrap.offsetLeft == "undefined" ? ((sinaadToolkit.page.getViewWidth() - w) / 2 - (sinaadToolkit.browser.ie === 6 ? 16 : 0 )) : (THIS.smWrap.offsetLeft != 0 ? THIS.smWrap.offsetLeft : THIS.smWrap.parentNode.offsetLeft);
       	}
       	if (tmpLeft >= 0) {
       		THIS.seWrap.style.left = tmpLeft + "px";
       	}
        if (!sinaadToolkit.browser.isSupportFixed) {
        	THIS.seWrap.style.top = sinaadToolkit.page.getScrollTop() + tp + "px";
        }
	    if (!sinaadToolkit.browser.isSupportFixed) {
	    	THIS.stWrap.style.top = sinaadToolkit.page.getScrollTop() + document.body.offsetHeight - 219 + "px";
	    }
	    THIS.stimer_pos = setTimeout("getSMPos()", 50);
	 };

	 //播放流媒体
	 THIS.showSM = function(fst){
	   clearTimeout(THIS.stimer);
	   THIS.seDiv.innerHTML = "";
	   THIS.stDiv.innerHTML = "";
	   THIS.seWrap.style.display = "block";
	   THIS.stWrap.style.display = "none";
	   var eObj = sinaadToolkit.ad.createHTML(d.main.type, u, w, h, l);
       THIS.seDiv.innerHTML = eObj;
		if (fst == true) {
		 	THIS.stimer = setTimeout("hideSM(true)", w > 260 ? 8000 : 5000);
		} else {
		    THIS.stimer = setTimeout("hideSM()", w > 260 ? 8000 : 5000);
		}
	 };

	 //关闭流媒体
	 THIS.hideSM = function (fst) {
	   clearTimeout(THIS.stimer);
	   THIS.seDiv.innerHTML = "";
	   THIS.stDiv.innerHTML = "";
	   THIS.seWrap.style.display = "none";
	   THIS.stWrap.style.display = "block";
       var tObj = sinaadToolkit.ad.createHTML(d.mini.type, t, 25, 150, l);
       THIS.stDiv.innerHTML = tObj;
	   if (fst == true || window.SteamMediaFlag) {
	   		try {
	   			window.SteamMediaFlag = false;
	   			nextAD();
	   		} catch (e) {}
	   	}
	 };

	 //关闭标签
	 THIS.closeSM = function () {
	   clearTimeout(THIS.stimer);
	   clearTimeout(THIS.stimer_pos);
	   THIS.smWrap.style.display = "none";
	   THIS.smWrap.innerHTML = "";
	 };

	 //按钮事件注册
	 sinaadToolkit.event.on(THIS.seCls, "click", THIS.hideSM);//关闭流媒体
	 sinaadToolkit.event.on(THIS.srBtn, "click", THIS.showSM);//重播流媒体
	 sinaadToolkit.event.on(THIS.scBtn, "click", THIS.closeSM);//关闭标签

	 //IP控制
	 window.SteamMediaFlag = true;
	 this.cookie = sinaadToolkit.storage.get("SteamMedia" + document.URL);
     this.cookie = this.cookie == "" ? 0 : ++this.cookie;
	 if (this.cookie < 2) {
	 	this.showSM(true);
	 } else {
	 	this.hideSM(true);
	 }
	 sinaadToolkit.storage.set("SteamMedia" + document.URL, this.cookie, 1440);
	 THIS.getSMPos();
   };

    //时间过滤
    this.ifSMAD = false;
    if (w) {
    	this.ifSMAD = true;

		document.getElementById("SteamMediaWrap").innerHTML += '<div id="loadingSmWrap" style="display:none;">'+
			'<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="loadingSmFlash" WIDTH="0" HEIGHT="0">'+
				'<PARAM NAME=quality VALUE=high>'+
				'<param name="Play" value="-1">'+
				'<PARAM NAME=movie VALUE="'+d.main.src + '">'+
			'</OBJECT>'+
		'</div>';

		if (sinaadToolkit.browser.ie) {
			this.SmLoadingTimer = setInterval(function () {
			  if(document.getElementById("loadingSmFlash").PercentLoaded() == 100) {
				clearInterval(this.SmLoadingTimer);
				THIS.initAdSM(d.main.src, d.main.link, d.mini.src, d.main.width, d.main.height, d.top, -1, '', '');
				if (document.getElementById("loadingSmWrap")) {
					document.getElementById("loadingSmWrap").innerHTML = "";
				}
			  }
			},1000);
		} else {
			THIS.initAdSM(d.main.src, d.mini.src, d.main.link, d.main.width, d.main.height, d.top, -1, '', '');
			if (document.getElementById("loadingSmWrap")) {
				document.getElementById("loadingSmWrap").innerHTML = "";
			}
		}
    }

}
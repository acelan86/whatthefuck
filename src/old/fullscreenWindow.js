function FullScreenOpenWin(fstType,ckeU){

   var THIS = this;//设置指针
   var d = FullScreenData;//加载数据
   var w = document.getElementById("FullScreenWrap");//加载容器对象

   var th = 0;
   var tw = 0;
   this.ftimer = null;
   this.ftimer_del = null;

   //全屏构造函数url, link, 
   this.initAdFS = function(u, l, u2, r2, ip, rp) {

     //判断选择素材
     if (fstType == false && ckeU == 2 && u2 != "") {
        u = u2;
     }

     //构造全屏容器
     THIS.fmWrap = document.getElementById('FullScreenWrap');
     THIS.fmWrap.style.cssText = 'position:relative;z-index:9999;width:1000px;margin:0px auto;padding:0px;';


     //构造素材
     THIS.fiWrap = document.createElement('div');
     THIS.fiWrap.id = 'fiWrap';
     THIS.fiWrap.style.cssText = 'position:relative;overflow:hidden;width:1000px;height:0px;display:none;margin:0;padding:0;';
     THIS.fmWrap.appendChild(THIS.fiWrap);

     THIS.fiCls = document.createElement('div');
     THIS.fiCls.id = 'fiCls';
     THIS.fiCls.style.cssText = 'cursor:pointer;position:absolute;width:77px;height:31px;right:0px;top:450px;background:url("http://d1.sina.com.cn/d1images/fullscreen/cls_77x31.gif") no-repeat;margin:0;padding:0;';

     //构造重播
     THIS.frWrap = document.createElement('div');
     THIS.frWrap.id = 'frWrap';
     THIS.frWrap.style.cssText = 'width:0px;height:117px;position:absolute;left:1000px;top:0px;margin:0;padding:0;overflow:hidden';
     THIS.fmWrap.appendChild(THIS.frWrap);

     THIS.frCls = document.createElement("div");
     THIS.frCls.id = 'frCls';
     THIS.frCls.style.cssText = 'cursor:pointer;width:25px;height:17px;position:absolute;right:0px;top:100px;background:url("http://d3.sina.com.cn/d1images/fullscreen/close.gif") no-repeat right;margin:0;padding:0;';
     THIS.frWrap.appendChild(THIS.frCls);

     //播放全屏
     THIS.showFS = function (type) {
      if (type == false) {
         clearTimeout(THIS.ftimer_del);
         clearTimeout(THIS.ftimer);
         THIS.hideFS();
       } else {
            var iObj = sinaadToolkit.ad.createHTML('image', u, 1000, 450, l);
            //o.initObj("FullScreenObj",u,l,"1000","450");
            THIS.fiWrap.innerHTML = iObj;
            THIS.fiWrap.appendChild(THIS.fiCls);
            THIS.fiWrap.style.display = "block";
            clearTimeout(THIS.ftimer_del);
            if (th < (rp == "" ? 450 : 490)) {
               th += (rp== "" ? 90 : 98);
               THIS.fiWrap.style.height = th + "px";
               THIS.ftimer = setTimeout(function () {
                THIS.showFS(true);
               }, 1);
            } else {
               clearTimeout(THIS.ftimer);
               THIS.ftimer_del = setTimeout(function () {
                THIS.hideFS();
               }, rp == "" ? 5000 : 8000);
            }
       }
     };

     //关闭全屏
     THIS.hideFS = function(){
       clearTimeout(THIS.ftimer_del);
       if (th > 0) {
         th -= rp == "" ? 90 : 98;
         THIS.fiWrap.style.height = th + "px";
         THIS.ftimer = setTimeout(function () { 
            THIS.hideFS();
         }, 1);
       }else{
         THIS.fiWrap.style.display = "none";
         clearTimeout(THIS.ftimer);
         if (fstType == true) { 
            try{
                nextAD();
            } catch (e) {}
         }
         //加载后续广告
         if(rp!=""){
            var rObj = sinaadToolkit.ad.createHTML('flash', r2 || "http://d1.sina.com.cn/shh/tianyi/fs/rplBtn_25x100.swf", 25, 100, '');
            THIS.frWrap.innerHTML = rObj;
            if(!r2 && r2.substring(r2.length - 3).toLowerCase() != "swf") {
                sinaadToolkit.event.on(THIS.frWrap.firstChild, 'click', THIS.rptFS);
            }
            THIS.frWrap.appendChild(THIS.frCls);
            THIS.showRpt();
         }
       }
     };  

     //重播全屏
     THIS.rptFS = function () {
       clearTimeout(THIS.ftimer_del);
       tw = 0;
       THIS.frWrap.style.width = 0 + "px";
       var iObj = sinaadToolkit.ad.createHTML(type, u, 1000, 450, l);
       THIS.fiWrap.innerHTML = iObj;
       THIS.fiWrap.appendChild(THIS.fiCls);
       THIS.showFS(true);
     };

     //标签进入
     THIS.showRpt = function () {
       if(tw < 25) {
         tw += 1;
         THIS.frWrap.style.width = tw + "px";
         THIS.ftimer = setTimeout(function () {
            THIS.showRpt();
         }, 10);
       }else{
         clearTimeout(THIS.ftimer);
       }
     };

     //标签关闭
     THIS.clsRpt = function(){
       clearTimeout(ftimer);
       clearTimeout(THIS.ftimer_del);
       w.innerHTML = "";
       w.style.display = "none";
     };

     sinaadToolkit.event.on(THIS.fiCls, 'click', THIS.hideFS);
     sinaadToolkit.event.on(THIS.frCls, 'click', THIS.clsRpt);

     if(ip != "" && fstType == true) {
       this.cookie = sinaadToolkit.storage.get("FullScreen" + document.URL);
       this.cookie = this.cookie == "" ? 0 : ++this.cookie;
       if(this.cookie < 2) {
        THIS.showFS(true);
       } else {
        THIS.showFS(false);
       }
       sinaadToolkit.storage.set("FullScreen" + document.URL, this.cookie, 1440);
     }else{
       THIS.showFS(true);
     }
   };


   //时间过滤
   this.ifFSAD = false;
   if(w){
        this.ifFSAD = true;

        document.getElementById("FullScreenWrap").innerHTML += '<div id="loadingFSWrap">' +
            '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="loadingFsFlash" WIDTH="0" HEIGHT="0">' +
                '<param name=quality value="high">' +
                '<param name="Play" value="-1">' +
                '<param name=movie value="' + d[0] + '">' +
            '</object>' +
        '</div>';

        if(sinaadToolkit.browser.ie) {
            this.FSLoadingTimer = setInterval(function () {
                if(document.getElementById("loadingFsFlash").PercentLoaded() == 100) {
                    clearInterval(pthis.FSLoadingTimer);
                    THIS.initAdFS(d.src, d.link, '', '', '', '');
                    if(document.getElementById("loadingFSWrap")) {
                        document.getElementById("loadingFSWrap").innerHTML = "";
                    }
                }
            }, 1000);
        } else {
            THIS.initAdFS(d.src, d.link, '', '', '', '');
            if(document.getElementById("loadingFSWrap")) {
                document.getElementById("loadingFSWrap").innerHTML = "";
            }
        }
    }
}
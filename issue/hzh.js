//coding by lingchen on Oct 27th 2012

//正文中有新组件容器需要过滤时请搜索“黑名单容器class”添加

var hzh = {};

hzh.flag = 0;

hzh.divid = "ad_44099";

hzh.pdps = "PDPS000000044099";

hzh.surround_num = 800; //环绕文字最优字符总数

hzh.str_sum = 0;

hzh.str_temp = 0; 

hzh.p_num = 0; //正文页p标签节点个数

hzh.nodes = []; //所有子节点

hzh.p_node = [];//子节点的p标签数组（不包含孙节点）

hzh.img_num = null;

//hzh.$ = function(id){return document.getElementById(id);}

hzh.$ = function(vArg){

    this.elements = [];

    switch(typeof vArg){

        case 'function': //window.onload = vArg

            hzh.addEvent(window,'load',vArg);

            break;

        case 'string':

            switch(vArg.charAt(0)){

                case '#': //id

                    var obj = document.getElementById(vArg.substring(1));

                    return obj;

                    break;

                case '.': //class

                    this.elements = hzh.getClass(document,vArg.substring(1));

                    return this.elements;   

                    break;

                default: //tagName  

                    this.elements = document.getElementsByTagName(vArg);

                    return this.elements;   

            }

            break;

        case 'object':

            this.elements.push(vArg);

            return this.elements;   

    }

}

hzh.getClass = function(oParent,sClass){

    var parent = oParent || document;

    var re = new RegExp('\b'+sClass+'\b');

    var aEles = parent.getElementsByTagName('*');

    var arr = [];

    for(var i=0; i<aEles.length; i++){

        if(re.test(aEles[i].className)){arr.push(aEles[i]);}

    }

    return arr;

}

hzh.addEvent = function(obj, sEv, fn){

    if(obj.attachEvent){

        obj.attachEvent('on'+sEv,function(){

            fn.call(obj);   

        }); 

    }

    else{

        obj.addEventListener(sEv, fn, false);   

    }

}

hzh.main_container = hzh.$("#artibody"); //正文主容器

hzh.p = hzh.main_container.getElementsByTagName("p"); //子孙节点的p标签数组

hzh.div = hzh.main_container.getElementsByTagName("div"); //子孙节点的div标签数组

hzh.className = 'otherContent_01';

hzh.cssText = 'display:none;width:200px; height:300px; margin:10px 20px 10px 0px; float:left; overflow:hidden; clear:both; padding:4px; border:1px solid #CDCDCD;';

hzh.zhengwen_div = hzh.main_container.getElementsByTagName("div"); //子孙节点的div标签数组

hzh.noAD = hzh.$("#noAD");

hzh.ua = navigator.userAgent.toLowerCase();

hzh.isIE6 = /msie 6/.test(hzh.ua);

hzh.isIE7 = /msie 7/.test(hzh.ua);

hzh.iOS = /\((iPhone|iPad|iPod)/i.test(hzh.ua);

hzh.iOS_tag = 1;

//获取cookie

hzh.getAdCookie = function(N){

    var c=document.cookie.split("; ");

    for(var i=0;i<c.length;i++){var d=c[i].split("=");if(d[0]==N)return unescape(d[1]);}

    return "";

};

hzh.removeHTMLTag = function(str) {//过滤字符串里的tag，空白等

    str = str.replace(/<\/?[^>]*>/g,''); //去除HTML tag

    str = str.replace(/[ | ]*\n/g,'\n'); //去除行尾空白

    //str = str.replace(/\n[\s| | ]*\r/g,'\n'); //去除多余空行

    str=str.replace(/&nbsp;/ig,'');//去掉&nbsp;

    return str;

}

hzh.Len = function(str){ //计算字符数

     var i,sum;

     sum=0;

     for(i=0;i<str.length;i++){

         if ((str.charCodeAt(i)>=0) && (str.charCodeAt(i)<=255))

             sum=sum+1;

         else

             sum=sum+2;

     }

     return sum;

}

hzh.insertAfter = function(newElement,targetElement) { //封装的后插函数

    var parent = targetElement.parentNode;

    if (parent.lastChild == targetElement) {

        //如果最后的节点是目标元素，则直接添加。

        parent.appendChild(newElement);

    }else {

        //如果不是，则插入在目标元素的下一个兄弟节点的前面。也就是目标元素的后面。

        parent.insertBefore(newElement,targetElement.nextSibling);

    }

}

hzh.createHzh = function(){ //创建画中画广告容器（div标签）

    var oDiv = document.createElement("div");

	oDiv.id = hzh.divid;

    oDiv.className = hzh.className;

    oDiv.style.cssText = hzh.cssText;

	oDiv.innerHTML = '<ins class="sinaads" id="Sinads49447" data-ad-pdps="'+hzh.pdps+'" data-ad-status="async"></ins>';

    return oDiv;    

}

hzh.createSpanHzh = function(){ //创建画中画广告容器（span标签）

    var oDiv = document.createElement("span");

	oDiv.id = hzh.divid;

    oDiv.className = hzh.className;

    oDiv.style.cssText = hzh.cssText;

	oDiv.innerHTML = '<ins class="sinaads"  id="Sinads49447" data-ad-pdps="'+hzh.pdps+'" data-ad-status="async"></ins>';

    return oDiv;    

}

hzh.insertAd_after = function(insert_p){ //后插广告

    var cur_p = insert_p;

    hzh.insertAfter(hzh.createHzh(),cur_p);

}

hzh.insertSpanAd_after = function(insert_p){ //后插广告(span)

    var cur_p = insert_p;

    hzh.insertAfter(hzh.createSpanHzh(),cur_p);

}

hzh.insertAd_before = function(thisDiv){ //前插广告

    var parent = thisDiv.parentNode;

    parent.insertBefore(hzh.createHzh(),thisDiv);

}

hzh.insertClear =function(insert_p){ //插入清除浮动div

    //清浮动div

    var oDivClear = document.createElement("div");

    oDivClear.style.fontSize = "0px";

    oDivClear.style.height = "0px";

    oDivClear.style.clear = "both";

    var last_p = insert_p;

    hzh.insertAfter(oDivClear,last_p);

}

hzh.nodePage = hzh.$(".page")[0];

hzh.nodeShare = hzh.$("#sinashareto");

//判断主容器里是否有分页容器

hzh.hasPage = function(){

    if(hzh.nodePage){

        return true;

    }else{

        return false;

    }

}();

//判断主容器里是否有分享容器

hzh.hasShare = function(){

    var shareFlag = false;

    for(var i=0;i<hzh.div.length;i++){

        if(hzh.div[i].id=="sinashareto"){

            shareFlag = true;

            break;  

        }

    }

    return shareFlag;

}();

hzh.yule_node = null;

for(var i=0;i<hzh.div.length;i++){

    if(hzh.div[i].innerHTML.indexOf('查看更多美图请进入娱乐幻灯图集')!=-1){

        hzh.yule_node = hzh.div[i].parentNode;

    }

}

//步骤1：筛选出主容器内在分页容器或分享容器之上所有子节点(不包含文本节点)

for(var i=0;i<hzh.main_container.childNodes.length;i++){

    if(hzh.main_container.childNodes[i].nodeType==1){

        var sel_childNodes = hzh.main_container.childNodes[i];

        //判断主容器里是否有“查看更多美图请进入娱乐幻灯图集”节点

        var yule_txt = '查看更多美图请进入娱乐幻灯图集';

        if(sel_childNodes.id=="sinashareto" || sel_childNodes.innerHTML.indexOf(yule_txt)!=-1 || sel_childNodes.className=="page"){

            break;

        }else{

            hzh.nodes.push(hzh.main_container.childNodes[i]);

        }

    }

}

//步骤2：

for(var i=hzh.nodes.length-1;i>=0;i--){

    var zhengwen_img_arr = hzh.nodes[i].getElementsByTagName("img");

    var zhengwen_p_script_arr = [];

    var zhengwen_p_align = false;

    if(hzh.nodes[i].nodeName.toLowerCase() == 'p'){

        zhengwen_p_script_arr = hzh.nodes[i].getElementsByTagName("script");

        if(hzh.nodes[i].getAttribute("align")=='center'){

            zhengwen_p_align = true;

        }

    }

    var zhengwen_table_node = hzh.nodes[i].nodeName.toLowerCase();

    var zhengwen_child_table_node = hzh.nodes[i].getElementsByTagName("table");

    var zhengwen_node_class = hzh.nodes[i].className;

    var nodeClassTag = false;

    //黑名单容器class

    var classList = ['weiboListBox otherContent_01','contentPlayer','blk_video_news','hdFigureWrap','artical-player-wrap','sdFigureWrap','img_wrapper'];

    for(var k=0;k<classList.length;k++){

        if(zhengwen_node_class==classList[k]){

            nodeClassTag = true;

            break;  

        }

    }

    //筛选出主容器内第一个白名单子节点在整个子节点中的位置（排除含有jpg图片，script标签，table标签，微博容器，“p标签里有居中属性”以及它以上的节点）

    if((zhengwen_img_arr[0] && (zhengwen_img_arr[0].src.indexOf(".jpg")!=-1 || zhengwen_img_arr[0].src.indexOf(".png")!=-1)) || zhengwen_table_node=="table" || zhengwen_child_table_node[0] || zhengwen_p_script_arr[0] || zhengwen_p_align==true || nodeClassTag == true){

        hzh.img_num = i+1;

        break;

    }

    else{

        hzh.img_num = i;

    }

}

//步骤3：筛选剩余子节点中标签名为p的节点

for(var i=hzh.img_num;i<hzh.nodes.length;i++){

    if(hzh.nodes[i].nodeName.toLowerCase() == 'p'){

        hzh.p_node.push(hzh.nodes[i]);

    }

}

if(hzh.p_node.length>0){

    for(i=0;i<hzh.p_node.length;i++){ 

        var html = hzh.p_node[i].innerHTML; 

        var txt = hzh.removeHTMLTag(html);

        var p_str_num = hzh.Len(txt);

        hzh.str_sum += p_str_num;

        hzh.p_num++;

    }

}

if(!hzh.noAD){

    //ie6,7下判断是否有视频容器，有就直接插在视频容器的后面(并且使用span容器标签)

    //左浮动容器，样式名blk_ntchack1

    var lFloatArr = hzh.$('.blk_ntchack1');

    var lFloatTarget = null;

    if(lFloatArr.length==1){

        lFloatTarget = lFloatArr[0];    

    }else if(lFloatArr.length>1){

        lFloatTarget = lFloatArr[lFloatArr.length-1];   

    }

    if((hzh.isIE6||hzh.isIE7) && lFloatTarget||( hzh.$("#p_player")||(hzh.$("#J_Article_Player")&&hzh.$("#J_Article_Player").parentNode.className.indexOf('blk_video_news')!=-1))){

        if(hzh.$("#p_player")){

            var oSpan = hzh.$("#p_player").parentNode;

            hzh.insertSpanAd_after(oSpan);

        }else if(lFloatTarget){

            hzh.insertSpanAd_after(lFloatTarget);

        }

        else{

            var oSpan = hzh.$("#J_Article_Player").parentNode;

            hzh.insertSpanAd_after(oSpan);

        }

    }

    else{

        //筛选出的p个数为0时将广告插在分页容器之上；如果没有分页，插入分享容器之上；如果没有分享容器，直接插在主容器的最后

        if(hzh.p_node.length<1){

            if(hzh.hasPage == true){

                hzh.insertAd_before(hzh.nodePage);

                hzh.insertClear(hzh.$("#"+hzh.divid));

            }else if(hzh.yule_node){ //娱乐频道特殊节点

                hzh.insertAd_before(hzh.yule_node);

                hzh.insertClear(hzh.$("#"+hzh.divid));

            }else if(hzh.hasShare == true){

                hzh.insertAd_before(hzh.nodeShare);

                hzh.insertClear(hzh.$("#"+hzh.divid));

            }else{

                hzh.main_container.appendChild(hzh.createHzh());

                hzh.insertClear(hzh.$("#"+hzh.divid)); 

            }

        }

        //筛选出的p个数为1时将广告插在该p的前面 

        else if(hzh.p_node.length==1){

            hzh.insertClear(hzh.p_node[hzh.p_node.length-1]);

            hzh.insertAd_before(hzh.p_node[hzh.p_node.length-1]);

        }

        //筛选出的p个数大于1时进行文字个数计算

        else if(hzh.p_node.length>1){

            //字符总数小于最佳环绕数，插在第一个p的前面

            if(hzh.str_sum<=hzh.surround_num){

                hzh.insertClear(hzh.p_node[hzh.p_node.length-1]);

                hzh.insertAd_before(hzh.p_node[0]);

            }else{

                //字符总数大于hzh.surround_num，从后向前遍历选出的p里的字符数，总和超过800后，广告插在该p的前面

                for(var i=hzh.p_num-1; i>=0; i--)

                {

                    var txt_last = hzh.removeHTMLTag(hzh.p_node[i].innerHTML);

                    var txt_last_num = hzh.Len(txt_last);

                    hzh.str_temp += (parseInt(txt_last_num/30) + 1)*30;

                    if(hzh.str_temp < hzh.surround_num){

                        hzh.p_num--;

                    }

                    else{

                        hzh.insertClear(hzh.p_node[hzh.p_node.length-1]);

                        hzh.insertAd_before(hzh.p_node[hzh.p_num-1]);

                        break;

                    }

                }

            }

        }

    }

}

hzh.hzh_div = hzh.$("#"+hzh.divid);

(function(){

	var adScript = document.createElement('script');

	adScript.src = 'http://d9.sina.com.cn/litong/zhitou/sinaads/release/sinaads.js';

	document.getElementsByTagName('head')[0].appendChild(adScript);

})();

(sinaads = window.sinaads || []).push({
    element: document.getElementById('Sinads49447'),

	params : {

      sinaads_success_handler : function () { 

	  		if(hzh.iOS&&(hzh.hzh_div.innerHTML.toLowerCase().indexOf('.swf')!=-1||hzh_div.innerHTML.toLowerCase().indexOf('<iframe')!=-1)){

				hzh.hzh_div.style.display = 'none'; 

			}else{

				hzh.hzh_div.style.display = 'block'; 

			}

			/*try{

				_ssp_ad.load(hzh.divid,function(){

					hzh.hzh_div.style.display = 'none';

				});

			}catch(e){

				hzh.hzh_div.style.display = 'none';

			}*/

	  },

      sinaads_fail_handler : function () {

	  }

    }	

});

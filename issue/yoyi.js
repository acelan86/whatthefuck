window.YOYIVER=2222;
var crazy_time_url = "http://atm.yoyi.com.cn/s/pl";
var crazy_link_url = null; // ´óËØ²ÄÁ´½Ó
var crazy_smalllink_url = null; //Ð¡ËØ²ÄÁ´½Ó
var crazy_resize_sign = 1;
var client_url="http://g.cn.miaozhen.com/x.gif?k=1005600&p=3yW2h0&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&v=[M_LOC]&o=";
var crazy_view_both = 0;
var crazy_view_limit = 2;
var crazy_src1_mode= 0;
var afp_flash_player_src_big = "http://rm.sina.com.cn/yoyi/1zdy/11/1101/yili/1.swf";    								//big flash file
var afp_flash_player_src_small = "http://rm.sina.com.cn/yoyi/1zdy/11/1101/yili/2.swf";   							//small flash file
var crazy_close_sign = 0;
var afp_cur_keyword_count = Math.floor(Math.random() * (101));
var crazy_tdate = new Date(); 
var crazy_src1_top = 0;
var crazy_src1_bottom = 1;
crazy_tdate.setHours(crazy_tdate.getHours()+ 24);
var crazy_show_tdate = new Date(); 
crazy_show_tdate.setMinutes(crazy_show_tdate.getMinutes()+ 0);
var today_nine_date = new Date(crazy_tdate.getFullYear(),crazy_tdate.getMonth(),crazy_tdate.getDate(),1,59,59);
var today_one_date = new Date(crazy_tdate.getFullYear(),crazy_tdate.getMonth(),crazy_tdate.getDate(),23,59,59);

var crazy_yoyi_focus_flv_count;
var crazy_yoyi_focus_show_count;
var isIE6=(window.XMLHttpRequest)?false:true;
var sbrowser = navigator.userAgent;
var isMoz = false;
var isSafa = false;
var isIE = (document.all) ? true : false;
if (sbrowser.indexOf("Safari") > -1 && sbrowser.indexOf("Chrome") == -1 && sbrowser.indexOf("Maxthon")==-1){
	isSafa = true;
}else if (sbrowser.indexOf("Mozilla") > -1 && sbrowser.indexOf("Gecko") > -1)
{
	var reMoz = new RegExp("rv:(([0-9]+\\.[0-9]+)(?:\\.[0-9]+)?)");
	reMoz.test(sbrowser);
	if (RegExp["$2"] == '1.8') isMoz = true;
}
if(window.YOYIVER>=1&&typeof(window.YOYIVER)!="undefined"){
	var crazy_fa_img=document.createElement('img');
	document.body.insertBefore(crazy_fa_img,document.body.firstChild);
	crazy_fa_img.id='crazy_fa_img';
	crazy_fa_img.style.width=0+'px';
	crazy_fa_img.style.height=0+'px';
	crazy_fa_img.style.border=0+'px';
	crazy_fa_img.style.position='absolute';
	crazy_fa_img.style.top=0+'px';
	crazy_fa_img.style.left=0+'px';
	
	var crazy_fa_img_client=document.createElement('img');
	document.body.insertBefore(crazy_fa_img_client,document.body.firstChild);
	crazy_fa_img_client.id='crazy_fa_img_client';
	crazy_fa_img_client.style.width=0+'px';
	crazy_fa_img_client.style.height=0+'px';
	crazy_fa_img_client.style.border=0+'px';
	crazy_fa_img_client.style.position='absolute';
	crazy_fa_img_client.style.top=0+'px';
	crazy_fa_img_client.style.left=0+'px';
	
	var yoyi_log_img=document.createElement('img');
	document.body.insertBefore(yoyi_log_img,document.body.firstChild);
	yoyi_log_img.id='yoyi_log_img';
	yoyi_log_img.style.width=0+'px';
	yoyi_log_img.style.height=0+'px';
	yoyi_log_img.style.border=0+'px';
	yoyi_log_img.style.position='absolute';
	yoyi_log_img.style.top=0+'px';
	yoyi_log_img.style.left=0+'px';
	
        if(isIE6){
	      var crazy_crazy_small=document.createElement('div');
	      crazy_crazy_small.id='crazy_crazy_small';
	      crazy_crazy_small.style.position='absolute';
	      crazy_crazy_small.style.width=25+'px';
		  crazy_crazy_small.style.height=220+'px';
	      crazy_crazy_small.style.zIndex=10000;
	      crazy_crazy_small.style.visibility='visible';
		  document.body.insertBefore(crazy_crazy_small,document.body.firstChild);
	      var crazy_crazy_max=document.createElement('div');
	      crazy_crazy_max.id='crazy_crazy_max';
	      crazy_crazy_max.style.position='absolute';
	      crazy_crazy_max.style.width=1000+'px';
	      crazy_crazy_max.style.height=300+'px';
	      crazy_crazy_max.style.zIndex=12000;
	      crazy_crazy_max.style.overflow="visible";
	      crazy_crazy_max.style.visibility='visible';
		document.body.insertBefore(crazy_crazy_max,document.body.firstChild);
        }else{
              if(isMoz){
	          var crazy_crazy_small=document.createElement('div');
	          crazy_crazy_small.id='crazy_crazy_small';
	          crazy_crazy_small.style.position='fixed';
	          crazy_crazy_small.style.width=25+'px';
			   crazy_crazy_small.style.height=220+'px';
	          crazy_crazy_small.style.zIndex=10000;
	          crazy_crazy_small.style.visibility='visible';
		  crazy_crazy_small.onmousedown=function(){
		     return false;
		  }
	         
				document.body.insertBefore(crazy_crazy_small,document.body.firstChild);  
	          var crazy_crazy_max=document.createElement('div');
	          crazy_crazy_max.id='crazy_crazy_max';
	          crazy_crazy_max.style.position='fixed';
	          crazy_crazy_max.style.width=1000+'px';
	          crazy_crazy_max.style.height=300+'px';
	          crazy_crazy_max.style.zIndex=12000;
		  crazy_crazy_max.style.overflow="visible";
	          crazy_crazy_max.style.visibility='visible';
		  crazy_crazy_max.onmousedown=function(){
		     return false;
		  }
	          
				  document.body.insertBefore(crazy_crazy_max,document.body.firstChild);
              }else{
	          var crazy_crazy_small=document.createElement('div');
	          crazy_crazy_small.id='crazy_crazy_small';
	          crazy_crazy_small.style.position='fixed';
	          crazy_crazy_small.style.width=25+'px';
			   crazy_crazy_small.style.height=220+'px';
	          crazy_crazy_small.style.zIndex=10000;
	          crazy_crazy_small.style.visibility='visible';
				  document.body.insertBefore(crazy_crazy_small,document.body.firstChild);
	          var crazy_crazy_max=document.createElement('div');
	          crazy_crazy_max.id='crazy_crazy_max';
	          crazy_crazy_max.style.position='fixed';
	          crazy_crazy_max.style.width=1000+'px';
	          crazy_crazy_max.style.height=300+'px';
	          crazy_crazy_max.style.zIndex=12000;
		  crazy_crazy_max.style.overflow="visible";
	          crazy_crazy_max.style.visibility='visible';
				  document.body.insertBefore(crazy_crazy_max,document.body.firstChild);
              }
        }			   
}else{
	document.write("<img id='crazy_fa_img' width=0 height=0 border=0 style='position:absolute;top:0px;left:0px;'>");
	document.write("<img id='yoyi_log_img' width=0 height=0 border=0 style='position:absolute;top:0px;left:0px;'>");
	if(isIE6){
	      document.write("<div id='crazy_crazy_small' style='position:absolute;visibility:visible;width:25px;height:220px;z-index:9999;'></div>");
	      document.write("<div id='crazy_crazy_max' style='position:absolute;overflow:visible;visibility:visible;width:1000px;height:300;z-index:10001;' ></div>");
        }else{
              if(isMoz){
	          document.write("<div id='crazy_crazy_small' style='position:fixed;visibility:visible;width:25px;height:220px;z-index:9999;' onMouseDown='return false;'></div>");
                  document.write("<div id='crazy_crazy_max' style='position:fixed;overflow:visible;visibility:visible;width:1000px;height:300;z-index:10001;' onMouseDown='return false;'></div>");
              }else{
	          document.write("<div id='crazy_crazy_small' style='position:fixed;visibility:visible;width:25px;height:220px;z-index:9999;'></div>");
                  document.write("<div id='crazy_crazy_max' style='position:fixed;overflow:visible;visibility:visible;width:1000px;height:300;z-index:10001;'></div>");
              }
        }
}
function insertFlash(elm, url, w, h, id) 
{
	if (!document.getElementById(elm)) return;
	var str = '';
	if(isIE)
	{
		str+='<OBJECT classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" WIDTH="'+ w +'" HEIGHT="'+ h +'"  ALIGN="" id='+id+'>';				
		str+='<PARAM NAME="movie" VALUE="'+url+'"/>';				
		str+='<PARAM NAME="quality" VALUE="autohigh"/>';			
		str+='<PARAM NAME="wmode" VALUE="transparent"/>';
		str+='<PARAM NAME="swliveconnect" VALUE="true"/>';			
		str+='<PARAM NAME="allowscriptaccess" VALUE="always"/>';				
		str+='<PARAM NAME="flashvars" VALUE="jsFunName=crazy_ExCommand"/>';				
		str+='</OBJECT>';				
		if(isIE6){
			str+='<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:-1;filter:alpha(opacity=0);"></iframe>';
		}
		if(afp_flash_player_src_big==url)
		{
		str+='<div style="position:absolute;top:300px;right:0px;z-index:99999;"><img id="closebutton" src="http://d1.sina.com.cn/d1images/lmt/cls_77x31.gif" width="77px" height="30px" style="cursor:pointer" onclick="crazy_buttonclose()"></div>';
						}
	}
	else
	{
	str += '<embed width="'+ w +'" flashvars="jsFunName=crazy_ExCommand" height="'+ h +'" src="'+ url +'" allowscriptaccess="always" swliveconnect="true" quality="autohigh" wmode="transparent" type="application/x-shockwave-flash" plugspace="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" id='+id+'></embed>';
	if(afp_flash_player_src_big==url)
	{
	str+='<div style="position:absolute;top:300px;right:0px;z-index:99999;"><img id="closebutton" src="http://d1.sina.com.cn/d1images/lmt/cls_77x31.gif" width="77px" height="30px" style="cursor:pointer" onclick="crazy_buttonclose()"></div>';
	}
	}	
	document.getElementById(elm).innerHTML = str;
}

function crazy_faTracker(sche,datatime,t)
{
	if (!document.getElementById("crazy_fa_img"))
	{
		return;
	}
	if(t=='mps'){
		if(1==0){
			var src="http://atm.yoyi.com.cn/s/pl/;r=0;p=2522;s=1;a=27175;m=30438;mps="+sche;	
		}else{
			var src="http://atm.yoyi.com.cn/s/pl/;r=323317654519352;p=2522;s=1;a=27175;m=30438;mps="+sche;
		}
	}else{
		if(1==0){
			var src="http://atm.yoyi.com.cn/s/pl/;r=0;p=2522;s=1;a=27175;m=30438;tps="+sche;	
		}else{
			var src="http://atm.yoyi.com.cn/s/pl/;r=323317654519352;p=2522;s=1;a=27175;m=30438;tps="+sche;
		}
	}
	document.getElementById("crazy_fa_img").src = src;
}
function crazy_buttonclose()
{
    crazy_faTracker("-1","-1");
	if (crazy_close_sign == 0)
	{
			crazy_close_sign = 1;
			if (isMoz == true) 
				setTimeout("crazy_hidediv()",50);
			else	
				crazy_hidediv();
	}	
}
function crazy_changediv()
{

	document.getElementById('crazy_crazy_small').style.display = "none";
	document.getElementById('crazy_crazy_max').style.display = "block";
	document.getElementById('crazy_crazy_max').style.top = (parseInt(window.pageYOffset | document.documentElement.scrollTop | document.body.scrollTop) + 46) + "px";


	document.getElementById('crazy_crazy_max').style.left = document.body.scrollLeft + parseInt((document.body.clientWidth-1000)/2+0);
	insertFlash("crazy_crazy_max", afp_flash_player_src_big,"1000", "300");
	crazy_ad_Resize();

}

function crazy_changebigdiv()
{

	document.getElementById('crazy_crazy_small').style.display = "none";
	document.getElementById('crazy_crazy_max').style.display = "block";
	document.getElementById('crazy_crazy_max').style.top = (parseInt(window.pageYOffset | document.documentElement.scrollTop | document.body.scrollTop) + 46) + "px";
	document.getElementById('crazy_crazy_max').style.left = document.body.scrollLeft + parseInt((document.body.clientWidth-1000)/2+0);
	crazy_ad_Resize();

}
function crazy_hidediv()
{
	document.getElementById('crazy_crazy_small').style.display = "block";
	document.getElementById('crazy_crazy_max').style.display = "none";
	insertFlash("crazy_crazy_small", afp_flash_player_src_small,"25", "220");
	crazy_ad_Resize();
}
function crazy_hidesmalldiv()
{
	document.getElementById('crazy_crazy_small').style.display = "none";
	document.getElementById('crazy_crazy_max').style.display = "none";
	crazy_ad_Resize();
}

function crazy_showfull()
{
	var oneday=24*3600*1000,now=new Date().getTime();
	var count=Get_Cookie("crazy_yoyi_count");
	var times=Get_Cookie("crazy_yoyi_times");
	if (times==null)
	{
		Set_Cookie("crazy_yoyi_count","1");
		Set_Cookie("crazy_yoyi_times",now);
		setTimeout("crazy_changediv()",1000); 
				if (crazy_view_both == 1)
					insertFlash("crazy_crazy_small", afp_flash_player_src_small,"25", "220");
		
	}else{
		if(now-times>oneday){
			Set_Cookie("crazy_yoyi_count","1");
			Set_Cookie("crazy_yoyi_times",now);
			setTimeout("crazy_changediv()",1000); 
				if (crazy_view_both == 1)
					insertFlash("crazy_crazy_small", afp_flash_player_src_small,"25", "220");
			
		}else{
			count=count*1+1;
			Set_Cookie("crazy_yoyi_count",count);			
			if(count<= crazy_view_limit){
				setTimeout("crazy_changediv()",1000); 
				if (crazy_view_both == 1)
					insertFlash("crazy_crazy_small", afp_flash_player_src_small,"25", "220");
				
				}else{
					insertFlash("crazy_crazy_small", afp_flash_player_src_small,"25", "220");
					}
		}
	
	}
	setInterval("crazy_ad_Resize()",100);
}
function crazy_ad_Resize() 
{
	var crazy_docWidth = 0;
	var crazy_docHeight = 0;
	var crazy_scrollLeft = 0;
	var crazy_scrollTop = 0;


	if(window.pageXOffset)
	{
		crazy_scrollLeft=window.pageXOffset;
	}
	else if(document.documentElement&&document.documentElement.scrollLeft)
	{
		crazy_scrollLeft=document.documentElement.scrollLeft;
	}
	else if(document.body)
	{
		crazy_scrollLeft=document.body.scrollLeft; 
	}

	if(window.pageYOffset)
	{
		crazy_scrollTop=window.pageYOffset;
	}
	else if(document.documentElement&&document.documentElement.scrollTop)
	{
		crazy_scrollTop=document.documentElement.scrollTop;
	}
	else if(document.body)
	{
		crazy_scrollTop=document.body.scrollTop;
	}

	/*if(window.innerWidth)
	{
		crazy_docWidth=parseInt(window.innerWidth)-6;
	}
	else if(document.documentElement&&document.documentElement.clientWidth)
	{ 
		crazy_docWidth=document.documentElement.clientWidth+10;
	}
	else if(document.body)
	{
		crazy_docWidth=document.body.clientWidth; 
	}
	*/
	crazy_docWidth = document.documentElement.clientWidth;

	if(window.innerHeight)
	{
		crazy_docHeight=parseInt(window.innerHeight);
	}
	else if(document.documentElement&&document.documentElement.clientHeight)
	{ 
		crazy_docHeight=document.documentElement.clientHeight; 		
	}
	else if(document.body)
	{
		crazy_docHeight=document.body.clientHeight;
	}

	var crazy_small_divHeight = document.getElementById("crazy_crazy_small").offsetHeight;
	var crazy_small_divWidth = document.getElementById("crazy_crazy_small").offsetWidth;
	var crazy_max_divHeight = document.getElementById("crazy_crazy_max").offsetHeight;
	var crazy_max_divWidth = document.getElementById("crazy_crazy_max").offsetWidth;

	if(document.getElementById("crazy_crazy_small"))
	{
		if( crazy_src1_mode==1)
		{
			document.getElementById('crazy_crazy_small').style.left= (0) + "px";
		}
		else
		{
			document.getElementById('crazy_crazy_small').style.left= (parseInt(crazy_scrollLeft) + parseInt((crazy_docWidth)) - crazy_small_divWidth - 0) + "px";
		}
		
		if (crazy_src1_bottom > 0)
		{
			if(isIE6)
			{
			  document.getElementById('crazy_crazy_small').style.top = (parseInt(crazy_scrollTop) + parseInt(crazy_docHeight) - crazy_small_divHeight - crazy_src1_bottom) + "px";	
			}
			else
			{
			  document.getElementById('crazy_crazy_small').style.top =(parseInt(crazy_docHeight) - crazy_small_divHeight - crazy_src1_bottom)+ "px";
			}
		}
		else
		{
			if(isIE6)
			{
			  document.getElementById('crazy_crazy_small').style.top = (parseInt(crazy_scrollTop) + crazy_src1_top) + "px";	
			}
			else
			{
			  document.getElementById('crazy_crazy_small').style.top = crazy_src1_top+ "px";
			}
		}
	}
	if(document.getElementById("crazy_crazy_max") && crazy_resize_sign == 1)
	{
		if(isIE6)
		{
			document.getElementById("crazy_crazy_max").style.top = (parseInt(crazy_scrollTop) + 46) + "px";
		}
		else
		{
			document.getElementById("crazy_crazy_max").style.top =46+ "px";
		}
	}
	var s=1;
	if(window.navigator.userAgent.indexOf("MSIE")>-1){s=0}
     if(window.navigator.userAgent.indexOf("MSIE 6.0")>-1){s=0}
    if(window.navigator.userAgent.indexOf("MSIE 9.0")>-1){s=1}
	document.getElementById("crazy_crazy_max").style.left = (parseInt(crazy_scrollLeft) + parseInt((crazy_docWidth-1000)/2) + 0 + s)+"px";
}

function crazy_ExCommand(command, object)
{
	if(command == "repeat")
	{
		crazy_faTracker("repeat",object.time,"mps");
		crazy_close_sign = 0;
		crazy_changediv();
	}
	
	if(command == "close")
	{

	        crazy_faTracker("-1",object.time,"mps");
		if (crazy_close_sign == 0)
		{
			crazy_close_sign = 1;
			if (isMoz == true) 
				setTimeout("crazy_hidediv()",50);
			else	
				crazy_hidediv();
		}
	}

	if(command == "open"){
		crazy_faTracker("0",object.time);
		if(1==1){
		    document.getElementById("yoyi_log_img").src="http://atm.yoyi.com.cn/s/smp/;p=2522;s=1;a=27175;m=30438;x=1";
	    }
		if(client_url!=""){ document.getElementById("crazy_fa_img_client").src=client_url}	
	}

	if(command == "pos50") {
		crazy_faTracker("50",object.time);
	
	}

	if(command == "pos100") {
		crazy_faTracker("100",object.time);
	}

	if(command == "autoclose") {
		if (crazy_close_sign == 0)
		{
			crazy_close_sign = 1;
			if (isMoz == true) 
				setTimeout("crazy_hidediv()",50);
			else	
				crazy_hidediv();
		}
	}
	if(command == "closesmall")
	{
		crazy_faTracker("-2",object.time,"mps");
		crazy_hidesmalldiv();
	}

	if (command == "link")
	{
		if(object.objID == afp_flash_player_src_big){
			if(1==0){
				crazy_link_url ="http://atm.yoyi.com.cn/s/clk/;r=0;p=2522;s=1;a=27175;m=30438;mps="+object.time+";u=http://e.cn.miaozhen.com/r.gif?k=1007102&p=3yiWs0&ro=sm&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http://www.yiliqqstar.com/";	
			}else{
				crazy_link_url ="http://atm.yoyi.com.cn/s/clk/;r=323317654519352;p=2522;s=1;a=27175;m=30438;mps="+object.time+";u=http://e.cn.miaozhen.com/r.gif?k=1007102&p=3yiWs0&ro=sm&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http://www.yiliqqstar.com/";
			}
		    window.open(crazy_link_url);
		}else{
			if(1==0){
				crazy_smalllink_url ="http://atm.yoyi.com.cn/s/clk/;r=0;p=2522;s=1;a=27175;m=30439;mps="+object.time+";u=http://e.cn.miaozhen.com/r.gif?k=1007102&p=3yiWs0&ro=sm&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http://www.yiliqqstar.com/";	
			}else{
				crazy_smalllink_url ="http://atm.yoyi.com.cn/s/clk/;r=323317654519352;p=2522;s=1;a=27175;m=30439;mps="+object.time+";u=http://e.cn.miaozhen.com/r.gif?k=1007102&p=3yiWs0&ro=sm&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&o=http://www.yiliqqstar.com/";
			}
		    window.open(crazy_smalllink_url);
		}
		
	}
}
//document.getElementById('crazy_crazy_max').style.display = "none";
function Get_Cookie( name ) {
	var start = document.cookie.indexOf( name + "=" );
	var len = start + name.length + 1;
	if ( ( !start ) && ( name != document.cookie.substring( 0, name.length ) ) )
	{
		return null;
	}
	if ( start == -1 ) return null;
	var end = document.cookie.indexOf( ";", len );
	if ( end == -1 ) end = document.cookie.length;
	return unescape( document.cookie.substring( len, end ) );
}

function Set_Cookie( name, value, expires, path, secure ) {
	// set time, it's in milliseconds
	document.cookie = name + "=" +escape( value ) +
	( ( expires ) ? ";expires=" + expires.toGMTString() : "" ) + //expires.toGMTString()
	( ( path ) ? ";path=" + path : "" ) +
	( ( secure ) ? ";secure" : "" );
}
function Delete_Cookie( name, path ) {
	if ( Get_Cookie( name ) ) document.cookie = name + "=" +
	( ( path ) ? ";path=" + path : "") +
	";expires=Thu, 01-Jan-1970 00:00:01 GMT";
}

function Yoyi_Show_Crazy(){
	
	   if(1==0){
	      if(crazy_tdate>=today_nine_date&&crazy_tdate<=today_one_date){
	        crazy_showfull();
	      }
	   }else{
	        crazy_showfull();
	   }
	   
	
}
Yoyi_Show_Crazy();
window.yoyi_adloaded_2522=1;

function ya_setservercookie( count ){ if(typeof( yaSetCookie ) != 'function') 
	return;  
_yusrid="QMITF06BdPH3QU0aX09l6";  
_yufc="1384506616" ;  
if( typeof( window.yoyi_IsFlashLoaded ) == 'undefined' ){  yaSetCookie( _yausridprefix , _yusrid ) ; yaSetCookie( _yaufcprefix , _yufc ) ; return ; } if( window.yoyi_IsFlashLoaded <= 0 ) { if( count < 5 ) { setTimeout( 'ya_setservercookie(' + ( count + 1 ) + ')' , 1000 ) ; return ; } } 
 try{ _userid = yaReadCookie( _yausridprefix ) ; if( !_userid || _userid == '-' || _userid == '' || _userid == 'null' || typeof( _userid ) == 'undefined' ){ yaSetCookie( _yausridprefix , _yusrid ) ; yaSetCookie( _yaufcprefix , _yufc ) ; } } catch(err){}} ya_setservercookie( 0 ) ;

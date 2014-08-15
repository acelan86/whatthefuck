window.YOYIVER=444;
	var afp_link_url = null;
	var afp_time_url = "http://atm.yoyi.com.cn/s/pl";
	var afp_count_limit = 1000;
	var afp_count_limit_cur = 0;
	var afp_view_limit = 1000;
	var afp_objTimer; 
	var afp_flash_player_src = "http://rm.sina.com.cn/yoyi/1zdy/11/15/jianeng/1.swf";
	var afp_flash_player_width =300;
	var afp_flash_player_height =300;
	var afp_resize_sign = 1;
	var afp_ad_time_url2="http://g.cn.miaozhen.com/x.gif?k=1007102&p=3yiWs0&rt=2&ns=[M_ADIP]&ni=[M_IESID]&na=[M_MAC]&v=[M_LOC]&o=";
	var afp_flash_player_button_width = "55";
	var afp_close_value = false;
	var sbrowser = navigator.userAgent;
	var isMoz = false;
	var isSafa = false;
	if (sbrowser.indexOf("Safari") > -1 && sbrowser.indexOf("Chrome") == -1 && sbrowser.indexOf("Maxthon")==-1){
		isSafa = true;
	}else if (sbrowser.indexOf("Mozilla") > -1 && sbrowser.indexOf("Gecko") > -1){
		var reMoz = new RegExp("rv:(([0-9]+\\.[0-9]+)(?:\\.[0-9]+)?)");
		reMoz.test(sbrowser);
		if (RegExp["$2"] == '1.8') isMoz = true;
	}
	var isIE6=(window.XMLHttpRequest)?false:true;
	var isIE=(document.all)?true:false;
	if(document.compatMode == "BackCompat"){
		var dou = document.body;
	}else{
		var dou = document.documentElement;
	}
	var yoyi_afp_firstTop=(parseInt(dou.clientHeight) - 300);
    var yoyi_afp_firstLeft=(parseInt(dou.clientWidth) - 300);
	function unicode(s){ 
	 var len=s.length; 
	 var rs=""; 
	 for(var i=0;i<len;i++){ 
	 var k=s.substring(i,i+1); 
	 rs+="&#"+s.charCodeAt(i)+";"; 
	 } 
	 return rs; 
	}
	if(window.YOYIVER>=1&&typeof(window.YOYIVER)!="undefined"){
	    var afp_videofm_img=document.createElement('img');
	    document.body.insertBefore(afp_videofm_img,document.body.firstChild);
	    afp_videofm_img.id='afp_videofm_img';
	    afp_videofm_img.style.width=0+'px';
	    afp_videofm_img.style.height=0+'px';
	    afp_videofm_img.style.border=0+'px';
	    afp_videofm_img.style.position='absolute';
	    afp_videofm_img.style.top=0+'px';
	    afp_videofm_img.style.left=0+'px';
				
		var afp_jiance=document.createElement('img');
	    document.body.insertBefore(afp_jiance,document.body.firstChild);
	    afp_jiance.id='afp_jiance';
	    afp_jiance.style.width=0+'px';
	    afp_jiance.style.height=0+'px';
	    afp_jiance.style.border=0+'px';
	    afp_jiance.style.position='absolute';
	    afp_jiance.style.top=0+'px';
	    afp_jiance.style.left=0+'px';
		
		var yoyi_log_img=document.createElement('img');
	    document.body.insertBefore(yoyi_log_img,document.body.firstChild);
	    yoyi_log_img.id='yoyi_log_img';
	    yoyi_log_img.style.width=0+'px';
	    yoyi_log_img.style.height=0+'px';
	    yoyi_log_img.style.border=0+'px';
	    yoyi_log_img.style.position='absolute';
	    yoyi_log_img.style.top=0+'px';
	    yoyi_log_img.style.left=0+'px';
	}else{
	    document.write("<img id='afp_videofm_img' width=0 height=0 border=0 style='position:absolute;top:0px;left:0px;'>");
	    document.write("<img id='afp_jiance' width=0 height=0 border=0 style='position:absolute;top:0px;left:0px;'>");
		document.write("<img id='yoyi_log_img' width=0 height=0 border=0 style='position:absolute;top:0px;left:0px;'>");
	}
	if(window.YOYIVER>=1&&typeof(window.YOYIVER)!="undefined"){
	    if(isIE6){
		  var afp_videofm_video_yoyi=document.createElement('div');
		  afp_videofm_video_yoyi.id='afp_videofm_video_yoyi';
		  afp_videofm_video_yoyi.style.position='absolute';
		  afp_videofm_video_yoyi.style.top=yoyi_afp_firstTop+'px';
		  afp_videofm_video_yoyi.style.left=yoyi_afp_firstLeft+'px';
		  afp_videofm_video_yoyi.style.zIndex=11000;
		  afp_videofm_video_yoyi.style.visibility='visible';
		    document.body.insertBefore(afp_videofm_video_yoyi,document.body.firstChild);
	    }else{
		  if(afp_resize_sign==1){
		    var afp_videofm_video_yoyi=document.createElement('div');
		    afp_videofm_video_yoyi.id='afp_videofm_video_yoyi';
		    afp_videofm_video_yoyi.style.position='fixed';
		    afp_videofm_video_yoyi.style.top=yoyi_afp_firstTop+'px';
		    afp_videofm_video_yoyi.style.left=yoyi_afp_firstLeft+'px';
		    afp_videofm_video_yoyi.style.zIndex=11000;
		    afp_videofm_video_yoyi.style.visibility='visible';
		     document.body.insertBefore(afp_videofm_video_yoyi,document.body.firstChild);
		  }else{
		    var afp_videofm_video_yoyi=document.createElement('div');
		    afp_videofm_video_yoyi.id='afp_videofm_video_yoyi';
		    afp_videofm_video_yoyi.style.position=unicode("absolute");
		    afp_videofm_video_yoyi.style.top=yoyi_afp_firstTop+'px';
		    afp_videofm_video_yoyi.style.left=yoyi_afp_firstLeft+'px';
		    afp_videofm_video_yoyi.style.zIndex=11000;
		    afp_videofm_video_yoyi.style.visibility='visible';
		     document.body.insertBefore(afp_videofm_video_yoyi,document.body.firstChild);
		  }	  
	    }
	}else{
	    if(isIE6){
		  document.write("<div id='afp_videofm_video_yoyi' style='position:"+unicode("absolute")+"; top:"+yoyi_afp_firstTop+"px; left:"+yoyi_afp_firstLeft+"px;z-index:10001; visibility: visible;'></div>");
	    }else{
		  if(afp_resize_sign==1){
		    document.write("<div id='afp_videofm_video_yoyi' style='position:fixed;top:"+yoyi_afp_firstTop+"px;left:"+yoyi_afp_firstLeft+"px;z-index:10001; visibility: visible;'></div>");
		  }else{
		    document.write("<div id='afp_videofm_video_yoyi' style='position:"+unicode("absolute")+";top:"+yoyi_afp_firstTop+"px;left:"+yoyi_afp_firstLeft+"px;z-index:10001; visibility: visible;'></div>");
		  }	  
	    }
	}
	function afp_show_flash(){
		var flashStr = "";
		if(isIE){
			flashStr += "<OBJECT id=\"VideoPlayer\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0\" WIDTH=\""+afp_flash_player_width+"\" HEIGHT=\""+afp_flash_player_height+"\" ALIGN=\"\">";
			flashStr += "<PARAM NAME=\"movie\" VALUE=\""+afp_flash_player_src+"\">";
			flashStr += "<PARAM NAME=\"quality\" VALUE=\"high\">";
			flashStr += "<PARAM NAME=\"loop\" VALUE=\"false\">";
			flashStr += "<PARAM NAME=\"wmode\" VALUE=\"transparent\">";
			flashStr += "<PARAM NAME=\"allowscriptaccess\" VALUE=\"always\">";
			flashStr += '<PARAM NAME="flashvars" value="jsFunName=afp_ExCommand" />';
			flashStr += "<PARAM NAME=\"bgcolor\" VALUE=\"#FFFFFF\">";
			flashStr += "</OBJECT>";
			if(isIE6){
			flashStr+= '<iframe style="position:absolute;top:0;left:0;width:'+afp_flash_player_width+';height:'+afp_flash_player_height+';filter:alpha(opacity=0);z-index:-1;"></iframe>';
		    }
		}else{
			flashStr += "<EMBED id=\"VideoPlayer\" flashvars=\"jsFunName=afp_ExCommand\" src=\""+afp_flash_player_src+"\" swLiveConnect=\"true\" quality=\"high\" loop=\"false\" allowscriptaccess=\"always\" wmode=\"transparent\" bgcolor=\"#FFFFFF\" WIDTH=\""+afp_flash_player_width+"\" HEIGHT=\""+afp_flash_player_height+"\" NAME=\"videofm\" ALIGN=\"\" TYPE=\"application/x-shockwave-flash\" PLUGINSPAGE=\"http://www.macromedia.com/go/getflashplayer\"></EMBED>";
		}
		document.getElementById("afp_videofm_video_yoyi").innerHTML = flashStr;
		setInterval("afp_videofmResize()",100);
	}
	function afp_videofmResize(){
		if(!document.getElementById("afp_videofm_video_yoyi"))
		{
			return;
		}
		var afp_divHeight =afp_flash_player_height;
		var afp_divWidth = afp_flash_player_width;
		var afp_docWidth = 0;
		var afp_docHeight = 0;
		var afp_scrollLeft = 0;
		var afp_scrollTop = 0;
		if(window.pageXOffset)
		{
			afp_scrollLeft=window.pageXOffset;
		}
		else if(document.documentElement&&document.documentElement.scrollLeft)
		{
			afp_scrollLeft=document.documentElement.scrollLeft;
		}
		else if(document.body)
		{
			afp_scrollLeft=document.body.scrollLeft; 
		}
		if(window.pageYOffset)
		{
			afp_scrollTop=window.pageYOffset;
		}
		else if(document.documentElement&&document.documentElement.scrollTop)
		{
			afp_scrollTop=document.documentElement.scrollTop;
		}
		else if(document.body)
		{
			afp_scrollTop=document.body.scrollTop;
		}
		if(window.innerWidth)
		{
			afp_docWidth=parseInt(window.innerWidth)-17;
		}
		else if(document.documentElement&&document.documentElement.clientWidth)
		{ 
			afp_docWidth=document.documentElement.clientWidth;
		}
		else if(document.body)
		{
			afp_docWidth=document.body.clientWidth; 
		}
		if(document.documentElement&&document.documentElement.clientHeight)
		{ 
			afp_docHeight=document.documentElement.clientHeight; 
		}
		else if(document.body)
		{
			afp_docHeight=document.body.clientHeight;
		}
		if(afp_resize_sign==1){
			if(isIE6){
			document.getElementById("afp_videofm_video_yoyi").style.top = (parseInt(afp_docHeight) - parseInt(afp_divHeight) + parseInt(afp_scrollTop)) + "px";
			}else{
			document.getElementById("afp_videofm_video_yoyi").style.top = (parseInt(afp_docHeight) - parseInt(afp_divHeight)) + "px";
			}
		}else{
		    document.getElementById("afp_videofm_video_yoyi").style.top = (parseInt(afp_docHeight) - parseInt(afp_divHeight)) + "px";
		}
		document.getElementById("afp_videofm_video_yoyi").style.left = (parseInt(afp_docWidth) - parseInt(afp_divWidth) + parseInt(afp_scrollLeft)) + "px";
	}
	function afp_videofmMoveLeft()
	{

		var afp_divLefts = parseInt(document.getElementById("afp_videofm_video_yoyi").style.left);
		document.getElementById("afp_videofm_video_yoyi").style.left = (afp_divLefts - parseInt(afp_flash_player_width)) + "px"; 
		document.getElementById("afp_videofm_video_yoyi").style.width = afp_flash_player_width + "px";
	}
	function afp_videofmMoveRight()
	{
		var afp_divLefts = parseInt(document.getElementById("afp_videofm_video_yoyi").style.left);
		document.getElementById("afp_videofm_video_yoyi").style.left = (afp_divLefts + parseInt(afp_flash_player_width) - parseInt(afp_flash_player_button_width)) + "px";
		document.getElementById("afp_videofm_video_yoyi").style.width = afp_flash_player_button_width + "px";
		afp_videofmResize();
	}
	function afp_videofmTracker(sche,datatime,t)
	{
		if (!document.getElementById("afp_videofm_img"))
		{
			return;
		}
		if (afp_count_limit_cur <= afp_count_limit)
		{
			if(t=="mps"){
				if(1==0){
					var src = "http://atm.yoyi.com.cn/s/pl/;r=0;p=2683;s=1;a=27198;m=30483;mps="+sche;
				}else{
					var src = "http://atm.yoyi.com.cn/s/pl/;r=325633750647696;p=2683;s=1;a=27198;m=30483;mps="+sche;
				}
			}else{
				if(1==0){
					var src = "http://atm.yoyi.com.cn/s/pl/;r=0;p=2683;s=1;a=27198;m=30483;tps="+sche;
				}else{
					var src = "http://atm.yoyi.com.cn/s/pl/;r=325633750647696;p=2683;s=1;a=27198;m=30483;tps="+sche;
				}
			}				
			document.getElementById("afp_videofm_img").src = src;
		}
	}
	var isBound = false;
	function afp_ExCommand(command,value)
	{
		if(!value){
			value={time:0}
		}
		if(!value.time){
			value.time=-1;
		}
		if(command == "open")
		{
			afp_count_limit_cur ++;
			afp_videofmTracker("0",value.time);
			if(afp_ad_time_url2!=""){
				document.getElementById("afp_jiance").src=afp_ad_time_url2;
			}
			if(1==0){
				var yoyi_ad_url="http://atm.yoyi.com.cn/s/clk/;r=0;p=2683;s=1;a=27198;m=30483;mps="+value.time+";u=http://mlt01.com/c.htm?pv=1&sp=0,762892,770166,2111138,0,1,1&target=http://www.canon.com.cn/specialsite/power/?ngAdID=1185DC0828A71";	
			}else{
				var yoyi_ad_url="http://atm.yoyi.com.cn/s/clk/;r=325633750647696;p=2683;s=1;a=27198;m=30483;mps="+value.time+";u=http://mlt01.com/c.htm?pv=1&sp=0,762892,770166,2111138,0,1,1&target=http://www.canon.com.cn/specialsite/power/?ngAdID=1185DC0828A71";
			}
			var yoyi_url=new Array();
			var yoyi_rand=0;
			yoyi_url[0]=yoyi_ad_url;
			yoyi_url[1]=yoyi_ad_url;
			
			if(1==1){
			   document.getElementById("yoyi_log_img").src="http://atm.yoyi.com.cn/s/smp/;p=2683;s=1;a=27198;m=30483;x=1";
			}
			afp_videofmResize();
		}
		else if(command == "play"){
		document.getElementById('afp_videofm_video_yoyi').style.zIndex = "11000";
			afp_videofmTracker("play",value.time,"mps");
			if(isBound){
				afp_videofmTracker("0",value.time);	
			}
		}
		else if(command == "replay"){
		document.getElementById('afp_videofm_video_yoyi').style.zIndex = "11000";
			afp_videofmTracker("replay",value.time,"mps");
			afp_videofmTracker("0",value.time);
		}
		else if(command == "pause"){
			isBound = false;
			afp_videofmTracker("pause",value.time,"mps");
		}
		else if(command == "pos50")
		{
			afp_videofmTracker("50",value.time);
		}
		else if(command == "pos100")
		{	document.getElementById('afp_videofm_video_yoyi').style.zIndex = "11000";
			afp_videofmTracker("100",value.time);
			isBound = true;
		}
		else if(command == "autoclose")
		{
			document.getElementById('afp_videofm_video_yoyi').style.display = "none";
			document.getElementById('afp_videofm_video_yoyi').innerHTML = "";
		}
		else if(command == "close")
		{
			afp_videofmTracker("-1",value.time,"mps");
			document.getElementById('afp_videofm_video_yoyi').style.display = "none";
			document.getElementById('afp_videofm_video_yoyi').innerHTML = "";
		}
		else if(command == "share")
		{
			afp_videofmTracker("share",value.time,"mps");
			window.open("mailto:?subject=标题：推荐精美Flash&body=内容：您的好友为您推荐了一个Flash短片,您可以点击如下地址欣赏:"+window.location);
		}
		else if(command == "link")
		{
			if(1==0){
				afp_link_url = "http://atm.yoyi.com.cn/s/clk/;r=0;p=2683;s=1;a=27198;m=30483;mps="+value.time+";u=http://mlt01.com/c.htm?pv=1&sp=0,762892,770166,2111138,0,1,1&target=http://www.canon.com.cn/specialsite/power/?ngAdID=1185DC0828A71";	
			}else{
				afp_link_url = "http://atm.yoyi.com.cn/s/clk/;r=325633750647696;p=2683;s=1;a=27198;m=30483;mps="+value.time+";u=http://mlt01.com/c.htm?pv=1&sp=0,762892,770166,2111138,0,1,1&target=http://www.canon.com.cn/specialsite/power/?ngAdID=1185DC0828A71";
			}
			window.open(afp_link_url);
		}
	}
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

	// this deletes the cookie when called
	function Delete_Cookie( name, path ) {
		if ( Get_Cookie( name ) ) document.cookie = name + "=" +
		( ( path ) ? ";path=" + path : "") +
		";expires=Thu, 01-Jan-1970 00:00:01 GMT";
	}

	var tdate = new Date(); 
	tdate.setHours(tdate.getHours()+ 24);

	var show_tdate = new Date(); 
	show_tdate.setMinutes(show_tdate.getMinutes()+ 0);


	var yoyi_focus_flv_count = Get_Cookie("yoyi_focus_27198_count");
	if (yoyi_focus_flv_count==null)
	{
		Set_Cookie("yoyi_focus_27198_count","0",tdate,"/","");
	}
	else
	{
		yoyi_focus_flv_count=Number(yoyi_focus_flv_count)+1;
		Set_Cookie("yoyi_focus_27198_count",yoyi_focus_flv_count,tdate,"/","");
	}

	yoyi_focus_flv_count = Get_Cookie("yoyi_focus_27198_count");

	var yoyi_focus_show_count = Get_Cookie("yoyi_focus_27198_show_count");
	if (yoyi_focus_show_count==null)
	{
		Set_Cookie("yoyi_focus_27198_show_count","1",show_tdate,"/","");
	}

	if ((afp_view_limit <= 0 || yoyi_focus_flv_count < afp_view_limit)  && yoyi_focus_show_count == null)
	{
		
			afp_show_flash();
		
	}
window.yoyi_adloaded_2683=1;

function ya_setservercookie( count ){ if(typeof( yaSetCookie ) != 'function') 
	return;  
_yusrid="VUUJQ06BdPH3Wr03k29l6";  
_yufc="1384507870" ;  
if( typeof( window.yoyi_IsFlashLoaded ) == 'undefined' ){  yaSetCookie( _yausridprefix , _yusrid ) ; yaSetCookie( _yaufcprefix , _yufc ) ; return ; } if( window.yoyi_IsFlashLoaded <= 0 ) { if( count < 5 ) { setTimeout( 'ya_setservercookie(' + ( count + 1 ) + ')' , 1000 ) ; return ; } } 
 try{ _userid = yaReadCookie( _yausridprefix ) ; if( !_userid || _userid == '-' || _userid == '' || _userid == 'null' || typeof( _userid ) == 'undefined' ){ yaSetCookie( _yausridprefix , _yusrid ) ; yaSetCookie( _yaufcprefix , _yufc ) ; } } catch(err){}} ya_setservercookie( 0 ) ;

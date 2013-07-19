<?php
    header('Content-Type', 'application/javascript');
    $array = array();
    $array["pdps0"] = "{'id':'pdps0', 'type':'Couple','size':'980*90', 'engineType':'sina', 'value':['http://img.adbox.sina.com.cn/ad/11521.html', 'http://img.adbox.sina.com.cn/ad/14954.html', 'http://img.adbox.sina.com.cn/ad/14954.html'], pv: 'http://d1.sina.com.cn/click/pdps0', mapping:['http://d1.sina.com.cn/mapping/pdps0', 'http://d2.sina.com.cn/mapping/pdps0']}";
    $array["pdps1"] = "{'id':'pdps1', 'size':'300*500','type':'EMBED', 'content':{type:['url'], src:['http://img.adbox.sina.com.cn/ad/6009.html'], pv:'http://testpv.com'}}";
    $array["pdps4"] = "{'type':'BP', 'value':'http://baidu.com'}";
    $array["pdps2"] = "{'type':'Wins', size:'250*230','content':{src:'http://d1.sina.com.cn/rwei/shijia2012/shichuang1129/300x250.swf', link:'http://sina.allyes.com/main/adfclick?db=sina&bid=508601,573886,579158&cid=0,0,0&sid=581485&advid=18960&camid=89632&show=ignore&url=http://www.china-shijia.com/'}}";
    $array["pdps3"] = "{'type':'Stream', size:'960*300','value':['http://img.adbox.sina.com.cn/ad/14785.html', 'http://img.adbox.sina.com.cn/ad/14954.html']}";
	$array['pdps5'] = "{'type':'EMBED', size:'300*250', content:{type:['fragment'],src:['\\x3cscript type=\"text\/javascript\"\\x3e \/*120*120，创建于2013-6-5*\/ var cpro_id = \"u1297930\"; \\x3c\/script\\x3e \\x3cscript src=\"http:\/\/cpro.baidustatic.com\/cpro\/ui\/f.js\" type=\"text\/javascript\"\\x3e\\x3c\/script\\x3e']}}";
    
	$array['pdps_js_1000_90'] = "{'type':'EMBED', size:'1000*90', content:{type:['js'], src:['./test/js.js']}}";
	$array['pdps_html_1000_90'] = "{type:'EMBED', size:'950*90', content:{type:['fragment'], src:['\\x3cscript type=\"text\/javascript\"\\x3etry { var google_page_url = window.top.location.href;}catch(err) {    var google_page_url = document.referrer || window.location.href;}var google_ad_client = \"ca-pub-1948721619348611\";var google_ad_slot = 9150438679;var google_ad_width = 950;var google_ad_height = 90;\\x3c\/script\\x3e\\x3cscript type=\"text\/javascript\"src=\"http:\/\/pagead2.googlesyndication.com\/pagead\/show_ads.js\"\\x3e\\x3c\/script\\x3e']}}";
    $array["pdps_url_1000_90"] = "{'id':'pdps1000_90', 'type':'EMBED','size':'1000*90', 'content':{type : ['url'], src : ['http://d4.sina.com.cn/201307/12/501436.html'], pv: 'http://d1.sina.com.cn/click/pdps0'}, mapping:['http://d1.sina.com.cn/mapping/pdps0', 'http://d2.sina.com.cn/mapping/pdps0']}";
    $array["pdps_mobi"] = "{id:'pdps_mobi', size:'320*35', type:'EMBED', content:{type:'url', src:'http://img.adbox.sina.com.cn/ad/16027.html'}}";
    
    echo $_GET["callback"]."(".$array[$_GET['pdps']].");";
?>
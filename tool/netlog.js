var page = require('webpage').create();
// page.onResourceRequested = function(request, networkRequest) {
//     //console.log(request.url + ':' + request.time));
// };
// page.onResourceReceived = function(response) {
//     response.stage === 'end' && console.log(response.url + ':' + response.status + ':' + response.time);
// };
// page.open('http://alitui.weibo.com/aj/static/taobao/widget1.html', 'GET', function () {});
var list = [],
	max = 200;

page.onResourceReceived = function (response) {
	
	if (response.stage === 'start') {
		max--;
		// list.push({
		// 	'time': +new Date(),
		// 	'status' : response.status,
		// 	'size' : response.bodySize
		// });
		console.log('id:' + max + '\ttime:' + (+new Date()) + '\tstatus:' + response.status + '\tsize:' + response.bodySize);
		
		if (max > 0) {
			setTimeout(function () {
				page.open('http://sax.sina.com.cn/impress?rotate_count=' + max + '&adunitid=PDPS000000037694&TIMESTAMP=1380116628323&referral=http%3A%2F%2Falitui.weibo.com%2Faj%2Fstatic%2Fweibo2sax.html%3Fid%3Dad_37694&callback=_ssp_ad.callback', 'GET');
			}, 5 * 60 * 1000); 
		} 
		// else {
		// 	for (var i = 0, len = list.length; i < len; i++) {
		// 		console.log('time:' + list[i].time + '\tstatus:' + list[i].status + '\tsize:' + list[i].size);
		// 	}
		// }
	}
}
page.open('http://sax.sina.com.cn/impress?rotate_count=0&adunitid=PDPS000000037694&TIMESTAMP=1380116628323&referral=http%3A%2F%2Falitui.weibo.com%2Faj%2Fstatic%2Fweibo2sax.html%3Fid%3Dad_37694&callback=_ssp_ad.callback', 'GET');

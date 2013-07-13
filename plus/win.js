var width = sinaads_ad_width,
	height = sinaads_ad_height;

if (top === self) {
	sinaads_win(window.document, sinaads_ad_data);
	/* 广告不在 iframe 中。展示该广告。可以使用 document.write 展示该广告。*/
} else {
    try {
    	sinaads_win(window.top.document, sinaads_ad_data);
		/* 使用适当的代码以让广告对 iframe 进行转义，并展示该广告。该代码很有可能需要使用 DOM 函数并引用顶部窗口。*/
    } catch (e) {
		document.write('由于跨域， 无法显示跨栏广告');
		/* 该广告无法对该 iframe 进行转义。显示一个适当的备用广告。该备用广告将仍位于该 iframe 中。*/
	}
}

function sinaads_win(document, data) {
	var div = document.createElement('div');
	div.innerHTML = '<iframe src="' + data.content + '" frameborder="0" style="width:' + width + 'px;height:' + height + 'px;"></iframe>';
	div.style.cssText = 'position:fixed;right:0px;bottom:0px;width:' + width + 'px;height:' + height + 'px;';
	document.body.appendChild(div);
}
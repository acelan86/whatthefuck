(function (window, undefined) {
    window.sinaads_render = function (data) {
        window.sinaads_ad_data = data;
        switch (data.type) {
            case 'Couple' :
                document.write('<script src="./plus/couple.js"></script>');
                break;
            case 'Wins' :
                document.write('<script src="./plus/win.js"></script>');
                break;
            default : 
                document.write('<iframe src="' + data.content.src + '" frameborder="0" style="width:' + data.size.split('*')[0] + 'px;height:' + data.size.split('*')[1] +'px;"></iframe>');
                break;
        }
    }
    // var script = document.createElement('script');
    // script.charset = "utf-8";
    // script.src = './data/impress.php?pdps=' + window.sinaads_ad_pdps + '&callback=sinaads_render';
    // document.body.appendChild(script);
    document.write('<script src="./data/impress.php?pdps=' + window.sinaads_ad_pdps + '&callback=sinaads_render"></script>');
})(window);
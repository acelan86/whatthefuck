(function (window, undefined) {

    window.sinaads_render = function (data) {
        var type = data.type;
        window.sinaads_ad_data = data;
        switch (type) {
            case 'Couple' :
                document.write('<script src="./plus/couple.js"></script>');
                break;
            case 'Wins' :
                document.write('<script src="./plus/videoWindow.js"></script>');
                break;
            case 'Stream' : 
                document.write('<script src="./plus/stream.js"></script>');
                break;
            case 'Bp' : 
                document.write('<script src="./plus/bp.js"></script>');
                break;
            default : 
                document.write('<iframe src="' + data.content.src + '" frameborder="0" style="width:' + data.size.split('*')[0] + 'px;height:' + data.size.split('*')[1] +'px;"></iframe>');
                break;
        }
    }
    document.write('<script src="./data/impress.php?pdps=' + window.sinaads_ad_pdps + '&callback=sinaads_render"></script>');
})(window);
(function (window, undefined) {


    window.sinaads_render = function (data) {
        var type = data.type,
            size = data.size.split('*'),
            content = data.content;
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
                document.write(
                    sinaads.core.render.createHTML({
                        src : content.src[0] || '',
                        link : content.link ? content.link[0] || '' : '',
                        width : parseInt(size[0], 10),
                        height : parseInt(size[1], 10),
                        type : content.type[0]
                    })
                );
                break;
        }
    }
    document.write('<script src="./data/impress.php?pdps=' + window.sinaads_ad_pdps + '&callback=sinaads_render&_rnd=' + (new Date().getTime()) + '"></script>');
})(window);
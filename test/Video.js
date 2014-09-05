/**
 * 视频广告集合
 * @type {[type]}
 */
var SinaadsVideo = {};

SinaadsVideo.FrontFilm = function (video, config) {
    var config = config || {};
    this.num = config.num || 0; //广告数
    this.videoId = video;
    this.slot = []; //广告数据插槽
    this.init();
}
SinaadsVideo.FrontFilm.prototype = {
    wait: function (conditionFunction, successCallback) {
        //@todo 等待某个条件成熟的方法的抽象
        //setInterval  if(condition) { clearInterval, successCallback} 
    },
    addSlotData: function (data) {
        this.slot.push(data);
    },
    init : function () {
        var timer = null,
            THIS = this;
            
        this.initPlayHandler = this.getInitPlayHandler();
        function _init() {
            THIS.video = document.getElementById(THIS.videoId);
            if (THIS.video) {
                timer && clearInterval(timer);
                THIS.video.addEventListener('play', THIS.initPlayHandler);
            }
        }
        timer = setInterval(_init, 200);
    },
    _playQueue : function () {
        var THIS = this,
            src = this.slot.shift();
        if (src) {
            this.video.src = src;
            this.video.play();
            this.video.addEventListener('ended', function () {
                THIS._playQueue();
            });
        }
    },
    getInitPlayHandler : function () {
        var timer = null,
            timeoutTimer = null,
            THIS = this,
            src,
            i = 0;
        function _play() {
            if (THIS.slot.length === THIS.num) {
                timer && clearInterval(timer);
                timeoutTimer && clearInterval(timeoutTimer);

                THIS.slot.push(THIS.video.src); //把正片压入
                THIS._playQueue();
            }
        }
        return function () {
            THIS.video.pause();
            THIS.video.removeEventListener('play', THIS.initPlayHandler);
            timer = setInterval(_play, 200);
            //3s后将定时器删除，播放正常视频
            timeoutTimer = setTimeout(function () {
                timer && clearInterval(timer);
                THIS.slot.push(THIS.video.src); //把正片压入
                THIS._playQueue();
            }, 3 * 1000);
        }
    }
};

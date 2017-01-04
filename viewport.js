// viewport.js
(function () {
    function isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent)
    }
    function setScale() {
        if (window.top !== window) {
            return;
        }
        var pageScale = 1;
        var width = window.screen.availWidth||document.documentElement.clientWidth;
        //兼容UC window.innerHeight与document.documentElement.clientWidth不对等
        pageScale = width/ 750;
        //console.log('screen.width', width, 'screen.height', height, 'setScale', pageScale);
        // meta
        var content = 'width=device-width, initial-scale=' + pageScale + ', maximum-scale=' + pageScale +', user-scalable=no';
        document.getElementById('viewport').setAttribute('content', content);
    }
    if (isMobile()) {
        setScale();
    }
})();

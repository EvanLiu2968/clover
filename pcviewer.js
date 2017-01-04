
;(function() {
    var docEl = window.document.documentElement;
    var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var timer;

    function refreshPcviewer() {
        //console.log('Pcviewer');
        var width = docEl.getBoundingClientRect().width||docEl.clientWidth;
        if (width > 540) { // æœ?å¤§å®½åº?
            var url=location.href;
            var str='<div class="pcviewer">'+
                '<div class="pcviewer-infoarea">'+
                '<div class="pcviewer-infoarea-titlearea">'+
                '<div class="pcviewer-infoarea-titlearea-info">'+
                '<img class="pcviewer-infoarea-titlearea-info-thum" src = "../../../images/cyztc/share_img.png"  />'+
                '<div class="pcviewer-infoarea-titlearea-info-title">春运直通车</div>'+
                '<div class="pcviewer-infoarea-titlearea-info-desc">春运直通车|广州团市委免费送你回家过年</div>'+
                '</div></div>'+
                '<div class="pcviewer-infoarea-qrcodearea">'+
                '<div class="pcviewer-infoarea-qrcodearea-img" ></div>'+
                '<div class="pcviewer-infoarea-qrcodearea-warn">打开微信或QQ<br>扫描二维码，在手机上浏览效果更好</div>'+
                '</div></div>'+
                '<div class="pcviewer-previewarea">'+
<<<<<<< HEAD
                '<iframe name="previewiframe" id="previewiframe" style="height: 864px; width: 540px;" src="" class="pcviewer-previewarea-iframe" frameborder="0"></iframe>'+
                '</div></div>';
            // win.document.getElementsByTagName("body")[0].innerHTML=str;
            $("body").html(str);
            $("#previewiframe").attr("src",url);
            window.frames[0].location.href=url;
=======

                '<iframe name="previewiframe" id="previewiframe" src="" class="pcviewer-previewarea-iframe" frameborder="0" style="height: 864px; width: 540px;"></iframe>'+
                '</div></div>';
            $("body").html(str);
            //$("#previewiframe").attr("src",url);//'+url+'
            window.frames[0].location.href=url;//'+url+'
>>>>>>> origin/master
            $(".pcviewer-infoarea-qrcodearea-img").qrcode({
                //render: "canvas", //table·½Ê½
                width: 130, //¿í¶È
                height:130, //¸ß¶È
                text: url //ÈÎÒâÄÚÈÝ
            });
        }
    }
    refreshPcviewer();
    window.addEventListener(resizeEvent, function() {
        clearTimeout(timer);
        timer = setTimeout(refreshPcviewer, 300);
    }, false);
})();


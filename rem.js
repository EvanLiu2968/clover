
(function(win) {
	var docEl = win.document.documentElement;
	var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
	var timer;

	function refreshRem() {
		//console.log('rem');
		// var width = docEl.clientWidth;
		var width = docEl.getBoundingClientRect().width||docEl.clientWidth;
		if (width > 540) { // 最大宽度
		 	width = 540;
		}
		var rem = width / 10; // 将屏幕宽度分成10份，1份为1rem
		docEl.style.fontSize = rem + 'px';
	}
	refreshRem();
	win.addEventListener(resizeEvent, function() {
		clearTimeout(timer);
		timer = setTimeout(refreshRem, 300);
	}, false);
})(window);

# Web移动开发

## 布局
目前主要移动端开发布局主要有3种（只考虑移动端，不考虑pc端兼容）
> 1.直接px加百分比%、flex混合开发；<br>
> 2.根据屏宽动态设置scale缩放viewport；<br>
> 3.使用css3新单位rem作为开发单位；

第一种：
类似Bootstrap自适应布局，局部使用px，整体弹性自适应，使用简单、组合自由；
缺点是不同屏宽呈现效果有差异，难以对应设计图尺寸。
第二种：
以设计图宽为网页宽，基本以px为单位，然后设置scale缩放网页，缺点是部分浏览器有兼容问题；
第三种：
首先跟第二种方案一样，以设计图宽为网页宽，基本以px为单位，不同的是使用工具将px转为rem，并动态设置好根部（html/body）font-size大小
```javascript
// 页面
(function(win) {
  var docEl = win.document.documentElement;
  var resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
  var timer;

  function refreshRem() {
    // var width = docEl.clientWidth;
    var width = docEl.getBoundingClientRect().width || docEl.clientWidth;
    // if (width > 540) { // 最大宽度
    // 	width = 540;
    // }
    var rem = width / 10; // 将屏幕宽度分成10份，1份为1rem
    docEl.style.fontSize = rem + 'px';
  }
  refreshRem();
  win.addEventListener(resizeEvent, function() {
    clearTimeout(timer);
    timer = setTimeout(refreshRem, 300);
  }, false);
})(window);
// gulp
var postcss = require('gulp-postcss');
var pxtorem = require('postcss-pxtorem');
  // ...
  gulp.pipe(postcss([
    pxtorem({
      rootValue: 75, //设计图px宽/屏幕rem宽
      unitPrecision: 6, //rem小数点
      propWhiteList: [], //
      selectorBlackList: [],
      replace: true,
      mediaQuery: false,
      minPixelValue: 2 //大于最小计算尺寸才计算
    })
  ]))
```
缺点是浏览器渲染时内部将rem转为px单位时，大部分浏览器会忽略px小数点，尺寸均存在0~2px的误差，所以转化最小单位需设为2px，以免1px、2px无法渲染

## 注意事项
1. 使用viewport使页面禁止缩放
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
```
2. format-detection设置
```html
<meta name="format-detection" content="telephone=no">
<meta name="format-detection" content="email=no">
```
3. 滚动优化
```css
 * {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
}
```
4. 禁止复制、选中文本
```css
Element {
    -webkit-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
     user-select: none;
}
```
5. 触摸元素时出现半透明灰色遮罩
```css
 * {
    -webkit-tap-highlight-color:rgba(255,255,255,0)
}
```
6. 点击触发元素`:active`伪类，可以用来做点击反馈
```html
<style>
Element:active{
  background:#f0f0f0;
}
</style>
<!-- 让其失效则： -->
<body ontouchstart="">
```
7. 动画定义3D启用硬件加速
```css
Element {
    -webkit-transform:translate3d(0, 0, 0)
    transform: translate3d(0, 0, 0);
}
```
8. Retina屏的1px边框
```css
Element{
    border-width: thin;
}
```
9. 旋转屏幕时，字体大小调整的问题
```css
 * {
   -webkit-text-size-adjust:100%;  
}
```
10. 设置缓存
```html
<meta http-equiv="Cache-Control" content="no-cache" />
```

## 系统的兼容问题或差异
### iOS
1. iOS safari浏览器默认样式`cursor:pointer`的元素才能触发点击事件。
2. meta
```html
<!-- 全屏 -->
<meta name="apple-mobile-web-app-capable" content="yes">
<!-- 顶部状态栏背景色 -->
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<!-- 桌面图标 -->
<link rel="apple-touch-icon" href="touch-icon-iphone.png" />
<link rel="apple-touch-icon" sizes="76x76" href="touch-icon-ipad.png" />
<link rel="apple-touch-icon" sizes="120x120" href="touch-icon-iphone-retina.png" />
<link rel="apple-touch-icon" sizes="152x152" href="touch-icon-ipad-retina.png" />
```

### Android
1. meta
```html
<!-- QQ浏览器： -->
<!-- 全屏 -->
<meta name="x5-fullscreen" content="true">
<!-- 强制竖屏 -->
<meta name="x5-orientation" content="portrait">
<!-- 强制横屏 -->
<meta name="x5-orientation" content="landscape">
<!-- 应用模式 -->
<meta name="x5-page-mode" content="app">
<!-- ... -->
<!-- UC浏览器： -->
<!-- 全屏 -->
<meta name="full-screen" content="yes">
<!-- 强制竖屏 -->
<meta name="screen-orientation" content="portrait">
<!-- 强制横屏 -->
<meta name="screen-orientation" content="landscape">
<!-- 应用模式 -->
<meta name="browsermode" content="application">
```

## 分享
pc端通常会使用网页一键分享工具，还能统计分享数据
但在移动端用户的社交工具通常只在app中使用，使用网页一键分享载入慢，并只能在浏览器登录后才能进行操作，体验差，基本不考虑；
因此，只考虑引导用户使用原生app分享功能，下面列举一些分享使用
微信：只能配置js-sdk获取分享定义权限，js-sdk需要绑定一个公众号，并且域名要与公众号域名相同，后台返回js-sdk的签名作为验证，有效期7200s
QQ：引入qq分享js，设置分享接口：
```javascript
//http://open.mobile.qq.com/api/component/share
setShareInfo(
  {
    title  : wxShareConfig.title,
    summary: wxShareConfig.desc,
    pic    : wxShareConfig.imgUrl,
    url    : wxShareConfig.link
  }
);
```

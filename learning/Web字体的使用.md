# Web字体的使用

## font字体格式说明

以font-awesome为例，其字体图标库包含以下几种文件格式

- .otf ，OpenType - PostScript 字体, 采用的是 PostScript 曲线, 支持 OpenType 高级特性。
- .svg ，由W3C制定的开放标准的矢量图形格式,体积最大。
- .eot ，Embedded Open Type，主要用于早期版本的IE，是其专有格式，带有版权保护和压缩。
- .ttf ，TrueType，在操作系统里更为常见，在web上使用的话，是为了兼容早期仅支持TTF和OTF的浏览器。由于体积比较大，还需要服务器额外压缩。
- .woff ，Web Open Font Format，可以看作是ttf的再封装，加入了压缩和字体来源信息，通常比ttf小40%。也是当前web字体的主流格式。
- .woff2 ，Web Open Font Format 2.0，相比woff最大的优化应该是加强了字体的压缩比。目前 支持的浏览器 只有正在互彪版本号的Chrome和Firefox。

## 字体加载问题

目前除了woff2在部分浏览器不支持，其他基本浏览器都是支持的，但有一问题经常会遇到，woff2加载时回报404，虽然不影响字体显示，但还是需要处理下，原因是服务器不能识别这种格式的文件。

解决方法一：
直接在css引用字体文件时去掉woff2,woff2虽然比woff小了25%左右，但由于woff本来不大，可以直接加载woff来代替woff2

解决方法二：
为了极致的在加载速度，根据服务器识别情况添加对应的MIME类型
```conf
location ~* \.(eot|otf|ttf|woff|woff2|svg)$ {
    add_header Access-Control-Allow-Origin *;
}

AddType application/x-font-woff woff
AddType application/x-font-woff2 woff2
```

## iconfont

[阿里矢量图标库 iconfont.cn](http://www.iconfont.cn)
多色图标(symbol)其实是多个单色svg的集合，支持 ie9+,及现代浏览器，通过引用相关js组合svg图标。

## 其他

icon字体化的趋势越来越明显，不过icon字体要自定义修改的话并不容易，低端设备也可能出现兼容问题，因此图标维持图片的做法并非过时，反而是现在及将来很长一段时间内最稳健的选择。

##ES6 import的一些解读##
通常使用import导入文件时会遇到下面这些格式
```
import "vue"  //第一种
import "../util/util.js"  //第二种
import Vue form "vue"  //第三种
import util form "../util/util.js"  //第四种
import {getUserInfo} form "../util/util.js"  //第五种
```
再来看看对应js中的一些写法
```
Date.prototype.format=function(format){};
let getUserInfo=function(){};
export const getUserInfo;
export default {};
```
根据以上我们可以猜测：
import的js文件会执行,Date.prototype.format会生效；
import纯字符串是定义好的模块名；
import 变量名是将export default的内容赋值给变量；
import {变量名}是export已命名变量，名字不能更改；
具体运行机制不知道，不过可以类似于把import的内容在一个匿名函数中执行，然后根据规则将一些内容暴露出去




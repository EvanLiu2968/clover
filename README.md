# FE进阶之路
> 慎行，独思。

*<span style="color:#67C23A">持续更新中。。。</span>*

## 基础篇
> 一生二，二生三，三成万物。

参考资料：[https://developer.mozilla.org](https://developer.mozilla.org)

### Array && Object
> Array和Object是引用类型。

- Array.map
- Array.filter
- Array.some
- Array.reduce
- Object.defineProperties
- Object.assign

### 闭包
闭包在实际编写代码的时候是非常常见的，这里从表现，原理，目的等角度分别讲述。
> 表现：可读取目标函数的局部作用域，可作为函数、模块之间的桥梁<br>
> 原理：函数执行时的上下文（作用域）取决于定义时环境而不是运行时环境<br>
> 目的：代码模块化、作用域隔离、特殊需求

#### 闭包的表现
简单来段代码
```javascript
window.onload=function(){
	myModuel.init();
	myModuel.bindEvent("love");
}
var dom="canvas";
var myModuel=(function(){
	var dom="evanliu";
	var componentAction = function(){
		// code block
	};
	var eventAction = function() {
		bindEvent("touch");
	};
	function bindEvent(event) {
		console.log(dom);
		dom="evanliu2968";
	}
	myModuel.bindEvent=bindEvent;
	return {
		init:function(){
			componentAction();
			eventAction();
		}
	}
})();
//运行结果是:
'evanliu'
'evanliu2968'
```
先一步一步解读。
首先在页面编写一个模块时，为了不污染全局作用域，模块就是以一个**闭包**的形式存在，浏览器控制台`console.log(myModuel)`就可以看到`~ > init > Scopes > [Closure,Global]`，分别为闭包作用域和全局作用域，bindEvent属性同样如此，原理后面已讲，好处同样显而易见，将模块内部的方法都挂载在myModuel命名空间上，并且可以在外部调用任意**被暴露**的函数，而是否**被暴露**取决于是否挂载在myModuel上。

#### 闭包的目的
普通的闭包不多讲，讲个常用到的例子。
用过webpack开发react、vue等应用时，import JS文件都成了基础语法了，但其并不是ES6的语法，只是babel、 webpack等的实现，看看mozilla开发文档的描述：

> **import 语句** 用于从一个已经导出的外部模块或另一个脚本中导入函数，对象或原始类型。

事实上大部分语法包括ES6都是基于自身语言的的一个语法糖，可以延伸思考下import不同用法的闭包实现。
```javascript
import defaultExport from "module-name";
import * as name from "module-name";
import { export } from "module-name";
import { export as alias } from "module-name";
import { export1 , export2 } from "module-name";
import { export1 , export2 as alias2 , [...] } from "module-name";
import defaultExport, { export [ , [...] ] } from "module-name";
import defaultExport, * as name from "module-name";
import "module-name";
```

#### 闭包的原理
之所以原理最后讲，是因为原理确实没什么好讲的，这正是javascript的一个特性，这里再次强调：**函数执行时的上下文（作用域）取决于定义时环境而不是运行时环境**，记住之，多思考。

### 正则
正则在所有语言里都是很重要的基础部分，在提升工作效率及分析框架或库的源码时都会看到它的身影，熟练掌握了正则，编程世界的青铜门将为你打开。
正则的相关知识挺多，这里放个链接：[https://zhuanlan.zhihu.com/p/29707385](https://zhuanlan.zhihu.com/p/29707385)
总是，正则很重要，正则很奇妙。下面列出部分关键词，作为前进路上的陀螺仪。
- 正则基本结构
	- 字面量 `/evanliu/`
	- 字符组 `/[a-z][0-9]/`
	- 量词 `/e{1,3}/`
	- 锚 `/^evanliu?=\d/`
	- 分组 `/(evanliu)+/`
	- 分支 `/(e|E)vanliu/`
- 修饰符 `-g-i-m`
- 横向模糊匹配和纵向模糊匹配
- 贪婪匹配和惰性匹配
- 无回溯匹配和有回溯匹配
	- 贪婪量词
	- 惰性量词
	- 分支结构
- 正则表达式的四种操作
	- 验证 `String.search;String.match;RegExp.test;RegExp.exec;`
	- 切分 `String.split(regexp)`
	- 提取 `同上验证`
	- 替换 `String.replace(regexp,String || Function)`


### 设计模式
- 模块模式
- 原型模式
- 发布订阅模式(观察者模式)
- 单例模式
- 工厂模式

下面均以最简的示例来阐述不同设计模式的一些差异
#### 模块模式
```javascript
// 示例一：模块是一个立即执行函数(IIFE)
var myModuel=(function(){
	// do something
	return {}
})();
// 示例二：ES6 模块
var myModuel=function(){};
moduel.export=myModuel;
export default myModuel
```

#### 原型模式
```javascript
// ES6
import React from 'react';
class myModuel extends React.Component {
	constructor() {};
	render() {};
}
// ES5
function Component (props){
	this.props=props;
}
Component.prototype={
	render:function(){
		return '<div></div>'
	}
}
```

#### 发布订阅模式
```javascript
var myApp=new Vue({
	el:'#app',
	data:function(){
		return {
			name:'evanliu'
		}
	},
	method:{
		changeName:function(name){
			this.$emit('nameChanged',{name:'evanliu2968'}) // dispatch event
		}
	},
	mounted:function(){
		this.$on('nameChanged',function(event,args){ // subscribe event
			this.name=args.name;
		})
	}
});
```
#### 单例模式
```javascript
// 以jQuery为例
$("#table").bootstrapTable(options); // 初始化table组件
$("#table").bootstrapTable("refresh"); // 初始化后可直接调用原型方法
// 简单做下示例：
$.fn.bootstrapTable=function(option){
	var Instance=this.data("bootstrap.table");
	if(!Instance){
		Instance=new BootstrapTable(option);
		this.data("bootstrap.table",Instance)
	} else {
		Instance[option].apply(Instance,Array.prototype.slice.call(arguments, 1));
	}
	return this
}
```
#### 工厂模式
```javascript
// 顾名思义，工厂根据设计图调用不同的产线进行生产，相当于工厂的总线
var shapeFactory = function(type) {
	if(!type){
		return null
	}else if(type==='square'){
		return new Square()
	}else if(type==='circle'){
		return new Circle()
	}
	return null
}
```
其他设计模式还有：装饰模式、策略模式、状态模式、中介者模式等等

### 事件模型
- 事件冒泡
- 事件代理
- 事件触发

## 框架篇
- react
- vue
- angular

### React
- all in JSX
- 单向数据流
- virtual DOM

### Vue
- 渐进式
- 双向数据绑定模版

### Angular
- typescript编写
- 工程式规范
- 依赖注入

### 关键词
- typescript
- Rxjs
- lodash

## 大前端篇
> javascript能运行良好的程序都终将采用javascript编写。

### 移动客户端
- react native
- weex
- ionic

### PC客户端
- electron
- nw.js

### 其他
- 小程序（微信、支付宝）
- webGL
- webassembly

## 全栈篇
> web的未来属于全栈。

### node

框架参考：
- express
- koa
- Egg
- thinkjs
- Meteor
- Feathers






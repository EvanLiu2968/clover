
## Babel

### import
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

### bind
```javascript
var config = {
  author: 'evanliu'
}
var func = config::function(){
  console.log(this.author) // evanliu
}
```

### deconstruction
```javascript
var func = (url,option,callback) => {
  const [u,opt,cb] = arguments
}
const {
  show,
  bigData
} = this.props
```

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

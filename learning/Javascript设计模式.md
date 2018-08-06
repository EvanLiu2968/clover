## Javascript设计模式

> 只是一个思路，自行斟酌。

### 主要设计模式

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

// 示例二：ES6(commonjs)模块
var myModuel=function(){};
moduel.export=myModuel;
export default myModuel
```
模块模式本质是对闭包的一个应用，由于Javascript语言特有的"链式作用域"结构（chain scope），子对象会一级一级地向上寻找所有父对象的变量。所以，父对象的所有变量，对子对象都是可见的，反之则不成立。
简单的说法就是函数外部的变量作用域函数内部可以获取，而函数内部的变量作用域对外是不可获取的，违反这个规则的基本就是闭包了

#### 原型模式

```javascript
// ES6
import React from 'react';
class myModuel extends React.Component {
  constructor() {};
  render() {
    return <div></div>
  };
}
// ES5
function Component (props){
  this.props=props;
}
Component.prototype={
  render:function(){
    return <div></div>
  }
}
```

#### 发布订阅模式

```javascript
const Event = require('event');

class App extends Event {
  constructor() {};
}

const app = new App()
app.on('thirsty', () => {
  console.log('我要喝水')
});
app.emit('thirsty'); // 输出 '我要喝水'
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
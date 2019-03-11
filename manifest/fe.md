# FE
## [基础] 实现一个简单的闭包。

## [基础] 实现获取斐波那契数列某个值方法。
```js
function fibonacci(x) {
  var result = 0;
  var x1 = 1, x2 = 2;
  // do staff begin
  if ( x > 2) {
    let i = 2;
    while (x > i) {
      result = x1 + x2;
      x1 = x2;
      x2 = result;
      i++;
    }
  } else {
    result = 1;
  }
  // do staff end
  return result;
}
```

## [基础] 实现某个阶乘函数方法。
```js
function factorial(x) {
  var result = 0;
  // do staff begin
  var i = x;
  while (i>0) {
    result = i*x;
    i--;
  }
  // do staff end
  return result;
}
```

## [js基础+算法] 将某个数组进行特定的排序。
例如， 将 7 排在数组最前面，5随后，3排在最尾巴，其他升序。稳定性不进行要求  
输入：[6,5,4,3,2,1,7,8,3,5,4,6,8,2,12,545,745,323,7]  
输出：[7,7,5,5,1,2,2,4,4,6,6,8,8,12,323,545,745,3,3]  
```js
function sortArray(a) {
  let group1 = [], group2 = [], group3 = [], group4 = [];
  a.forEach((x)=>{
    switch (x) {
      case 7:
        group1.push(x);
        break;
      case 5:
        group2.push(x);
        break;
      case 3:
        group4.push(x);
        break;
      default:
        group3.push(x);
    }
  })
  group3 = group3.sort((a,b)=>a-b)
  return group1.concat(group2).concat(group3).concat(group4)
}
```

## [基础] 最新的 css 版本中，position ，几个值，以及其定位的时候相对参考坐标在哪里。
position:static(default), absolute, relative, fixed, sticky
分别相对于文档流，最近的非static父级，最近的父级，viewport(浏览器窗口)，在屏幕范围时为文档流，超出屏幕范围则fixed。

## [基础] css 中 z-index 问题。（下面填空题答案很多，填充正确即可）
```html
<style>
  .container {
    position: relative;
  }
  #A, #B, #C, #D {
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 30px;
  }
  #A {
    background: red;
    z-index: 10;
  }
  #B {
    background: blue;
    z-index: 40;
  }
  #C {
    background: green;
    z-index: 20;
  }
  #D {
    background: yellow;
    z-index: 30;
  }
</style>
<div class="container">
  <div id="A">
    A
    <div id="B">B</div>
  </div>
  <div id="C">
    C
    <div id="D">D</div>
  </div>
</div>
```
（1）怎么改动所有的样式, B显示在最上?  
将#A z-index大于#C
（2）怎么改动所有的样式, D显示在最上？  
已经是最上
（3）有什么规律？  
层级是相对于兄弟元素，并且相同层级后来居上

## [基础] 下面绑定事件方式
```
// 方式1
jQuery('body').on('click', '.btn', (e) => {
  console.log(e);
});

// 方式2
jQuery('body .btn').on('click', (e) => {
  console.log(e);
});
```
问题一： 两个方式的事件原理是什么？  
第一种是代理，第二种是直接绑定
问题二： 哪个方式性能好？  
问题三： 有什么不同？对应使用场景举例。  
直接绑定适合较少的非动态元素，代理用于较多的元素或动态元素

## 用 ES5 写一个 Animal 类及其两个不同实例。
条件一：定义属性方法 say ，实现 `animalA.say !== animalB.say` 及 `animalA.__proto__.say === animalB.__proto__.say`  
条件二：实现 `Animal.die(animal)` ，标记该实例为死亡。  
条件三：实现 `Animal.all()` ，返回所有创建但是未标记为死亡的 animal 实例。  
```js
function Animal(props) {
  this.name = props.name;
  // do staff begin
  Animal.liveList = Animal.liveList || []
  Animal.liveList.push(this)
  // do staff end
}

// do staff begin
Animal.prototype.say = function(){
  return this.name
}
Animal.die = function(ins){
  var i = Animal.liveList.findIndex((a)=>a===ins)
  Animal.liveList.splice(i,1)
  ins = null
}
Animal.all = function(){
  return Animal.liveList
}

// do staff end

var animalA = new Animal({ name: '小白鼠A' });
var animalB = new Animal({ name: '小白鼠B' });
```

## 上一题，改成 ES6 写法。
```js
class Animal {
  constructor(props){
    this.name = props.name
  }
  static die = function(ins){
    var i = Animal.liveList.findIndex((a)=>a===ins)
    Animal.liveList.splice(i,1)
    ins = null
  }
  static all = function(){
    return Animal.liveList
  }
  say(){
    return this.name
  }
}
```
## 实现一个简单的redux
```js
class Store {

  constructor(reducer, initialState) {
    this._reducer = reducer
    this._state = initialState
    this.listeners = []
  }

  getState() {
    return this._state
  }

  dispatch(action) {
    let newState = this._reducer(this._state, action)
    if(newState !== this._state) {
      this._state = newState
      this.listeners.forEach(listener => listener())
    }
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      this.listeners.splice(index, 1)
    }
  }
}

export const createStore = (reducer, initialState) => {
  return new Store(reducer, initialState)
}
```

## 写一个匹配 url 中 pathname 的正则。
```js
//.match(url)
```

## css 中 box-sizing 不同值及其作用。
border-box content-box

## CSS 选择器的权重
1、ID　　#id
2、class　　.class
3、标签　　p
4、通用　　*
5、属性　　[type="text"]
6、伪类　　：hover
7、伪元素　　::first-line
8、子选择器、相邻选择器
权重计算规则
- 第一等：代表内联样式，如: style=””，权值为1000。
- 第二等：代表ID选择器，如：#content，权值为0100。
- 第三等：代表类，伪类和属性选择器，如.content，权值为0010。
- 第四等：代表类型选择器和伪元素选择器，如div p，权值为0001。
- 通配符、子选择器、相邻选择器等的。如*、>、+,权值为0000。
- 继承的样式没有权值。
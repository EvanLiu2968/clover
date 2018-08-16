## ES6的class的使用

### Babel相关配置

- `babel-plugin-transform-decorators-legacy` 装饰器语法转换
- `babel-plugin-transform-class-properties` 类属性转换

```json
{
  "plugins": [
    "transform-decorators-legacy",
    "transform-class-properties"
    ]
}
```

### 类的语法

ES6的class本质还是ES5构造方法加原型的一个语法糖，面向对象的简化写法

class主要包含构造方法、静态属性、成员方法这些基本单元，其中成员方法的this默认指向类本身。
```javascript
class Animal {
  constructor(species, name) {
    this.species = species;
    this.name = name;
  }
  static mouth = function(voice){
    console.log(voice)
  }
  say(sound) {
    this.mouth(sound)
  }
  hello() {
    this.say(`hi, I'm ${this.name}.`)
  }
}
```
#### 类的私有属性
因为ES6的class不是一个真正的类，因此没有Java类的private、public和protected这些区分，不过可以通过一些方法来达到
- 闭包
闭包的特性之一就是能访问函数内部的私有变量，把引用变量放在类外边，配合`export`就形成了一个闭包
```javascript
const name = "Button";

export default class App extends React.Component {
  getName() {
    console.log(name) // 'Button'
  }
}
```
- 约定俗成的使用`__`前缀表示属性私有，类似`__proto__`, `__defineGetter__`
- `Symbol`

#### 类的静态属性
```javascript
class App extends React.Component {
  //static关键字 需要 transform-class-properties 支持
  static propTypes = {}
  static defaultProps = {}
}
// 等价于
App.propTypes = {}
App.defaultProps = {}
```
在子类中super指向父类的构造函数，同样可以通过super来调用父类的静态方法:
```javascript
class App extends Container {

  getName(){
    super.getName() //相当于 Container.getName()
  }
}
```
#### 类的实例属性
去除static修饰的属性，不同于静态属性，能被子类继承的属性即为实例属性
```javascript
class App extends React.Component {

  state = {
    name: "Button"
  }

  render() {
    return (
      <div>{`这是一个${this.state.name}组件`}</div>
    )
  }
}
```

### 类的继承

类的继承由`extends`关键字实现，子类在构造方法中调用`super()`继承父类的this，相当于`父类.prototype.constructor.call(this)`
```javascript
class Person extends Animal {
  constructor(species, name, sex) {
    super(species, name)
    this.sex = sex;
  }
  sayHello() {
    this.hello()
  }
}
```
实际上以上代码会在执行hello()的时候报错，因为此时子类继承自父类`hello()`的方法this指向还是指向父类，super()只是把父类构造方法中的this指向了子类，父类成员方法this指向没变。

解决方法是：
- 在父类构造方法中手动将成员方法的this绑定至构造方法的this
```javascript
class Animal {
  constructor(species, name) {
    this.species = species;
    this.name = name;
    this.say.bind(this)
    this.hello.bind(this)
  }
  // ...
}
```
- 使用装饰器绑定
```javascript
import BindAll from 'lodash-decorators/bindAll';
import Bind from 'lodash-decorators/bind';

@BindAll()
class Animal {
  constructor(species, name) {
    this.species = species;
    this.name = name;
  }
  // or ...
  @Bind()
  hello() {
    this.say(`hi, I'm ${this.name}.`)
  }
}
```
## 装饰器Decorator

Decorator语法是ES2016(即ES7)的新特性
- 是继承关系的一种替代 
- 动态的类添加额外的功能 

### Babel的配置
需要安装babel插件来转译 `babel-plugin-transform-decorators-legacy`

.babellrc配置
```json
{
  "presets": [ "env" ],
  "plugins": [ "transform-decorators-legacy" ]
}
```

### 基础类装饰器
```javascript
function test(target) {
  target.hasTested = true;
}

@test
class Target {}
console.log(Target.hasTested) // true
```

### 柯里化装饰器
```javascript
function test(isTested) {
  return function(target){
    target.hasTested = isTested;
  }
}

@test(true)
class Target {}
console.log(Target.hasTested) // true
```

### 类属性(方法)装饰器
```javascript
/*
 * target: 目标类
 * name: 目标方法
 * descriptor: 目标方法的描述对象
 */
function readonly(target, name, descriptor){
  // descriptor对象原来的值如下
  // {
  //   value: [Function],
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // };
  descriptor.writable = false;
  return descriptor;
}

class Target {
  @readonly
  test(){
    //
  }
}
```

### 注意事项

- 装饰器只能用于类和类的方法，不可用于函数，因为函数存在函数提升，class类似于`const Target = function(){}`

### 第三方模块

- `core-decorators` 提供了几个常见的装饰器，通过它可以更好地理解装饰器
- `lodash-decorators` Decorators using lodash functions

```javascript
// import { autobind, readonly, override, deprecate } from 'core-decorators';
import Debounce from 'lodash-decorators/debounce';
import BindAll from 'lodash-decorators/bindAll';

@BindAll()Web
class Search {
  constructor(ajax) {
    this.input = '';
    this.httpService = ajax;
  }
 
  @Debounce(100)
  post() {
    return this.httpService.post(this.input);
  }
}
```
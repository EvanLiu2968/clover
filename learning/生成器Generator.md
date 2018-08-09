## 生成器Generator

generator（生成器）是ES6标准引入的新的数据类型。generator跟函数很像，但可以返回多次。

generator由`function*`定义。

```javascript
function* foo(x) {
  yield x + 1;
  yield x + 2;
  return x + 3;
}
const f = foo(1);
```
直接调用一个generator和调用函数不一样，foo(1)仅仅是创建了一个generator对象，还没有去执行它。
调用generator对象有两个方法：

- 不断地调用generator对象的next()方法;
```javascript
const f = foo(1);
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: false}
f.next(); // {value: 4, done: true}
```

- 第二个方法是直接用`for ... of`循环迭代generator对象，这种方式不需要我们自己判断done;
```javascript
const f = foo(1);
for (var x of f) {
  console.log(x); // 依次输出2, 3, 4
}
```

### `co`

co实现了对generator的封装，实现了类似`async/await`的功能，基于Node的话一般会安装node8版本以上来获得`async/await`的支持。

找的示例大概如下：
```javascript
// 大致实现
function isGeneratorFunction(obj) {
  return obj && obj.constructor && 'GeneratorFunction' === obj.constructor.name
}
function co(GenFunc) {
  if(!isGeneratorFunction(GenFunc)){
    throw new Error('the arguments required be a generatorFunction.')
  }
  return function(cb) {
    var gen = GenFunc()
    next()
    function next(err, args) {
      if (err) {
        cb(err)
      } else {
        if (gen.next) {
          var ret = gen.next(args)
          if (ret.done) {
            cb && cb(null, args)
          } else {
            ret.value(next)
          }
        }
      }
    }
  }
}
// co的包装
co(function* () {
  var a
  a = yield delay(200) // 200
  a = yield delay(a + 100) // 300
  a = yield delay(a + 100) // 400
})(function(err, data) {
  if (!err) {
    console.log(data) // print 400
  }
})
```
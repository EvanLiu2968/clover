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
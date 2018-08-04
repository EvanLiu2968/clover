## 正则表达式Regex

正则在所有语言里都是很重要的基础部分，在提升工作效率及分析框架或库的源码时都会看到它的身影，熟练掌握了正则，也许新的青铜门就此打开。

### 正则规则汇总

正则的相关知识挺多，这里推荐相关资源链接
- [Javascript正则表达式](https://zhuanlan.zhihu.com/p/29707385)
- [正则表达式手册](http://tool.oschina.net/uploads/apidocs/jquery/regexp.html)

下面列出部分关键词，作为前进路上的陀螺仪。

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

### 常用正则相关方法

实际使用中，记住`test` `match` `replace`这三个常用函数就可以了，下面列出常用正则相关方法


- 验证
  - `String.prototype.search(regex)` return -1 || index number
  - `String.prototype.match(regex)` return null || array
  - `Regex.prototype.test(string)` return false || true
  - `Regex.prototype.exec(string)` return null || array

因为`test`直接返回Boolean, 所以一般是`test`最常用

- 替换
  - `String.prototype.replace(regexp,String || Function)`

```javascript
// replace function demo
var newString = 'abc12345#$*%'.replace(/([^\d]*)(\d*)([^\w]*)/, function(match, p1, p2, p3, offset, string){
  // p1 is nondigits, p2 digits, and p3 non-alphanumerics
  return [p1, p2, p3].join(' - ');
});
console.log(newString);  // abc - 12345 - #$*%
```

- 提取
  - `String.prototype.match(regex)`
  - `Regex.prototype.exec(string)`

需要注意的是`String.prototype.search(regex)`和`Regex.prototype.test(string)`函数匹配的是`()`的值(同`replace`)，并作为`Regex.$1` `Regex.$2`...`Regex.$9`属性，该特性是非标准的，不建议使用

- 切分
  - `String.prototype.split(regexp)`


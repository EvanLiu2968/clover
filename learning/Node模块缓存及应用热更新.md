## node模块缓存及热更新

### node模块缓存机制

与前端浏览器会缓存静态脚本文件以提高性能一样，Node对引入过的模块都会进行缓存，以减少二次引入时的开销。不同的地方在于，浏览器仅仅缓存文件，而Node缓存的是编译和执行之后的对象。不论是核心模块还是文件模块，`require()`方法对相同模块的二次加载都一律采用缓存优先的方式，这是第一优先级的。不同之处在于核心模块的缓存检查先于文件模块的缓存检查。

第二次引入的模块状态都将沿用第一次的状态，Node模块里的单例模式也是基于此
```javascript
var instance = null
module.exports = function(){
  if(instance){
    return instance     //第二次会执行
  }else{
    return new Orange() //第一次会执行
  }
}
```

### Node模块实现原理
Node模块加载遵循commonjs规范，实现为`commonjs2`，详情可见文档[https://nodejs.org/docs/latest/api/modules.html](https://nodejs.org/docs/latest/api/modules.html#modules_the_module_wrapper)

```javascript
/*
 * Before a module's code is executed, Node.js will wrap it with a function wrapper that looks like the following:
 */
(function(exports, require, module, __filename, __dirname) {
// Module code actually lives in here
});
```
由此可知，在我们书写的代码中可以把以上5个变量当成全局变量
```javascript
exports.keys = 'evanliu'
module.exports = {
  key: 'evanliu'
}
//但不能写成exports = {key: 'evanliu'}，这样修改了exports的引用
```
`require`本身是一个函数，同时挂在了5个方法：
- `require.cache`
- `require.extensions`
- `require.main`
- `require.resolve(request[, options])`
- `require.resolve.paths(request)`
其中`require.cache`是热更新的关键。
`require.extensions`官方已准备废弃，不过还可以使用。可以对不同后缀的文件做处理，例如默认加载`.json`会自动转成`JSON`对象，也可以自行加点其他的，如下：
```javascript
var extensions = ['.css', '.less']; //里面定义不需要加载的文件类型
for (let i = 0, len = extensions.length; i < len; i++) {
  require.extensions[extensions[i]] = function () {
    return false;
  };
}
```
### node模块热更新

在特殊场景需求下需要不重启就更新一些非核心node模块，而由于node模块的缓存检测机制，热更新实际上就是如何来清除引用的模块缓存

node模块加载的核心代码如下
```javascript
Module._load = function(request, parent, isMain) {
  var filename = Module._resolveFilename(request, parent);

  var cachedModule = Module._cache[filename];
  if (cachedModule) {
    return cachedModule.exports;
  }

  var module = new Module(filename, parent);
  Module._cache[filename] = module;
  module.load(filename);
  
  return module.exports;
};

require.cache = Module._cache;
```

清除缓存思路如下
```javascript
function cleanCache (module) {
  var path = require.resolve(module);
  require.cache[path] = null;
}
```

因为我也没有实践过，所以这里给个可行的思路，具体可以参考下面给出的一些相关资料

### 相关资料参考

- [热更新引发的内存泄漏](https://zhuanlan.zhihu.com/p/34702356)
- [热更新思路](http://fex.baidu.com/blog/2015/05/nodejs-hot-swapping/)
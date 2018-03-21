# node模块

## node模块缓存机制
与前端浏览器会缓存静态脚本文件以提高性能一样，Node对引入过的模块都会进行缓存，以减少二次引入时的开销。不同的地方在于，浏览器仅仅缓存文件，而Node缓存的是编译和执行之后的对象。不论是核心模块还是文件模块，require()方法对相同模块的二次加载都一律采用缓存优先的方式，这是第一优先级的。不同之处在于核心模块的缓存检查先于文件模块的缓存检查。

所以不做特殊处理，第二次引入的模块状态都将沿用第一次的状态

## node模块热更新

node模块加载的核心代码如下
```
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

> node模块热更新：node服务不重启就能更新部分node模块

[热更新引发的内存泄漏](https://zhuanlan.zhihu.com/p/34702356)
[热更新思路](http://fex.baidu.com/blog/2015/05/nodejs-hot-swapping/)
## Fed

1. pm2的主要作用？
内建负载均衡（使用Node cluster 集群模块）
后台运行
0秒停机重载，我理解大概意思是维护升级的时候不需要停机.
具有Ubuntu和CentOS 的启动脚本
停止不稳定的进程（避免无限循环）
控制台检测
提供 HTTP API
远程控制和实时的接口API ( Nodejs 模块,允许和PM2进程管理器交互 )

2. Node cluster如何做负载均衡？

3. nginx反向代理和正向代理？

4. css-loader和style-loader的区别？
css-loader以字符串形式读取CSS文件。
style-loader获取这些样式并创建style标签插入页面。

5. webpack和gulp有哪些区别？
Webpack是一个模块打包器，gulp是执行任务的

6. 什么是loader，什么是plugin？
loader是用来告诉webpack如何转化处理某一类型的文件，并且引入到打包出的文件中
plugin是用来自定义webpack打包过程中的方式，一个插件是含有apply方法的一个对象，通过这个方法可以参与到整个webpack打包的各个流程（生命周期）
```js
function MyPlugin(oPath) {
  outputPath = oPath
}
MyPlugin.prototype.apply = function(compiler) {
  compiler.plugin("compile", function(params) { //start compile
  });
  compiler.plugin("emit", function(compilation, callback) { //end compile
    callback();
  });
};
```

ES6有哪些特性？
箭头函数、let/const的块级作用域、Set、 class、数组/对象结构、展开运算符

主流小程序开发方式有哪些？
原生开发：
我们需要全新学习小程序的抒写格式，目前版本模板中支持 slot，但是不支持 npm 包。原生不支持 css 预处理器，但是 vsCode 中 Easy WXLESS 插件可以将 less 文件自动转换为 wxss 文件；
wepy：
我们需要熟悉 vue 和 wepy 两种语法，支持 slot 组件内容分发插槽，支持 npm 包，支持 css 预处理器；
mpvue：
我们需要熟悉 vue ，目前版本（v1.0.13）不支持 slot ，支持 npm 包，支持 css 预处理器；
taro:
采用React语法标准，支持 JSX 书写，让代码更具表现性，Taro暂不支持直接渲染children。

commonjs和ES6模块化的区别？

vue的插件机制

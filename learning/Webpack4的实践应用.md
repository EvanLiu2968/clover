## Webpack4的实践应用

webpack4发布不久，跟3的版本还是有不少的差异的，实践下来，问题主要是一些在webpack3版本正常运行的库在4的版本会有问题，并且问题还不能靠搜索直接得到答案，官方说的性能提升其实也没那么重要，不过也不能老守着webpack3不升级，所以简要介绍下wenpack4的实践。

先列出github地址：[https://github.com/EvanLiu2968/webpack4-plus-koa](https://github.com/EvanLiu2968/webpack4-plus-koa)，所有相关的webpack配置在`build`文件夹，并且集成了node端运行时，算是一个完整的生产项目

1. 默认配置
根据webpack的mode属性，会匹配不同的默认配置，mode有三种模式:`development` `production` `none`, 分别为开发模式、生产模式、不启用默认配置，并且这个值是必填的(不配置会报错)，在这些默认配置下就可以正常的开发，关于这些默认配置可以去官网查找，不过项目的差异和不同需求，零配置想必也是不可能的。

2. 主要配置属性

- entry
- output
- optimization
- module
- plugins

除了optimization,其他的和webpack3使用方式基本一致，不过plugins中使用的一些插件可能会不兼容webpack4，
entry和output作为入口和出口，不过这些配置只适用于js文件入口，html/css等则需要其他插件支持，module是用于配置loader，plugins则是用于配置扩展webpack的插件

详情请看webpack4文档 [https://webpack.js.org](https://webpack.js.org/concepts)

3. Optimization

`optimization`是webpack4新增的，把很多插件相关的配置都迁移到了optimization中，这也是webpack4升级后最重要的配置项，其配置项较多，建议将官方文档通看一遍。
我先大致列下我所用到的配置，还需要优化，不过基本还是能用的，其中vendors作为主要的第三方公用库，其他chunks会排除vendors中已存在的文件
```javascript
module.exports = {
  optimization: {
    splitChunks: { // cacheGroups为子配置项，其他均为公用配置项,公用配置项均可在子配置项中再次定义
      chunks: 'initial', // chunks范围, 'initial'只对入口文件处理, "all"对entry进行拆分
      // minSize: 30000,
      // minChunks: 1,
      // maxAsyncRequests: 5, // 最大异步请求chunks
      // maxInitialRequests: 3, // 最大初始化chunks
      cacheGroups: {
        vendors: {
          test: /react|react-dom|axios|lodash/,
          name: "vendors", //chunks id
          filename: config.env !== 'dev' ? 'js/[name]_[hash:10].js' : 'js/[name].js', //打包输出的name
          priority: 10, // 优先级
          enforce: true
        },
        default: false,
        commons: {
          // test: /\.(?!(scss|less|styl|stylus|css))$/, //排除css chunks，先一个页面一个css
          name: 'commons',
          filename: config.env !== 'dev' ? 'js/[name]_[hash:10].js' : 'js/[name].js',
          // minSize: 20000, //默认为 30000(30kb),公用业务代码大于这个尺寸则抽取出来
          // minChunks: 1, // 几个入口的公用代码
          // priority: 1, // 优先级
          reuseExistingChunk: true, //重用已存在chunk
          enforce: true
        }
      }
    }
  },
}
```

4. 多进程构建及dll

要想更快的构建项目，要么使用更多的系统资源，要么打包更少的文件，前者可以用多进程构建,后者可以使用dll(动态链接库)预编译
多进程构建相关两个包为`happypack` `webpack-parallel-uglify-plugin`，
dll配置可以引入webpack内置插件`webpack/lib/DllPlugin`

5. 服务端渲染配置
- `target: 'node'` 由于输出代码的运行环境是node，源码中依赖的node原生模块没必要打包进去；
- `externals: [nodeExternals()]` webpack-node-externals的目的是为了防止node_modules目录下的第三方模块被打包进去，因为nodejs默认会去node_modules目录下去寻找和使用第三方模块。
- 忽略掉不需要被打包进用于服务端的代码中去的文件，例如css之类(或者提取css以行内样式的形式插入html)
- `libraryTarget： 'commonjs2'`以commonjs2规范导出渲染函数，以供给采用nodejs编写的http服务器代码调用。

6. 其他

webpack3中一般使用`extract-text-webpack-plugin`来处理css，不过webpack4中使用会有兼容问题，官方推荐使用`mini-css-extract-plugin`

html-webpack-plugin需要注意`chunksSortMode`这个属性，否则有可能注入js的顺序不是你所预期的那样子，能设置的属性值有'none' | 'auto' | 'dependency' | 'manual' | {Function}，我这里设置了manual,即按照chunks数组的顺序注入

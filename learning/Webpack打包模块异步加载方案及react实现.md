## Webpack打包模块异步加载方案及react实现

### Introduction

因为react-router v4去除了v3默认的异步加载组件属性getComponent。因此异步加载组件需要自行实现，实现后组件可用到任何需要异步加载的地方

异步加载方式很多，但配合webpack打包的异步加载主要有两种

1. `require.ensure`

```javascript
const Component = getComponent((callback) => {
  require.ensure([], require => {
    callback(null, require("./component").default);
  }, 'chunk-name');
});
```

可使用该方式实现AsyncLoader组件，示例在`Usage method 2`。

2. `Syntax Dynamic Import`

`import()`返回的是Promise对象，输出`export`的值

```javascript
const loader = import('./component')
loader.then((e)=>{
  let Component = e.default
})
```
该方法需要`babel-plugin-syntax-dynamic-import`支持

`.babelrc`配置示例如下
```json
{
  "plugins": [
     "syntax-dynamic-import",
  ]
}
```

### AsyncLoader

> 配合webpack打包的异步加载组件

代码已抽取为公用组件，地址[EvanLiu2968/react-asyncLoader](https://github.com/EvanLiu2968/react-asyncLoader)

### Usage

#### Basic usage

```javascript
const Home = AsyncLoader({
  loader: () => import(/* webpackChunkName: "my-chunk-name" */"../pages/home")
  // my-chunk-name对应打包js的[name],省略则[name]对应从0开始的数字
});
/* 生成打包文件目录
chunk
  - [chunk-name].[hash].js
 */
```

#### Add loading and error state

```javascript
import { Spin } from 'antd'
const Home = AsyncLoader({
  loader: () => import(/* webpackChunkName: "my-chunk-name" */"../pages/home"),
  loading: <div className="async-loading"><Spin size="large" /></div>,
  error: <div className="async-error">some error occurred.</div>,
  delay: 300
});
```

#### With require usage

```javascript
const Home = AsyncLoader({
  loader: () => new Promise((resolve,reject)=>{
    require.ensure([], require => {
      resolve(require("../pages/home"));  //注意export default 和 module.exports的区别
    }, "my-chunk-name");
    // my-chunk-name对应打包js的[name],省略则[name]对应从0开始的数字
  })
});
/* 生成打包文件目录
chunk
  - [my-chunk-name].[hash].js
 */
```
#### Demo

[https://www.evanliu2968.com.cn](https://www.evanliu2968.com.cn/system/home)

### Options

- `loader`  type: Function 如上Usage，返回Promise对象
- `loading` type: Boolean || JSX 默认false不开启，当为JSX，在加载过程中以loading替代
- `error`   type: Boolean || JSX 默认false不开启，当为JSX，在加载错误时error替代
- `delay`   type: Number 默认200，加载完成后延迟200ms关闭loading
## node同构应用中ES6的使用

写客户端代码时已经习惯了各种ES6的语法，`import`, `export`...
再写服务端代码的时候顺手一写就写了个`import`,然后就等着报错吧
其实加入一些配置就可以在服务端写各种ES6+。

ps: 这只是一个应用的思路，实际使用中还是不建议这样做，会存在一定的性能损失，并且易造成node端代码混乱，不够规范，得不偿失。

### 如何使用

ES6+在服务端使用关键就是`babel`

Talk is cheap, show the code.

首先安装node模块

`npm i babel-core babel-polyfill --save`

在执行文件入口开头引入`babel-core`和`babel-polyfill`

```javascript
require('babel-core/register')
require('babel-polyfill')
// follow is your main code.
```

有了这个还不能正确执行, 还缺少`.babelrc`配置文件
```json
{
  "presets": [
    "react",
    "es2015",
    "stage-0",
  ],
  "plugins": [
    [
      "transform-runtime",
      {
        "polyfill": true,
        "regenerator": true
      }
    ]
  ]
}
```
注意安装相应的babel扩展模块，例如：
```json
{
  "babel-plugin-add-module-exports": "^0.2.1",
  "babel-plugin-react-transform": "^2.0.2",
  "babel-plugin-transform-decorators-legacy": "^1.3.4",
  "babel-plugin-transform-react-display-name": "^6.25.0",
  "babel-plugin-transform-runtime": "^6.15.0",
  "babel-plugin-typecheck": "^3.9.0",
  "babel-polyfill": "^6.26.0",
  "babel-preset-es2015": "^6.5.0",
  "babel-preset-react": "^6.5.0",
  "babel-preset-stage-0": "^6.5.0"
}
```
react是react server side render是服务端需要解析jsx语法，其实既然做ssr，复用客户端的配置就OK了

`node index.js` 试运行, success!

* 需要注意的一个点是，入口文件已配置好babel,但入口文件不能有`import`这些语法，
因为`import`会在`require`之前执行，入口文件就老老实实用`require`吧

### 其他

客户端使用webpack时会使用alias文件别名的配置
既然要同构复用一套代码，这个配置在服务端也可以解决
跟上面的babel模块一样，在入口文件引入
```javascript
require('app-module-path').addPath(__dirname)
```
`__dirname`是当前执行文件的路径,这样可以把路径统计的文件名作为require的alias

```
src/...
index.js
```
例如index.js为入口文件, 后续可直接`require('src/...')`引入
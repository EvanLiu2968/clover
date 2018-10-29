## 一次Webpack编译失败的总结

问题起因是这样的，个人网站有段时间没更新过了，于是准备把最近的修改更新至生产环境，在服务器`npm run build`打包后点开网站，运行正常，然后在IE9测试下最近做的IE兼容，发现只有React同构输出的html，打包资源js、css之类的404？

首先Chrome是正常的，这个应该是之前的缓存，清掉Chrome缓存，果然变成跟IE一样的404，在服务器上cd到打包目录竟然是空的，再次编译`npm run build`发现了一个问题，进度到`92%`会卡顿很久，然后结束，没有报错，之前没仔细注意以为是正常的。

webpack编译出错真是件麻烦事，以我的经验这种没有错误提示的不太好解决。

首先，得想想我做了哪些npm包及webpack配置上的改动，最近的改动时把egg及egg几个插件都更新到了最新版，难道是egg最新版依赖的npm包和webpack相关的包有重复？因为引用相同的包不同版本，会启用引用的最高版本，如果是这样，也没法排查，只能一个个试。

在此心中暗暗警戒自己一句：**没有问题的时候不要随意升级npm包**

接下来重置回之前的egg版本，无效，因为用的webpack4，都怀疑是不是webpack4哪个插件的版本兼容，这样的事可不少。

因为这次实验是现在本机打包，再次到服务器打包，而本机是正常的，不过有发现本机打包出来的文件非常大，每个页面都有1M多，`.map`文件更是多达5M多，十来个页面都有几十M了，编译的时候还巨卡

这是大概猜测到原因了，本机8G内存都卡成这样，服务器单核2G，实际可用内存还不到1G，估计是到92%的时候内存不够而提前结束进程。因为原本打包的文件每个页面不到100K，首先则要找出多出的js是什么，安装了`webpack-bundle-analyzer`再次编译

<img style="display:block;margin:0 auto" src="https://pic3.zhimg.com/v2-f9ae65e90b19293a410c402300560cc9_r.jpg" />

这下看出问题了，每个页面都打包了一个完整的antd(moment等库也是由antd引入的),仅此就有1M，而原本是有配置antd按需加载的，再次查阅了antd的按需加载说明：
```js
import { Button } from 'antd';
// 按需加载实际上是通过babel-plugin-import把上面的代码转换为下面的
import Button from 'antd/lib/button';
import 'antd/lib/button/style';
```
也就是说，antd的按需加载没有生效，再看antd的按需加载配置:
```json
{
  "presets": [
    "react",
    ["env",  { 
      "modules": false,
      "targets": {
        "browsers": ["last 2 versions", "safari >= 7", "iOS 7", "ie >= 9"]
      }
    }]
  ],
  "plugins": [
    "react-hot-loader/babel",
    "syntax-dynamic-import",
    "transform-es2015-modules-commonjs",
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-object-rest-spread",
    "transform-object-assign",
    ["import", { "libraryName": "antd", "style": "css" }],
  ],
  "comments": false
}
```
配置也是正常的，才想起之前加了一个`transform-es2015-modules-commonjs`，用于转换`module.exports`以兼容webpack，而babel的插件加载也是有先后顺序的，plugins是从上到下，presets是从下到上。

由此，把plugins顺序调整一下：
```json
{
  "plugins": [
    "react-hot-loader/babel",
    ["import", { "libraryName": "antd", "style": "css" }],
    "syntax-dynamic-import",
    "transform-es2015-modules-commonjs",
    "transform-decorators-legacy",
    "transform-class-properties",
    "transform-object-rest-spread",
    "transform-object-assign"
  ]
}
```
再次本机编译，每个页面js大小降到了100k以下，再次在服务器上打包，问题得以解决。

当然这个问题跟webpack的uglify插件也有关，没有错误提示或者没有正确的错误提示，其他的问题也不少

> 总之，一失足成千古恨，白费功夫大半夜。
## React和Vue同构组件的两端兼容

前端框架原本多是用于是天然适合SPA的类管理系统，随着现在Node体系的完善及多样化的需求，项目开始以Node作为服务器，既使用服务端渲染保证首屏的加载速度及SEO，又能享受到组件化开发带来的便利，React和Vue同构应用也较常见了。而同构就需要一套代码兼容Node和浏览器两端，所以介绍下同构组件如何做多端的兼容。

兼容处理就在于两端组件执行的生命周期不尽相同，注意在node同构周期避免使用window操作即可。

### 浏览器端和Node端的生命周期

浏览器端组件的生命周期就是组件的完整生命周期，Node端其实需要的就是组件的DOM结构，不需要交互逻辑，所以都是到render后得到DOM就结束了，只要在同构生命周期间要避免客户端代码的执行即可。

for React
```javascript
getDefaultProps
⇩
getInitialState
⇩
componentWillMount
⇩
render //服务端渲染在此处结束
⇩
componentDidMount
⇩
componentWillReceiveProps / shouldComponentUpdate / componentWillMount / componentWillUpdate / componentDidUpdate
```

for Vue
```javascript
beforeCreate
⇩
created
⇩
beforeMount
⇩
render //服务端渲染在此处结束
⇩
mounted
⇩
beforeUpdate
⇩
updated
⇩
destroyed
⇩
beforeDestroyed
```

### 通用Render方法

for React
```javascript
const isClient = typeof window !== 'undefined'

class App extends React.Component {
  render(){
    return <div>Hello World</div>
  }
}

const DOMRender = isClient ? require('react-dom') : require('react-dom/server')

module.exports = function (jsx,element){
  if(isClient){
    if(typeof element !== 'object' || !element.nodeType){
      element = document.getElementById(element)
    }
    DOMRender.render(jsx,element)
  } else {
    // 输入纯html
    // return DOMRender.renderToStaticMarkup(jsx)
    // 或者，输出带checkSum标记的html，检测到变化时才更新dom，具体看各个版本说明
    return DOMRender.renderToString(jsx)
  }
}
```

for Vue
```javascript
const isClient = typeof window !== 'undefined'

const App = new Vue({
  template: `<div>Hello World</div>`
})

module.exports = function (vm,element){
  if(isClient){
    if(typeof element !== 'object' || !element.nodeType){
      element = document.getElementById(element)
    }
    vm.$mount(element)
  } else {
    const DOMRender = require('vue-server-renderer').createRenderer()
    // 返回Promise可以配合await变成同步
    return new Promise((resolve,reject)⤵️{
      // Vue以回调的方式返回html有点坑
      DOMRender.renderToString(vm, (err, html) ⤵️ {
        if (err){
          reject(err)
        }else{
          resolve(html) // ⤵️ <div data-server-rendered="true">Hello World</div>
        }
      })
    })
  }
}
```

### State传递

由于主要数据已经在服务端获取，所以客户端初始渲染数据只要获取服务端传递过来的数据就可以了，不再重新请求数据。

关于服务端向客户端传递数据的方法大体也就一种，服务端包装好数据直接塞在html里面。
方法一：
在html里插入script标签将数据赋值给window的全局变量，我的个人网站做法就是如此，例如：
```html
<script>window.__INITIAL_STATE__ = ${ JSON.stringify(originState) }</script>
```
方法二:
在html里插入dom将数据赋值给dom的属性，知乎就是这样做的，并在获取state后将dom删除掉，但通过html请求可以看到，例如：
```html
<div data-state="${ JSON.stringify(originState) }"></div>
```
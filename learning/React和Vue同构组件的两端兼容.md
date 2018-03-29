# React和Vue同构组件的两端兼容

兼容处理就在于两端执行的生命周期不尽相同，注意在node同构周期避免使用window操作即可。

### 浏览器端生命周期

for React
```
getDefaultProps => getInitialState => componentWillMount => render
=> componentDidMount => componentWillReceiveProps/shouldComponentUpdate/componentWillMount/componentWillUpdate/componentDidUpdate
```

for Vue
```
beforeCreate => created => beforeMount => render
=> mounted => beforeUpdate => updated => destroyed => beforeDestroyed
```

### Node端同构生命周期

在同构生命周期间要避免客户端代码的执行

for React
```
getDefaultProps => getInitialState => componentWillMount => render
```

for Vue
```
beforeCreate => created => beforeMount => render
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
    // return DOMRender.renderToStaticMarkup(jsx) //输入纯html
    return DOMRender.renderToString(jsx) //输出带checkSum标记的html，检测到变化时才更新dom，具体看各个版本说明
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
    return new Promise((resolve,reject)=>{
      // Vue以回调的方式返回html有点坑
      DOMRender.renderToString(vm, (err, html) => {
        if (err){
          reject(err)
        }else{
          resolve(html) // => <div data-server-rendered="true">Hello World</div>
        }
      })
    })
  }
}
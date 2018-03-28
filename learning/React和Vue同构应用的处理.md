
### client end life cycle
```
getDefaultProps => getInitialState => componentWillMount => render
=> componentDidMount => componentWillReceiveProps/shouldComponentUpdate/componentWillMount/componentWillUpdate/componentDidUpdate
```

### node end life cycle (node端同构)
在同构生命周期间要避免客户端代码的执行
```
getDefaultProps => getInitialState => componentWillMount => render
```
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
    return DOMRender.renderToStaticMarkup(jsx)
  }
}
```

### client end life cycle
```
beforeCreate => created => beforeMount => render
=> mounted => beforeUpdate => updated => destroyed => beforeDestroyed
```

### node end life cycle (node端同构)
在同构生命周期间要避免客户端代码的执行
```
beforeCreate => created => beforeMount => render
```
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
    // vue以回调的方式返回html有点坑
    DOMRender.renderToString(vm, (err, html) => {
      if (err) throw err
      console.log(html)
      // => <div data-server-rendered="true">Hello World</div>
    })
  }
}
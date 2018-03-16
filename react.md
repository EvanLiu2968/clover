
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
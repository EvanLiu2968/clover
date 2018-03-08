
### client end life cycle
```
getDefaultProps => getInitialState => componentWillMount => render
=> componentDidMount => componentWillReceiveProps/shouldComponentUpdate/componentWillMount/componentWillUpdate/componentDidUpdate
```

### node end life cycle (node端同构)
在同构生命周期间要避免出现客户端的代码
```
getDefaultProps => getInitialState => componentWillMount => render
```
```javascript
const isServer = typeof window === 'undefined'
var reactDom = isServer ? require('react-dom-server') : require('react-dom')

module.exports = function(jsx,id){
  if(isServer){
    // return pure html
    return reactDom.render(jsx)
  } else {
    reactDom.render(jsx,id)
  }
}
```
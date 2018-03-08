
### client end life cycle
```
beforeCreate => created => beforeMount => render
=> mounted => beforeUpdate => updated => destroyed => beforeDestroyed
```

### node end life cycle (node端同构)
在同构生命周期间要避免出现客户端的代码
```
beforeCreate => created => beforeMount => render
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
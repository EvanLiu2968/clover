## React和Vue组件的通信

这里涉及组件库开发关联组件或业务需求需要的一些组件通信方法

### Vue

> 参考[vue父、子、孙组件间数据传递、事件传递](https://juejin.im/post/5b570924e51d45195f0b3bb3)

- 获取父子实例调用实例方法通信
- $attrs $listeners属性/事件传递
- $on $emit事件通信
- provide/inject嵌套通信
[https://cn.vuejs.org/v2/api/#provide-inject](https://cn.vuejs.org/v2/api/#provide-inject)
```javascript
export default {
    name: 'parent',
    components: {
        subChild,
    },
    provide() {
        return {
            $userStore: this.$userStore
        }
    },
    data() {
        return {
            $userStore: {
                state: {
                    name: 'evanliu'
                },
                commit (key, value) {
                    this.state[key] = value
                }
            },
        };
    }
}
```
```javascript
export default {
    name: 'sub-child',
    template: `
    <div>
      <span>用户名：{{$userStore.state.name}}</span>
    </div>
    `,
    inject: ['$userStore'],
    methods: {
        updateName(value) {
            this.$userStore.commit('name', value)
        }
    }
}
```
- 利用$parent、$children封装一套可向下广播事件，向上派发事件的方法
```javascript
/*递归子组件，找到对应组件并广播事件*/
function broadcast(componentName, eventName, params) {
  /*遍历当前节点下的所有子组件*/
  this.$children.forEach(child => {
    /*获取子组件名称*/
    var name = child.$options.name;

    if (name === componentName) {
      /*如果是我们需要广播到的子组件的时候调用$emit触发所需事件，在子组件中用$on监听*/
      child.$emit.apply(child, [eventName].concat(params));
    } else {
      /*非所需子组件则递归遍历深层次子组件*/
      broadcast.apply(child, [componentName, eventName].concat([params]));
    }
  });
}
/*递归父组件，找到对应组件并派发事件*/
function dispatch(componentName, eventName, params) {
  /*获取父组件，如果以及是根组件，则是$root*/
  var parent = this.$parent || this.$root;
  /*获取父节点的组件名*/
  var name = parent.$options.name;
  while (parent && (!name || name !== componentName)) {
    /*当父组件不是所需组件时继续向上寻找*/
    parent = parent.$parent;
    if (parent) {
      name = parent.$options.name;
    }
  }
  /*找到所需组件后调用$emit触发当前事件*/
  if (parent) {
    parent.$emit.apply(parent, [eventName].concat(params));
  }
}
```
*通过这种方式进行数据、事件传递，必须给组件命名name;*

### React

- props 嵌套组件传值,可层层传递
- 嵌套组件之间通信，父组件提供`getChildContext()`函数，用来返回子组件相应的`context`对象
```javascript
import React from 'react';
import PropTypes from "prop-types";

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      color: "red"
    };
  }

  static childContextTypes = {
    color:PropTypes.string,
    callback:PropTypes.func,
  }

  getChildContext(){
    return{
      color:this.state.color
      changeColor:this.changeColor.bind(this)
    }
  }

  changeColor(color){
    this.setState({
      color: color
    })
  }

  render(){
    return(
      <div>
        <Sub>
          <SubChild></SubChild>
        </Sub>
      </div>
    );
  }
}
```
```javascript
import React from "react";
import PropTypes from "prop-types";

export default class SubChild extends React.Component{
  // declare context
  static contextTypes = {
    color:PropTypes.string,
    changeColor:PropTypes.func,
  }
  render(){
    const style = { color:this.context.color }
    const cb = (color) => {
      return () => {
        this.context.changeColor(color);
      }
    }
    return(
      <div style = { style }>
        {`color is ${this.context.color}.`}
        <button onClick = { cb("#20a0ff") }>change color</button>
      </div>
    );
  }
}
```
- 非嵌套组件间通信，可使用事件订阅，不同于Vue已内置事件模型，React需要自行构建
```javascript
import React,{ Component } from "react";
import emitter from "./emitter"

export default class VideoPlayer extends Component{
  constructor(props) {
    super(props);
    this.state = {
      msg:'初始化中...',
    };
  }
  componentDidMount(){
    this.eventEmitter = emitter.addListener("loadComponent",(msg)=>{
      this.setState({
        msg
      })
    });
  }
  // 组件销毁前移除事件监听
  componentWillUnmount(){
    emitter.removeListener(this.eventEmitter);
  }
  render(){
    return(
      <div>
        { this.state.msg }
      </div>
    );
  }
}
```
```javascript
import React,{ Component } from "react";
import emitter from "./emitter"

export default class Bullet extends Component{
  componentDidMount(){
    emitter.emit('loadComponent','弹幕装载完成')
  }
  render(){
    return(
      <div>bullet</div>
    );
  }
}
```
- `ReactDOM.createPortal` React16版本新的顶级API，可以把组件渲染在父节点DOM之外，但保持组件的嵌套关系
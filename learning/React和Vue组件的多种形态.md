## React和Vue组件的多种形态

### React组件

- 无状态组件
- 状态组件
- 高阶组件

#### 无状态组件

一段JSX就可以当成一个无状态组件，它不包含组件状态的一个变更，也是React应用优先采用的一种组件形式，使组件尽可能的简单从而提升整体性能

例如：
```javascript
function pureComponent(props){
  return (
    <div>
      <h1>{props.title}</h1>
      {props.children}
    </div>
  )
}
```

#### 状态组件

状态组件即拥有完整组件生命周期的组件，通过状态、属性来控制组件的展示

ES5的`React.createClass`形式
```javascript
var ES5Component = React.createClass({
  //定义传入props中的属性各种类型
  propTypes: {
    initialValue: React.PropTypes.string
  },
  //组件默认的props对象
  defaultProps: {
    initialValue: ''
  },
  // 设置 initial state
  getInitialState: function() {//组件相关的状态对象
    return {
      text: this.props.initialValue || 'placeholder'
    };
  },
  handleChange: function(event) {
    this.setState({ //this represents react component instance
      text: event.target.value
    });
  },
  render: function() {
    return (
      <div>
        <input onChange={this.handleChange} value={this.state.text} />
      </div>
    );
  }
});
ES5Component.propTypes = {
  initialValue: React.PropTypes.string
};
ES5Component.defaultProps = {
  initialValue: ''
};
```

ES6的`React.Component`的类继承形式
```javascript
class ES6Component extends React.Component {
  constructor(props) {
    super(props);

    // 设置 initial state
    this.state = {
      text: props.initialValue || 'placeholder'
    };

    // ES6 类中函数必须手动绑定
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      text: event.target.value
    });
  }

  render() {
    return (
      <div>
        <input onChange={this.handleChange} value={this.state.text} />
      </div>
    );
  }
}
ES6Component.propTypes = {
  initialValue: React.PropTypes.string
};
ES6Component.defaultProps = {
  initialValue: ''
};
```
其中，通过`React.createClass`创建的组件所有的成员方法this指向类本身，而`React.Component`自定义的成员方法this指向需要手动绑定，可以使用装饰器统一绑定或者在构造函数中逐个`bind`

#### 高阶组件

高阶组件其实只是类似于高阶函数的一种组件使用方式，先来看看高阶函数的定义

高阶函数(higher-order function)指操作函数的函数，一般有以下几种情况：
- 函数可以作为参数被传递
- 函数可以作为返回值输出

由此，高阶组件就是指操作函数或组件的函数，参数可能是组件，返回值也可能是组件。
以常用的`redux`和`antd`为例
```javascript
import { connect } from 'redux';
import { Form } from 'antd';

const ConnectedComment = connect(mapStateToProps, mapDispatchToProps)(Component);
const WrappedLoginForm = Form.create()(LoginForm);
// 另一种调用方式如decorator
@Form.create()
class LoginForm extends React.Component {
  //
}
```
大概形式如下：
```javascript
export const errorHandler = function(props = {}){
  return function(Component){
    return class extends React.Component {
      render() {
        return <ErrorHandler {...props}><Component {...this.props}/></ErrorHandler>
      }
    }
  }
}
```

上面这种是通过包装组件达到扩展组件功能的一个目的，还有一种则是以函数形式的调用来操控组件，最常见的如消息弹框
```javascript
import MessageBox from './MessageBox';

function Message(props) {
  return new Promise((resolve, reject) => {
    const div = document.createElement('div');

    document.body.appendChild(div);

    if (props.lockScroll != false) {
      document.body.style.setProperty('overflow', 'hidden');
    }

    const component = React.createElement(MessageBox, Object.assign({}, props, {
      promise: { resolve, reject },
      onClose: () => {
        ReactDOM.unmountComponentAtNode(div);
        document.body.removeChild(div);
        document.body.style.removeProperty('overflow');

        if (props.onClose instanceof Function) {
          props.onClose();
        }
      }
    }));

    ReactDOM.render(component, div);
  });
}
```
需要注意下`React.createElement(Component,props)`的这种创建形式，而不是`new Component(props)`

### Vue组件

- [探索Vue高阶组件](http://hcysun.me/2018/01/05/%E6%8E%A2%E7%B4%A2Vue%E9%AB%98%E9%98%B6%E7%BB%84%E4%BB%B6/)
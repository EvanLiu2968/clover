## Web端异常监控及用户行为统计

在服务端一般有框架集成日志模块，在Web端就需要手动去采集需要的信息传回服务器去做数据分析。

相对懒人模式的有Google Analystic, 或者墙内的百度统计，以最简单的方式获取一些基本统计信息。

### 异常监控

需要监控的异常包含但不限于：

- 资源响应异常，包括接口、图片、CSS、JS等资源的403/404/500等
- 运行时错误，包括错误时间、运行环境、代码位置、堆栈等便于排查错误。

### 用户行为统计

一张图抛砖引玉

<img style="display:block;margin:0 auto" src="http://wx2.sinaimg.cn/mw690/df3fcedbgy1ft7cpcpbftj20h536oqjg.jpg" />

### React及Vue组件的监控及采集

```javascript
export const reporter = function(props = {}){
  return function(Component){
    return class extends React.Component {
      render() {
        return <Reporter {...props}><Component {...this.props}/></Reporter>
      }
    }
  }
}
```
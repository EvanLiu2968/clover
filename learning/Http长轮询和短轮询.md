## Http长轮询和短轮询

可以先看看这篇文章的解释[TCP长连接和短连接 - http长轮询和短轮询](https://blog.csdn.net/alps1992/article/details/51201657)

### Node WebSocket的实现

以网上demo作为示例

服务器端
```javascript
const Server = require('ws').Server;
const wss = new Server({
  port:2000
});
wss.on('connection',function(ws){
  ws.on('message',function(data){
    ws.send('你好,客户端,我是服务器!');
    console.log(data);
  })
});

```
客户端
```javascript
/*
 * node客户端
 */
const WebSocket = require('ws');
const socket = new WebSocket('ws://localhost:2000/');
socket.on('open',function(){
  socket.send('你好，服务器,我是客户端');
});
socket.on('message',function(event){
  console.log(event);
})
/*
 * 浏览器
 */
const socket = new WebSocket('ws://localhost:2000/');
  socket.onopen = function(){

  };
  socket.onmessage = function(event){
    console.log(event.data)
  }
```
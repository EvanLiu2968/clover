## Node内存泄露解决方案

如果只关注浏览器端的话，基本不用怎么关注内存的问题，毕竟能刷新重置。
但在服务端就必须重视这个问题，高并发情况下，任何一个小问题都被放大了。
一段程序在执行过程中本身会占用一定的内存，执行完相应的将释放原有占用的内存，这是一个理想状态。

但如果执行完内存释放不完全导致内存常驻，这就算是内存泄漏，
或者释放内存的速度小于占用内存的速度也是会导致内存占用的堆积过高，这种一般在高并发情况下发生，合理做负载均衡即可，

主要需要解决的是第一种情况内存常驻(泄漏)的问题。

### 内存泄露的典型情况

#### 闭包引用导致的泄漏

本来闭包的一个特性就是可以让局域作用域内的一些变量常驻，这种算是最多的典型，拿网上的代码示例如下：
```javascript
'use strict';
const express = require('express');
const app = express();

//以下是产生泄漏的代码
let theThing = null;
let replaceThing = function () {
  let leak = theThing;
  let unused = function () {
    if (leak)
      console.log("hi")
  };
  
  // 不断修改theThing的引用
  theThing = {
    longStr: new Array(1000000),
    someMethod: function () {
      console.log('a');
    }
  };
};

app.get('/leak', function closureLeak(req, res, next) {
    replaceThing();
    res.send('Hello Node');
});

app.listen(8082);
```

#### 全局缓存导致的泄漏
有时候可能用了某些变量来缓存数据而没有清除旧数据，自然会导致变量内存占用越来越高，代码示例如下：
```javascript
'use strict';
const easyMonitor = require('easy-monitor');
const express = require('express');
const app = express();

const _cached = [];

app.get('/arr', function arrayLeak(req, res, next) {
	//只进不出
    _cached.push(new Array(1000000));
    res.send('Hello World');
});

app.listen(8082);
```
值得注意的是，如果你对某个变量频繁的进行赋值操作，也可能导致垃圾内存回收的不及时
```javascript
const _cached = {};
app.post('/userinfo', function arrayLeak(req, res, next) {
  //频繁的进行赋值操作
  _cached.userinfo=req.body
  res.send('Hello World');
});
```

#### 原生Socket重连策略不恰当导致的泄漏
这种比较少见，我直接从网上找了例子
```javascript
const net = require('net');
let client = new net.Socket();

function connect() {
  client.connect(26665, '127.0.0.1', function callbackListener() {
  console.log('connected!');
});
}

//第一次连接
connect();

client.on('error', function (error) {
  // console.error(error.message);
});

client.on('close', function () {
  //console.error('closed!');
  //泄漏代码
  client.destroy();
  setTimeout(connect, 1);
});
``` 
这是 `net` 模块的重连每一次都会给 client 增加一个 connect事件 的侦听器，如果一直重连不上，侦听器会无限增加，从而导致泄漏。

### 泄漏排查工具的使用

#### heapdump
- `node-heapdump`
- `node-memwatch`

#### easy-monitor

[easy-monitor文档](http://easy-monitor.cn/document)

```javascript
// monitor进程界面: http://localhost:12333  文档:http://easy-monitor.cn/document
const easyMonitor = require('easy-monitor');
easyMonitor('monitor 7atour');
myApp()
```
#### Alinode - Node.js性能平台的使用

大致过程是使用阿里开发的一个Node引擎Alinode代替原生Node执行项目，并通过连接Node.js性能平台，将内存堆数据传给平台进行分析，包括一些可视分析图的展示，这里只讲下其安装启动过程。

> 以下步骤为Mac实际步骤

##### 启动

未安装部署过`alinode`先执行 **安装部署** 步骤

连接alinode性能平台
`nohup agenthub yourconfig.json &`

执行 node App <br/>Nginx
`ENABLE_NODE_LOG=YES node index.js` <br/>
或者使用pm2启动 <br/>
`ENABLE_NODE_LOG=YES pm2 start index.js --name pcfed`

> 注意

执行node App前先查看`which node` <br/>
查看node映射命令`/Users/用户/.tnvm/versions/alinode/v3.9.0/bin/node` <br/>
包含`alinode`的路径则执行`node`时实际为`alinode`

正常`which node`显示为`/usr/local/bin/node`

当`alinode`映射有问题时，有两种方式:

1. 需要手动使用`alinode`路径执行js文件 <br/>
示例：`ENABLE_NODE_LOG=YES /Users/evanliu/.tnvm/versions/alinode/v3.9.0/bin/node index.js`

2. 执行 **安装部署** 中的`source .bashrc`,不要切换终端，cd至相应文件执行
`ENABLE_NODE_LOG=YES node index.js`

##### 安装部署

[alinode runtime部署文档](https://help.aliyun.com/document_detail/60902.html?spm=a2c4g.11174283.6.552.7tCr1U)

##### 安装alinode
`wget -O- https://raw.githubusercontent.com/aliyun-node/tnvm/master/install.sh | bash`

`vi .bashrc`

.bashrc根据不同系统有不同配置方式，具体参照命令终端给出的提示
```bashrc
export TNVM_DIR="/Users/用户/.tnvm"
[ -s "$TNVM_DIR/tnvm.sh" ] && . "$TNVM_DIR/tnvm.sh"
# This loads nvm
export NODE_PATH="/User/用户/.tnvm/lib/node_modules/"
export PATH="/User/用户/.tnvm/bin/":$PATH
```
运行`source .bashrc`使暴露的tnvm变量及node路径映射生效

`alinode-v3.9.0` 对应 `node-v8.9.4` <br/>
`tnvm install alinode-v3.9.0` <br/>
`tnvm use alinode-v3.9.0`

##### 安装agenthub
`npm install @alicloud/agenthub -g` <br/>
根据提示设置agenthub配置文件yourconfig.json <br/>
配置完后`vi yourconfig.json`查看是否配置正确 <br/>
yourconfig.json 参数如下：
```json
{
  "server": "agentserver.node.aliyun.com:8080",
  "appid": "3180",
  "secret": "6e5705973527b4883b38c6fbcbd256afa326eaa1",
  "logdir": "/tmp/",
  "reconnectDelay": 10,
  "heartbeatInterval": 60,
  "reportInterval": 60,
  "error_log": [],
  "packages": []
}
```
然后按照 **启动** 步骤执行Alinode

### Mock request
这个是我调试时模拟页面请求写的测试代码，顺便一起贴上来了
```javascript
var request = require('request')

const config = {
  requestUrl:[
    'http://127.0.0.1:9080/ssrTest1/',
    'http://127.0.0.1:9080/ssrTest2/',
    'http://127.0.0.1:9080/ssrTest3/',
  ],
  maxCount: 200
}

var args = process.argv.splice(2); //取得命令行参数

var maxCount = config.maxCount
if(typeof parseInt(args[0]) === 'number'){
  maxCount = parseInt(args[0])
}

var count = 0;
function startRequest(){
  if(count < maxCount){
    let url = getRandomFormArray(config.requestUrl)
    request(url, function (error, response, body) {
      count++
      console.log('开始第 '+count+' 次请求')
      startRequest()
    });
  }
}
// start run
startRequest()

function getRandomFormArray(arr){
  let length = arr.length
  let i = Math.floor(Math.random()*length)
  return arr[i]
}
```

### 相关资料参考
- [node内存控制](http://blog.csdn.net/exialym/article/details/52119074)
- [js内存管理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)
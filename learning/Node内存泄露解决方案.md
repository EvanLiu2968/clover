# node内存泄露排查


## 内存泄露

# 使用`easy-monitor`监控node server
[相关文章](https://cnodejs.org/topic/58eb5d378cda07442731569f)

## 使用
```
// monitor进程界面: http://localhost:12333  文档:http://easy-monitor.cn/document
const easyMonitor = require('easy-monitor');
easyMonitor('monitor 7atour');
myApp()
```
[更多使用查看文档](http://easy-monitor.cn/document)

## Xcode

mac需要依赖Xcode生成解析内存的编译包

遇到`easy-monitor`抛出服务器异常可尝试`npm i v8-profiler-node8`
如安装时有如下错误，则需要解决这个问题：
```
xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance
```

这是由于安装多个(版本)的Xcode引起的
可以执行以下命令：(xcode包目录可能有差异)
`sudo xcode-select -s /Applications/Xcode.app/Contents/Developer/`
如正确设置，可`xcodebuild -version`查看其版本号

## mock request
```javascript
var request = require('request')

const config = {
  requestUrl:[
    'http://127.0.0.1:60200/touroperator/specialline/',
    'http://127.0.0.1:60200/hotel/groupbooking/',
    'http://127.0.0.1:60200/ticket/groupbooking/',
    'http://127.0.0.1:60200/ticket/recommendhotel/',
    'http://127.0.0.1:60200/tourbus/list/',
    'http://127.0.0.1:60200/shopping/list/',
    'http://127.0.0.1:60200/restaurant/list/',
    'http://127.0.0.1:60200/festival/list/',
    'http://127.0.0.1:60200/toursaler/specialline/',
    'http://127.0.0.1:60200/cruise/list/',
    'http://127.0.0.1:60200/visa/',
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
# Node.js性能平台的使用

> 以下步骤为Mac实际步骤


## 启动

未安装部署过`alinode`先执行 **安装部署** 步骤

连接alinode性能平台
`nohup agenthub yourconfig.json &`

执行 node App <br/>
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

## 安装部署

[alinode runtime部署文档](https://help.aliyun.com/document_detail/60902.html?spm=a2c4g.11174283.6.552.7tCr1U)

### 安装alinode
`wget -O- https://raw.githubusercontent.com/aliyun-node/tnvm/master/install.sh | bash`

`vi .bashrc`

.bashrc根据不同系统有不同配置方式，具体参照命令终端给出的提示
```
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

### 安装agenthub
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
然后按照 **启动** 步骤执行alinode

## 内存泄露排查相关
- `node-heapdump`
- `node-memwatch`
- `easy-monitor`

### 相关资料参考
- [node内存控制](http://blog.csdn.net/exialym/article/details/52119074)
- [js内存管理](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Memory_Management)
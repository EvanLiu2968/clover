# 服务器自动同步Github仓库的方法

### 前提需求

之前我有提及，[www.evanliu2968.com.cn]上的文档都是node服务读取我的Github上的一个专用文档库，由于请求Github文件的操作很慢且很容易挂掉，所以我在部署服务器上又加了一个从Github拉取下来的本地文档仓库，浏览文档可以秒开了。

但随之带来一个问题，如果我更新文档库，还得登录服务器拉取文档库最新文档，这得浪费几分钟时间，肯定不能忍。

所以我找了几种方法
- 方法一：写一个定时器，定时每过一段时间在目标仓库执行`git pull`
- 方法二：部署Git Hooks，当监听到`push`事件时在目标仓库执行`git pull`，我搜了一个别人的教程
<a href="https://segmentfault.com/a/1190000003836345" target="_blank">Git Hooks 部署教程</a>

不过，我的仓库是托管在Github上的，Github已经贴心的做好了这个Hooks，<a href="https://developer.github.com/webhooks/" target="_blank">Github Webhooks官方文档</a>，下面主要就来介绍Github Webhooks如何使用。

### Github仓库Webhooks设置

打开`Github`仓库 => `Settings` => `Webhooks`

`Payload URL`项填写一个接口地址
比如例如填的是`http://www.evanliu2968.com.cn/hookTest`，会在event发生时发起该URL的Post请求

`Content type`必须选择`application/json` <br/>
`Secret`填写一个字符串，用来给你的接口做验证 <br/>
`Webhooks event`默认选择`Just the push event.`，毕竟只需要一个push事件

填完后保存不出意料会看到当前hook有一个感叹号表示不可用，所以下一步就来搭建这个post接口。

### Webhooks的接口搭建

这里以我的node服务作为示例，直接在`koa-router`里加上接口
```javascript
router.post('/hookTest', async function(ctx, next) {
  // console.log(ctx.req.headers)
  // console.log(ctx.request.body) //一大串仓库push的信息，没什么用，忽略它
  var sign   = ctx.req.headers['x-hub-signature']   //输出为：sha1=${secret的加密字符串}
  var event = ctx.req.headers['x-github-event']    //输出为：事件名称(push)
  var commitID    = ctx.req.headers['x-github-delivery'] //输出为：commitID
  if(event=='push'){
    // 可在此验证sign真伪
    let cwd = process.cwd()
    runCmd('sh', [path.join(cwd,'scripts/pullClover.sh')], function(res){
      console.log(res) //res返回的是shell命令操作后在命令行终端显示的字符串，这里是一些git操作的提示
    });
  }
  ctx.body = 'hello, github!'
});
// 运行shell
function runCmd(cmd, args, callback) {
  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var res = "";

  child.stdout.on('data', function(buffer) { res += buffer.toString(); });
  child.stdout.on('end', function() { callback (res) });
}
```
关于`scripts/pullClover.sh`的shell脚本我这里就简单的`git pull`，顺便也贴上来
```shell
#!/bin/bash

# target folder: 与整个项目同级的clover
cd ../clover

# pull clover
git pull
```
关于shell有非常多的各种妙用，以后有时间再来详细介绍下

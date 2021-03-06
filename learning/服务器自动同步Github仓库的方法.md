## 服务器自动同步Github仓库的方法

### 前提需求

之前我有提及，[www.evanliu2968.com.cn](https:///www.evanliu2968.com.cn)上的文档都是node服务读取我的Github上的一个专用文档库，由于请求Github文件的操作很慢且很容易挂掉，所以我在部署服务器上又加了一个从Github拉取下来的本地文档仓库，浏览文档可以秒开了。

但随之带来一个问题，如果我更新文档库，还得登录服务器拉取文档库最新文档，这得浪费几分钟时间，肯定不能忍。

解决方案
- 部署Git Hooks，当监听到`push`事件时Git会执行`.git/hooks`中对应的hook脚本 [Git 钩子介绍](https://www.git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)

大致就是修改`.git/hooks`中的`.sample` 结尾的示例文件，去掉`.sample`，写入对应钩子要执行的shell脚本，git事件发生时会执行同名的shell脚本,`post-receive`示例：
```shell
#!/bin/sh
export GIT_WORK_DIR=/root/evanliu2968
unset GIT_DIR
cd $GIT_WORK_DIR
git reset --hard
git pull origin master
```

我的仓库是托管在Github上的，我这里使用了Github的Hooks接口，[Github Webhooks官方文档](https://developer.github.com/webhooks/)，下面主要就来介绍Github Webhooks如何使用。

### Github仓库Webhooks设置

打开`Github`仓库 => `Settings` => `Webhooks`

`Payload URL`项填写一个接口地址
比如例如填的是`https:///www.evanliu2968.com.cn/hookTest`，会在event发生时发起该URL的Post请求

`Content type`必须选择`application/json` <br/>
`Secret`填写一个字符串，用来给你的接口做验证 <br/>
`Webhooks event`默认选择`Just the push event.`，毕竟只需要一个push事件

填完后保存不出意料会看到当前hook有一个感叹号表示不可用，所以下一步就来搭建这个post接口。

### Webhooks的接口搭建

这里以我的node服务作为示例，直接在`koa-router`里加上接口
```javascript
var crypto = require('crypto'); // 提供通用的加密和哈希算法

router.post('/hookTest', async function(ctx, next) {
  // console.log(ctx.req.body) //一大串仓库push的信息，用它来计算动态签名
  var sign = ctx.req.headers['x-hub-signature']   //输出为：sha1=${secret的加密字符串}
  var event = ctx.req.headers['x-github-event']    //输出为：事件名称(push)
  var commitID = ctx.req.headers['x-github-delivery'] //输出为：commitID
  if(event=='push'){
    // 根据请求的body和secret计算sha1的值
    var hmac = crypto.createHmac('sha1','your github secret');
    hmac.update(new Buffer(JSON.stringify(ctx.req.body))); //ctx.req.body时github传过来的post数据(跟ctx.request.body一样的)
    var signature = 'sha1=' + hmac.digest('hex'); //用这个跟sign对比
    // 可在此验证sign真伪
    if(signature == sign){
      let cwd = process.cwd()
      runCmd('sh', [path.join(cwd,'scripts/pullClover.sh')], function(res){
        console.log(res) //res返回的是shell命令操作后在命令行终端显示的字符串，这里是一些git操作的提示
      });
    }
  }
  ctx.body = { message:'hello, github' }
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
关于`crypto`模块，可以看这个[crypto](https://www.liaoxuefeng.com/wiki/001434446689867b27157e896e74d51a89c25cc8b43bdb3000/001434501504929883d11d84a1541c6907eefd792c0da51000)

`scripts/pullClover.sh`的shell脚本我这里就简单的`git pull`，顺便也贴上来
```shell
#!/bin/bash

# target folder: 与整个项目同级的clover
if [ ! -x "../scripts/pullClover.sh" ];then
echo 'please enter: sodu chmod 777 ../scripts/pullClover.sh'
fi

if [ ! -d "../clover" ];then
# 没有则创建文件夹，拉取github仓库
echo 'clover is not found, start to create clover files...'
mkdir ../clover
cd ../clover
git init
git remote add clover https://github.com/EvanLiu2968/clover.git
git fetch clover
git checkout master
else
cd ../clover
git pull
fi
```
关于shell有非常多的各种妙用，以后有时间再来详细介绍下

## Electron应用实践

现在Browser/Server应用日益强大、完善，但受限于浏览器的天然限制，很多时候还是需要Client/Server应用来为我们提供更好的服务。而Electron很好的为我们提供了PC客户端应用开发的解决方案，其核心就是封装了一个包含Node和Chronium的壳(Shell)

### 如何开发

我们通常可以按普通web应用的方式来开发界面，而Node则提供浏览器受限的本地文件读写及系统API调用等功能。
我们可以直接在web里调用Node的功能，但考虑模块的解耦及web端的复用，可能需要同时适配桌面端和客户端，建议web端以调用接口的形式来完成web和本地Node的通信，相当于把远程的server端搬到了本地而已。

具体设计参考当前写的一个electron版音乐播放器：[music-player](https://github.com/EvanLiu2968/music-player)

架构设计如下：

### Electron架构

代码未动，架构先行,我把整个应用分为三个大模块：Electron Shell、Node API Server、React web APP。
三个大模块都有独立的package、运行方式，由此这三个模块可以单独开发、迭代，设计的架构图如下：
<img src="https://raw.githubusercontent.com/EvanLiu2968/clover/master/cdn/app/music-player/framework.jpg" style="display: block;margin:0 auto;">

### 主要技术栈

- web：typescript + react + redux + antd-ui
- server: typescript + koa
- shell: electron + electron-builder

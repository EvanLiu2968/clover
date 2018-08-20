## Egg实践之网站重构

毫无疑问，Koa是Node服务端框架首选，不过Koa做了基础部分，实际开发还是得大量依赖第三方中间件和插件，避免不了项目的整体混乱。要避免混乱，首先就得制定规范，规范怎么定，首先得看生态的主流规范。

Egg的生态相对还是比较好的，有阿里背书，已有很多Egg应用已上线生产验证过，我对此看好。

目前网站[evanliu2968.com.cn](http://evanliu2968.com.cn)已经用Egg重构，主要模块已完成，后续接入Mongodb/Mysql、Redis和Docker，用于保存后台管理数据及爬虫数据，也算是练习吧。

我的网站以React为基础，有多单页`server side render`，也有`single page application`，所以第一步是构建webpack打包。

为节省时间，我采用了egg生态封装好的现成的脚手架，虽然做一些自定义配置还是有些小问题，终究还是能跑了，后续有时间再自己实现一个构建脚手架，方便以后扩展。

后面有通过webpack4实现的一个脚手架及node服务端，server端也是借鉴了部分egg的设计思想写的，写的很简洁，可以借鉴下，
github地址：[https://github.com/EvanLiu2968/webpack4-plus-koa](https://github.com/EvanLiu2968/webpack4-plus-koa)

其实具体怎么开发，文档都写的很详细了，所以我先主要讲认为的几个优点，再大概的把结构梳理下。

1. 生态发展好，包括Koa和Egg相关插件，问题点基本都有成熟解决方案。

2. 统一企业开发规范，结构清晰，易于排查问题点，易于后续扩展维护。

### 基本结构

- config

应用配置，包括Egg集成插件的启用、设置等及自定义配置项，不同运行环境配置可覆盖默认，并可在应用内部任意处调用。

- router

统一用一个文件来定义路由，包括Page路由和API路由，也是了解一个应用的起点。

- controller

控制层，作为响应输出端，比如Page和API的响应。

- service

服务层，官方说法是业务逻辑层，我这里用来做接口的逻辑

- middleware

中间件层，基本用法与Koa中间件一致，可自行写或者调用第三方，这里只是定义，可以在config里开启全局启用或应用内单独启用

- public

静态资源层，这个是可以自定义的，我的public放在了最外层(app同级)

- view

视图层，可放置html或其他模板，我这里使用了`egg-view-react-ssr`，全是`.js`

- 其他

Egg官方文档是很好的学习资料，首先了解它的整体设计规范，然后可以根据这些设计规范自己尝试实践出一个简版的egg，不了解的地方可以去查看egg的源码，通读源码能发现许多文档上没有的知识。

比如egg的基础核心是通过扩展koa的`application` `context` `request` `response`四个类对象，`controller` `service`也是继承公用的基类而来，将其挂载在`application`或`context`上，以下示例中Loader的加载过程部分的源码是理解egg生命周期关键的一部分，建议去深入阅读。
```javascript
class AppWorkerLoader extends EggLoader {

  /**
   * loadPlugin first, then loadConfig
   * @since 1.0.0
   */
  loadConfig() {
    this.loadPlugin();
    super.loadConfig();
  }

  /**
   * Load all directories in convention
   * @since 1.0.0
   */
  load() {
    // app > plugin > core
    this.loadApplicationExtend();
    this.loadRequestExtend();
    this.loadResponseExtend();
    this.loadContextExtend();
    this.loadHelperExtend();

    // app > plugin
    this.loadCustomApp();
    // app > plugin
    this.loadService();
    // app > plugin > core
    this.loadMiddleware();
    // app
    this.loadController();
    // app
    this.loadRouter(); // Dependent on controllers
  }

}
```

另外，遇到某些问题时的解决流程，首先查阅官方文档，Github的README，还没有找到可适当搜索答案，再没有就去阅读相关源码吧。之前我遇到一个egg-security的一些问题，后面也是阅读相关源码才知道的，基本也知道了这个扩展的一个运行机制，配置如何运行。测试代码写得很齐全，结构规范、清晰，但文档却只表达了一部分，估计作者也是希望别人能来看看源码吧。

关于具体实践，可以直接从仓库拉取，地址是[evanliu2968](https://github.com/EvanLiu2968/evanliu2968)
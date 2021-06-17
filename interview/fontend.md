



# 前端面试参考
> 线上为zoom视频 + [https://code.meideng.net/](https://code.meideng.net/)

### 基础

#### CSS/HTML
- 如何让一个元素水平垂直居中
- CSS盒模型
- CSS 选择符有哪些？哪些属性可以继承？优先级算法如何计算？ CSS3新增伪类有那些？
- 如何创建块级格式化上下文(block formatting context),BFC 有什么用
- 列出display的值，说明他们的作用。position的值， relative和absolute分别是相对于谁进行定位的？
- rem、em和vw/vh、百分比布局、px各有什么优缺点
- flex

#### JS/网络
- web持久化储存有哪些？cookie sessionStorage localStorage的区别（衍生cookie使用）
- HTTP method有哪些？有什么区别？(功能、语义化、body/query)
- HTTP 状态码及其含义
- 网站优化方式有哪些？分减少加载和运行优化(减少页面重绘、重排)，重点：减少体积(打包资源压缩)、减少请求(dns、精灵图)、
- 从浏览器地址栏输入 url 到显示页面的步骤？
- 什么情况web资源应该缓存或不缓存，应该如何做？cache-control Expires etag
- 一个图片等资源的请求和一个get接口的请求有什么区别？
- 跨域问题是怎么产生的？如何解决？
- javascript 有哪几种数据类型？

- 什么闭包？闭包有什么用？
- ES6：箭头函数 解构赋值 let/const 参数处理(默认参数值/剩余参数/展开运算符) 模板字符串 class Objects(create/assign/keys) 新增数据类型
- Promise
- call/apply/bind作用？是否可以改变箭头函数this值？
- JavaScript原型，原型链 ? 有什么特点？

### 进阶
- https和http的区别，有什么用？
- 如何改变url不刷新？
- 防抖和节流有什么作用？
- 如何实现一个滚动加载？
- xss攻击如何防范？（前端：避免不信任跨域交本、插入html转义； 后端：https、限制iframe、接口参数校验、cookie httponly）
- 开发规范如何制定？eslint是否了解？

框架问题
- 如何设计一个dialog组件？前后流程应该是怎样？（重点：应先设计组件API；其他：如何将组件挂载在body下）
- 如何实现form规则校验？派发事件和context(provide/inject)
- 如何实现数据响应式机制？
- react和vue如何触发视图更新？(props/state)
- diff机制？深克隆和浅克隆？
- react/vue高阶组件如何实现？
- 状态管理库的原理是什么？(redux、vuex)
- react和vue各有什么弊端？


node问题
- common.js模块机制 事件模型？event loop？
- 了解过node宏任务、微任务吗？
- koa设计模型？为什么这么设计？
- 如何debug node应用？如何排查node应用的内存泄露？
- 有用过哪些node orm框架？
- 如何发布node应用？child_process、cluster（集群）了解过吗？

发散问题

- 单帐号包含多角色的的管理系统如何实现登录、权限控制？
- 项目重构是为了解决什么问题？接下来如何避免？
- 你遇到过比较难的技术问题是？你是如何解决的？
- 平时如何学习？接下来一段时间内的一个规划是什么？

### 高级
> https://github.com/airuikun/Weekly-FE-Interview/blob/master/summary/questions.md

- 讲解一下HTTPS的工作原理
- 讲解一下https对称加密和非对称加密
- 如何遍历一个dom树
- new操作符都做了什么
- 手写代码，简单实现call
- 手写代码，简单实现apply
- 手写代码，简单实现bind
- 简单实现项目代码按需加载，例如import { Button } from 'antd'，打包的时候只打包button
- 简单手写实现promise
- 如何劫持https的请求，提供思路
- 前端如何进行seo优化
- 前后端分离的项目如何seo
- 简单实现async/await中的async函数
- 1000-div问题(长列表不卡顿)
- （开放题）2万小球问题：在浏览器端，用js存储2万个小球的信息，包含小球的大小，位置，颜色等，如何做到对这2万条小球信息进行最优检索和存储
- （开放题）接上一题如何尽可能流畅的实现这2万小球在浏览器中，以直线运动的动效显示出来
- （开放题）100亿排序问题：内存不足，一次只允许你装载和操作1亿条数据，如何对100亿条数据进行排序
- （开放题）a.b.c.d和a['b']['c']['d']，哪个性能更高
- Git reflog、cherry-pick等

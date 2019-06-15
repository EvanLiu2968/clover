## Golang开发clog：二

造轮子不是为了造轮子，而是更好地去使用轮子。

因为Node的koa够简洁，扩展性好，打算造一个Golang版的koa来作为学习Golang的切入点，全部代码请看[https://github.com/EvanLiu2968/go-koa](https://github.com/EvanLiu2968/go-koa)

### API文档
无论是写一个库还是一个UI组件等，首先要做的是根据需求定义接口，再用代码来实现接口，这样才能避免接口的规范性，哪怕内部实现不优雅，只要接口及其参数稳定，那这个库就是一个稳定的库，内部具体实现可以后续再优化。

现在，虽然我还没有写代码，但可以把使用文档先写出来。

#### Hello Koa
```go
package main

import "github.com/EvanLiu2968/go-koa"

func main() {
  app := koa.New()
  // response
  app.Use(func(ctx koa.Context){
    ctx.SetBody("hello, koa")
  })

  app.Listen(3000)
}
```
#### Context
主要方法都集中在ctx
```go
type Context interface {
  SetBody(body string)
  // 获取响应头
  GetContentType()
  // 设置响应头
  SetContentType(cType string)
  // 获取header
  GetHeader(name string)
  // 设置header
  SetHeader(name string, value string)
  // 获取cookie
  GetCookie(name string)
  // 设置cookie
  SetCookie(name string, value string)
  // ...
}
```

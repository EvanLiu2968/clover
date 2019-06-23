## Golang开发clog：一

### 包依赖管理

例如Node的npm/yarn，Java的maven在包的下载、版本控制、项目级依赖等都有很好的方案，查了下Golang目前主流的方案并不是很好，目前安装的官方推荐的最新稳定版Golang v1.12.5，所以只学习官方推荐的go module作为包管理方式，这个是在v1.11加入的，要到v1.13才会默认开启，因此现在需要手动开启，这方面的相关问题可以参考[https://goproxy.io/](https://goproxy.io/)
```bash
# Enable the go modules feature
export GO111MODULE=on
# Set the GOPROXY environment variable
export GOPROXY=https://goproxy.io
```

#### 包管理的使用

```bash
mkdir go-demo && cd go-demo
go mod init go-demo && ls
```
可以看到多了一个go.mod的文件
```bash
module go-demo

go 1.12
```
如果项目引用了第三方包，在执行`go get`或者`go run``go build`等命令时均会执行写入里面require，有则会下载对应版本号，例如Iris的go.mod：
```bash
module github.com/kataras/iris

require (
	github.com/AndreasBriese/bbloom v0.0.0-20180913140656-343706a395b7 // indirect
	github.com/BurntSushi/toml v0.3.1
  ...
)
```
其中依赖包后面的`indirect`代表是间接引用的，这些依赖包会下载至`$GOPATH/pkg/mod`，这些依赖都会携带版本号和sum值，所有项目也都会共用mod目录的包，间接引用的包也会跟直接引用的包同级

### 文件引用
同一个包里面，不同文件之间，不需要 import，直接用就好。不同包的话，需要引用包，只能使用大写字母开头的方法 ，变量 等等，小写子母开头的只能包内使用。

简单介绍：不同包，先引入包，只能是引用大写开头方法，同包不同文件，可使用全部方法

相比Node，Node的作用域是单文件，而go的作用域是单个包
```go
// main.go
package main

import "console"

func main()  {
    console.Log("hello, evanliu!")
}
```
```go
// console/log.go
package console

import "fmt"

func Log(s string) {
  var res = format(s)
  fmt.Print(s)
}
```
```go
// console/util.go
package console

func format(s string) {
  return s
}
```

注意的是，大部分情况是目录名（文件夹名）即包名，一些IDE会在新建文件时自动定义package为目录名，但这不是必须的，你可以把包名命名为其他的，不过import的还是目录名，即import的是目录路径，使用的是包名

另：Golang引用路径分$GOPATH绝对路径和相对路径，目前主流的是使用绝对路径引入
```go
// import "$GOPATH/src/dir"
import "dir"
import "./dir"
```

### 基本类型
- 整型：int, int8, int16, unit8, unit16, rune, byte等
- 浮点型：float32, float64等
- 布尔型: bool
- 字符串类型: string
- 派生类型:
  - 函数类型 func
  - 数组类型 []
  - 结构化类型 struct
  - 接口类型 interface
  - Map类型 map
  - 指针类型 pointer
  - Channel类型
  - 切片类型 slice


### 语法
1. Go语言的单引号一般用来表示「rune literal」，即——码点字面量(应该是Unicode编码表)。
所以所有的字符串都必须使用双引号，而Node则没有这样的限制

2. Go定义变量使用`var`关键字，缩写为`:=`
```go
var str1 = "hello"
str2 := "evanliu"
```
另，var是块级作用域，相当于js的let，go同样有const可用于定义常量

3. 二元运算符，基本跟js差不多，主要差异在比较运算，js有弱等于`==`和恒等于`===`之分，而go只有等于和不等，不同类型是不等的，所以只有`==`, `!=`

4. 默认包内大写开头的函数包外可用，其他函数在包内无需引用即可

5. 主要内置函数和关键字(if for之类忽略)
make, range, nil, 

6. 函数通常在最后的返回值中返回错误信息，通过判断错误信息是否为nil来判断有没有错误
```go
result, err:= Sqrt(-1)

if err != nil {
   fmt.Println(err)
}
```

7. goroutine，通过go 关键字开启
```go
package main

import (
  "fmt"
  "time"
)

func say(s string) {
  for i := 0; i < 5; i++ {
    time.Sleep(100 * time.Millisecond)
    fmt.Println(s)
  }
}

func main() {
  go say("world")
  say("hello")
}
```
8. 指针
*主要用在指针类型声明和取地址上实际值。 &用于取地址
```go
type demo struct {
    Value string
}
var pt *demo //*用作指针类型声明
pt = &demo{Value: "val"} //&取值地址
d1 := *pt //*用作取地址指向的实际值
```

### 面向对象
面向对象并没有标准的定义，其主要引入了对象（object)、类（class）、继承（inheritance）、子类（subclass）等概念，Java，Javascript都是如此。go并没有这些东西，不过也可以由此实现面向对象的思想。

#### Go的对象-封装
go没有object这个类型，类似特性的是struct，struct是一种包含了命名域和方法的类型
```go
package main

import "fmt"

type Person struct {
  name string
  age int
}
func (p *Person) Name string {
  return p.name
}
func main() {
  var person = Person{name:"evanliu", age: 18}
  fmt.Println(person.Name())
}
```
#### Go的多态-继承
go有意地被设计为没有`extend`之类的继承语法，go通过在struct和interface上使用组合和多态来实现继承关系。
```go
package main

import "fmt"

type Person struct {
  name string
  age int
  Contact Contact
}
type Contact struct {
  phone string
  wechat string
}
func (c *Contact) Wechat string {
  return c.wechat
}
func main() {
  var person = Person{
    name:"evanliu",
    age: 18,
    Contact: Contact{
      phone: "2968"
      wechat: "evanliu"
    }
  }
  fmt.Println(person.Contact.Wechat())
}
```
而两种类型但拥有相同属性时，可以通过`interface`来消除类型的差异
```go
type Human interface {
    Talk()
}

func SpeakTo(h Human) {
    h.Talk()
}

func main() {
    p := Person{Name: "Dave"}
    c := Citizen{Person: Person{Name: "Steve"}, Country: "America"}

    SpeakTo(&p)
    SpeakTo(&c)
}
```

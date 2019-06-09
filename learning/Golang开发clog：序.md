## Golang开发clog：序

刚好近一年未更新文章，准备开始Golang的clog(code log)记录。

### Why Golang?

轻量型web服务的话Node还是首选，作为大前端的基础服务支撑，在后端服务领域也有很好的表现。
目前我会在koa, egg, nest(typescript)中根据应用场景选择一个，但因为生态（人、市场）的不足，接下来打算花点时间拓展下其他语言的实际应用情况。
目前后端服务领域的语言中，同为脚本语言的PHP,Python虽然生态更好，但语言特性还不如Node。
静态语言主要为Java, Golang, C#等，Java人数众多，技术栈(SSH框架)统一
不过还是决定把主要精力放在Node上，而Golang开发同样够快且能解决开发分布式系统和CPU密集计算的短板，天然适合与Node前后端分离的微服务架构，在Node有瓶颈的时候可以用上。

### 参考资料
- [awesome-go](https://github.com/avelino/awesome-go)
- [golang-for-nodejs-developers](https://github.com/miguelmota/golang-for-nodejs-developers)
- [Go Lang 中文网](https://studygolang.com)
- [Go Web Iris 中文网](https://studyiris.com)
- [Go Interview Questions and Answers](https://goquiz.github.io)

### 开发环境安装
windows
直接安装对应安装包, 跟Node一样会自动配置环境变量
然后要在git bash里执行还需要这几步
[stackoverflow.com/Git Shell - go command not found](https://stackoverflow.com/questions/36869660/git-shell-go-command-not-found)
```bash
# You have to put the Go executable in your PATH:
cd ~
vi .bashrc
# Inside .bashrc, enter the following:
PATH=$PATH:/c/Go/bin

# Restart git bash and you should now have the go command
go version
```

Mac/linux
```bash
# 下载二进制包：go1.12.5.linux-amd64.tar.gz。
wget https://dl.google.com/go/go1.12.5.linux-amd64.tar.gz

# 将下载的二进制包解压至 /usr/local目录。
tar -C /usr/local -xzf go1.12.5.linux-amd64.tar.gz

# 将 /usr/local/go/bin 目录添加至PATH环境变量：
vi /etc/profile
export PATH=$PATH:/usr/local/go/bin
source /etc/profile

go version
```

### Hello world
```go
// test.go
package main

import "fmt"

func main() {
	fmt.Print("hello, evanliu!")
}
```
```bash
go run test.go # go build test.go
```

## Shell脚本的基本介绍及应用

Shell是一种命令语言、程序设计语言、应用程序，通常意义上来说，Shell代指`Shell Script`，即Shell脚本。

Shell脚本和正则作为所用通用程序语言的两把尖刀，能快速解决很多问题。

### Shell基本命令

#### 基本使用

变量命名只能英文字母，数字和下划线，首个字符不能是数字，也不要想JS那样用`var`申明
使用变量是加上`$`作为变量前缀
```shell
my_name="evanliu"
echo $my_name # 打印变量
echo "My github name is ${my_name}2968"
unset my_name # 删除变量
```
shell常用计算符有: `+` `-` `*` `/` `%` `=` `==` `!=`

Shell 数组用括号来表示，元素用"空格"符号分割开，语法格式如下：
```shell
choice=(A B "C" D)
printf "%-6s %-6s %-6s %-6s\n" 选择一 选择二 选择三 选择四
printf "%-6s %-6s %-6s %-6s\n" ${choice[0]} ${choice[1]} ${choice[2]} ${choice[3]}
echo '正确答案是：'
echo choice[2] # 输出 C
```

#### 基本语句

if 语句
```shell
a=10
b=20
if [ $a == $b ]
then
   echo "a 等于 b"
elif [ $a -gt $b ]
then
   echo "a 大于 b"
elif [ $a -lt $b ]
then
   echo "a 小于 b"
else
   echo "没有符合的条件"
fi
```

for 语句
```shell
for loop in 1 2 3 4 5
do
  echo "The value is: $loop"
done
```

while 语句
```shell
int=1
while(( $int<=5 ))
do
  echo $int
  let "int++"
done
```
case 语句
```shell
echo '请选择药丸，选择输入 blue 或 red'
echo '请输入:'
read pill
case $pill in
  blue)  echo '你选择了 蓝色药丸'
  ;;
  red)  echo '你选择了 红色药丸'
  ;;
  *)  echo '你没有选择药丸，你完蛋了！'
  ;;
esac
```

### Shell基本应用

通常将Shell代码存为`*.sh`的脚本文件，直接在命令终端执行脚本文件。
在node实际应用中，可以通过`npm scripts` 或`child_process.spawn()`建立一个执行shell的子进程
文件头部需要注明`#!/bin/bash`，`#!` 是一个约定的标记，它告诉系统这个脚本需要什么解释器来执行，即使用哪一种 Shell。
```shell
#!/bin/bash
echo "Hello World !"
```

#### 变量传递
执行`*.sh`的脚本文件时需要获取执行时传入的参数方便应对不同处理，而不用分成多个脚本文件，这是需要用到变量传递

| Params |  Description  |
|--------|---------------|
| `$#`   | 传递到脚本的参数个数 |
| `$*`   | 以一个单字符串显示所有向脚本传递的参数。如"$*"用「"」括起来的情况、以"$1 $2 … $n"的形式输出所有参数。|
| `$$`   | 脚本运行的当前进程ID号 |
| `$!`   | 后台运行的最后一个进程的ID号 |
| `$@`   |与`$*`相同引用，不同的是`$*`表示一个参数(多个参数拼成)，`$@`表示多个参数。|
| `$-`   | 显示Shell使用的当前选项，与set命令功能相同。|
| `$?`   | 显示最后命令的退出状态。0表示没有错误，其他任何值表明有错误。|
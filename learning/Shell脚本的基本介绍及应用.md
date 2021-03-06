## Shell脚本的基本介绍及应用

Shell是一种命令语言、程序设计语言、应用程序，通常意义上来说，Shell代指`Shell Script`，即Shell脚本。

Shell脚本和正则作为所用通用程序语言的两把尖刀，能快速解决很多问题。

### Shell基本命令

#### 基本使用

变量命名只能英文字母，数字和下划线，首个字符不能是数字，也不需要像JS那样用`var`申明，注意等号左右不能有空格
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

#### 其他问题
Mac下`*.sh`文件默认没有执行权限的，运行.sh文件出现 Permission denied错误

需要通过修改文件权限解决：
```shell
chmod 777 xx.sh
```

文件权限管理的三种基本权限
| Params |  Description  |  数值表示  |
|------- |---------------|-----------|
| `R`    | 读            |  4        |
| `W`    | 写            |  2        |
| `X`    | 可执行         |  1        |

例如：
```bash
sudo chmod 765 filename
# 或者
sudo chmod -rwx-rw-rx filename
```
第一个数值表示当前所属用户的权限
第二个数值表示当前所属组的权限
第三个数值表示其他用户权限

文件条件判断
```bash
-e filename  如果 filename存在，则为真  [ -e /var/log/syslog ]
-d filename  如果 filename为目录，则为真  [ -d /tmp/mydir ]
-f filename  如果 filename为常规文件，则为真  [ -f /usr/bin/grep ]
-L filename  如果 filename为符号链接，则为真  [ -L /usr/bin/grep ]
-r filename  如果 filename可读，则为真  [ -r /var/log/syslog ]
-w filename  如果 filename可写，则为真  [ -w /var/mytmp.txt ]
-x filename  如果 filename可执行，则为真  [ -L /usr/bin/grep ]
filename1 -nt filename2  如果 filename1比 filename2新，则为真  [ /tmp/install/etc/services -nt /etc/services ]
filename1 -ot filename2  如果 filename1比 filename2旧，则为真  [ /boot/bzImage -ot arch/i386/boot/bzImage ]
```
例如：
```bash
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
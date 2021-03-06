## 基于Linux的Node服务器搭建

> 网站地址 [www.evanliu2968.com.cn](https:///www.evanliu2968.com.cn)
> Github仓库 [https://github.com/EvanLiu2968/evanliu2968](https://github.com/EvanLiu2968/evanliu2968)

简单介绍下网站构建，以Node作为服务器，`koa2` + `react server side render`，选择的是腾讯云服务器`CentOS 7`，搭建过程中主要用到了`node`, `pm2`, `nginx`, `git`, 后续加上`redis`, `mongodb`, `docker`.

### Run it at cloud server

> The following steps can be success with Tecent cloud server.

#### Update npm node & pm2

The cloud server should be in a node enviroment, and then login the command terminal.
check the version of `node/npm/nginx`. as expected, they need to update.
now, let's start it.

```bash
npm i n -g
n latest
# install global npm pm2
npm i npm pm2 -g
# install yarn
sudo wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo

sudo yum install yarn

yarn config set registry https://registry.npm.taobao.org -g

yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
```
#### Install Git & Node
```sh
yum install git
# install node
curl -sL https://rpm.nodesource.com/setup_10.x | bash -

yum install -y nodejs
```

#### Git pull remote resposity

```bash
mkdir evanliu2968
cd evanliu2968
git init
git remote add evanliu2968 https://github.com/EvanLiu2968/evanliu2968.git
git fetch evanliu2968
git checkout master
git pull
```

#### Install Nginx

Mac: 
```bash
# https://brew.sh/index_zh-cn.html
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

# brew install nginx
sudo brew install nginx
```

CentOS:
```bash
# download nginx package corresponding to the current system version

wget  http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm

# create nginx's yum resposity

rpm -ivh nginx-release-centos-7-0.el7.ngx.noarch.rpm

# download and install nginx

yum install nginx
```


*linux nginx server command*

- start nginx `systemctl start nginx`
- 设置开机自启动 `systemctl enable nginx.service`
- 停止开机自启动 `systemctl disable nginx.service`
- 查看服务当前状态 `systemctl status nginx.service`
- 重新启动服务 `systemctl restart nginx.service`
- 查看所有已启动的服务 `systemctl list-units --type=service`

*Mac nginx server command*

start nginx (when the port less than `1024`, it must be runned as sudo, otherwise throw `permission denied`)
```bash
sudo nginx   # 启动
sudo nginx -s quit  # 退出
sudo nginx -s reload  # 重启
sudo nginx -t  # 检查Nginx配置是否正确
```

#### Nginx conf setting

for Mac config:
```bash
cd /usr/local/etc/nginx
vi nginx.conf
```

for CentOS config:
```
cd /etc/nginx/conf.d
sudo vi default.conf
```

when the protocol is `http`, you should proxy you APP to port `80`,
and when the protocol is `https`, you should proxy you APP to port `443`.

http.conf:
```conf
# /etc/nginx/conf.d/http.conf

server {
  listen 80;
  server_name www.evanliu2968.com.cn;
  return 301 https://$server_name$request_uri; # 重定向https，如果开启https的话，不开启注释掉
  location / {
    proxy_set_header	Host		$http_host;
    proxy_set_header	X-Real-IP	$remote_addr;
    proxy_pass	http://127.0.0.1:7001;
    proxy_redirect		off;
  }
}
```

开启https下面单独说明。

#### Nginx SSL证书部署

- [腾讯云证书安装指引](https://cloud.tencent.com/document/product/400/4143)
- [云服务器上传下载文件方法](http://bbs.qcloud.com/thread-24970-1-1.html)

从腾讯云开通SSL证书后下载至本地，解压取nginx里的两个文件，分别是证书和密钥，上传至服务器跟`nginx.conf`(nginx配置执入口)同级目录

然后配置`conf.d/https.conf`，并在`nginx.conf`里启用

https.conf (以我的网站为例)
```conf
# /etc/nginx/conf.d/https.conf

server {
  listen 443;
  server_name www.evanliu2968.com.cn; # 绑定证书的域名
  ssl on; # 启用SSL功能
  ssl_certificate 1_www.evanliu2968.com.cn_bundle.crt; # 证书文件
  ssl_certificate_key 2_www.evanliu2968.com.cn.key; # 私钥文件
  ssl_session_timeout 5m;
  ssl_protocols TLSv1 TLSv1.1 TLSv1.2; # 使用的协议
  ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:HIGH:!aNULL:!MD5:!RC4:!DHE; # 配置加密套件
  ssl_prefer_server_ciphers on;
  location / {
    proxy_set_header	Host		$http_host;
    proxy_set_header	X-Real-IP	$remote_addr;
    proxy_pass	http://127.0.0.1:7001;
    proxy_redirect		off;
  }
}
```

开启后可以成功的看到[https://www.evanliu2968.com.cn](https://www.evanliu2968.com.cn)的小绿锁了。

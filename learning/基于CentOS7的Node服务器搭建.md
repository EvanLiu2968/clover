## 基于Linux的Node服务器搭建

> 个人网站[www.wvanliu2968.com.cn](http://www.wvanliu2968.com.cn) 本来还想多花点时间做个管理系统，时间很紧，所以直接从Github获取我的markdown文档仓库。<br/>
另外，吐槽下备案进度，一个月简直了。

简单介绍下网站构建，以Node作为服务器，`koa2` + `react server side render`，从腾讯云买的服务器(1年)及域名(4年)，总计￥120，我是选择的镜像系统是centOS 7，搭建过程中主要用到了node、pm2、nginx、git

## Run it at cloud server

> The following steps can be success with Tecent cloud server.

1. The cloud server should be in a node enviroment, and then login the command terminal.
check the version of `node/npm/nginx`. as expected, they need to update.
now, let's start it.
`npm i n -g`
`n latest`
`npm i npm pm2 -g`

2. git pull remote resposity.
`mkdir evanliu2968 && cd evanliu2968` <br/>
`git init` <br/>
`git remote add evanliu2968 https://github.com/EvanLiu2968/evanliu2968.git` <br/>
`git fetch evanliu2968` <br/>
`git checkout master` <br/>
`git pull` <br/>

3. install node_modules and run `npm run build`,
then, add pm2 item for monitor your project. <br/>
`pm2 start index.js --name evanliu2968` <br/>
`pm2 list` <br/>
`pm2 log evanliu2968` <br/>

4. nginx

Mac: 
`sudo brew install nginx`

cebtOS: 
1. download nginx package corresponding to the current system version

`wget  http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm`

2. create nginx's yum resposity

`rpm -ivh nginx-release-centos-7-0.el7.ngx.noarch.rpm`

3. download and install nginx

`yum install nginx`

4. nginx server command

start nginx
`systemctl start nginx`

设置开机自启动
`systemctl enable nginx.service`

停止开机自启动
`systemctl disable nginx.service`

查看服务当前状态
`systemctl status nginx.service`

重新启动服务
`systemctl restart nginx.service`

查看所有已启动的服务
`systemctl list-units --type=service`

for Mac config:
`cd /usr/local/etc/nginx`
`vi nginx.conf`

for centOS config:
`cd /etc/nginx/conf.d`
`sudo vi default.conf`

conf http
```conf
# /usr/local/etc/nginx/servers/default.conf

map $http_upgrade $connection_upgrade {
  default upgrade;
  '' close;
}

upstream evanliu2968{
  server 127.0.0.1:7001;    # 端口号需对应业务需求
  keepalive 64;
}

server {
    listen 80;
    server_name www.evanliu2968.com.cn;
    location / {
      proxy_set_header	Host		$http_host;
      proxy_set_header	X-Real-IP	$remote_addr;
      proxy_pass	http://evanliu2968;
      proxy_redirect		off;
    }
}
```

for Mac

start nginx (when the port less than 1024, it must be runned as sudo, otherwise throw `permission denied`)
`sudo nginx`
stop nginx
`sudo nginx -s quit` or `sudo nginx -s stop` for force stop

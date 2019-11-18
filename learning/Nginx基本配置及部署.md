## Nginx基本配置及部署

[Nginx中文文档](http://www.nginx.cn/doc/)

### Gzip开启
```conf
http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    # tcp_nopush     on;

    keepalive_timeout  65;

    # gzip start
    gzip on;
    gzip_min_length 1k;
    gzip_buffers 4 16k;
    # gzip_http_version 1.0;
    gzip_comp_level 2;
    gzip_types text/plain application/x-javascript text/css application/xml text/javascript image/jpeg image/gif image/png;
    gzip_vary off;
    gzip_disable "MSIE [1-6]\.";
    # gzip end

    include /etc/nginx/conf.d/*.conf;
}
```

### Nginx静态文件服务部署
```conf
server {
  listen       80;
    server_name  www.evanliu2968.com.cn;
    charset      utf-8;
    root         /repo/evanliu2968/dist/;
    location / {
      index   /pages/index.html;
    }
    location /system/ {
      index   /pages/system.html;
    }
    # api proxy
    location /api/ {
      proxy_pass   http://127.0.0.1:7001;
      set $token $cookie_token;
      if ( $http_accessToken != '' ) {
        set $token $http_accessToken;
      }
      proxy_set_header   accessToken      $token;
      proxy_set_header   Host             $host;
      proxy_set_header   X-Real-IP        $remote_addr;
      proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
    }
}
```

### Nginx单域名多服务部署
```conf
server {
  listen       80;
    server_name  www.evanliu2968.com.cn;
    location / {
      proxy_pass   http://127.0.0.1:7001/;
    }
    location /system/ {
      proxy_pass   http://127.0.0.1:8001/;
    }
}
```

### Nginx多域名单服务部署
多域名即开启多个server
```conf
server {
  listen       80;
    server_name  www.evanliu2968.com.cn;
    location / {
      proxy_pass   http://127.0.0.1:7001/;
    }
}
server {
  listen       80;
    server_name  system.evanliu2968.com.cn;
    location / {
      proxy_pass   http://127.0.0.1:7001/system/;
    }
}
```

### Nginx多域名多服务部署
```conf
server {
  listen       80;
    server_name  www.evanliu2968.com.cn;
    location / {
      proxy_pass   http://127.0.0.1:7001/;
    }
}
server {
  listen       80;
    server_name  system.evanliu2968.com.cn;
    location / {
      proxy_pass   http://127.0.0.1:8001/;
    }
}
```

### Nginx负载均衡配置
主要是HTTP Upstream 模块
- 轮询，默认方式，每个请求按时间顺序逐一分配到不同的后端服务器，可使用`weight`指定轮询几率，weight和访问比率成正比，用于后端服务器性能不均的情况，session的问题可在应用服务中配置redis。
- `ip_hash`, 每个请求按访问ip的hash结果分配，要求nginx一定是最前端的服务器，否则nginx得不到正确ip
- 其他第三方实现方式，比如`fair`, `url_hash`
```conf
upstream  www.evanliu2968.com.cn
{
  ip_hash;
  server   127.0.0.1:7001;
  server   127.0.0.1:7002;
}
upstream  system.evanliu2968.com.cn
{
  server   127.0.0.1:8001 weight=5;
  server   127.0.0.1:8002;
}
 
server
{
  listen  80;
  server_name  www.evanliu2968.com.cn;

  location / {
    proxy_pass        http://www.evanliu2968.com.cn;
    proxy_set_header   Host             $host;
    proxy_set_header   X-Real-IP        $remote_addr;
    proxy_set_header   X-Forwarded-For  $proxy_add_x_forwarded_for;
  }
}
```

### SSL开启
https.conf (仅做示例)
```conf
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

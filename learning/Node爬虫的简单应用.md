## Node爬虫的简单应用

爬虫，算是爬取资源工具的另一个称呼，今天简单介绍下如何用Node做一个爬虫脚本。

以爬取图片为例，[evanliu2968.com.cn](http://evanliu2968.com.cn)我放了一些我以前拍的一些照片，现在我们来用脚本把它们自动下载下来。

### cheerio

首先介绍下`cheerio`这个Node模块，能将html字符串以jQuery的语法解析，通常用作爬虫，其实也可以通过它对html做一些处理。
示例：
```javascript
var cheerio = require('cheerio')
var html = `
<div class="wrap">
  <img class="pic" src="test.jpg" />
</div>
`
var $ = cheerio.load(html,{decodeEntities: false})
var src=$('.pic').attr('src')
console.log(src) // 输出为：test.jpg
```

下面以真实例子来爬取一张图片。

首先要获取页面的html字符串，这里我用了`axios`来作为请求库，这个看自己喜好。
```javascript
var axios = require('axios')
var fs = require('fs')
var cheerio = require('cheerio')

function fetchImages(){
  let href = 'https:///www.evanliu2968.com.cn/'
  axios.get(href).then(res=>{
    return new Promise(function(resolve,reject){
      if(res.status == 200){
        var $ = cheerio.load(res.data); //采用cheerio模块解析html
        var imgList = []
        $('img').each(function(i,el){
          let src = $(this).attr('src')
          if(/^http/.test(src)){
            imgList.push(src)
          }else{
            imgList.push(href+src.replace(/^\//,''))
          }
        })
        resolve(imgList)
      }else{
        reject('404')
      }
    })
  }).then(list=>{
    saveImages(list)
  })
}
async function saveImages(list){
  for(let i =0; i<list.length; i++){
    let imgUrl = list[i]
    console.log(`开始下载第${i+1}张`)
    console.log(`...`)
    try{
      let res = await axios.get(imgUrl,{responseType: 'stream'})
      // 这里注意，可以用fs判断有无images这个文件夹，没有则创建，不然保存时会出错，这里我省略了，直接mkdir iamges
      res.data.pipe(fs.createWriteStream(`./images/${i}.jpg`))
      console.log(`第${i+1}张下载完毕`)
      console.log(`...`)
    }catch(e){
      // console.log(e)
      console.log(`第${i+1}张下载失败`)
    }
  }
}
```
不出意外的话，`images`多了我首页的那张图片了。

需要注意的是要控制并发的数量，抛开爬取网站IP限制的缘故，本身并发请求数量也是有限制的，我这里用了`async await`，直接一张张的同步下载

### puppeteer

下面来学习下爬取[evanliu2968.com.cn/photo](http://evanliu2968.com.cn/photo)里的照片。

这里是有两个难关的，一个是API token验证，egg自带了`egg-security`插件，而且我用的是react-ssr，甚至接口是什么都无从获取。
第二个则是图片懒加载，只有到了视口才会加载真正的图片，否则就只能爬取到一张张loading.gif。

我需要用的是另一个模块`puppeteer`，意思是木偶，chrome官方维护，是一个无状态(headless)Chrome，可以用来做测试、爬虫、甚至封装一个专属浏览器。

直接以代码示例来说明
```javascript
const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  await page.goto('http://evanliu2968.com.cn/photo');
  await page.waitFor(2*1000);
  let html = await page.content()
  console.log(html) //得到该html就可以用cheerio来解析了
  await page.screenshot({path: 'screenshots/photo.png'});
  browser.close();
}
```

图片懒加载的问题，可以借助puppeteer的其他API来解决这个问题，方法可能不止一种(比如从我关联信息里提取，埋个彩蛋)。
例如通过控制方向键来自动滚动加载图片
```javascript
let Keyboard = page.keyboard
keyboard.press('ArrowUp',{delay:1000}) //按住上箭头键一秒，模拟滚动页面😢
```

使用puppeteer是可以解决很多难题的，比如cookie/token限制，登录限制等，都可以通过puppeteer来解决，这里只算是一个引子。

#### 问题难点
- 人机验证
  - ip识别(利用代理ip，构建ip池)
  - 机器码/浏览器识别码识别(可构建伪造的浏览器信息池，定时更换)
  - 用户行为识别(点击、滚动、鼠标轨迹)
  - 滑块验证(固定滑块、缺口补全滑块、刮刮卡滑块)
  - 验证码验证(包括验证码、图片识别点击、问题回答)
- 单页型应用(puppeteer无头浏览器解决,会执行js渲染页面)
- 需要账号的需要批量注册/登录/接收验证码(手机或邮箱)
- 分布式爬取
  - 已有数据去重
  - 多线程url去重

#### puppeteer安装
直接npm安装可能会遭遇失败，实测Mac比较容易成功，以windows为例，可以直接使用本地的chrome
1. 在nodejs安装目录(..\nodejs\node_modules\npm\)的npmrc文件加入
```
puppeteer_skip_chromium_download = 1
```
2. 然后
```
npm i -S puppeteer
```
即可安装成功
3. 代码调用初始化时需要声明chrome安装位置
```js
const puppeteer = require('puppeteer');
const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
});
```

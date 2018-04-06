## Node爬虫的简单应用

爬虫，算是爬取资源工具的另一个称呼，今天简单介绍下如何用Node做一个爬虫脚本。

以爬取图片为例，[evanliu2968.com.cn](http://evanliu2968.com.cn)我放了不少我以前拍的一些照片，现在我们来用脚本把它们自动下载下来。

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
  let href = 'http://www.evanliu2968.com.cn/'
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
第二个则是图片懒加载，只有到了视口才会加载整正的图片，否则就只能爬取到一张张loading.gif。

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

关于puppeteer的API可以去看看[puppeteer API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md),了解下能做到哪些好玩的事

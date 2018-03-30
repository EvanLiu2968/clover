## Node爬虫的简单应用

> 占坑。。。

```javascript
var axios = require('axios')
var fs = require('fs')
var cheerio = require('cheerio')
const puppeteer = require('puppeteer');

function fetchImages(){
  var url = 'http://originoo.com/ws/p.index.php?baidu#jzl_kwd=70456283200&jzl_ctv=18405388247&jzl_mtt=2&jzl_adt=cl1'
  axios.get(url).then(res=>{
    return new Promise(function(resolve,reject){
      if(res.status == 200){
        var $ = cheerio.load(res.data); //采用cheerio模块解析html
        var imgList = []
        $('img').each(function(i,el){
          imgList.push($(this).attr('src'))
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
      res.data.pipe(fs.createWriteStream(`./images/${i}.jpg`))
      console.log(`第${i+1}张下载完毕`)
      console.log(`...`)
    }catch(e){
      // console.log(e)
      console.log(`第${i+1}张下载失败`)
    }
  }
}

function fetchMedias(){
  const downloadFiles='./static/piano/';
  const baseUrl='https://virtualpiano.net/wp-content/themes/twentyfourteen-child/notes/';
  const urlList = [baseUrl+'a48.mp3'];
  for(let i=49;i<=90;i++){
    urlList.push(baseUrl+'a'+i+'.mp3')
    urlList.push(baseUrl+'b'+i+'.mp3')
  }
}


async function saveMedias(list){
  for(let i =0; i<list.length; i++){
    let imgUrl = list[i]
    console.log(`开始下载第${i+1}张`)
    console.log(`...`)
    try{
      let res = await axios.get(imgUrl,{responseType: 'stream'})
      res.data.pipe(fs.createWriteStream(`./media/${i}.mp3`))
      console.log(`第${i+1}张下载完毕`)
      console.log(`...`)
    }catch(e){
      // console.log(e)
      console.log(`第${i+1}张下载失败`)
    }
  }
}

function test(){
  var html = `
  <div class="wrap">
    <img class="pic" src="test.jpg" />
  </div>
  `
  var $ = cheerio.load(html,{decodeEntities: false})
  var src=$('.pic').attr('src')
  console.log(src)
}



async function run() {
  // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  await page.goto('http://123.207.9.149/photo');
  page.on('load',async ()=>{
    console.log('页面加载完毕')
    // await page.click('a')
  })
  
  await page.waitFor(2*1000);
  let html = await page.content()
  console.log(html)
  let Keyboard = page.keyboard
  keyboard.press('ArrowUp',{delay:1000}) //按住上箭头键一秒，模拟滚动页面😢
  await page.screenshot({path: 'screenshots/photo.png'});
  await page.waitFor(1000*1000);
  browser.close();
}

function pupTest(){
  //
}

run();
// test()
// fetchImages()
// saveMedias(urlList)

```

var gulp = require('gulp'); //本地安装gulp所用到的地方
var less = require('gulp-less'); //less编译
var webserver = require('gulp-webserver'); //静态服务(其他选择gulp-connect或livereload)
var concat = require('gulp-concat');  //文件合并
var rename = require('gulp-rename'); //文件重命名

var autoprefixer = require('gulp-autoprefixer');//自动处理css浏览器前缀

var uglify = require('gulp-uglify'); //js压缩
var minifyCss = require("gulp-minify-css"); //css压缩
var minifyHtml = require("gulp-minify-html"); //html压缩

var spritesmith = require('gulp.spritesmith'); //精灵图合成

//var basedir='html5Editor-master/';
var basedir='';
//gulp.src(): 来源
//gulp.dest(): 目标
//gulp.run():运行
//gulp.pipe(): 管道流
//gulp.watch(): 监视文件系统，文件改动时自动处理
//gulp.task(): 任务

//步骤一：
//npm install -g gulp  全局安装gulp
//步骤二：
//cd project.path cmd把目录切换到项目文件夹
//步骤三：
//npm init   根目录生成package.json，并设置属性。如果有package.json，直接npm install会安装所有package moduel
//步骤四：
//npm install gulp --save-dev 安装项目依赖并写进package.json文件。

//国内建议选装淘宝cnpm：这是一个完整的npmjs.org镜像，同步频率目前为10分钟，命令：npm install cnpm -g --registry=https://registry.npm.taobao.org
//注意：安装完后最好查看其版本号cnpm -v或关闭命令提示符重新打开，安装完直接使用有可能会出现错误；

//定义默认任务
gulp.task('default',['server','watch','less'],function(){
    console.info("gulp 已经运行！");
});
//web服务
gulp.task('server',function(){
    gulp.src(basedir).pipe(webserver({
        port:3000,
        path:'',
        livereload: true,         //自动刷新
        directoryListing: false,  //目录列表显示
        open: true,               //打开浏览器
        fallback: 'index.html'    //默认打开文件
        // middleware: function(req, res, next) {
        //     if (req.url === '/middleware') {
        //         res.end('middleware');
        //     } else {
        //         next();
        //     }
        // }
    }));
});
// 自动任务
gulp.task('watch', function() {
    gulp.watch(basedir + 'src/less/cyztc/*.less',['less','rycx_download']);
    gulp.watch(basedir + 'src/WEB-INF/html/cyztc/*.html');
    gulp.watch(basedir + 'src/css/cyztc/cyztc_px.css',['pxToRem']);
    gulp.watch(basedir + 'src/css/cyztc/rycx_download.css',['pxToRem1']);
    gulp.watch(basedir + 'src/js/cyztc/*.js');
});
//编译Less
gulp.task('less', function () {
    gulp.src(basedir+'src/less/cyztc/cyztc.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(rename('cyztc_px.css')) //该任务调用的模块
        .pipe(gulp.dest(basedir+'src/css/cyztc/')); //将会在src/css下生成index.css
});

//编译Less
gulp.task('rycx_download', function () {
    gulp.src(basedir+'src/less/cyztc/rycx_download.less') //该任务针对的文件
        .pipe(less()) //该任务调用的模块
        .pipe(gulp.dest(basedir+'src/css/cyztc/')); //将会在src/css下生成index.css
});

//当图片名以-hover结尾时，自动生成:hover伪类样式
function hoverClass(name){
    return /-hover$/.test(name)?name.replace(/-hover$/,':hover'):name;
}
gulp.task('sprite', function () {
    var spriteData = gulp.src(basedir+'src/images/ticket/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',//保存合并后图片的地址
        cssName: 'sprite.css',//保存合并后对于css样式的地址，可输出SASS,Stylus,LESS,JSON等格式
        padding:5,//合并时两个图片的间距
        algorithm: 'binary-tree',//排列规则有：top-down、left-right、diagonal、alt-diagonal、binary-tree
        //cssTemplate:'sprite-temp.css'//精灵图样式模版地址，内置默认模版如下：
        // {{#sprites}}
        //     .icon-{{name}}{
        //         background-image: url("{{escaped_image}}");
        //         background-position: {{px.offset_x}} {{px.offset_y}};
        //         width: {{px.width}};
        //         height: {{px.height}};
        //     }
        // {{/sprites}}
        // 函数定义模版
        cssTemplate: function (data) {
            var arr=[];
            data.sprites.forEach(function (sprite) {
                arr.push('.icon-'+hoverClass(sprite.name)+
                    '{\n' +
                    'background-image: url("'+sprite.escaped_image+'");\n'+
                    'background-position: '+sprite.px.offset_x+' '+sprite.px.offset_y+';\n'+
                    'width:'+sprite.px.width+';\n'+
                    'height:'+sprite.px.height+';\n'+
                    '}\n');
            });
            return arr.join('');
        }
    }));
    spriteData.img.pipe(gulp.dest(basedir+'src/images/ticket/'));
    spriteData.css.pipe(gulp.dest(basedir+'src/images/ticket/'));
});


var postcss = require('gulp-postcss');
var pxtorem = require('postcss-pxtorem');
//https://github.com/cuth/postcss-pxtorem#options
gulp.task('pxToRem', function() {
    var processors = [pxtorem({
        rootValue: 75, //根font-size 大小
        unitPrecision: 6,
        propWhiteList: [], //
        selectorBlackList: [],
        replace: true,
        mediaQuery: false,
        minPixelValue: 3
    })];
    gulp.src(basedir+'src/css/cyztc/cyztc_px.css')
        .pipe(postcss(processors))
        .pipe(rename('cyztc_rem.css'))
        .pipe(gulp.dest(basedir+'src/css/cyztc/'));
});
gulp.task('pxToRem1', function() {
    var processors = [pxtorem({
        rootValue: 75, //根font-size 大小
        unitPrecision: 6,
        propWhiteList: [], //
        selectorBlackList: [],
        replace: true,
        mediaQuery: false,
        minPixelValue: 3
    })];
    gulp.src(basedir+'src/css/cyztc/rycx_download.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest(basedir+'src/css/cyztc/'));
});
//autoFx任务：自动处理css浏览器前缀
// gulp-autoprefixer的browsers参数详解 :https://github.com/ai/browserslist#queries
// last 2 versions: 主流浏览器的最新两个版本
// last 1 Chrome versions: 谷歌浏览器的最新版本
// last 2 Explorer versions: IE的最新两个版本
// last 3 Safari versions: 苹果浏览器最新三个版本
// Firefox >= 20: 火狐浏览器的版本大于或等于20
// iOS 7: IOS7版本
// Firefox ESR: 最新ESR版本的火狐
// > 5%: 全球统计有超过5%的使用率
gulp.task('autoFx', function () {
    gulp.src(basedir+'src/css/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, //是否美化属性值 默认：true 像这样：
            //-webkit-transform: rotate(45deg);
            //        transform: rotate(45deg);
            remove:true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(gulp.dest(basedir+'src/css'))
});


//以下为选用任务：[minify,fonts,images,timestamp,sprites,statics,views,webpack]

//minify任务：js代码检测、压缩js/css/html
// var jshint = require('gulp-jshint'); //js检测
// gulp.task('js-hint', function() {
//     gulp.src(basedir+'src/js/*.js')
//         .pipe(jshint())
//         .pipe(jshint.reporter('default'));
// });
gulp.task('minify-js', function() {
    gulp.src(basedir+'src/js/*.js')
        //.pipe(concat('all.js'))
        .pipe(gulp.dest(basedir+'dist/js'))
        //.pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(basedir+'dist/js'));
});
gulp.task('minify-css', function () {
    gulp.src(basedir+'src/css/cyztc/cyztc_rem.css') // 要压缩的css文件
        .pipe(minifyCss()) //压缩css
        .pipe(gulp.dest(basedir+'src/css/cyztc'));
});
gulp.task('minify-html', function () {
    gulp.src(basedir+'src/html/*.html') // 要压缩的html文件
        .pipe(minifyHtml()) //压缩
        .pipe(gulp.dest(basedir+'dist/html'));
});
gulp.task('build',['minify-js','minify-css'],function(){
    console.log('*.js,*.css,*.html已全部压缩完毕！');
});


//images任务：压缩图片（包括PNG、JPEG、GIF和SVG图片），移动图片。https://github.com/sindresorhus/gulp-imagemin#user-content-options
// var imagemin = require('gulp-imagemin');

// gulp.task('image-min', function () {
//     gulp.src(basedir+'src/img/*.{png,jpg,gif,ico}')
//         .pipe(imagemin({
//             optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
//             progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
//             interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
//             multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
//         }))
//         .pipe(gulp.dest(basedir+'dist/img'));
// });


//rev任务：生成时间戳信息，解决浏览器JS/CSS/图片的缓存问题。
// <!doctype html>
// <html>
//   <head>
//     <link rel="stylesheet" href="css/style.css?rev=@@hash">
//     <script src="js/js-one.js?rev=@@hash"></script>
//     <script src="js/js-two.js"></script>
//   </head>
//   <body>
//     <div>hello, world!</div>
//     <img src="img/test.jpg?rev=@@hash" alt="" />
//     <script src="js/js-three.js?rev=@@hash"></script>
//   </body>
// </html>
// var rev = require('gulp-rev-append');

// gulp.task('testRev', function () {
//     gulp.src(basedir+'src/html/*.html')
//         .pipe(rev())
//         .pipe(gulp.dest(basedir+'dist/html'));
// });
//fonts任务：处理iconfonts文件
//statics任务：处理常规的静态文件，比如404.html、500.html等。
//views任务：压缩/预处理/条件编译HTML、移动HTML。
//webpack任务：整合webpack到gulp构建系统，用来管理JS/CSS。

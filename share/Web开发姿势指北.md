## Web开发姿势指北

> 工欲善其事，必先利其器。

### Chrome扩展
- `谷歌访问助手` 可自由访问某些404网站，安装扩展的前置技能，代价是需要设置固定的主页
- `React Developer Tools` 调试、标识React应用，代表应用：知乎、严选、腾讯云等
- `Vue.js devtools` 调试、标识Vue应用，代表应用：哔哩哔哩、简书、掘金等
- `WEB前端助手(FeHelper)` 常用小工具集合
- `ColorZilla` 取色器
- `Window Resizer`
- `Page Ruler` 页面尺
- `CSSViewer`
- `JSONView` JSON格式化
- `Sourcegraph` Github专用，源码查看神器
- `Octotree` 增加Github树，项目文件快捷入口
- `Enhanced Github`
- `Adblocker`
- `Axure RP Extension for Chrome`
- `TransTt` 划词翻译工具
- `Chrono` 强大的下载管理器

其他：
- `Tampermonkey` 油猴，脚本有需要可自行搜索，例如qq、163等付费音乐免费下载、百度云网盘下载、各视频站点VIP破解等
- `Proxy SwitchyOmega` 代理设置、切换
- `Postman` 请求测试
- `Lighthouse` Google官方网页应用检测工具
- `Inject JS` JS脚本注入，个人专用，https://github.com/EvanLiu2968/InjectJS


### VSCode扩展

目前核心插件：
- `Auto Close Tag` Html Tag 自动镜像填充
- `Auto Rename Tag` Html Tag 自动镜像修改
- `Bracket Pair Colorizer` 代码块自动线框高亮，便于深层嵌套代码查看
- `Chinese (Simplified) Language Package` VSCode简体中文语言包
- `Code Runner` 主要语言的右键运行
- `Document This` 快捷生成注释
- `Eslint` Javascript书写规范化，可以自动格式化代码
- `GitLens` 让你知道每一行代码（Bug）的Git提交日期、作者、提交信息等
- `Markdown Preview Enhanced` Markdown预览增强
- `npm Intellisense` 引入npm模块智能提示、填充
- `Path Intellisense` 引入文件模块智能提示、填充
- `stylelint` CSS/SCSS/Less语法检测
- `Vetur` Vue 语法高亮

其他可选插件：
- `IntelliJ IDEA Keybindings` 按键导入，按照主要习惯选择其他App的设置
- `Setting Sync` VSCode所有配置(设置、扩展等)同步
- `Go` Go语法高亮
- `Python` Python语法高亮

User Setting
```json
{
    "editor.renderWhitespace": "all",
    "editor.tabSize": 2,
    "files.associations": {
        "*.vue": "vue"
    },
    "eslint.autoFixOnSave": true,
    "eslint.options": {
        "extensions": [
            ".js",
            ".jsx",
            ".vue"
        ]
    },
  "eslint.validate": [
      "javascript",{
          "language": "vue",
          "autoFix": true
      },
      "html",
      "vue"
  ],
    "search.exclude": {
        "**/node_modules": true,
        "**/bower_components": true,
        "**/dist": true
    },
    "emmet.syntaxProfiles": {
        "javascript": "jsx",
        "vue": "html",
        "vue-html": "html"
    },
    "git.confirmSync": false,
    "window.zoomLevel": 0,
    "editor.cursorBlinking": "smooth",
    "editor.minimap.enabled": true,
    "editor.minimap.renderCharacters": false,
    "window.title": "${dirty}${activeEditorMedium}${separator}${rootName}",
    "editor.codeLens": true,
    "editor.snippetSuggestions": "top",
    "explorer.confirmDragAndDrop": false,
    "editor.fontSize": 16,
    "javascript.updateImportsOnFileMove.enabled": "always",
}
```

### 设计稿标注工具

- Mac
  - Sketch
- Windows
  - PxCook

### 公司开源平台

- 项目管理
  - 禅道，免费开源
- 代码管理
  - Gitlab
- 文件管理
  - SVN
- 文档管理
  - 语雀，有道云

### 环境配置
- phpStudy 让天下没有难配的服务器环境，windows环境下很好使，php是最好的工具

### 其他
- 自动接口文档 Swagger UI
- 模拟接口服务 [easyMock](https://www.easy-mock.com)

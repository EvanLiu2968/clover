## Webpack4的实践应用

webpack4发布不久，跟3的版本还是有不少的差异的，实践下来，问题主要是一些在webpack3版本正常运行的库在4的版本会有问题，并且问题还不能靠搜索直接得到答案，官方说的性能提升其实也没那么重要，不过也不能老守着webpack3不升级，所以简要介绍下wenpack4的实践。

先列出github地址：[https://github.com/EvanLiu2968/webpack-react-ssr](https://github.com/EvanLiu2968/webpack-react-ssr)

1. 默认配置
根据webpack的mode属性，会匹配不同的默认配置，mode有三种模式:`development` `production` `none`, 分别为开发模式、生产模式、不启用默认配置，并且这个值是必填的(不配置会报错)，在这些默认配置下就可以正常的开发，关于这些默认配置可以去官网查找，不过项目的差异和不同需求，零配置想必也是不可能的。

2. 主要配置属性

- context
- entry
- output
- optimization
- module
- plugins


3. optimization
`optimization`是webpack4新增的，把很多插件相关的配置都迁移到了optimization中，这也是wenpack4
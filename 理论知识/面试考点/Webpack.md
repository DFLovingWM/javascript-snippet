# Webpack

## Webpack的作用？

一句话总结：模块化打包工具。具体过程（非顺序）：

- 从Entry开始，递归地解析Entry依赖的所有Module。
- 对于每个Module，根据配置的Loader对其进行转换；转换后，又递归地解析Module依赖的所有子Module。
- 一个Entry及其所有Module被分到一个组即Chunk。
- Webpack将所有Chunk转换成文件输出。
- 在整个构建流程中，Webpack会在合适时机执行配置的Plugin。

## loader是什么？loader的加载顺序？

1. Webpack只能处理JS文件，而loader的作用是处理各种非JS文件。本质上，loader是一个函数，它接收文件内容构成的大字符串。
1. 在配置中，按照compose的原理，从右到左，后一个参数的入参是前一个函数的出参。比如处理样式，如果用的是less，则有：

```js
{
  loaders: [
    {
      test: /\.less$/,
      loader: "style-loader!css-loader?modules&minimize!less-loader"
    }
  ]
}
```

从右到左依次为：

- less-loader：将less转化为css
- css-loader：处理`@import``url`等指令。这里还带上了俩参数：`minimize`表示压缩CSS源码，`modules`表示开启CSS Modules
- style-loader：将最终的css代码建立`style`标签插入当前HTML页面

## Webpack DevServer实时预览（Live Reload）

原理：DevServer会在bundle中注入一个代理客户端，让网页与DevServer之间通过WebSocket通信。当源码发生改变时：

- Webpack重新构建出bundle并放到DevServer上
- DevServer通过WebSocket控制网页刷新，重新请求bundle

## Webpack DevServer热更新(Hot Module Replacement, HMR)

基于HMR plugin。原理：HMR模块会在bundle中注入一个HMR Runtime，可以进行WebSocket通信。当源码发生改变时：

- Webpack重新构建出bundle后，DevServer将更新模块的hash信息发送给客户端
- HMR Runtime通过Ajax获取更新模块列表，再通过JSONP（将字符串直接执行）获取更新模块`webpackHotUpdate`。如果无法更新，则fallback到刷新网页。
  - 删除过期模块
  - 重新安装过期模块的子模块
  - 替换模块

## 关于Webpack优化？

- 优化构建速度
  - 缩小文件搜索范围
    - resolve
      - extensions：扩展名尽量少
      - modules：指定第三方模块的目录
      - mainFields：指定第三方模块的入口文件
      - alias：可以直接指定第三方模块的min版本，而不用再递归解析该模块依赖（但会影响Tree Shaking）
    - module.noParse：指定非模块化资源，省去解析时间
    - loader
      - test：尽可能少
      - include：可以指定src表示只处理JS源码
      - exclude：可以排除node_modules等目录
  - DLLPlugin：使较稳定模块只转译一次
  - HappyPackPlugin：多进程
- 优化开发体验
  - 实时刷新
  - 热更新
- 优化包质量
  - Tree Shaking特性：移除死代码
  - splitChunk属性：提取公共代码
  - 按需加载
  - ModuleConcatenationPlugin：模块连接/Scope hoisting
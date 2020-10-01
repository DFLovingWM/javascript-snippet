# babel

## plugin：插件

作用：babel是编译器，本身不负责任何转换，它的转换全靠各种各样的插件。

编译步骤：

- 解析：@babel/parser，解析成AST
- 转换：@babel/core
- 生成：@babel/generator

顺序：插件早于预设，按照声明顺序。

分类：

- 转换插件：转换代码。
- 语法插件：允许babel解析某种语法。转换插件自动开启语法插件。



## preset：预设

preset是插件集，不需要开发者一个个插件来配置，因此节约了时间。

preset按照声明的逆序执行，考虑到后向兼容性。

- env：根据指定的环境，自动选择对应的插件集来编译（最新的JS，不支持stage语法）。
- stage-x(0～3)：stage-x指还没发行的JS新特性。
  - stage-0：Strawman，由TC39成员提出的想法
  - stage-1：Proposal，值得尝试
  - stage-2：Draft，初步规范
  - stage-3：Candidate，完成规范、初步实现
  - stage-4：Finished，将被添加到下一个年度发布
- react：react支持
  - plugin-syntax-jsx
  - plugin-transform-react-jsx
  - plugin-transform-react-display-name
- typescript：ts支持
  - plugin-transform-typescript
- minify：原则是先压缩后转换，即认识ES6+的语法并压缩（但不转换）。而Uglify不认识ES6+，只能先转换再压缩。



## 库

### babel-polyfill

包括：

- core-js：新API（`Promise`、`WeakMap`）、静态方法（`Array.from`、`Object.assign`）、实例方法（`[].includes`）
- regenerator-runtime：Generator函数

有两个缺点：

1. 写入所有，导致包体积大
1. 污染全局（因为是polyfill，所以是侵入式定义）

第1个缺点需要用babel-preset-env的`useBuiltIns`属性解决，值为`usage`时表示根据使用到的函数进行按需引入。

而第2个缺点需要用到下面的babel-runtime。

### babel-runtime、babel-plugin-transform-runtime

需要一起使用。

babel-runtime类似于babel-polyfill，它提供工具，包括：

- core-js
- regenerator：generator/yield、async/await
- helpers

然而它解决了babel-polyfill污染全局的问题，适合开发NPM包。

babel-plugin-transform-runtime将helpers从“使用前定义”改成“引用”（指向babel-runtime中的定义），避免重复定义、代码臃肿。但它不支持实例方法。



## 参考

- [Babel.js](https://babeljs.io/docs/en/)
- [一口(很长的)气了解 Babel](https://mp.weixin.qq.com/s/qetiJo47IyssYWAr455xHQ)
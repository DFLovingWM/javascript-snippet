# 实现co

## 思路

`co(genFunc)`做的事情是：

- （递归地）将每个yield后面的Promise解析出值，然后将值还给用户代码
- 返回一个总的Promise：
  - 如果过程不存在用户代码没有捕捉的异常，则总Promise成功，值为`genFunc`的返回值
  - 如果过程中存在用户代码没有处理的异常，则总Promise失败，值为该异常

只要对generator的执行机制有一定理解，实现起来就不难，难点在于异常处理细节。

## 参考

- [tj: co](https://github.com/tj/co/blob/master/index.js)

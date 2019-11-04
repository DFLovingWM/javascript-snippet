# 实现call/apply

## 目标

仿照`Function.prototype.call`，实现`Function.prototype.myCall`。

## 思路

`call/apply`的作用是将函数在某对象上调用，或者说是手动改变函数的执行上下文（context）。如果传入的对象为`undefined/null`，则在全局对象上调用：浏览器对应`window`，Node对应`global`（注意不是`module.exports`）。

实现方式：可以给`context`对象临时增加一个方法，调用后，再删除该方法。

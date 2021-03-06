# 实现bind

## 思路

`fn.bind(context, ...args)`用以将函数的上下文修改为某个对象，并且能够提供部分参数，它返回一个新函数。

实现要点：

- 返回一个待执行/延迟执行的新函数，调用时上下文为`context`。这里借用`apply/call`来实现。
- 如果新函数是通过`new`调用的（即当作构造函数），因为新实例`instance`优于`context`，执行上下文再次修改为`instance`。并且，新函数需要继承原函数。

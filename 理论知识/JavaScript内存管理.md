# JavaScript内存管理

## 对象的生命周期

- 创建
- 使用（读/写）
- 释放

在JS这样的高级语言中，开发者只会关注“使用”，“创建”与“释放”由GC（垃圾回收）管理。GC面临的核心问题为：如何判断一个对象不再被需要（然而这个问题是undecidable的）。

## 引用计数（Reference-counting）算法

思路：“不再被需要”定义为引用计数为0的对象。

问题：循环引用。例如：

```js
(function () {
  let a = {};
  let b = {};
  a.prop = b;
  b.anotherProp = a;
} ());
```

当匿名函数执行完毕，两个对象的计数都为1，所以都不能被回收。

## 标记清除（Mark-and-sweep）算法

思路：“不再被需要”定义为从全局对象出发不可达（图搜索DFS/BFS）的对象。不可达对象包含了引用计数为0的对象，并且解决了循环引用的问题。

## 参考

- [MDN: Memory Management](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)
- 《JavaScript高级程序设计第三版》Ch4.3：垃圾回收

# 节流(throttle)与防抖动(debounce)

## 定义

控制函数的执行频率。DOM事件的发射频率无法控制，故提供了一个中间层，来控制函数实际的执行频率。

- throttle：使函数的连续调用有最小间隔，即保证函数在一个最小间隔中最多只执行一次。在一个大阶段中进行小于最小间隔的多次调用，会得到多次执行。应用：图片懒加载时的元素检测。
- debounce：使函数只选取（满足最小间隔的）连续调用中的最后一次。在一个大阶段中进行小于最小间隔的多次调用，只会得到唯一一次执行。分为两种：
  - trailing debounce(默认)：窗口resize
  - leading debounce：提交按钮

## 实现（使用timeout）

使用闭包（作为中间函数），分离函数的调用（称为`call`）和实际执行（称为`invoke`）。

### debounce

防抖动分为两种：

- `trailing`(默认)：在某个wait阶段的结尾处执行，如果存在重复调用，则开启新的wait阶段
- `leading`：在某个wait阶段的开头处执行，如果存在重复调用，则不执行、但同时开启新的wait阶段

实现时只需要对这两种情况分类讨论即可。

### throttle

节流可以开启两个选项：

- leading
- trailing

这2个选项的组合，以及它们的含义：

- `leading && trailing`(默认)：在某个wait阶段的开头执行，如果存在重复调用，则在该wait阶段的结尾处执行最新的那次调用
- `leading && !trailing`：在某个wait阶段的开头执行，如果存在重复调用，则忽略
- `!leading && trailing`：在某个wait阶段中，在结尾处执行最新的那次调用
- `!leading && !trailing`：不合理

理解之后才能完整实现。需要对`now`与`prev`进行比较，分类讨论（可以画个数轴帮助分类讨论）：

- `now >= prev + wait || now < prev`：表示超出间隔，可以执行
  - 如果`leading`，则立即执行
  - 如果`!leading`，则增加定时器在阶段末端待执行
- `prev <= now < prev + wait`：表示在间隔之内的重复调用。在`trailing`开启的情况下，重复调用需要在wait末端执行，所以要设置定时器。但是频繁重复调用可能引起定时器多次重启，没有必要，于是只设置一个定时器，对于重复调用，只更新`context`和入参即可。如果没开`trailing`，则忽视重复调用。

## 参考

- [JavaScript专题之跟着underscore学防抖](https://github.com/mqyqingfeng/Blog/issues/22)
- [JavaScript专题之跟着 underscore 学节流](https://github.com/mqyqingfeng/Blog/issues/26)
- [CSS-Tricks: Debouncing and Throttling Explained Through Examples](https://css-tricks.com/debouncing-throttling-explained-examples/)

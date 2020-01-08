# 图片懒加载（分析vue-lazyload源码）

## 含义

当`img`元素设置`src`时，浏览器会请求下载图片然后展示。当一个页面中的图片过多时，由于IO过多，可能会引起浏览器的卡顿，影响用户体验。改善方案是，当滚动条移动时，始终只加载那些在当前viewport中的图片（或者顶多提前一些），这就是图片的懒加载。

## 解决方案

有两种解决方案：

- 传统方案：监听`scroll`事件，检测在viewport内的所有元素
- 新API：使用`IntersectionObserver`类

简单的demo写起来不费劲，但这里我们考虑工程化的实现：实现`LazyImage`组件。

### 方案一：监听scroll

首先，因为scroll事件频繁发射，所以该方案需要用`throttle`（不用`debounce`哦）来辅助降低检测元素的操作频率。

因为基于DOM事件，所以组件需要在`mounted`阶段注册回调。N个`LazyImage`有共同的滚动父元素`window`（实际情况更复杂一点，需要考虑多个滚动父元素）。于是有两种思路：

- 思路1：每个组件在`mounted`阶段调用`window.addEventListener`，在回调中只检测当前组件是否在viewport中。
  - 优：简单
  - 劣：性能差，1次scroll事件对应N个回调
- 思路2：只调用1次`window.addEventListener`，在回调中同时检测N个组件有哪些在viewport中。
  - 优：性能好
  - 劣：不简单，需要引入一个中间组件，来管理父元素的监听、子组件队列的检测

思路2明显更好。所谓“中间组件”，在`vue-lazyload`中对应`Lazy`类。作为“管理员”，它维护两个队列：

- `TargetQueue`：父元素队列，里面包含所有可滚动的父元素（全局滚动`window`、局部滚动）。
- `ListenerQueue`：子组件队列，里面包含两种对象：
  - 子组件
  - 自定义类ReactiveListener，用以模拟子组件，在指令中使用

对于一个`LazyImage`组件来说：

- `mounted`阶段、以及`src`被更改（响应特性）时，告知管理员将自身与父元素加入队列。
- `beforeDestroy`阶段，告知管理员将自身与父元素撤出队列。

对于一个`Lazy`类来说，它的工作主要有：

- 维护两个队列：
  - 注册一个`LazyImage`组件：如果其父元素不存在，则加入`TargetQueue`队列、并且注册`scroll`事件监听。
  - 反注册一个`LazyImage`组件：如果其父元素下的所有子组件都被移除，则反注册`scroll`事件监听。
- `scroll`回调：遍历`ListenerQueue`：如果组件已加载完毕，则将其移出队列；如果组件在viewport中，则通知它加载。

### 方案二：IntersectionObserver

使用`IntersectionObserver`API是更新的方案，但缺点是学习成本，以及一定的兼容性问题。以下称其实例为`observer`。

由于`observer`本来就是一个统一的管理者，所以也更迎合上述的“思路2”。对于`Lazy`类来说:

- 实例化时：初始化唯一的一个`observer`
- 注册组件时：`observer.observe(vm.el)`
- 反注册组件时：`observer.unobserve(vm.el)`
- 回调：遍历`entries`参数：如果组件已加载完毕，则`observer.unobserve(vm.el)`；如果组件在viewport中，则通知它加载

## 参考

- [Vue-Lazyload](https://github.com/hilongjw/vue-lazyload)
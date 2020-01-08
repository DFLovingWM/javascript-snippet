# 实现Vue

## 理解

`new Vue().$mount`，创建一个Vue实例：

- 在`beforeCreate`和`created`之间，对Vue实例的`data`、`props`等对象构建响应式（劫持属性的`getter`和`setter`）
- 在`beforeMount`和`mounted`之间，进行：
  - `render`：获取最新VDOM。同时因为touch了视图所依赖的数据，会触发相关属性的`getter`，于是进行依赖收集，即这些属性会将“视图更新”这个`render watcher`记录下来，以便在更新时能够调用。
  - `update`：将新VDOM与旧VDOM比较，得出patch应用在旧DOM上，这样视图就更新了（这里是第一次）。

其中，`render`一步是为了获取Vue实例的VDOM。当遇到子组件的VDOM时，子组件VDOM在`init`阶段会创建出
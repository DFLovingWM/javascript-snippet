# VueRouter

## 实现原理

- 问题：VueRouter是怎么实现的？



## 组件复用

- 问题：跳转到的新路由对应同一个组件时，比如`/user/:id`设置的路由，由`/user/1`跳转到`/user/2`，会发生什么？

路由记录是新的，但组件是同一个，会发生组件复用，执行`beforeRouteUpdate`路由钩子（或者监听`$route`对象）。注意，组件自身的`beforeUpdate/updated`不会被调用，除非该组件的视图所依赖的某个数据跟着发生了改变。

- 问题：如何避免组件复用？

在对应的`router-view`组件上添加`key`，需要保证该`key`不相同（状态相关），比如可以：

```html
<router-view :key="$route.params.id" />
```

- 问题：为什么加了key就能避免组件复用？

这个涉及到key的作用，参考《Vue.md》。

## history模式

- 问题：history模式有什么缺点？怎么解决？

当用户直接访问某个SPA页面，即进行以下任意一种操作时：

- 刷新页面
- 拷贝URL，在新Tab中直接跳转

URL会报`404 Not Found`。因为应用是SPA，当前URL是经过前端跳转形成的，所以Nginx无法根据当前URL找到应用入口，用户无法进入应用。

解决方案：

- Webpack
- Nginx
- 后端

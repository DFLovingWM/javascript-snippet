# Vue

## key的作用

- 问题：在v-for中，为什么要指定key？如果不指定会造成什么结果？

key的作用是在VDOM比较过程中标记可以复用的结点，而开发者显示提供一个unique的key是为了避免“就地复用”给“有状态组件”带来的副作用（一般是状态没有得到更新）。如果开发者不指定key，VDOM为了提高效率会采取“就地复用”策略（尽量全部复用旧结点，避免创建/销毁多个组件的开销），这与提供`index`作为key的效果是一样的，只适合无状态组件，不推荐。

参考：[第 1 题：写 React / Vue 项目时为什么要在列表组件中写 key，其作用是什么？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/1)

## 事件委托

- 问题：如果v-for的每个item都绑定了事件，为什么Vue不会处理成事件委托？

首先，事件委托的作用/优点有：

- 不必手动给新增的子元素绑定事件
- 只定义了一个回调函数，更省内存

而Vue中，的确是不会处理成事件委托的，而是保留开发者的做法，理由与上述观点一一对应：

- v-for配合事件绑定，开发者只需要书写一次，新增的子元素也不必再写一次来绑定事件
- 虽然给N个子元素监听了事件，但回调是同一个函数。所以只要不是多个函数，其实内存消耗也差不多
- 更自由：开发者可以自行选择是事件绑定还是事件委托。如果是委托，则可能需要开发者额外保存数据，来保证在回调中能辨识是哪一个子元素

参考：[Is event delegation necessary?](https://forum.vuejs.org/t/is-event-delegation-necessary/3701/4)

## Vue2+源码中，有多少种watcher？

### 2020-01

首先，要认识`Watcher`这个类，它代表了“订阅者”，有两个关键属性：

- `getter`：取值函数，隐含了触发回调、依赖收集这两个过程。有两个时机会执行`getter`：
  - watcher实例化
  - 有关属性调用setter
- `cb`：回调函数。只出现在watch中，之后详述。

然后，在Vue2+源码中，存在3种Watcher：

- Render Watcher（视图）
- Lazy Watcher（computed属性）
- User Watcher（watch属性）

详细：

- Render Watcher（视图更新）：`getter`是重渲染，无`cb`。
  - 依赖收集：`getter`依赖于有关属性（如果有条件分支，则不成立分之的属性会被暂时忽略）。组件在mount阶段，会实例化一个Render Watcher，该过程会调用一次`getter`，其中组件调用render函数、触发属性的getter，使得该watcher与有关属性产生双向关联。
  - 触发视图更新：有关属性被开发者修改、触发setter时，会调用一次`getter`，包括视图更新和依赖重新收集（因为返回值无用，所以也没有cb）。
- Lazy Watcher（computed）：开发者提供的computed属性作为`getter`，无`cb`。“lazy”的含义是，watcher实例化时不会执行`getter`，而是每当computed属性被触发getter（属性被访问/使用）时，watcher的`getter`才可能会执行。
  - 依赖收集：`getter`依赖于有关属性（如果有条件分支，则不成立分之的属性会被暂时忽略）。函数执行时触发了有关属性的getter，使得该watcher与有关属性产生双向关联。
  - 触发computed函数：与Render Watcher不同的是，当有关属性触发setter时，只是让该watcher的`dirty`属性变为true（表示待触发），但此时还没触发computed回调；在这种时候，只有当computed属性被访问（一般是被视图访问），才会执行`getter`（相当于优化）。另外，执行`getter`后，会通知Render Watcher也直接订阅该watcher所依赖的属性（@todo 为啥呢？）。
- User Watcher（watch）：开发者提供的属性包一层wrapper作为`getter`，可理解为“因”；开发者提供的回调作为`cb`，可理解为“果”。另外，"User"的含义：对开发者提供的`cb`包一层异常捕捉，
  - 依赖收集：当deep为false时，`getter`只依赖于该监听属性；当deep为true时，`getter`依赖于以该监听属性为根的对象子树上的任何一个属性（故存在性能开销）。组件在create阶段，会实例化这个User Watcher，调用一次`getter`，触发其对象树上属性的getter，于是该User Watcher与这些属性产生双向关联。
  - 触发回调：如果依赖的对象树发生改变、触发某个有关属性的setter，`getter`就会执行，并获取`getter`的返回值。如果返回值改变、或者是deep监听，又会执行`cb`。

### 2020-02更新

3种watcher：

- Render watcher：视图
  - 依赖关系：视图依赖于数据。数据被访问时，收集视图作为依赖；数据被修改时，触发视图更新。
  - 异步执行
- Lazy watcher：computed属性
  - 依赖关系：数据B依赖于数据A。A被访问时，收集B作为依赖；A被修改时，使B变为dirty状态（必要条件），之后当B被访问时，才会触发B函数的执行。（@todo 存疑：当A也是个计算属性时，如何触发B的执行？）
  - 同步执行
- User watcher：watch属性
  - 依赖关系：（当设置deep监听时）数据依赖于其对象树上的任意子属性。当子属性被访问时，收集数据作为依赖；当子属性被修改时，触发数据的handler回调。（@todo 存疑：源码中`isObject`判断有啥用？）
  - 异步执行

## nextTick：作用？原理？

相关知识：浏览器的事件循环。一起食用更佳。

这里有两种不同的"tick"概念：

- 事件循环中的tick：每个tick执行一个宏任务和所有微任务，两个tick之间进行页面渲染（重绘重排）。所以到了“下一个tick”，（可能）能看到当前最新的页面。
- nextTick中的tick：每个tick执行一轮“watcher改变”。到了“下一个tick”，一定能读取到最新的DOM。

### 作用

首先，在这里需要分清“渲染”这个概念，它有多种意思：

1. 组件调用render函数，重新生成VDOM
1. VDOM计算出patch，应用到DOM上使其改变
1. DOM改变，引起浏览器重绘与重排

`Vue.nextTick(fn)`的作用是：在下一次渲染（第2种，即DOM改变）之后，执行fn。因为开发者设值时引起的渲染（第1种，即VDOM重新生成）是异步的，开发者并不知道什么时候会应用到DOM上（第2种），而`nextTick`能保证开发者在回调中能访问到最新的DOM。

### 原理

nextTick表示将某个函数安排在“下一个tick”（这里的tick，与事件循环中的tick不一样）执行。基于优先使用MicroTask的原则，依次进行能力检测：

- Promise
- MutationObserver
- setImmediate（比setTimeout好的原因：让脚本有机会在UA事件和渲染发生后立即得到调用。但只有IE实现）
- setTimeout

每当一个render/user watcher被update，它不会立即地、同步地run，而是由框架调用`queueWatcher`将它扔到队列（用以存放同一轮改变的watcher）。如果还没进行，则调用`nextTick`开启对该队列的消费（参考`flushSchedulerQueue`）；如果已经是进行中，就不需要开启。

然后，`nextTick`内部也使用了一个队列`callbacks`，用来缓冲唯一一个`flushSchedulerQueue`、以及多个开发者回调`fn`（如果指定了）。如果缓冲中存在`flushSchedulerQueue`则它一定是在最前面，任意一个`fn`都会在`flushSchedulerQueue`后面，所以开发者在`fn`中能访问到已更新/最新的DOM。

## Vue SSR

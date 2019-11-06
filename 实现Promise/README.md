# 实现Promise

## 原理

在实现Promise之前，必须对Promise有足够深刻的认识。

### 状态

Promise的3种状态：

- `pending`
- `resolved(fulfilled)`
- `rejected`

并且遵循规则：

- 初始状态：刚创建时，3种状态都有可能。
- 状态转移：只有`pending => resolved`或`pending => rejected`。`resolved/rejected`被认为是确定的状态，一旦状态被确定了，永远都不会再发生变化。

### Promise链

从上面得知，Promise的创建与状态确定并不一定是同时的，很多时候，Promise先被创建出来、处于`pending`状态，然后它会在某个时刻被上一个Promise确定状态、才变成`resolved/rejected`。在一条Promise链中，当前Promise的状态由相邻的上一个Promise来决定。

当调用`p1.then(onResolved, onRejected)`时，实际上做了2件事情：

- 同步给`p1`增加1个成功回调和1个失败回调。现在或之后：
  - 当`p1`被确定为`resolved`时，调用`onResolved`函数
  - 当`p1`被确定为`rejected`时，调用`onRejected`函数
- 同步返回一个状态为`pending`的新Promise（记为`p2`）。现在或之后：
  - 当`p1.onResolved`或`p1.onRejected`成功执行，那么`p2`就被确定为`resolved`，并且`p1.onResolved`或`p1.onRejected`的返回值作为`p2`的值
  - 当`p1.onResolved`或`p1.onRejected`执行过程中出现异常，那么`p2`就被确定为`rejected`，并且该异常作为`p2`的值

相应地，在具体编码中，实现Promise的核心代码，就是`then`方法中对当前Promise状态的判断。记`p2 = p1.then(onResolved, onRejected)`。如果`p1`状态为：

- `pending`：`p1`本身未确定，`p1`也无法决定`p2`的状态，所以只能将队列存放一个函数`cb`，`cb`的主要工作有2个：执行`onResolved`或`onRejected`回调、决定`p2`状态
- `resolved`：执行`cb`
- `rejected`：执行`cb`

而Promise链的首结点，由用户代码显式地通过`new Promise(executor)`创建，即它的状态由用户代码决定。所以我们通常认为，（在全局作用域中创建1个Promise时）`executor`的执行是“同步”的。

## 参考

- [Promise实现原理（附源码）](https://juejin.im/post/5b83cb5ae51d4538cc3ec354)。核心思路很不错，但似乎在判断`resolve(value)`中的`value`时有冗余逻辑。

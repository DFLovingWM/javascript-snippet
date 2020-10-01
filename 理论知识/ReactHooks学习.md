# React Hooks学习笔记

## 出现原因

为了解决类组件的几个问题：

- 难以复用有状态的逻辑（stateful logic），现有方案如render props、HOC都需要改变组件的层级关系。而Hooks不会影响当前的组件层级（最核心）。
- 容易出现复杂组件，不相关逻辑在同一个生命周期钩子中，相关逻辑可能分散。而Hooks可以根据状态的相关程度来自定义划分。
- 类对开发者不太友好，对编译器的优化也不好。而Hooks可以避免使用class，拥抱function（最明显）。

## Hooks API

Hooks API基于函数组件，并且以`useXxx`方式命名。首先需要明确的是，组件即函数，而组件的重渲染对应函数的重新执行，得到一份“快照”（所有变量都是新的）。

### useState

定义状态的getter和setter。语法为：

```js
const [state, setter] = useState(initialVal);
```

其中`setter`类似于`setState`：

- `setter`是覆盖值，而`setState`是更新部分值
- 既能传入值，也能传入函数（当新状态需要依赖旧状态时）

### useEffect

定义组件的副作用（副作用：访问外部数据/使得函数不纯/与渲染无关的行为）。语法为：

```js
useEffect(fn, dependencies);
```

很常用的一个hook，不过API设计有些奇妙：

- `fn`：代表副作用的函数。`fn`可以返回一个`cleanup`函数（可选），`cleanup`表示清除该副作用。
- `dependencies`：是一个数组，表示该副作用所依赖的数据。它有3种不同类型的值，决定了副作用触发的不同时机：
  - undefined（不填该参数）：表示默认行为。`fn`会在组件每次重渲染之后执行（包括第一次，所以相当于写在`componentDidMount`与`componentDidUpdate`中），`cleanup`会在重渲染之前执行。更具体地（站在类组件生命周期的角度），组件mount时，执行`fn`；组件update时，执行`cleanup`后再执行`fn`；组件unmount时，执行`cleanup`。
  - 非空数组：`fn`会在组件每次重渲染之后、并且数组中任意一个变量的值发生改变时执行。使用场景：当副作用只依赖于其中一部分状态变量时。
  - 空数组：表示无依赖，即任何一个状态变量的改变都不会引起副作用。`fn`只在组件mount时执行，`cleanup`只在组件unmount时执行。

总的来说，副作用发生在重渲染之后（官方表示，甚至是在页面渲染即repaint/reflow之后）。

### useMemo

用于性能优化，避免不必要的渲染。当某个状态变量改变引起组件重渲染，默认会重新生成所有子组件，但当有些子组件不依赖该状态变量因而没必要重渲染时，就可以对它们设置条件。语法：

```js
const memoizedValue = useMemo(getter, dependencies);
```

意义：

- `fn`可以返回两种值
  - 组件：表示当`dependencies`中有改变时，才会渲染该(子)组件
  - 值：表示当`dependencies`中有改变时，才会执行`fn`生成用于展示的值，类比Vue中的`computed`属性
- `dependencies`一般是非空数组，因为如果是：
  - undefined：表示绝对执行，即没有任何优化，等同于不使用该API（写了但没用）
  - 空数组：表示啥都不依赖，然而内容不变的组件也只会渲染一次，完全不需要任何优化（写了但没必要）

注意，虽然语法相似，但`useMemo`跟`useEffect`完全不一样、也不能混用：

- `useMemo`用于减少渲染（性能优化），发生在组件渲染之前，相当于类组件中的`shouldComponentUpdate`或`PureComponent`
- `useEffect`用于增加副作用，发生在组件渲染之后

只要写在子组件调用渲染之前即可，有两种写法（@todo 存疑）：

- 写在父组件中，

```js
function Parent () {
  const [name, setName] = useState('');
  const child = useMemo(() => {
    return (
      <Child name={name} />
    )
  }, [name]);

  return (
    <div>
      {child}
    </div>
  )
}

function Child (props) {
  return (
    <div>Child: {props.name}</div>
  )
}
```

- 写在子组件的开头，包裹子组件

```js
function Parent () {
  const [name, setName] = useState('');
  return (
    <div>
      <Child name={name} />
    </div>
  )
}

function Child (props) {
  return useMemo(() => {
    return (
      <div>Child: {props.name}</div>
    ) 
  }, [props.name]);
}
```

### useCallback

作用：缓存组件每次重渲染时的内联回调函数（inline callback）的实例，它并不能省去创建内联函数的性能开销，而是配合`shouldComponentUpdate`/`PureComponent`/`React.memo`/`useMemo`一起使用，避免不必要的渲染。需求背景：

- 类组件中，即使子组件是`PureComponent`，而如果接收的回调函数是个匿名函数，也会因为回调函数实例不同而引发重渲染，PureComponent就没有达到优化目的。解决方案：将匿名函数定义在组件原型上（那么随着父组件重渲染，该函数的实例也不变），然后子组件接收它。
- 函数组件中，即使子组件使用`React.memo`/`useMemo`包裹起来，而如果接收一个闭包（包括匿名函数、内联非匿名函数）作为属性，由于重渲染会重新执行函数组件而生成新闭包，memo也不能达到优化目的。解决方案：`useCallback`。

`useCallback`是`useMemo`的特殊情况：`useMemo`用于条件缓存一个值，而对于`useCallback`来说，这个值就是函数，即`useCallback(fn, deps)`相当于`useMemo(() => fn, deps)`。语法：

```js
const fn = useCallback(oldFn, deps);
```

参考：[React Hooks 第一期：聊聊 useCallback](https://zhuanlan.zhihu.com/p/56975681)

### useRef



### useLayoutEffect

它与`useEffect`相似但调用时机不同：

- `useEffect`中的`fn`在浏览器绘制之后【异步】（延迟）执行，但保证在新的渲染之前执行。一般用于事件注册与注销。
- `useLayoutEffect`中的`fn`在DOM更新之后、浏览器绘制之前【同步】执行（所以会阻塞浏览器绘制）。一般用于修改页面样式，避免闪屏问题。

参考：[useEffect和useLayoutEffect的区别](https://www.jianshu.com/p/412c874c5add)

## 参考

- [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html)
- [Hooks API Reference](https://reactjs.org/docs/hooks-reference.html)

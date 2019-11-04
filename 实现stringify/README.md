# 实现JSON.stringify

`JSON.stringify(value, replacer, space)`，后两个参数跟不通用、就不考虑了。我们只要实现`stringify(value)`。

## 重新认识API

`JSON.stringify`将对象序列化，然而有些情况是不满足预期的：

- 当键属于`symbol`类型时，直接忽略该KV对。（普通对象的key本来只能是`string`类型，后来在ES6中加入`symbol`类型）
- 当值属于`undefined`、`symbol`、函数这3种“不可序列化的”类型时：在对象中直接忽略该KV对；在数组中，值统一转化为`null`（它也想忽略啊，但是会影响相对顺序）。
- 当值为`number`类型中的`NaN`、`Infinity`时，也会被转化为`null`。
- 当值为对象、且实现了`toJSON`时，直接沿用用户返回的对象。
- 循环引用：报错

实现的时候，遵循上面这些规则就行。另外，还有一些小细节：

- 外围符号标记
  - 字符串：`""`
  - 数组：`[]`
  - 对象：`{}`
- KV对
  - 对象：K、V都要展示
  - 数组：下标不必展示

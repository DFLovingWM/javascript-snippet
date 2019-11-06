# 实现instanceOf

## 目标

因为`instanceof`是关键字，无法实现，所以只能实现`instanceOf(instance, clazz)`。

## 思路

返回true的充要条件：`clazz.prototype`与`instance.__proto__`在同一原型链上，并且前者在后者上游。所以只要从`instance.__proto__`开始向上沿着原型链寻找就行。

偷懒的话可以直接用`Object.isPrototypeOf`这个ES6 API。

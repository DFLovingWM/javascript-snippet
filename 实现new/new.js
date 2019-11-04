/**
 * 实现一个`new A(b)`：调用方式为`New(A, b)`
 */
function New (Clazz, ...args) {
  const instance = {}

  // 对象属性：窃取构造函数
  const ret = Clazz.apply(instance, args)
  if (ret !== null && ['function', 'object'].includes(typeof ret)) { // 如果构造函数有对象类型的返回值，则返回该对象
    return ret
  }

  // 原型属性：设置原型
  if (Clazz.prototype) {
    Object.setPrototypeOf(instance, Clazz.prototype)
  }

  return instance
}

module.exports = New
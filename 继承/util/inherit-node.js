/**
 * 通过直接链接原型，来实现继承
 * 参考：https://segmentfault.com/q/1010000015291849/a-1020000015291964
 */
module.exports = function inherit (SubClass, SuperClass) {
  if (typeof Object.setPrototypeOf === 'function') {
    Object.setPrototypeOf(SubClass.prototype, SuperClass.prototype)
    Object.setPrototypeOf(SubClass, SuperClass)
  } else {
    SubClass.prototype.__proto__ = SuperClass.prototype
    SubClass.__proto__ = SuperClass
  }
}

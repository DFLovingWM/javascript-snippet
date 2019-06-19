/**
 * 实现继承
 * 参考：https://segmentfault.com/q/1010000015291849/a-1020000015291964
 * @param {Function} subClass 子类构造器
 * @param {Function} superClass 父类构造器
 */
module.exports = function inherit (subClass, superClass) {
  // 原型上的继承
  if (typeof Object.setPrototypeOf === 'function') {
    Object.setPrototypeOf(subClass.prototype, superClass.prototype)
    Object.setPrototypeOf(subClass, superClass)
  } else {
    subClass.prototype.__proto__ = superClass.prototype
    subClass.__proto__ = superClass
  }
}

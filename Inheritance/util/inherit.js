const objectCreate = require('./object-create-polyfill')

/**
 * 实现继承
 * @param {Function} subClass 子类构造器
 * @param {Function} superClass 父类构造器
 */
module.exports = function inherit (subClass, superClass) {
  const create = Object.create || objectCreate

  subClass.prototype = create(superClass.prototype) // 继承
  /*
   * 因为在Object.create中，子类原型是一个临时类的实例，即其constructor指向临时类
   * 所以需要纠正constructor
   */
  subClass.prototype.constructor = subClass

  // 构造器上的继承(ES6额外步骤)
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(subClass, superClass)
  } else {
    subClass.__proto__ = superClass
  }
}

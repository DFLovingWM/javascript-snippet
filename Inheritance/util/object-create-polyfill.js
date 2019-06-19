/**
 * 对Object.create的polyfill
 * 参考《JavaScript高级程序设计》ch6.3.4 原型式继承
 */
module.exports = function objectCreate (proto, descriptorObj) {
  var F = function () {}
  F.prototype = proto // 链接在同一原型链上
  var ret = new F()

  if (descriptorObj) {
    Object.defineProperties(ret, descriptorObj)
  }

  return ret // 最终要的是对象，说明F只是临时的构造器
}

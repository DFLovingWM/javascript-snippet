/**
 * `Object.create`实现继承
 */
module.exports = function inherit (SubClazz, SuperClazz) {
  SubClazz.prototype = Object.create(SuperClazz.prototype) // 继承
  SubClazz.prototype.constructor = SubClazz // 纠正constructor
}

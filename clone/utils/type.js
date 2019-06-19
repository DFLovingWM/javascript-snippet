// 获取对象的类型
module.exports = function getType (x) {
  let s = Object.prototype.toString.call(x)
  return s.match(/^\[object ([a-zA-Z0-9_]+)\]$/)[1]
}

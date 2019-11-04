/**
 * 手动实现`Object.create`
 */
function inherit (SubClazz, SuperClazz) {
  SubClazz.prototype = objectCreate(SuperClazz.prototype)
  SubClazz.prototype.constructor = SubClazz
}

function objectCreate (proto) {
  function F () {}
  F.prototype = proto
  return new F()
}

module.exports = inherit
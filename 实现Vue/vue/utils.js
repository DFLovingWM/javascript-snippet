module.isPlainObject = function (val) {
  const t = Object.prototype.toString.call(val);
  return t.slice(8, t.length - 1) === 'Object'
}
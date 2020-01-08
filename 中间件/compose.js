module.exports = function compose (...fns) {
  return function (param) {
    return fns.reduceRight((acc, b) => b(acc), param)
  }
}
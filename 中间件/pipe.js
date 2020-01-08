module.exports = function compose (...fns) {
  return function (param) {
    return fns.reduce((acc, b) => b(acc), param)
  }
}
/**
 * 递归实现(版本2)
 */
function _curry (fn, params) {

  // 递归函数
  function helper (...args) {
    args = params.concat(args)

    // （递归树叶子结点）参数数量到达形参数量，则求值
    if (args.length === fn.length) {
      return fn.apply(this, args)
    }

    // （递归树非叶子结点）继续延迟
    return _curry(fn, args)
  }

  return helper
}

module.exports = function (fn) {
  return _curry(fn, [])
}
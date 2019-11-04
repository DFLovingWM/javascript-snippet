/**
 * 递归实现(版本1)
 */
function curry (fn) {
  let args = [] // 存放所有参数

  // 递归函数
  function helper (...someArgs) {
    args = args.concat(someArgs)

    // （递归树叶子结点）参数数量到达形参数量，则求值
    if (args.length === fn.length) {
      const res = fn.apply(this, args)
      args = [] // 清空参数
      return res
    }

    // （递归树非叶子结点）继续延迟
    return helper
  }

  return helper
}

module.exports = curry
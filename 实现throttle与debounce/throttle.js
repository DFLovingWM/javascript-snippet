/**
 * 节流：使函数的连续调用有最小间隔
 */
function throttle (fn, minDuration = 100) {
  let prev = 0
  return function newFn (...args) {
    const curr = +new Date()
    if (curr - prev >= minDuration) { // 超过最小间隔，才调用
      prev = curr
      return fn.apply(this, args)
    }
  }
}

module.exports = throttle
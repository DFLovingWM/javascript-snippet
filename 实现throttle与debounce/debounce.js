/**
 * 防抖动：延迟执行。在实际执行前，总是以最后一次调用为有效
 */
function debounce (fn, delay = 100) {
  let timerId = null
  return function newFn (...args) {
    if (timerId) { // 如果当前存在定时器，则先取消
      clearTimeout(timerId)
    }
    timerId = setTimeout(() => {
      fn.apply(this, args) // 注：因为延时，无法获取返回值
    }, delay)
  }
}

module.exports = debounce
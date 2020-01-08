/**
 * 防抖动：延迟执行。在实际执行前，总是以最后一次调用为有效
 * @param {Function} fn 回调函数
 * @param {number} wait 最小阶段（毫秒数）
 * @param {boolean} immediate 是否立即执行
 * @returns {Function} 经过防抖动的回调函数
 */
function debounce (fn, wait = 100, immediate = false) {
  let timer = null
  let result

  function debounced (...args) {
    // 无论是哪一种，都先取消当前wait阶段
    clearTimeout(timer)

    if (immediate) {
      // 如果没有定时器，则立即执行
      if (timer === null) result = fn.apply(this, args)
      // 因为上面已经执行了，所以timeout中不能再执行
      // 但要给一个空的timeout占位，表示“wait阶段”
      timer = setTimeout(() => {
        timer = null // 将timeout置空，表示wait阶段结束了
      }, wait)
    } else {
      // 延迟执行
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, wait)
    }

    return result
  }

  // 提供cancel给用户，可以取消还在进行的定时器
  debounced.cancel = function () {
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  return debounced
}

module.exports = debounce
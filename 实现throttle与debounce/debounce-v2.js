/**
 * 浏览器中，也可以使用`requestAnimationFrame`实现
 */
function debounce (fn) {
  let requestId = null

  return function newFn () {
    if (requestId !== null) {
      cancelAnimationFrame(requestId)
    }
    requestId = requestAnimationFrame(fn)
  }
}

module.exports = debounce
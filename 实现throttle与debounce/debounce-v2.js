/**
 * 浏览器中，也可以使用`requestAnimationFrame`实现
 */
function debounce (fn) {
  let id = null

  return function newFn () {
    if (id !== null) {
      cancelAnimationFrame(id)
    }
    id = requestAnimationFrame(fn)
  }
}

module.exports = debounce
/**
 * 判断实例是否属于某个类
 */
module.exports = function instanceOf (instance, Clazz) {
  if (typeof Clazz !== 'function') throw new Error('请传入构造函数')
  
  // 沿着原型链查找
  // 类似于并查集的getRoot操作，可以用循环或递归实现
  const parentKey = '__proto__'
  let parent = instance[parentKey]
  while (parent !== null) {
    if (parent === Clazz.prototype) {
      return true
    }
    parent = parent[parentKey]
  }
  return false
}
/**
 * 控制Promise并发数
 * @param {any[]} array 数据
 * @param {Function} 将数据生成Promise的函数
 * @param {number} concurrency 最大并发数
 */
module.exports = function map (array, mapper, concurrency) {
  array = array.slice()
  const n = array.length

  return new Promise((resolve, reject) => {
    const res = Array.from({ length: n }, () => undefined) // 结果（按顺序）
    const unvisited = new Set(Array.from({ length: n }, (_, i) => i)) // 未处理
    const visited = new Set() // 处理完毕

    function process (index) {
      // 终止
      if (index >= n) return

      // 如果这个不能处理，则再看下一个
      if (!unvisited.has(index)) {
        process(index + 1)
      }

      unvisited.delete(index) // 标记`index`正在处理中
      const promise = mapper(array[index]) // 执行
      promise.then(r => {
        // 加入结果
        res[index] = r
        visited.add(index)

        if (visited.size === n) { // 全部完成，则整个成功
          resolve(res)
        } else { // 尚未全部完成，则处理下一个
          process(index + 1)
        }
      }).catch(e => {
        reject(e) // 只要有一个错误，整个就错误
      })
    }

    // 初始时，只执行并发数个Promise（就控制了并发数）
    for (let i = 0; i < concurrency; ++i) {
      process(i)
    }
  })
}
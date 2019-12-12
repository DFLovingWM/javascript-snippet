module.exports = function map (array, mapper, concurrency = 10) {
  const limit = new Limit(concurrency)
  return Promise.all(array.map((...args) => limit.build(() => mapper(...args))))
}

class Limit {
  constructor (n) {
    this.limit = n
    this.count = 0
    this.queue = []
  }

  // 入队（待执行）
  enqueue (fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        fn,
        resolve,
        reject
      })
    })
  }

  // 出队（执行）
  dequeue () {
    if (this.queue.length > 0 && this.count < this.limit) {
      const { fn, resolve, reject } = this.queue.shift()
      this.run(fn).then(resolve).catch(reject)
    }
  }

  // 立即执行
  async run (fn) {
    ++this.count
    const value = await fn()
    --this.count
    this.dequeue()
    return value
  }

  // 初始化
  build (fn) {
    if (this.count < this.limit) { // 还没到上限 => 立即执行
      return this.run(fn)
    } else { // 到达上限 => 先加入队列，待执行
      return this.enqueue(fn)
    }
  }
}
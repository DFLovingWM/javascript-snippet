module.exports = function map (params, mapper, concurrency = 10) {
  const limit = new Limit(concurrency)
  return Promise.all(params.map((...args) => limit.build(() => mapper(...args))))
}

class Limit {
  constructor (limit) {
    this.limit = limit // 限制数
    this.queue = [] // 队列，放置待执行的getter
    this.count = 0
  }

  build (getter) {
    if (this.count < this.limit) {
      return this.run(getter)
    } else {
      return this.enqueue(getter)
    }
  }

  run (getter) {
    ++this.count
    return getter().then((res) => {
      --this.count
      this.dequeue()
      return res
    })
  }

  enqueue (getter) {
    // 因为使用Promise.all，所以这里要返回一个Promise`B`
    return new Promise((resolve, reject) => {
      // 但要等到“真正”的Promise`A`执行完毕后，才标记`B`完毕
      // 所以将`B`的resolve、reject存到队列中，待调用
      this.queue.push({
        getter,
        resolve,
        reject
      })
    })
  }

  dequeue () {
    if (this.queue.length > 0 && this.count < this.limit) {
      const { getter, resolve, reject } = this.queue.shift()
      this.run(getter).then(resolve).catch(reject)
    }
  }
}
/**
 * 实现一个简单版的Promise
 */

const PENDING = 'pending' // 等待中
const RESOLVED = 'resolved' // 成功
const REJECTED = 'rejected' // 失败

function EasyPromise (changer) {
  this.state = PENDING // 状态
  this.value = undefined // 值
  // 设置回调队列的理由：
  // Promise还在pending状态时还不能调用回调函数，但是又不能丢弃用户给的回调，
  // 所以只能用队列暂存。
  this.resolvedCallbacks = []
  this.rejectedCallbacks = []

  // 暴露接口：被确定为`resolved`
  function resolve (value) {
    if (this.state !== PENDING) return

    // 规范参数：当参数是EasyPromise类型时，需要递归地解包
    if (isPromise(value)) {
      value.then(resolve, reject)
    } else {
      // 同步改变状态
      this.state = RESOLVED
      this.value = value
      // 异步执行回调
      async(() => {
        const cbs = this.resolvedCallbacks
        this.resolvedCallbacks = []
        cbs.forEach(cb => {
          cb(this.value)
        })
      })
    }
  }

  // 暴露接口：被确定为`rejected`
  function reject (value) {
    if (this.state !== PENDING) return

    this.state = REJECTED
    this.value = value
    async(() => {
      const cbs = this.rejectedCallbacks
      this.rejectedCallbacks = []
      cbs.forEach(cb => {
        cb(this.value)
      })
    })
  }

  resolve = resolve.bind(this)
  reject = reject.bind(this)

  // 这里的try...catch是为了捕捉用户代码决定【第一个】Promise时可能出现的异常
  try {
    // 暴露给用户、由用户决定它的状态
    changer(resolve, reject)
  } catch (e) {
    // 用户代码出现异常，那么它只能失败
    reject(e)
  }
}

EasyPromise.prototype.then = function (onResolved, onRejected) {
  // 规范化参数：
  // 如果不传，默认为不处理/传递
  if (typeof onResolved !== 'function') {
    onResolved = value => value
  }
  if (typeof onRejected !== 'function') {
    onRejected = reason => {
      throw reason
    }
  }

  // 无论当前EasyPromise状态如何，始终返回一个新的EasyPromise
  return new EasyPromise((resolveNext, rejectNext) => {

    function resolveCurr (value) {
      try {
        const res = onResolved(value)
        resolveNext(res)
      } catch (e) {
        rejectNext(e)
      }
    }

    function rejectCurr (error) {
      try {
        const res = onRejected(error)
        resolveNext(res)
      } catch (e) {
        rejectNext(e)
      }
    }

    switch (this.state) {
      case PENDING:
        this.resolvedCallbacks.push(resolveCurr)
        this.rejectedCallbacks.push(rejectCurr)
        break
      case RESOLVED:
        resolveCurr(this.value)
        break
      case REJECTED:
        rejectCurr(this.value)
        break
    }
  })
}

EasyPromise.prototype.catch = function (onRejected) {
  return this.then(null, onRejected)
}

EasyPromise.prototype.finally = function (onCompleted) {
  return this.then(
    value => {
      return EasyPromise.resolve(onCompleted()).then(() => value)
    },
    error => {
      return EasyPromise.resolve(onCompleted()).then(() => { throw error })
    }
  )
}

EasyPromise.resolve = function (value) {
  return new EasyPromise(resolve => {
    resolve(value)
  })
}

EasyPromise.reject = function (value) {
  return new EasyPromise((_, reject) => {
    reject(value)
  })
}

EasyPromise.all = function (promises) {
  return new EasyPromise((resolve, reject) => {
    const res = [] // 保存结果（按顺序）
    let count = 0

    for (const [i, promise] of promises.entries()) {
      // 如果传入的不是Promise，要先帮它转化为Promise
      this.resolve(promise).then(
        val => {
          res[i] = val
          ++count
          // 全部成功，才resolve
          if (count === promises.length) {
            resolve(res)
          }
        },
        err => {
          // 但凡有一个失败，就reject
          reject(err)
        }
      )
    }
  })
}

EasyPromise.race = function (promises) {
  return new EasyPromise((resolve, reject) => {
    for (const promise of promises) {
      this.resolve(promises).then(
        val => {
          // 任意一个成功，就结束（成功）
          resolve(val)
        },
        err => {
          // 任意一个失败，就结束（失败）
          reject(err)
        }
      )
    }
  })
}

// 异步调用
function async (fn, ...args) {
  setTimeout(fn, 0, ...args)
}

// 判断是否是EasyPromise
function isPromise (p) {
  return p instanceof EasyPromise
}

module.exports = EasyPromise
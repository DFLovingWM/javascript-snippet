/**
 * 测试 finally 方法
 */

const EasyPromise = require('./EasyPromise');

const p1 = new EasyPromise((resolve, reject) => {
  const n = Math.random()
  if (n > 0.5) {
    resolve(n)
  } else {
    reject(n)
  }
})

// p2保持p1的状态
const p2 = p1.finally(
  () => {
    console.log('finally')
  }
)

p2.then(
  s => {
    console.log('p2：p1成功', s)
  },
  err => {
    console.log('p2: p1失败了', err)
  }
)
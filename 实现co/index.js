const co = require('./co');

function getData (n, success = true) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      success ? resolve(n) : reject(n)
    }, 1000)
  })
}

function * main () {
  const a = yield getData(1)
  console.log(a)

  let b
  try {
    b = yield getData(2, false)
  } catch (e) {
    b = 0
  }
  console.log(b)
  
  return a + b
}

// 方式1：不可能
// const g = main()
// g.next().value.then(res => {
//   g.next(res).value.then(res => {
//     console.log(g.next(res).value)
//   })
// })

// 方式2：co
co(main).then(res => {
  console.log('main函数结果：', res)
}).catch(err => {
  console.error('main函数报错：', err)
})
/**
 * 测试resolve(另一个promise)
 */
const Promise = require('./EasyPromise');
const Promise2 = require('./answer')

const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('迟到')
  }, 1000)
})

const p2 = new Promise((resolve, reject) => {
  // p1.then(val => {
  //   resolve(val)
  // })
  resolve(p1)
})

p2.then(val => {
  console.log('p2成功：', val)
})
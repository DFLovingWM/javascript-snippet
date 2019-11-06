const MyPromise = require('./MyPromise');

const p1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(null)
  }, 1000)
})

console.log(p1)
p1.then(n => {
  console.log(n)
})

setTimeout(() => {
  console.log(p1)
  p1.then(n => {
    console.log(n)
  })
}, 500)

setTimeout(() => {
  console.log(p1)
  p1.then(n => {
    console.log(n)
  })
}, 2000)
const EasyPromise = require('./EasyPromise');
const MyPromise = require('./answer');

const p1 = new EasyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 200)
})

const p2 = p1.then(
  n => {
    console.log('p1成功，带动p2：', n)
    return 2
  }
)

const p3 = p1.then(
  n => {
    console.log('p1成功，带动p3：', n)
    return EasyPromise.resolve(EasyPromise.resolve(3))
  }
)

p2.then(
  (n) => {
    console.log('p2成功', n)
  }
)

p3.then(
  (n) => {
    console.log('p3成功', n)
  }
)

setTimeout(() => {
  const p4 = p1.then(
    n => {
      console.log('p1成功，带动p4', n)
      return 4
    }
  )

  p4.then(
    (n) => {
      console.log('p4成功', n)
    }
  )
}, 600)

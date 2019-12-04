// R.map函数
const map = f => ([x, ...xs]) =>
  !x ?
  [] :
  [f(x), ...map(f)(xs)]

// 在此基础上定义double函数
const double = arr => map(x => x * 2)(arr)

// 用户代码
console.log(double([1,2,3]))
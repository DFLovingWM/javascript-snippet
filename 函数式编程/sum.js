// R.sum函数
const _sum = acc => ([x, ...xs]) =>
  !x ?
  acc :
  _sum(acc + x)(xs)

// 美化：去掉对用户不友好的形参
const sum = arr => _sum(0)(arr)

console.log(sum([7,9,3]))
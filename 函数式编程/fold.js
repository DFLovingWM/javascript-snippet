/**
 * fold迭代模式：
 * - foldr
 * - foldl
 */
const foldr = connector => acc => ([x, ...xs]) =>
  x === undefined ?
  acc :
  connector(x)( foldr(connector)(acc)(xs) )

const foldl = connector => acc => ([x, ...xs]) =>
  x === undefined ?
  acc :
  foldl(connector)( connector(acc)(x) )(xs)


// 用foldr实现map
const map = f => foldr( x => acc => [f(x), ...acc] )([])
// 使用
console.log( map( x => x * 2 )([1, 2, 3, 4, 5]) )

// 用foldr实现sum
const sum = foldr( x => acc => acc + x )(0)
// 使用
console.log( sum([1,2,3,4,5]) )

// 用foldr实现forEach
const forEach = f => foldl( _ => x => f(x) )()
// 使用
forEach( x => console.log('Hello, ' + x) )([1,2,3])
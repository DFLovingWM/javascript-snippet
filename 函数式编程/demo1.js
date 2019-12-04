const arr = [3,4,5]

// 递归式遍历数组
function loopArray (arr, body, i) {
  if (i === arr.length) return
  body(arr[i], i, arr)
  loopArray(arr, body, i + 1)
}
loopArray(arr, function (item, index, array) {
  console.log(item)
}, 0)

/**
 * 禁用var/let，所有东西都用const定义，也就是说无变量，强制immutable。
 * 禁用分号，也就是不让“顺序执行”，解除过程式编程范式。
 * 禁用if/else，但允许用条件表达式condition ? expr1 : expr2。
 * 禁用for/while/do-while。
 * 禁用prototype和this来解除JS中的面向对象编程范式。
 * 禁用function和return关键字，仅用lambda表达式来编程（JS里叫箭头函数）。
 * 禁用多参数函数，只允许使用单个参数，相当于强行curry化
 */

// const body = item => next => next(doSomething(item))
const twoSteps = step1 => step2 => param => step2(step1(param))

const loopOnArray = arr => body => i =>
  i < arr.length ?
  twoSteps(body)(_ => loopOnArray(arr)(body)(i + 1))(arr[i]) :
  undefined
loopOnArray(arr)(item => console.log(item))(0)
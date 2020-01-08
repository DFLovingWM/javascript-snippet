module.exports = function curry (fn, initArgs = []) {

  function newFn (...args) {
    const newArgs = initArgs.concat(args); // 整合参数（需要注意，禁止mutate任何参数数组，即避免副作用）
    if (newArgs.length>= fn.length) { // 如果达到形参数量，则调用
      return fn.apply(this, newArgs);
    }
    return curry(fn, newArgs); // 否则增加实参后继续递归
  }

  return newFn
};
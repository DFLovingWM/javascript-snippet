// 侵入式实现
Function.prototype.myCall = function (context, ...args) {
  const fnName = Symbol() // 用Symbol随机函数名，以免与原有属性冲突

  if (context === undefined || context === null) {
    // 传入的上下文如果是undefined/null，则在全局对象上调用
    // 浏览器中是window，Node中是global
    context = global
  }

  // 临时增加函数
  context[fnName] = this
  // 然后调用
  const ret = context[fnName](...args)
  // 删除临时函数
  delete context[fnName]

  return ret
}
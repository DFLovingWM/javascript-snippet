Function.prototype.myBind = function (context, ...args) {
  const fn = this
  const newFn = function (...restArgs) {
    // 判断新函数是通过new调用、还是普通调用
    return fn.apply(this instanceof newFn ? this : context, args.concat(restArgs))
  }

  // （如果是new调用，）继承原函数的原型，以访问原构造函数上的原型的属性
  // 这里涉及到【继承】的知识
  // newFn.prototype = fn.prototype // 这种方式也行，但是修改newFn的原型，即是修改fn原型
  newFn.prototype = Object.create(fn.prototype) // 改用继承

  return newFn
}
const { Dep } = require('./dep');

// 观察者类
class Observer {
  value = null;
  dep = null;

  constructor (value) {
    this.value = value;
    this.dep = new Dep();

    if (Array.isArray(value)) { // 数组类型
      observeArray(value);
    } else if (isPlainObject(value)) { // 纯对象类型
      observeObject(value);
    }
  }
}

// 将obj转变为响应式
function observe (obj) {
  return new Observer(obj);
}

// 劫持数组
function observeArray (arr) {
  for (let i = 0; i < arr.length; ++i) {
    observe(arr[i]); // 递归
  }
}

// 劫持纯对象
function observeObject (obj) {
  for (const key of Object.keys(obj)) {
    defineReactive(obj, key);
  }
}

// 劫持纯对象的边（属性）
function defineReactive (obj, key) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  if (!descriptor.configurable) return // 属性不可配置，没办法劫持

  const getter = descriptor.get; // 旧的getter
  const dep = new Dep(); // 每个属性配一个Dep
  let value = getter.call(obj);
  const childOb = observe(value); // 先劫持值对象

  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: true,
    get () {
      const res = getter.call(obj);
      if (Dep.target) {
        dep.depend(); // 被某视图读取时，进行依赖收集
      }
      return res;
    },
    set (newVal) {
      const oldVal = obj[key];
      if (newVal === oldVal) return; // 设置相等的值，不必触发更新
      
      // 当新值是个对象类型，还需要劫持它
      observe(newVal);
      dep.notify();
    }
  })
}

// 数组：定义新原型，继承Array.prototype
const arrayMiddlePrototype = Object.create(Array.prototype);
['push', 'pop', 'splice', 'unshift', 'shift', 'sort', 'reverse'].forEach(method => {
  arrayMiddlePrototype[method] = function (...args) {
    const res = this[method](...args);
    const ob = this.__ob__;
    let inserted
    switch (method) {
      case 'push':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2);
        break;
    }
    // 如果有新增的元素，则劫持它们
    if (inserted) {
      observeArray(inserted);
    }
    // 触发视图更新
    ob.dep.notify();
    return res;
  }
})

module.exports = observe;
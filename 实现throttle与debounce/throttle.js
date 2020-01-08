/**
 * 节流：timeout实现
 */
function throttle (fn, wait = 1000, { leading = true, trailing = true }) {
  let timer = null // 当前定时器
  let prev = 0 // 上一次执行的时间戳
  let context, inArgs, outArgs // 上下文、入参、出参（拉出来作为全局变量，是为了可以更新）
  
  function throttled (...args) {
    const now = Date.now()

    // 初始化prev
    if (prev === 0 && !leading) prev = now

    // 始终更新到最新一次调用的入参与上下文
    context = this
    inArgs = args

    if (now >= prev + wait || now < prev) { // 超越间隔 => 立即执行
      // 稀有情况：
      // 当trailing模式下、now === prev + wait、并且优先于定时器时
      // 为了防止连续执行2个，随便选1个执行即可
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      invokeAtOnce()
    } else if (!timer && trailing) { // 不足间隔、但trailing => 执行延迟任务
      const remaining = wait - (now - prev)
      invokeLater(remaining)
    }

    return outArgs // 将出参返回（但可能是上一次的结果）
  }

  // 立即执行
  function invokeAtOnce () {
    prev = Date.now()
    outArgs = fn.apply(context, inArgs)
  }

  // 延迟执行
  function invokeLater (delay) {
    timer = setTimeout(() => {
      timer = null
      prev = Date.now()
      outArgs = fn.apply(context, inArgs)
    }, delay)
  }

  // 取消钩子，主要是重置所有全局参数
  throttled.cancel = function () {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    prev = 0
    context = inArgs = outArgs = undefined
  }

  return throttled
}

function throttle (func, wait, options) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhh')
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};

module.exports = throttle
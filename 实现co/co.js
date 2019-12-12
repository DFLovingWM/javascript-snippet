module.exports = function co (generatorFunction) {
  const generator = generatorFunction()
  return new Promise((resolve, reject) => {

    function resolveNext (currResult) {
      let generatorResult
      try {
        generatorResult = generator.next(currResult)
        process(generatorResult)
      } catch (e) {
        reject(e) // 来到这里，表示用户代码出现了非Promise异常，并且没有被catch
      }
    }

    function rejectNext (currError) {
      let generatorResult
      try {
        generatorResult = generator.throw(currError)
        process(generatorResult)
      } catch (e) {
        reject(e) // 来到这里，表示上面抛给用户代码的Promise异常没有被catch
      }
    }

    function process (generatorResult) {
      // 递归终止条件：return，将return的值作为整体Promise的值返回
      if (generatorResult.done) {
        resolve(generatorResult.value)
        return
      }

      const promise = generatorResult.value
      if (!isPromise(promise)) {
        reject('Must yield a promise.')
        return
      } else {
        promise
          .then(resolveNext) // 子Promise成功后，接着下一个子Promise（递归）
          .catch(rejectNext) // 任意一个子Promise报错，整体Promise就报错
      }
    }

    resolveNext() // 启动！
  })
}

function isPromise (value) {
  const t = Object.prototype.toString.call(value)
  return t.slice(8, t.length - 1) === 'Promise'
}
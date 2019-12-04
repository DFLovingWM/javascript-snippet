function Koa () {
  this.fns = []
}

Koa.prototype.use = function (fn) {
  this.fns.push(fn)
}

// go实现1
// Koa.prototype.go = function (ctx) {
//   // 递归
//   const dispatch = i => {
//     if (i === this.fns.length) return
//     this.fns[i].call(this, ctx, () => {
//       dispatch(i + 1)
//     })
//   }

//   dispatch(0)
// }

// go实现2
Koa.prototype.go = function (ctx) {
  const done = () => {}
  const executor = this.fns.reduceRight((acc, fn) => {
    return () => {
      fn.call(this, ctx, acc)
    }
  }, done)

  executor()
}

module.exports = Koa
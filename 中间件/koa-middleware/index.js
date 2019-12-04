const Koa = require('./Koa')
const app = new Koa()

app.use((ctx, next) => {
  console.log('before 赋予年龄', ctx)
  ctx.age = 10
  next()
  console.log('after 赋予年龄', ctx)
})

app.use((ctx, next) => {
  console.log('before 赋予爱好', ctx)
  ctx.hobby = 'basketball'
  next()
  console.log('after 赋予爱好', ctx)
})

app.go({
  name: 'JK'
})
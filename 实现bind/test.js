require('./bind');

function adder (a, b) {
  console.log(this.id)
  this.a = a
  this.b = b
}

adder.prototype.name = 'Calculator'

const c1 = {
  id: 1
}

const boundAdder = adder.myBind(c1)
let c2 = new boundAdder(1, 2) // 用new调用
console.log('c1:', c1)
console.log('c2:', c2)
console.log(c2.name)
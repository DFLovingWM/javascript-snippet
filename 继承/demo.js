const Human = require('./entity/Human')
const Student = require('./entity/Student')

const jk = new Student('1', 'JK', 100)
jk.sayName()
jk.showScore()
console.log(jk)
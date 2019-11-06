const instanceOf = require('./instanceOf');

function Human (id, name) {
  this.id = id
  this.name = name
}

Human.prototype.play = function () {
  console.log(this.name + '玩')
}

function Student (id, name, score) {
  Human.call(this, id, name)
  this.score = score
}

Student.prototype = Object.create(Human.prototype)
Student.prototype.constructor = Student
Student.prototype.exam = function () {
  console.log(this.name + '考试')
}

const jk = new Student('1', 'JK', '99')
const cl = new Student('1', 'CL', '100')
// console.log(jk instanceof null)
console.log(jk instanceof Object)
console.log(jk instanceof Human)
console.log(jk instanceof Student)

// console.log(instanceOf(jk, null))
console.log(instanceOf(jk, Object))
console.log(instanceOf(jk, Human))
console.log(instanceOf(jk, Student))

//

console.log(Array.prototype instanceof Array)
console.log(instanceOf(Array.prototype, Array))
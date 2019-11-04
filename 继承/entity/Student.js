const Human = require('./Human')
const inherit = require('../util/inherit-v2')

/**
 * 学生类
 */
function Student (id, name, score) {
  Human.call(this, id, name)
  this.score = score
}

inherit(Student, Human)

Student.prototype.showScore = function () {
  console.log(`So sad to get ${this.score} points...`)
}

module.exports = Student

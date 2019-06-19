const Human = require('./Human')
// const inherit = require('../util/inherit')
const inherit = require('../util/inherit2')

/**
 * 学生类
 */
function Student (id, name, classId) {
  Human.call(this, id, name)
  this.classId = classId
}

// 继承自Human
inherit(Student, Human)

Object.assign(Student.prototype, {
  goToSchool () {
    console.log(`${this.name}上学，进入${this.classId}班`)
  },
  
  leaveSchool () {
    console.log(`${this.name}放学啦，离开${this.classId}班`)
  }
})

module.exports = Student

/**
 * 该文件不用管，用来copy到浏览器执行、以查看原型链用的
 */

/**
 * 人 类
 */
function Human (id, name) {
  this.id = id
  this.name = name
}

Object.assign(Human.prototype, {
  eat (sth = '东西') {
    console.log(`${this.name}吃${sth}`)
  },

  sleep () {
    console.log(`${this.name}睡觉`)
  }
})

/**
 * 学生类
 */
function Student (id, name, classId) {
  Human.call(this, id, name)
  this.classId = classId
}

// 继承自Human
inherit2(Student, Human)

Object.assign(Student.prototype, {
  goToSchool () {
    console.log(`${this.name}上学了...`)
  },
  
  leaveSchool () {
    console.log(`${this.name}放学啦！`)
  }
})

function inherit (subClass, superClass) {
  subClass.prototype = objectCreate(superClass.prototype) // 继承
  // subClass.prototype.constructor = subClass // 调整构造器的指向

  // 构造器上的继承(ES6额外步骤)
  Object.setPrototypeOf(subClass, superClass)
}

function inherit2 (subClass, superClass) {
  // 原型上的继承
  Object.setPrototypeOf(subClass.prototype, superClass.prototype)

  // 构造器上的继承(ES6额外步骤)
  Object.setPrototypeOf(subClass, superClass)
}

function objectCreate (proto, descriptorObj) {
  var F = function () {}
  F.prototype = proto // 链接在同一原型链上
  var ret = new F()

  if (descriptorObj) {
    Object.defineProperties(ret, descriptorObj)
  }

  return ret // 最终要的是对象，说明F只是临时的构造器
}

var alice = new Student(1, 'alice', 9)
alice
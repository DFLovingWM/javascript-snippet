function Person (name, age) {
  this.id = ++Person.id
  this.name = name
  this.age = age
}

Person.id = 0

Person.prototype.introduce = function () {
  console.log(`Hello, my name is ${this.name}. I am ${this.age}.`)
}

module.exports = Person
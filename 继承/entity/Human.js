/**
 * 人
 */
function Human (id, name) {
  this.id = id
  this.name = name
}

Human.prototype.sayName = function () {
  console.log('Hello, my name is ' + this.name)
}

module.exports = Human

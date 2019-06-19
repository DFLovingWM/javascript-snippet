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

module.exports = Human

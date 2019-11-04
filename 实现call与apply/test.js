function sayName () {
  console.log(`I'm ${this.name}`)
}

const jk = {
  name: 'JK',
  age: 10
}

sayName.call(jk)
sayName.call(undefined)
sayName.call(null)

require('./call')
sayName.myCall(jk)
sayName.myCall(undefined)
sayName.myCall(null)
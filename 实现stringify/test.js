const stringify = require('./stringify');

const obj = {
  name: 'JK',
  age: 12,
  phone: ['18819481197', 18819481197],
  phone2: new Number(10086),
  handsome: new Boolean(true)
}

console.log(JSON.stringify(obj))
console.log(stringify(obj))
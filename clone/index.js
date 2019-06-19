const { deepCloneByRecursion: deepClone } = require('./deepClone')

let alice = {
  name: 'Alice',
  age: 10,
  isAdult: false,
  x: undefined,
  y: null,
  secret: Symbol.for(`Alice's secret`)
}

let papa = {
  name: 'papa',
  age: 30
}

let mama = {
  name: 'mama',
  age: 32
}

alice.friends = [papa, mama]

let alice2 = deepClone(alice)

console.log('alice => ', alice)
console.log('alice2 => ', alice2)
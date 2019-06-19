const assert = require('assert')
const {
  deepCloneByRecursion,
  deepCloneByIteration: deepClone
} = require('./deepClone')

describe('测试', () => {
  let arya
  let arya2

  beforeEach(() => {
    arya = {
      firstName: 'Arya',
      lastName: 'Stark',
      age: NaN,
      isAdult: false,
      x: undefined,
      y: null,
      secret: Symbol.for(`Alice's secret`),

      sayName () {
        return this.firstName
      },
      get fullName () {
        return this.firstName + ' ' + this.lastName
      },

      deadList: ['Cersey', 'Mountain', 'Malin Trant'],
      teacher: {
        name: 'Serio',
        from: 'Bravos'
      },
      friends: [{
        name: 'Pie',
        age: 17
      }, {
        name: 'Gendry',
        age: 19
      }, {
        name: 'Jarkun',
        age: Infinity
      }],
    }

    arya.self = arya

    arya2 = deepClone(arya)
  })

  it('基本类型', () => {
    assert(arya2.hasOwnProperty('x') && arya2.x === undefined)
    assert(Number.isNaN(arya2.age))
    assert(arya2.secret === Symbol.for(`Alice's secret`))
  })

  it('getter和方法', () => {
    assert(arya2.fullName === 'Arya Stark')
    assert(arya2.sayName() === 'Arya')
  })

  it('引用类型', () => {
    assert(arya2.deadList !== arya.deadList && arya2.deadList.every((item, index) => item === arya.deadList[index]))
    assert(arya2.teacher !== arya.teacher && arya2.teacher.name === arya.teacher.name)
    let pie = arya.friends.find(item => item.name === 'Pie')
    let pie2 = arya2.friends.find(item => item.name === 'Pie')
    assert(arya2.friends !== arya.friends && pie !== pie2 && pie.name === pie2.name)
  })

  it('循环引用', () => {
    assert(arya2.self === arya2)
    assert(arya2.self !== arya.self)
    assert(arya2.self.self.self.fullName === 'Arya Stark')
  })
})
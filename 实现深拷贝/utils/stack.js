module.exports = class Stack {
  constructor (arr = []) {
    this.arr = arr
  }

  push (n) {
    this.arr.push(n)
  }

  pop () {
    return this.arr.pop()
  }

  top () {
    return this.arr[this.arr.length - 1]
  }

  isEmpty () {
    return this.arr.length === 0
  }
}

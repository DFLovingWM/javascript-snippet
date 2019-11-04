const curry = require('./curry-v2');

function add (a, b, c) {
  console.log(a + b + c)
}

add = curry(add)

add(1,2,3)
add(1)(2)(3)
add(1,2)(4)
add(1)(2,4)
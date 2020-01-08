const curry = require('./curry');

var add = curry((a, b, c) => a + b + c);

var add3 = add(1, 2);
var add4 = add(4);

console.log(add3(10)); // 13
console.log(add4(14, 6)); // 24
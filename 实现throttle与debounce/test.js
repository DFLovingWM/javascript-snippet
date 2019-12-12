// const {
//   throttle,
//   debounce,
// } = require('./underscore');
const throttle = require('./throttle');
const debounce = require('./debounce');

const log = sth => {
  console.log('Log:', sth)
}

const throttleLog = throttle(log, 1000, { leading: true, trailing: false })
const debounceLog = debounce(log, 1000, false)

const readline = require('readline')
readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}).on('line', line => {
  // throttleLog(line)
  debounceLog(line)
})

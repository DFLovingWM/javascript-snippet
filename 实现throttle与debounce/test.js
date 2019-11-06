const throttle = require('./throttle');
const debounce = require('./debounce');

function log (sth) {
  console.log('Log: ' + sth)
}

const log2 = throttle(log, 2000)
const log3 = debounce(log, 1000)

const readline = require('readline')
readline.createInterface({
  input: process.stdin,
  output: process.stdout,
}).on('line', line => {
  log3(line)
})

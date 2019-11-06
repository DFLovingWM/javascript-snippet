const { getSurrogates } = require('./Surrogate')

/**
 * 字符 => 代理对字符串表示
 * @param {String} rawChar 字符
 * @returns {String} 该字符的代理对字符串表示
 */
function getSurrogatesStr (rawChar) {
  return getSurrogates( rawChar.codePointAt(0) ).map( n => `\\u{${n.toString(16)}}` ).join('')
}

/**
 * 字符 => 码点字符串表示
 * @param {String} rawChar 字符
 * @returns {String} 该字符的码点字符串表示
 */
function getCodePointStr (rawChar) {
  return `\\u{${rawChar.codePointAt(0).toString(16)}}`
}

function at (string, position) {
  return string[position]
}

module.exports = {
  getSurrogatesStr,
  getCodePointStr
}

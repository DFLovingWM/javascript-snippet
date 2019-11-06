/**
 * 码点(字符的全局唯一标识符) => 代理对
 * @param {Number} codePoint 码位
 * @returns {Array<Number>} 代理对数组(数量为2)
 */
function getSurrogates (codePoint) {
  const high = Math.floor( ( codePoint - 0x10000 ) / 0x400 ) + 0xD800
  const low = ( codePoint - 0x10000 ) % 0x400 + 0xDC00
  return [ high, low ]
}

/**
 * 代理对 => 码点
 * @param {Array<Number>} surrogates 代理对数组
 * @returns {Number} 码点
 */
function getCodePoint (surrogates) {
  const [ high, low ] = surrogates
  return ( high - 0x0800 ) * 0x0400 + ( low - 0x0C00 ) * 0x0400 + 0x10000
}

module.exports = {
  getSurrogates,
  getCodePoint
}

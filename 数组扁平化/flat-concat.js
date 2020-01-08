/**
 * 数组拍平（利用concat实现）
 * @param {Array} arr 原数组
 * @returns {Array} 新数组(一维)
 */
module.exports = function flat (arr) {
  // 思路：每次拍平一层，直到所有元素都不是数组为止
  while (arr.some(Array.isArray)) {
    arr = flatOne(arr);
  }
  return arr;
};

// 拍平1层
function flatOne (arr) {
  return [].concat(...arr)
}
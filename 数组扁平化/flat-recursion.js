/**
 * 数组拍平（递归实现）
 * @param {Array} arr 原数组
 * @returns {Array} 新数组(一维)
 */
module.exports = function flat (arr) {
  if (!Array.isArray(arr)) { // 递归终止条件
    return [arr];
  }

  let res = [];
  for (const x of arr) {
    res = res.concat(x);
  }
  return res;
};
/**
 * 数组拍平（前序遍历实现）
 * @param {Array} arr 原数组
 * @returns {Array} 新数组(一维)
 */
module.exports = function flat (arr) {
  const res = []; // 作为“全局”变量，保存遍历结果

  function preOrder (arr) {
    if (!Array.isArray(arr)) { // 递归终止条件
      res.push(arr);
      return;
    }
    
    for (const x of arr) {
      preOrder(x);
    }
  }

  preOrder(arr);
  return res;
};
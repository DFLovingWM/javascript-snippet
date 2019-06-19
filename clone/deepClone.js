const Stack = require('./utils/stack')
const Queue = require('./utils/queue')
const getType = require('./utils/type')

/**
 * 递归版本：
 * 需要借助 WeakMap 克服循环引用问题
 */
function deepCloneByRecursion (src, hash = new WeakMap()) {
  let type = getType(src)
  if (!['Object', 'Array'].includes(type)) {
    // 不是Object/Array类型，直接返回
    return src
  }

  if (hash.has(src)) {
    // 解决循环引用的关键之处：
    // 如果发现该src拷贝过，则直接返回其拷贝dest
    return hash.get(src)
  }

  let dest

  if (type === 'Array') {
    dest = []
    hash.set(src, dest) // 记录映射
    for (let i = 0; i < src.length; ++i) {
      if (src.hasOwnProperty(i)) { // 数组可能中间缺了下标（当然也可以不用考虑）
        dest[i] = deepCloneByRecursion(src[i], hash)
      }
    }
  } else {
    dest = {}
    hash.set(src, dest) // 记录映射
    for (const key of Reflect.ownKeys(src)) { // 使用`Reflect.ownKeys`来遍历对象
      dest[key] = deepCloneByRecursion(src[key], hash)
    }
  }
  
  return dest
}


/**
 * 循环版本，元思路：
 * 为了避免爆栈，考虑将递归转化为循环：
 * 递归是对一个`Tree`进行`DFS`，
 * 则可以用循环对其`BFS`
 */
function deepCloneByIteration (srcObject, mapping = new WeakMap()) {
  // 这里设置dummy结点的原因是：
  // 将根根结点设置为 Object 类型，不必再进行判断
  const srcDummy = { root: srcObject }
  const destDummy = {}

  const queue = new Queue()
  queue.push(new Node(srcDummy, destDummy, 'root', srcObject))

  while (!queue.empty()) {
    const { srcParent, destParent, key, srcCurrent } = queue.pop()

    // 如果已经遍历过了（表明有循环引用），则直接赋值，不必继续探索该结点
    if (mapping.has(srcCurrent)) {
      destParent[key] = mapping.get(srcCurrent)
      continue
    }

    const type = getType(srcCurrent)
    if (type === 'Object') {
      // 目标结点增加子结点（对象类型），此时还“没有内容”
      const destCurrent = {}
      destParent[key] = destCurrent
      // 建立映射，解决循环引用
      mapping.set(srcCurrent, destCurrent)
      // 源结点发散
      for (const k of Reflect.ownKeys(srcCurrent)) {
        queue.push(new Node(srcCurrent, destCurrent, k, srcCurrent[k]))
      }
    } else if (type === 'Array') {
      // 目标结点增加结点（数组类型），此时也是“空”的
      const destCurrent = []
      destParent[key] = destCurrent
      // 建立映射，解决循环引用
      mapping.set(srcCurrent, destCurrent)
      // 源结点发散
      for (let i = 0; i < srcCurrent.length; ++i) {
        if (srcCurrent.hasOwnProperty(i)) {
          queue.push(new Node(srcCurrent, destCurrent, i, srcCurrent[i]))
        }
      }
    } else {
      destParent[key] = srcCurrent // 基础类型，直接赋值。此时已结束，不必发散
    }
  }

  return destDummy.root
}

/**
 * BFS基础结点类型（重要！）
 * @param {Object|Array} srcParent 源父结点
 * @param {Object|Array} destParent 目标父结点（与srcParent对应）
 * @param {string} key 键
 * @param {Object|Array} srcCurrent 源当前结点
 */
function Node (srcParent, destParent, key, srcCurrent) {
  this.srcParent = srcParent
  this.destParent = destParent
  this.key = key
  this.srcCurrent = srcCurrent
}

module.exports = {
  deepCloneByRecursion,
  deepCloneByIteration
}
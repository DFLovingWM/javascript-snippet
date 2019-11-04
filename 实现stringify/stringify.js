/**
 * 序列化
 */
function stringify (src, visit = new Set()) {
  if (typeof src === 'string') { // 字符串要特殊判断，加上双引号
    return '"' + src + '"'
  } else if (isBasicType(src)) { // 基本类型，直接返回其字符串
    return String(src)
  } else if (isBoxType(src)) { // 包装类型，也当作基本类型返回
    return src.valueOf()
  }

  // ==================== 以下是（广义）对象类型 ====================

  // 检查循环引用
  if (visit.has(src)) {
    throw new Error('循环引用')
  }

  // 尝试沿用`toJSON`
  if (src.toJSON) {
    return src.toJSON()
  }

  if (Array.isArray(src)) { // 数组类型
    const res = []
    visit.add(src)
    for (let i = 0; i < src.length; ++i) {
      if (isInvalid(src[i])) {
        res.push(String(null)) // 非序列化的值，在数组中转为null（丢弃的话会影响顺序）
      } else {
        res.push(stringify(src[i], visit)) // 值
      }
    }
    return '[' + res.join(',') + ']'
  } else { // 对象类型
    const res = []
    visit.add(src)
    for (const key of Object.keys(src)) {
      if (!isInvalid(src[key])) { // 非序列化的值，在对象中直接丢弃
        res.push(`"${key}":${stringify(src[key], visit)}`) // 键 + 值
      }
    }
    return '{' + res.join(',') + '}'
  }
}

// 判断变量是否属于基本类型
function isBasicType (value) {
  const type = typeof value
  return type === null || ['undefined', 'boolean', 'number', 'string'].includes(type)
}

// 判断是否是（那3个）包装类型
function isBoxType (value) {
  let type = Object.prototype.toString.call(value)
  type = type.slice(8, type.length - 1)
  return ['Boolean', 'Number', 'String'].includes(type)
}

// 判断类型是否为不可序列化的
function isInvalid (value) {
  return ['undefined', 'symbol', 'function'].includes(typeof value)
}

module.exports = stringify
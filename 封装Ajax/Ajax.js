function Ajax () {}

// 获取一个通用的XHR对象
function getXHR (resolve, reject) {
  let xhr
  if (window.XMLHttpRequest) { // 一般情况
    xhr = new XMLHttpRequest()
  } else { // 浏览器版本 <= IE6
    xhr = new ActiveXObject('Microsoft.XMLHttp')
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status >= 200 && xhr.status < 300) { // 2xx表示成功
        try {
          const data = JSON.parse(xhr.responseText)
          resolve(data)
        } catch (e) {
          reject(e)
        }
      } else {
        reject('请求错误，状态码：' + xhr.status)
      }
    }
  }
  xhr.onerror = function (e) {
    reject(e)
  }
  return xhr
}

/**
 * 格式化参数
 * @param {Object} data 参数对象
 * @returns {string} 参数字符串(query string格式)
 */
function formatParam (data) {
  let res = ''
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) { // 如果值是数组
      for (const val of value) {
        if (res) res += '&'
        res += encodeURIComponent(key) + '=' + encodeURIComponent(val)
      }
    } else {
      if (res) res += '&'
      res += encodeURIComponent(key) + '=' + encodeURIComponent(data[key])
    }
  }
  return res
}

// 参数在URL path中
['get', 'delete'].forEach(action => {
  Ajax.prototype[action] = function (url, query) {
    return new Promise((resolve, reject) => {
      const xhr = getXHR(resolve, reject)
      const queryString = formatParam(query)
      xhr.open(action.toUpperCase(), url + '?' + queryString, true)
      xhr.send()
    })
  };
})

// 参数在body中
['post', 'put'].forEach(action => {
  Ajax.prototype[action] = function (url, body) {
    return new Promise((resolve, reject) => {
      const xhr = getXHR(resolve, reject)
      const bodyString = formatParam(query)
      xhr.open(action.toUpperCase(), url, true)
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      xhr.send(bodyString)
    })
  }
})

// 跨域：JSONP
Ajax.prototype.jsonp = function (url, query) {
  
}

module.exports = Ajax
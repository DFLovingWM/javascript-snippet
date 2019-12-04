const Ajax = require('./Ajax')

var ajax = new Ajax()
ajax.get(`http://www.mocky.io/v2/5dde1f692f0000fe637eacf3`).then(data => {
  console.log('响应：' + data)
})
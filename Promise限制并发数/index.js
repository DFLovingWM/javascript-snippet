require('./api')

function delay (wait) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, wait * 1000)
  })
}

async function getData (n) {
  await delay(1)
  return `#{${n}}`
}

async function main () {
  const arr = Array.from({ length: 10 }, (_, i) => i)
  const t = Date.now()
  const res = await Promise.map(arr, getData, 3)
  console.log( (Date.now() - t) / 1000, '秒' )
  console.log(res)
}

main()
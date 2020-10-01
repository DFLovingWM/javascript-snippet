/**
 * 考察输出顺序
 */

console.log("script start");

async function async1() {
  await async2();
  console.log("async1 end");
  await 1;
  console.log('last')
}

async function async2() {
  console.log("async2 end");
}

async1();

setTimeout(function () {
  console.log("setTimeout");
}, 0);

new Promise(resolve => {
  console.log("Promise");
  resolve();
})
.then(function () {
  console.log("promise1");
})
.then(function () {
  console.log("promise2");
});

console.log("script end");

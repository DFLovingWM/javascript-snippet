// new Promise(resolve => {
//   resolve(1);
  
//   Promise.resolve().then(() => {
//       // t2
//       console.log(2)
//   });
//   console.log(4)
// }).then(t => {
//   // t1
//   console.log(t)
// });
// console.log(3);

new Promise(resolve => {
  resolve(1);

  new Promise(r => r(0)).then(() => {
    console.log(2)
  })

  console.log(4)
}).then(t => {
  // t1
  console.log(t)
});
console.log(3);
const compose = (...func) => {
  // 从最后一个往前执行
  return func.reduce((f1, f2) => (val) => f1(f2(val)));
};

// const add1 = (val) => {
//   return val + "1";
// };

// const add2 = (val) => {
//   return val + "2";
// };

// const add3 = (val) => {
//   return val + "3";
// };

// console.log(compose(add1, add2, add3)("hello"));

export default compose;

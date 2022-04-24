const compose = require("lodash.compose");

const _compose = (...func) => {
  return func.reduce((f1, f2) => (val) => f1(f2(val)));
};

function add1(val) {
  return val + 1;
}

function add2(val) {
  return val + 2;
}

function add3(val) {
  return val + 3;
}

const fn = compose(add1, add2, add3);
const fn1 = _compose(add1, add2, add3);
console.log(fn(1));
console.log(fn1(1));

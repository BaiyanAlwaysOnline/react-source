function* log1(val) {
  console.log(1);
  console.log(2);
  const res = yield val + 1;
  yield* log2(res);
}
function* log2(val) {
  yield "a" + val;
  yield "b";
}

/**
 * redux-saga的实现原理
 * https://www.npmjs.com/package/co
 */
function co(gen, params) {
  const it = gen(params);
  let res;
  function next(value) {
    res = it.next(value);
    console.log(res);
    if (!res.done) {
      next(res.value);
    }
  }
  next();
}

co(log1, 3);

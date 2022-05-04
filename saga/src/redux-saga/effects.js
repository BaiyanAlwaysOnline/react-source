import * as effectTypes from "./effectTypes.js";

// effect其实就是actionCreators

export function take(actionType) {
  return { type: effectTypes.TAKE, actionType };
}

export function put(action) {
  return { type: effectTypes.PUT, action };
}

function delayP(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

// export function delay(delay) {
//   return { type: effectTypes.DELAY, delay };
// }

// 复用call
export function delay(ms) {
  return call(delayP, ms);
}

export function call(fn, ...args) {
  return { type: effectTypes.CALL, fn, args };
}

export function cps(fn, ...args) {
  return { type: effectTypes.CPS, fn, args };
}

export function fork(saga) {
  return { type: effectTypes.FORK, saga };
}

/**
 * 开启多个任务，互不干扰
 * @param {*} actionType
 * @param {*} saga
 * @returns
 */
export function takeEvery(actionType, saga) {
  function* takeEverySaga() {
    while (true) {
      yield take(actionType);
      // 每次fork都会创建一个新的迭代器
      yield fork(saga);
    }
  }
  return fork(takeEverySaga);
}

export function all(effects) {
  return { type: effectTypes.ALL, effects };
}

export function cancel(task) {
  return { type: effectTypes.CANCEL, task };
}

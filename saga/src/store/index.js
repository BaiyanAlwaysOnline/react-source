import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "../redux-saga";
import {
  take,
  takeEvery,
  put,
  delay,
  call,
  cps,
  all,
  fork,
  cancel,
} from "../redux-saga/effects";

// import saga from "./saga.js";

export const COUNTER_ADD = "COUNTER_ADD";
export const ASYNC_COUNTER_ADD = "ASYNC_COUNTER_ADD";
export const COUNTER_MINUS = "COUNTER_MINUS";
export const COUNTER_SET = " COUNTER_SET";

const counter = (state = { num: 0 }, action) => {
  switch (action.type) {
    case COUNTER_ADD:
      return { num: state.num + 1 };
    case COUNTER_MINUS:
      return { num: state.num - 1 };
    case COUNTER_SET:
      return action.payload;
    default:
      return state;
  }
};

// function fetchOper(ms = 1000) {
//   return new Promise((res) => setTimeout(() => res("fetchOper OK"), ms));
// }

// function* add() {
//   const res = yield call(fetchOper, 600);
//   console.log(res);
//   yield put({ type: COUNTER_ADD }); // 让中间件帮我们派发一个 {type: COUNTER_ADD} 的action
// }

// function* saga() {
//   for (let i = 0; i < 3; i++) {
//     yield take(ASYNC_COUNTER_ADD); // 等待用户向仓库派发一个ASYNC_COUNTER_ADD的action {type: 'TAKE', actionType: 'ASYNC_COUNTER_ADD'}
//     yield delay(1000); // 延迟一秒
//     yield add();
//   }
// }

// function* saga() {
//   yield takeEvery(ASYNC_COUNTER_ADD, add); // 无限累加
// }

// function* add1() {
//   for (let i = 0; i < 3; i++) {
//     yield take(ASYNC_COUNTER_ADD); // 等待用户向仓库派发一个ASYNC_COUNTER_ADD的action {type: 'TAKE', actionType: 'ASYNC_COUNTER_ADD'}
//     yield delay(1000); // 延迟一秒
//     yield put({ type: COUNTER_ADD });
//   }
//   return "add1-val";
// }

// function* add2() {
//   for (let i = 0; i < 3; i++) {
//     yield take(ASYNC_COUNTER_ADD); // 等待用户向仓库派发一个ASYNC_COUNTER_ADD的action {type: 'TAKE', actionType: 'ASYNC_COUNTER_ADD'}
//     yield delay(1000); // 延迟一秒
//     yield put({ type: COUNTER_ADD });
//   }
//   return "add2-val";
// }

// function* saga() {
//   const res = yield all([add1, add2]); // 无限累加
//   console.log("root saga done", res);
// }

function* add() {
  while (true) {
    yield take(ASYNC_COUNTER_ADD); // 等待用户向仓库派发一个ASYNC_COUNTER_ADD的action {type: 'TAKE', actionType: 'ASYNC_COUNTER_ADD'}
    yield put({ type: COUNTER_ADD });
  }
}

function* saga() {
  const task = yield fork(add); // 无限累加
  yield take("CANCEL_ADD");
  yield cancel(task);
  console.log("生活还要继续");
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(counter, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(saga);

export default store;

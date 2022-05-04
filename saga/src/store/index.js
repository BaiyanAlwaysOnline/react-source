import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "../redux-saga";
import { take, put, delay } from "../redux-saga/effects";

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

function* saga() {
  for (let i = 0; i < 3; i++) {
    yield take(ASYNC_COUNTER_ADD); // 等待用户向仓库派发一个ASYNC_COUNTER_ADD的action {type: 'TAKE', actionType: 'ASYNC_COUNTER_ADD'}
    yield delay(1000); // 延迟一秒
    yield put({ type: COUNTER_ADD }); // 让中间件帮我们派发一个 {type: COUNTER_ADD} 的action
  }
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(counter, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(saga);

export default store;

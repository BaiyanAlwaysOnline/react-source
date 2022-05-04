import { take, put, delay, takeEvery } from "redux-saga/effects";
/**
 * 1.根saga
 * 2.watcher saga 监听
 * 3.worker saga 具体做什么
 */
function* rootSaga() {
  yield watcherSaga();
}

function* watcherSaga() {
  yield takeEvery("ASYNC_COUNTER_ADD", asyncAdd);
}

function* asyncAdd() {
  yield delay(1000);
  yield put({ type: "COUNTER_ADD" });
}

export default rootSaga;

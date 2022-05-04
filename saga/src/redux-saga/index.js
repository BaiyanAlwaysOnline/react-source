import runSaga from "./runSaga.js";
import stdChannel from "./channel.js";

function createSagaMiddleware() {
  const channel = stdChannel();
  let bundRunSaga;
  const sagaMiddleware = ({ dispatch, getState }) => {
    // ! 这里bind的用法注意记忆下
    // ! 使用 bind 创建新的函数，并且保存middlewareAPI（put触发真正的store.dispatch）和channel单例（保证take的事件和用户dispatch后触发的put使用的是一个channel）
    bundRunSaga = runSaga.bind(null, { channel, dispatch, getState });
    return (next) => (action) => {
      next(action);
      channel.put(action.type);
    };
  };
  sagaMiddleware.run = (saga) => {
    bundRunSaga(saga);
  };
  return sagaMiddleware;
}

export default createSagaMiddleware;

import * as effectTypes from "./effectTypes.js";

function runSaga(env, saga) {
  const { channel, getState, dispatch } = env;
  // 执行generate函数，生成迭代器
  const it = saga();
  function next(args) {
    const { value, done } = it.next(args);
    if (!done) {
      switch (value.type) {
        case effectTypes.TAKE:
          // once订阅，阻塞流程
          // ? generate函数阻塞流程，可以恢复，是怎么做到的，背后原理是什么？
          channel.take(value.actionType, next);
          break;
        case effectTypes.PUT:
          dispatch(value.action);
          next();
          break;
        case effectTypes.DELAY:
          setTimeout(next, value.delay);
          break;
        default:
          break;
      }
    }
  }
  next();
}

export default runSaga;

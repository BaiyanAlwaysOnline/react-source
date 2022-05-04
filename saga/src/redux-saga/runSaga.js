import * as effectTypes from "./effectTypes.js";

function runSaga(env, saga, ctn) {
  const { channel, getState, dispatch } = env;
  // 执行generate函数，生成迭代器
  const it = typeof saga === "function" ? saga() : saga;
  const task = {
    cancel: () => next("TASK_CANCEL"),
  };
  function next(value, isErr) {
    if (value === "TASK_CANCEL") it.return();
    else if (isErr) it.throw(value);
    const { value: effect, done } = it.next(value);
    if (!done) {
      // 如果是一个新的generate函数执行，则返回一个迭代器
      if (typeof effect[Symbol.iterator] === "function") {
        // 新开一个迭代器，类似开启一个新的进程去执行
        runSaga(env, effect);
        // 继续执行当前迭代器
        next();
      } else if (typeof effect.then === "function") {
        // 支持promise异步,如果yield后面接了promise，会卡住主线程
        effect.then(next);
      } else {
        switch (effect.type) {
          case effectTypes.TAKE:
            // once订阅，阻塞流程
            // ? generate函数阻塞流程，可以恢复，是怎么做到的，背后原理是什么？ => 实现generate函数后发现，其实就是个switch case
            channel.take(effect.actionType, next);
            break;
          case effectTypes.PUT:
            dispatch(effect.action);
            // 继续执行当前迭代器
            next();
            break;
          case effectTypes.CALL:
            effect.fn(...effect.args).then(next);
            break;
          case effectTypes.CPS: // Node style cb function
            effect.fn(...effect.args, next);
            break;
          case effectTypes.FORK:
            const task = runSaga(env, effect.saga);
            // 继续执行当前迭代器
            next(task);
            break;
          case effectTypes.ALL: // 类似Promise.all
            const { effects } = effect;
            const res = [];
            let complateIndex = 0;
            effects.forEach((effect, index) =>
              runSaga(env, effect, (value) => {
                res[index] = value;
                // 所有effect执行完成，才走当前的迭代器的next
                if (++complateIndex === effects.length) {
                  next(res);
                }
              })
            );
            break;
          case effectTypes.CANCEL:
            effect.task.cancel();
            // 取消其他的fork任务，当前迭代器继续执行
            next();
          default:
            break;
        }
      }
    } else {
      // 兼容all方法，当所有effects执行完成，continue
      ctn && ctn(effect);
    }
  }
  next();
  return task;
}

export default runSaga;

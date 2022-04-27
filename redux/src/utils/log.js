export const loggerMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    // 先执行，给到用户的dispatch方法
    console.log("loggerMiddleware");
    return next(action);
  };

export const loggerMiddleware1 =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    // 最后一个执行
    // 第一个middleware的next是原生store的dispatch方法
    console.log("loggerMiddleware1");
    return next(action);
  };

// ! 复盘 在思考某个复杂程序的时候，一定要抓住问题的本质，化繁为简，不要纠结于细节，比如这个compose函数，关注他的输入，输出以及函数间的参数传递即可得到结论；
// ! 递归也是如此

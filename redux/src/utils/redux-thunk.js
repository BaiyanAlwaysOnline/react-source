/**
 * ! 加餐 redux-thunk源码分析
 * @param {*} extraArgument
 * @returns
 */
function createThunkMiddleware(extraArgument) {
  const middleware = ({ dispatch, getState }) => (next) => (action) => {
    // 如果传过来的action是个函数，则当前middleware chain终止，并执行action
    // 用户处理完成异步action,用户重新调用dispatch方法，会重新走middleware chain
    if (typeof action === "function") {
      // 这个dispatch是增强过的composed dispatch
      return action(dispatch, getState, extraArgument);
    }
    // Otherwise, pass the action down the middleware chain as usual
    return next(action);
  };
  return middleware;
}

export default createThunkMiddleware();

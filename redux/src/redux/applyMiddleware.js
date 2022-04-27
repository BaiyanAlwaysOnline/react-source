/**
 * store enhancer
 * @param  {...any} middlewares
 */

import compose from "../utils/compose";

/**
 * 
    export const middleware = 
        ({ dispatch, getState }) => 
        (next) => 
        (action) => {
            return next(action);
 *      };
 */

const applyMiddleware =
  (...middlewares) =>
  (createStore) =>
  (reducer) => {
    const store = createStore(reducer);
    let dispatch;
    const middlewareAPI = {
      getState: store.getState,
      // 不能用store的dispatch，必须要走middleware整条链路
      dispatch: (action) => dispatch(action),
    };
    // middleware都是柯里化的，执行并保存API
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    // 返回增强后的store
    return {
      ...store,
      dispatch,
    };
  };

export default applyMiddleware;

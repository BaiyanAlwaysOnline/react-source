// ! 本质：发布订阅  store是一个单例

/**
 * redux是一个js库，可以脱离react使用
 * getState获取最新state
 * dispatch action => reducer => newstate => subsrcibe()
 */
function createStore(reducer, enhancer) {
  // 如果传了enhancer，就是要enhancer去创建store
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }
  let state;
  let listeners = [];
  const getState = () => state;
  const dispatch = (action) => {
    state = reducer(state, action);
    // 当dispatch后，emit
    listeners.forEach((listener) => listener());
  };
  // 订阅 on
  const subscribe = (listener) => {
    listeners.push(listener);
    return () => (listeners = listeners.filter((l) => l !== listener));
  };
  // 初始化state，得到默认state
  dispatch({ type: "@redux/INIT" });
  return {
    getState,
    dispatch,
    subscribe,
  };
}

export default createStore;

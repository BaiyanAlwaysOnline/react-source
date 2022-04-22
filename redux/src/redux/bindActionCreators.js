const bindActionCreator = (actionCreators, dispatch) => {
  return function (...args) {
    dispatch(actionCreators.apply(this, args));
  };
};

/**
 * @param {*} actionCreator
 * @param {*} dispatch
 */
const bindActionCreators = (actionCreators, dispatch) => {
  // 如果actionCreators是一个函数，单独绑定，直接返回
  if (typeof actionCreators === "function") {
    return bindActionCreator(actionCreators, dispatch);
  }

  const boundActionCreators = {};
  for (let key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }

  return boundActionCreators;
};

export default bindActionCreators;

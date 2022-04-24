const combineReducers = (reducers) => {
  // 会过滤掉不为function的reducer
  let finalReducers = {};
  for (let key in reducers) {
    const reducer = reducers[key];
    if (typeof reducer === "function") {
      finalReducers[key] = reducer;
    }
  }

  // 返回一个新的reducer
  return (state, action) => {
    let nextState = {};

    let hasChange = false;

    for (let key in finalReducers) {
      const reducer = finalReducers[key];
      const previousStateForKey = state?.[key];
      nextState[key] = reducer(previousStateForKey, action);
      const nextStateForKey = nextState[key];
      hasChange = hasChange || nextStateForKey !== previousStateForKey;
    }

    // ? 什么情况会出现
    hasChange =
      hasChange ||
      Object.keys(finalReducers)?.length !== Object.keys(nextState)?.length;

    console.log(hasChange, "hasChange");

    // 如果值没有发生改变，就返回旧值
    return hasChange ? nextState : state;
  };
};

export default combineReducers;

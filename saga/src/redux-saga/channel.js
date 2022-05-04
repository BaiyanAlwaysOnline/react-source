function channel() {
  let takers = [];
  function take(actionType, taker) {
    taker.actionType = actionType;
    taker.cancel = () => {
      takers = takers.filter((f) => f !== taker);
    };
    takers.push(taker);
  }
  function put(actionType) {
    // 备份防止cancel时数组塌陷
    const _takers = takers;
    _takers.forEach((taker) => {
      if (actionType === taker.actionType) {
        taker.cancel();
        taker();
      }
    });
  }

  return {
    take,
    put,
  };
}

export default channel;

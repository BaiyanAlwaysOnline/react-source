function createHashHistory() {
  let listeners = [];
  // ! hash自己维护一个栈和index去实现 go goback goforward的效果
  let stack = [];
  let index = -1;
  // 路由传参：每一个location对应一个state，代表当前location的状态，可以用于存放任何信息
  let state = null;
  let action;

  /**
   * @param {*} listener
   * @returns 事件监听移除函数
   */
  const listen = (listener) => {
    listeners.push(listener);
    return () => (listeners = listeners.filter((f) => f !== listener));
  };

  const excuteListen = () => {
    listeners.forEach((f) => f(stack[index]));
    action = null;
    state = null;
  };

  const push = (path, nextState) => {
    if (typeof path === "object") {
      nextState = path.state;
      path = path.pathname;
    }
    state = nextState;
    window.location.hash = path;
  };

  const go = (n) => {
    const idx = index + n;
    const target = stack[idx];
    if (target) {
      index = idx;
      const { pathname, state: nextState } = target;
      state = nextState;
      action = "POP";
      window.location.hash = pathname;
    }
  };

  const goBack = () => {
    go(-1);
  };

  const goForward = () => {
    go(1);
  };

  window.addEventListener("hashchange", () => {
    if (!action) {
      action = "PUSH";
      stack[++index] = { pathname: getHash(), state };
    }
    Object.assign(history, {
      action,
      location: stack[index],
    });
    excuteListen();
  });

  const history = {
    action: "POP",
    location: { pathname: getHash(), state: null },
    go,
    goBack,
    goForward,
    listen,
    push,
    stack,
  };
  window._history = history;
  init();
  return history;
}

// 使用hash路由，如果没有hash默认添加hash
function init() {
  const hash = window.location.hash;
  if (!hash) {
    window.location.hash = "/";
  }
}

function getHash() {
  return window.location.hash.slice(1);
}

export default createHashHistory;

/**
   * action: "PUSH"
     block: ƒ block(prompt)
     createHref: ƒ createHref(location)
     go: ƒ go(n)
     goBack: ƒ goBack()
     goForward: ƒ goForward()
     length: 14
     listen: ƒ listen(listener)
     location: {pathname: '/home', search: '', hash: '', state: {…}, key: 'pi814r'}
     push: ƒ push(path, state)
     replace: ƒ replace(path, state)
   */

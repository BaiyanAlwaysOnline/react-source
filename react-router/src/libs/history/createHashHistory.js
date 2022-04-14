function createHashHistory() {
  const globalHistory = window.history;
  const globaLocation = window.location;
  let listeners = [];
  const go = (n) => globalHistory.go(n);
  const goBack = () => go(-1);
  const goForward = () => go(1);

  /**
   * @param {*} listener
   * @returns 事件监听移除函数
   */
  const listen = (listener) => {
    listeners.push(listener);
    return () => (listeners = listeners.filter((f) => f !== listener));
  };

  const push = (pathname, state) => {
    Object.assign(history.location, {
      state,
      pathname,
    });
    globaLocation.hash = pathname;
  };

  const setState = ({ action, location }) => {
    Object.assign(history, {
      action,
      location,
    });
    listeners.forEach((fn) => fn(location));
  };

  window.addEventListener("hashchange", (e) => {
    const action = "PUSH";
    setState({
      action,
      location: {
        pathname: getHash(),
        state: null,
      },
    });
  });

  const history = {
    action: "POP",
    go,
    goBack,
    goForward,
    listen,
    location: { pathname: getHash(), state: null },
    push,
  };
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

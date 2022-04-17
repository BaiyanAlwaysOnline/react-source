function createBrowserHistory() {
  const globalHistory = window.history;
  const globaLocation = window.location;
  let listeners = [];
  const go = (n) => globalHistory.go(n);
  const goBack = () => go(-1);
  const goForward = () => go(1);

  /**
   * ! pushState不会触发onpopstate事件，通过执行监听函数，触发Router的setState从而更新页面
   * @param {*} listener
   * @returns 事件监听移除函数
   */
  const listen = (listener) => {
    listeners.push(listener);
    return () => (listeners = listeners.filter((f) => f !== listener));
  };

  const push = (pathname, state) => {
    globalHistory.pushState(state, null, pathname);
    const action = "PUSH";
    const location = {
      pathname,
      state,
    };
    setState({ action, location });
  };

  /**
   * ! BrowserHistory本质都是触发Router组件的监听函数执行，只不过方式不同，一个是通过push触发（push不会触发onpopstate的执行），一个是监听onpopstate触发
   *
   */
  const setState = ({ action, location }) => {
    Object.assign(history, {
      action,
      location,
      length: globalHistory.length,
    });
    listeners.forEach((fn) => fn(location));
  };

  window.onpopstate = (popStateEvent) => {
    const action = "POP";
    const location = {
      pathname: globaLocation.pathname,
      state: popStateEvent.state,
    };
    setState({ action, location });
  };

  const history = {
    action: "POP",
    go,
    goBack,
    goForward,
    length: 0,
    listen,
    location: { pathname: globaLocation.pathname, state: globalHistory.state },
    push,
  };
  return history;
}

export default createBrowserHistory;

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

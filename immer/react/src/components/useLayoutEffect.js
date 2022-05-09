import { useRef, useCallBack } from "react";
let hookIndex = 0;
let hooks = [];

const useLayoutEffect = (cb, deps) => {
  if (hooks[hookIndex]) {
    const { lastDeps } = hooks[hookIndex];
    const isSame = deps.every((dep, index) => lastDeps[index] === dep);
    if (isSame) {
      hookIndex++;
      return;
    }
  }
  const { destroy } = hooks[hookIndex] || {};
  destroy && destroy();
  let effectStat = { lastDeps: deps };
  hooks[hookIndex++] = effectStat;
  // 创建一个微任务 = Promise.resolve().then()
  queueMicrotask(() => {
    effectStat.destroy = cb();
  });
};

const useEvent = (fn) => {
  const fnRef = useRef();
  // 视图更新完成后执行，保证fn里面获取到的state和props永远是最新的
  useLayoutEffect(() => {
    fnRef.current = fn;
  });
  // 保证返回的函数是引用不变
  return useCallBack((...args) => {
    let fn = fnRef.current;
    return fn(...args);
  }, []);
};

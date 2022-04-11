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

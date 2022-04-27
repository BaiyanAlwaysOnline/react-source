import { useRef, useLayoutEffect } from "react";

const usePrevState = (selector, prevState) => {
  const prevStateFromStore = useRef(null);
  // 监听，当store中的数据发生变化，触发视图更新
  useLayoutEffect(() => {
    if (prevStateFromStore.current === null) {
      prevStateFromStore.current = selector(prevState);
    }
  }, []);

  return prevStateFromStore;
};

export default usePrevState;

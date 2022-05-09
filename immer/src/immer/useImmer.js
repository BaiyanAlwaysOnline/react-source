import { useRef, useState } from "react";
import { toProxy, INTERNAL } from "./core";

function useImmer(baseState) {
  const [state, setState] = useState(baseState);
  const draftRef = useRef(
    toProxy(baseState, () => {
      // 当用户修改了proxyState，会触发当前回调函数执行
      const { draftState, ...rest } = draftRef.current[INTERNAL];
      setState({ ...draftState });
    })
  );

  const updater = (pruducer) => {
    pruducer(draftRef.current);
  };
  return [state, updater];
}

export default useImmer;

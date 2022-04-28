import { useReducer } from "react";
import { useLayoutEffect } from "react";
import usePrevState from "./usePrevState";
import useReactReduxContext from "./useReactReduxContext";

const useSelector = (selector) => {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const { store } = useReactReduxContext();
  const storeState = store.getState();
  const nextState = selector(storeState);
  const prevState = usePrevState(selector, storeState);
  useLayoutEffect(() => {
    return store.subscribe(() => {
      if (prevState.current !== selector(store.getState())) {
        forceUpdate();
        prevState.current = selector(store.getState());
      }
    });
  }, []);
  return nextState;
};

export default useSelector;

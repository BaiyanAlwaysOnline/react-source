import React from "react";
import { useMemo } from "react";
import { useContext } from "react";
import ReactReduxContext from "./ReactReduxContext.js";
import { bindActionCreators } from "../redux";
import { useReducer } from "react";
import { useLayoutEffect } from "react";
import { useRef } from "react";

const connect = (mapStateToProps, mapDispatchToProps) => (OldComponent) => (
  props
) => {
  const {
    store: { getState, subscribe, dispatch },
  } = useContext(ReactReduxContext);

  const [, forceUpdate] = useReducer((x) => x + 1, 0);
  const prevStateFromStore = useRef(null);
  // 原始的state
  const prevState = getState();
  // mappedState
  const mappedState = useMemo(() => {
    return mapStateToProps(prevState, props);
  }, [prevState, props]);
  // mappedDispatch
  const mappedDispatch = useMemo(() => {
    let mappedDispatch;
    if (typeof mapDispatchToProps === "function") {
      mappedDispatch = mapDispatchToProps(dispatch, props);
    } else if (
      typeof mapDispatchToProps === "object" &&
      mapDispatchToProps !== null
    ) {
      mappedDispatch = bindActionCreators(mapDispatchToProps, dispatch);
    } else if (!mapDispatchToProps) {
      mappedDispatch = { dispatch };
    }
    return mappedDispatch;
  }, [mapDispatchToProps, dispatch, props]);

  // 监听，当store中的数据发生变化，触发视图更新
  useLayoutEffect(() => {
    if (prevStateFromStore.current === null) {
      prevStateFromStore.current = mapStateToProps(prevState, props);
    }
  }, []);

  useLayoutEffect(() => {
    const unsubscribe = subscribe(() => {
      // ! react-redux会做优化，如果store中的某个namespace中的state没有发生变化，则不会触发对应connect组件的更新
      // ? mapStateToProps就是个select函数，猜测 reselector库就是类似原理
      const nextState = mapStateToProps(getState(), props);
      if (prevStateFromStore.current !== nextState) {
        forceUpdate();
        prevStateFromStore.current = mapStateToProps(getState(), props);
      }
    });
    return unsubscribe;
  }, [subscribe, forceUpdate, getState, props, mapStateToProps]);

  return <OldComponent {...props} {...mappedState} {...mappedDispatch} />;
};

export default connect;

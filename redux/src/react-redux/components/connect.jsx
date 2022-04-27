import React, { useMemo, useReducer, useLayoutEffect } from "react";
import { bindActionCreators } from "../../redux";
import usePrevState from "../hooks/usePrevState.js";
import useReactReduxContext from "../hooks/useReactReduxContext.js";

const connect =
  (mapStateToProps, mapDispatchToProps) => (OldComponent) => (props) => {
    const {
      store: { getState, subscribe, dispatch },
    } = useReactReduxContext();

    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    // 原始的state
    const prevState = getState();
    const prevStateFromStore = usePrevState(mapStateToProps, prevState);
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

import React from "react";
import actions from "../store/actions/counter2.js";
import { useSelector, useDispatch } from "../react-redux";

function ReactReduxHooks2() {
  const state = useSelector((state) => state.counter2);
  const dispatch = useDispatch();
  console.log("ReactReduxHooks2 render");
  return (
    <div>
      <p>{state.num}</p>
      <button onClick={() => dispatch(actions.add())}>+</button>
      <button onClick={() => dispatch(actions.minus())}>-</button>
      <button
        onClick={() => {
          dispatch(actions.set({ num: Math.random() }));
        }}
      >
        set
      </button>
    </div>
  );
}

export default ReactReduxHooks2;

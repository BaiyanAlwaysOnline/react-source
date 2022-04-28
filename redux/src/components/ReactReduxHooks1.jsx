import React from "react";
import actions from "../store/actions/counter1.js";
import { useSelector, useDispatch } from "../react-redux";

function ReactReduxHooks1() {
  const state = useSelector((state) => state.counter1);
  const dispatch = useDispatch();
  console.log("ReactReduxHooks1 render");
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

export default ReactReduxHooks1;

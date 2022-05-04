import React from "react";
import { useSelector, useDispatch } from "react-redux";

function Counter() {
  const num = useSelector((rootState) => rootState.num);
  const dispatch = useDispatch();
  return (
    <div>
      <p>Counter: {num}</p>
      <button onClick={() => dispatch({ type: "COUNTER_ADD" })}>+</button>
      <button onClick={() => dispatch({ type: "CANCEL_ADD" })}>cancel</button>
      <button onClick={() => dispatch({ type: "ASYNC_COUNTER_ADD" })}>
        async +
      </button>
      <button onClick={() => dispatch({ type: "COUNTER_MINUS" })}>-</button>
    </div>
  );
}

export default Counter;

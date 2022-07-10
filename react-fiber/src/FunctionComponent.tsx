import React, { use } from "../lib/react";

const ADD = "ADD";
function reducer(state, action) {
  switch (action.type) {
    case ADD:
      return { count: state.count + 1 };
    default:
      return state;
  }
}
function FunctionCounter() {
  const [numberState, setNumberState] = React.useState({ number: 0 }); //0
  const [countState, dispatch] = React.useReducer(reducer, { count: 0 }); //0

  return (
    <div>
      <div id="counter1">
        <span>{numberState.number}</span>
        <button
          onClick={() => setNumberState({ number: numberState.number + 1 })}
        >
          加1
        </button>
      </div>
      <div id="counter2">
        <span>{countState.count}</span>
        <button onClick={() => dispatch({ type: ADD })}>加1</button>
      </div>
    </div>
  );
}

export default FunctionCounter;

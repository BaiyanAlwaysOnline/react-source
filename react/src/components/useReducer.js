import React from "react";
import ReactDOM from "react-dom";

let hookIndex = 0;
let hooks = [];

const useReducer = (reducer, initialState, init) => {
  hooks[hookIndex] =
    hooks[hookIndex] || (init ? init(initialState) : initialState);
  const currentIndex = hookIndex;
  const dispatch = (action) => {
    hooks[currentIndex] = reducer
      ? reducer(hooks[currentIndex], action)
      : action;
    render();
  };
  return [hooks[hookIndex++], dispatch];
};

const useState = (initialState) => {
  return useReducer(null, initialState);
};

const reducer = (state, action) => {
  switch (action) {
    case "ADD":
      return {
        num: state.num + 1,
      };
    case "DECREASE":
      return {
        num: state.num - 1,
      };
    default:
      return state;
  }
};
const initialState = 0;
const init = (initialState) => {
  return {
    num: initialState,
  };
};

const Counter = () => {
  const [num, dispatch] = useReducer(reducer, initialState, init);
  const [num1, setNum1] = useState(0);

  return (
    <div>
      <p>{num.num}</p>
      <button onClick={() => dispatch("ADD")}>add</button>
      <button onClick={() => dispatch("DECREASE")}>decrease</button>
      <p>{num1}</p>
      <button onClick={() => setNum1(num1 + 1)}>add</button>
    </div>
  );
};

const render = () => {
  hookIndex = 0;
  const root = document.getElementById("root");
  ReactDOM.render(<Counter />, root);
};

render();

export default Counter;

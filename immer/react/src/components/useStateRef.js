import React from "react";
import ReactDOM from "react-dom";

let lastState;
const useState = (initialState) => {
  lastState =
    lastState ||
    (typeof initialState === "function" ? initialState() : initialState);
  const setState = (newState) => {
    if (typeof newState === "function") {
      newState = newState(lastState);
    }
    lastState = newState;
    render();
  };
  return [lastState, setState];
};

let lastRef = { current: null };
const useRef = (initialRef) => {
  lastRef = lastRef || { current: initialRef };
  return lastRef;
};

export const Counter = () => {
  console.log("render");
  //   const [num, setNum] = React.useState(0);
  //   const num1 = React.useRef(0);
  const [num, setNum] = useState(0);
  const num1 = useRef(0);
  const handleClick = () => {
    setTimeout(() => {
      //   setNum(num + 1);
      setNum((num) => num + 1);
    }, 1000);
    // setNum(num + 1);
    // num1.current++;
  };
  return (
    <div>
      <button onClick={handleClick}>add {num}</button>
      <button
        onClick={() => {
          setTimeout(() => {
            console.log(num, num1.current);
          }, 3000);
        }}
      >
        log
      </button>
    </div>
  );
};

const render = () => {
  const root = document.getElementById("root");
  ReactDOM.render(<Counter />, root);
};

render();

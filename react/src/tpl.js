import React from "react";
import ReactDOM from "react-dom";

let hookIndex = 0;
let hooks = [];

const useState = (initialState) => {
  let index = hookIndex;
  hooks[index] =
    hooks[index] ||
    (typeof initialState === "function" ? initialState() : initialState);

  function setState(newState) {
    if (typeof newState === "function") {
      newState = newState();
    }
    hooks[index] = newState;
    render();
  }

  return [hooks[hookIndex++], setState];
};

const Counter = () => {
  console.log("Counter render");

  const [num, setNum] = useState(0);

  React.useEffect(() => {
    document.title = `当前已经点击了第${num}次`;
  });

  return (
    <div>
      <button onClick={() => setNum(num + 1)}>add {num}</button>
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

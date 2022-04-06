import React, { useState, memo } from "react";
import ReactDOM from "react-dom";

const Parent = () => {
  const [str, setStr] = useState("");
  const [num, setNum] = useState(0);
  console.log("Parent render");
  const numValue = {
    num,
  };
  const handleSetNum = (val) => {
    setNum(val);
  };
  return (
    <div>
      <input type="text" value={str} onChange={(e) => setStr(e.target.value)} />
      <Child num={numValue.num} setNum={handleSetNum} />
    </div>
  );
};

const Child = memo(({ num, setNum }) => {
  console.log("Child render");
  return (
    <div>
      <button onClick={() => setNum(num + 1)}>add {num}</button>
    </div>
  );
});

const render = () => {
  const root = document.getElementById("root");
  ReactDOM.render(<Parent />, root);
};

render();

export default Parent;

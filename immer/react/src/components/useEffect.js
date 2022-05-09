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
      newState = newState(hooks[index]);
    }
    hooks[index] = newState;
    render();
  }

  return [hooks[hookIndex++], setState];
};

const useEffect = (cb, deps) => {
  if (hooks[hookIndex]) {
    const { lastDeps } = hooks[hookIndex];
    const isSame = deps.every((dep, index) => lastDeps[index] === dep);
    if (isSame) {
      hookIndex++;
      return;
    }
  }
  const { destroy } = hooks[hookIndex] || {};
  destroy && destroy();
  let effectStat = { lastDeps: deps };
  hooks[hookIndex++] = effectStat;
  setTimeout(() => {
    effectStat.destroy = cb();
  });
};

const Counter = () => {
  console.log("Counter render");
  const [str, setStr] = useState("");
  const [num, setNum] = useState(0);

  useEffect(() => {
    // console.log("useEffect执行了");
    // document.title = `当前已经点击了第${num}次`;
    let timer = setInterval(() => {
      console.log("开启定时器");
      setNum((num) => num + 1);
    }, 1000);
    return () => {
      console.log("清除定时器");
      clearInterval(timer);
    };
  }, [num]);

  return (
    <div>
      <input type="text" value={str} onChange={(e) => setStr(e.target.value)} />
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

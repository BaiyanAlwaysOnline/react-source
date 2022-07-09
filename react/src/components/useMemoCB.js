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

const useMemo = (factory, deps) => {
  if (hooks[hookIndex]) {
    const [lastMemo, lastDeps] = hooks[hookIndex];
    const same = lastDeps.every((dep, index) => deps[index] === dep);
    if (same) {
      // 依赖项没有变化
      hookIndex++;
      return lastMemo;
    }
  }
  const newMemo = factory();
  hooks[hookIndex++] = [newMemo, deps];
  return newMemo;
};

const useCallback = (cb, deps) => {
  if (hooks[hookIndex]) {
    const [lastCb, lastDeps] = hooks[hookIndex];
    const same = lastDeps.every((dep, index) => deps[index] === dep);
    if (same) {
      // 依赖项没有变化
      hookIndex++;
      return lastCb;
    }
  }
  hooks[hookIndex++] = [cb, deps];
  return cb;
};

const memo = (FunctionalComponent) => {
  return class extends React.PureComponent {
    render() {
      return <FunctionalComponent {...this.props} />;
    }
  };
};

const Parent = () => {
  const [str, setStr] = useState("");
  const [num, setNum] = useState(0);
  console.log("Parent render");

  const numValue = useMemo(() => ({ num }), [num]);

  const handleSetNum = useCallback((val) => {
    setNum(val);
  }, []);

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
  hookIndex = 0;
  const root = document.getElementById("root");
  ReactDOM.render(<Parent />, root);
};

render();

export default Parent;

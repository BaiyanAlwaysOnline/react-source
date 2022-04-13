import React from "react";
import ReactDOM from "react-dom";

const createContext = (initialValue) => {
  let context = { _currentValue: initialValue || null };

  const Provider = ({ value, children }) => {
    // 通过闭包记录value
    context._currentValue = value;
    return children;
  };

  const Consumer = ({ children }) => {
    // children必须是一个函数
    return children(context._currentValue);
  };
  context.Provider = Provider;
  context.Consumer = Consumer;
  return context;
};

const CounterContext = createContext();

let hookIndex = 0;
let hooks = [];

const useContext = (context) => {
  debugger;
  return context._currentValue;
};

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
  const [num1, setNum1] = useState(0);
  console.log("counter", CounterContext);
  const { num, dispatch } = useContext(CounterContext);
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

const App = () => {
  const [num, dispatch] = useReducer(reducer, initialState, init);
  console.log("App", CounterContext);

  return (
    <CounterContext.Provider value={{ num, dispatch }}>
      <Counter />
    </CounterContext.Provider>
  );
};

const render = () => {
  hookIndex = 0;
  const root = document.getElementById("root");
  ReactDOM.render(<App />, root);
};

render();

export default App;

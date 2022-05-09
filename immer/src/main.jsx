import React from "react";
import ReactDOM from "react-dom/client";
import { produce, useImmer } from "./immer";
// import { useImmer } from "use-immer";

const baseState = {
  name: "TODO",
  list: [1],
};

const nextState = produce(baseState, (draft) => {
  draft.list.push(2);
  draft.name = "AAAA";
});

console.log(baseState);
console.log(nextState);
console.log(nextState.list === baseState.list);

let id = 1;
function Counter() {
  const [state, setState] = useImmer({
    name: "TODO",
    list: [1],
  });

  return (
    <div>
      <h1>{state.name}</h1>
      <button
        onClick={() =>
          setState((draftState) => {
            draftState.list.push(++id);
          })
        }
      >
        新增
      </button>
      <ul>
        {state.list.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Counter />);

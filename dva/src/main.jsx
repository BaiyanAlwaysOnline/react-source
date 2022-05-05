import React from "react";
import dva, { connect } from "./dva";
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const app = dva();

app.model({
  namespace: "counter",
  state: { number: 0 },
  reducers: {
    add(state) {
      return { number: state.number + 1 };
    },
    minus(state) {
      return { number: state.number - 1 };
    },
  },
  effects: {
    *asyncAdd(action, { put, call }) {
      console.log(action);
      yield call(delay, 1000);
      yield put({ type: "counter1/add" });
    },
  },
});

app.model({
  namespace: "counter1",
  state: { number: 0 },
  reducers: {
    add(state) {
      return { number: state.number + 1 };
    },
    minus(state) {
      return { number: state.number - 1 };
    },
  },
});

function Counter(props) {
  return (
    <div>
      <p>Counter - {props.number}</p>
      <button onClick={() => props.dispatch({ type: "counter/add" })}>+</button>
      <button onClick={() => props.dispatch({ type: "counter/asyncAdd" })}>
        ASYNC +
      </button>
      <button onClick={() => props.dispatch({ type: "counter/minus" })}>
        -
      </button>
    </div>
  );
}

const ConnectedCounter = connect((state) => state.counter)(Counter);

function Counter1(props) {
  return (
    <div>
      <p>Counter1 - {props.number}</p>
      <button onClick={() => props.dispatch({ type: "counter1/add" })}>
        +
      </button>
      <button onClick={() => props.dispatch({ type: "counter1/minus" })}>
        -
      </button>
    </div>
  );
}

const ConnectedCounter1 = connect((state) => state.counter1)(Counter1);

app.router(() => (
  <div>
    <ConnectedCounter />
    <ConnectedCounter1 />
  </div>
));
app.start("#root");

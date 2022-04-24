import React from "react";
import {
  createStore,
  bindActionCreators,
  combineReducers,
  applyMiddleware,
} from "../redux";
import logger from "redux-logger";
import { loggerMiddleware, loggerMiddleware1 } from "../utils/log";

const ADD = "ADD";
const MINUS = "MINUS";
const SET = "SET";

const reducer1 = (state = { num: 0 }, action) => {
  switch (action.type) {
    case ADD:
      return { num: state.num + 1 };
    case MINUS:
      return { num: state.num - 1 };
    case SET:
      return action.payload;
    default:
      return state;
  }
};

const reducer2 = (state = { name: "baiyan" }, action) => {
  switch (action.type) {
    case SET:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({ reducer1, reducer2 });

const store = createStore(
  reducer,
  applyMiddleware(loggerMiddleware, loggerMiddleware1)
);

// actionCreator
const add = () => ({
  type: ADD,
});
const minus = () => ({
  type: MINUS,
});
const actionCreators = {
  add: () => ({
    type: ADD,
  }),
  minus: () => ({
    type: MINUS,
  }),
  set: (payload) => ({
    type: SET,
    payload,
  }),
};
// bound
const boundAdd = bindActionCreators(add, store.dispatch);
const boundMinus = bindActionCreators(minus, store.dispatch);
const boundActions = bindActionCreators(actionCreators, store.dispatch);

class Counter extends React.Component {
  state = {
    num: store.getState().reducer1.num,
  };
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({ num: store.getState().reducer1.num });
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    return (
      <div>
        <p>{this.state.num}</p>
        <button onClick={() => boundActions.add()}>+</button>
        <button onClick={() => boundActions.minus()}>-</button>
        <button
          onClick={() => {
            boundActions.set({ num: Math.random() });
          }}
        >
          set
        </button>
      </div>
    );
  }
}

export default Counter;

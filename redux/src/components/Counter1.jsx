import React from "react";
import { createStore, bindActionCreators, combineReducers } from "../redux";

const ADD = "ADD";
const MINUS = "MINUS";
const SET = "SET";

const reducer1 = (state = { num: 0 }, action) => {
  debugger;
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
  debugger;
  switch (action.type) {
    case SET:
      return action.payload;
    default:
      return state;
  }
};

const reducer = combineReducers({ reducer1, reducer2 });

const store = createStore(reducer);

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
// binded
const boundAdd = bindActionCreators(add, store.dispatch);
const boundMinus = bindActionCreators(minus, store.dispatch);
const boundActions = bindActionCreators(actionCreators, store.dispatch);

const num = { num: Math.random() };

class Counter1 extends React.Component {
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
        {/* <button onClick={() => store.dispatch({ type: ADD })}>+</button>
        <button onClick={() => store.dispatch({ type: MINUS })}>-</button> */}
        {/* <button onClick={() => boundAdd()}>+</button>
        <button onClick={() => boundMinus()}>-</button> */}
        <button onClick={() => boundActions.add()}>+</button>
        <button onClick={() => boundActions.minus()}>-</button>
        <button
          onClick={() => {
            boundActions.set(num);
          }}
        >
          set
        </button>
      </div>
    );
  }
}

export default Counter1;

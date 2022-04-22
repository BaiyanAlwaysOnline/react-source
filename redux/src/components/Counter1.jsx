import React from "react";
import { createStore, bindActionCreators } from "../redux";

const ADD = "ADD";
const MINUS = "MINUS";
const SET = "SET";

const reducer = (state = { num: 0 }, action) => {
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

class Counter1 extends React.Component {
  state = {
    num: store.getState().num,
  };
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({ num: store.getState().num });
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
            boundActions.set({ num: Math.random() });
          }}
        >
          set
        </button>
      </div>
    );
  }
}

export default Counter1;

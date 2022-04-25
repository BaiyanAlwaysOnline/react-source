import React from "react";
import { bindActionCreators } from "../redux";
import store from "../store/index";
import * as actionTypes from "../store/action-types.js";
// actionCreator
// const add = () => ({
//   type: ADD,
// });
// const minus = () => ({
//   type: MINUS,
// });
const actionCreators = {
  add: () => ({
    type: actionTypes.COUNTER2_ADD,
  }),
  minus: () => ({
    type: actionTypes.COUNTER2_MINUS,
  }),
  set: (payload) => ({
    type: actionTypes.COUNTER2_SET,
    payload,
  }),
};
// binded
// const boundAdd = bindActionCreators(add, store.dispatch);
// const boundMinus = bindActionCreators(minus, store.dispatch);
const boundActions = bindActionCreators(actionCreators, store.dispatch);

class Counter2 extends React.Component {
  state = {
    num: store.getState().counter2.num,
  };
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({ num: store.getState().counter2.num });
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

export default Counter2;

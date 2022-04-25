import React from "react";
import { bindActionCreators } from "../redux";
import store from "../store/index";
import actions from "../store/actions/counter1.js";

const boundActions = bindActionCreators(actions, store.dispatch);

class Counter1 extends React.Component {
  state = {
    num: store.getState().counter1.num,
  };
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState({ num: store.getState().counter1.num });
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

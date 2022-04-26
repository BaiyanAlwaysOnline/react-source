import React from "react";
import actions from "../store/actions/counter2.js";
import { connect } from "../react-redux";

class ReactRedux1 extends React.Component {
  render() {
    console.log("ReactRedux1 render");
    return (
      <div>
        <p>{this.props.num}</p>
        <button onClick={() => this.props.add()}>+</button>
        <button onClick={() => this.props.minus()}>-</button>
        <button
          onClick={() => {
            this.props.set({ num: Math.random() });
          }}
        >
          set
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state.counter2;
};

export default connect(mapStateToProps, actions)(ReactRedux1);

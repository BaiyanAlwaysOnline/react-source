import React from "react";
import actions from "../store/actions/counter1.js";
import { connect } from "react-redux";

class ReactRedux extends React.Component {
  render() {
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
  return state.counter1;
};

export default connect(mapStateToProps, actions)(ReactRedux);

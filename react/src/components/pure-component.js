import React from "../react";

class Counter extends React.PureComponent {
  state = {
    num: 1,
  };

  add = (num) => {
    this.setState({ num: this.state.num + num });
  };

  render() {
    console.log("render");
    const element = (
      <div>
        <span>nums: {this.state.num}</span>
        <button onClick={() => this.add(1)}>+</button>
      </div>
    );
    console.log(element);
    return element;
  }
}

export default Counter;

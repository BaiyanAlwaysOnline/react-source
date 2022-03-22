import React from "../react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num: 0,
    };
    console.log("1 setup state and props");
  }

  componentWillMount() {
    console.log("2 componentWillMount");
  }
  componentDidMount() {
    console.log("4 componentDidMount");
  }
  shouldComponentUpdate(nextProps, nextState) {
    console.log("5 shouldComponentUpdate");
    return nextState.num % 2 === 0;
  }
  componentWillUpdate() {
    console.log("6 componentWillUpdate");
  }
  componentDidUpdate() {
    console.log("7 componentWillDidUpdate");
  }

  componentWillUnmount() {
    console.log("8 componentWillUnMount");
  }

  add = () => {
    this.setState({ num: this.state.num + 1 });
  };

  render() {
    console.log("3 render");
    return (
      <div>
        {this.state.num}
        <button onClick={this.add}>add</button>
        <Child num={this.state.num} />
      </div>
    );
  }
}

class Child extends React.Component {
  render() {
    return <h3>{this.props.num}</h3>;
  }
}

export default Counter;

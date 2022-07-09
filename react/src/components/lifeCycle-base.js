import React from "../react";

/**
 * willXX 废弃
 * componentWillMount fiber架构，组件的挂载，更新都可能会被打断/暂停，可能会导致will生命周期重复执行
 * componentWillUpdate
 * componentWillReceiveProps 有人会在这里面setState组件死循环渲染
 */

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
  componentWillReceiveProps(nextProps) {
    console.log("* componentWillReceiveProps");
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
      <div id={`counter-${this.state.num}`}>
        <p>{this.state.num}</p>
        {this.state.num === 4 ? null : <Child num={this.state.num} />}
        <button onClick={this.add}>add</button>
      </div>
    );
  }
}

class Child extends React.Component {
  componentWillMount() {
    console.log("child1 componentWillMount");
  }
  render() {
    console.log("child2 render");
    return (
      <div id={`childCounter-${this.props.num}`}>
        <h3>{this.props.num}</h3>
      </div>
    );
  }
  componentDidMount() {
    console.log("child3 componentDidMount");
  }
  // ! 组件的父组件更新，就会触发
  componentWillReceiveProps(nextProps) {
    console.log("child4 componentWillReceiveProps");
  }
  componentWillUpdate() {
    console.log("child5 componentWillUpdate");
  }
  componentDidUpdate() {
    console.log("child6 componentDidUpdate");
  }
  componentWillUnmount() {
    console.log("child7 componentWillUnMount");
  }
}

export default Counter;

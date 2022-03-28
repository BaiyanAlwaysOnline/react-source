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
  }

  add = () => {
    this.setState({ num: this.state.num + 1 });
  };

  render() {
    return (
      <div id={`counter-${this.state.num}`}>
        <p>{this.state.num}</p>
        <ChildCounter num={this.state.num} />
        <button onClick={this.add}>add</button>
      </div>
    );
  }
}

class ChildCounter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { num: 0 };
  }

  // 从props派生出state
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log("getDerivedStateFromProps");

    const { num } = nextProps;
    if (num % 2 === 0) {
      return {
        num: num * 2,
      };
    } else {
      return {
        num: num * 3,
      };
    }
  }

  render() {
    return (
      <div id={`childCounter-${this.state.num}`}>
        <h3>{this.state.num}</h3>
      </div>
    );
  }
}
let num = 1;
class Message extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: [0],
    };
  }

  componentDidMount() {
    setInterval(this.addMsg, 1000);
  }

  addMsg = () => {
    this.setState({ message: [num++, ...this.state.message] });
  };

  render() {
    const style = {
      height: "200px",
      width: "100px",
      overflow: "auto",
      border: "1px solid red",
    };
    return <div style={style}>1</div>;
  }
}

// export default Counter;
export default Message;

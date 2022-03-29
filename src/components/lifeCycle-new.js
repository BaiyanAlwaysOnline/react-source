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
    this.wrapper = React.createRef();
  }

  // render执行完成后生成vdom，在compare之前执行
  getSnapshotBeforeUpdate(prevProps, prevState) {
    const dom = this.wrapper.current;
    return dom.scrollHeight - dom.scrollTop;
    // dom.scrollHeight(+) - dom.scrollTop = x;  => dom.scrollHeight在逐渐增加，把scrollHeight的增量转移给scrollTop，通过这样滚动条一直往下滚模拟
    // 10 - scrollTop(4) = 6
    // 12 - 6 = scrollTop(6)
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const dom = this.wrapper.current;
    snapshot && (dom.scrollTop = dom.scrollHeight - snapshot);
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
    return (
      <div id="container" ref={this.wrapper} style={style}>
        {this.state.message.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    );
  }
}

// 如果是不同的type
class Test extends React.Component {
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
        {this.state.num % 2 ? (
          <h3>{this.state.num}</h3>
        ) : (
          <span>{this.state.num}</span>
        )}
        <button onClick={this.add}>add</button>
      </div>
    );
  }
}
// export default Counter;
// export default Message;
export default Test;

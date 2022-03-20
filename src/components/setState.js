import React from "react";
/**
 * 1.实现事件绑定
 * 2.组件更新
 * 3.组件异步更新
 */

class Tick extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date(),
      number: 0,
    };
    this.handleTick = this.handleTick.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    setInterval(this.handleTick, 1000);
  }

  handleTick() {
    this.setState({ date: new Date() });
  }

  // 合成事件，event是经过React封装的，不是原生事件，通过事件委托到document上（React17之前，17以后委托到了root上）
  handleAdd(event) {
    // 1.每次合成事件处理函数/生命周期函数中执行setState，都会把更新好的状态存起来，待事件执行完成后统一更新
    // 2.在setTimeout等函数中执行setState是同步更新
    // 3.谨慎处理this  bind/箭头函数(ES7)/匿名函数

    // updaterQueue.isBatchingUpdate = true; // !不能每次手写，react使用合成事件支持
    // console.log(event);
    // setTimeout(() => {
    //   console.log(event);
    // });
    // 合并，异步更新
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number); // 0
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number); // 0

    // updaterQueue.batchUpdate();

    // 每次基于上一次state, 异步更新
    this.setState(
      (prevState) => ({ number: prevState.number + 1 }),
      () => console.log(this.state) // 更新后触发的回调
    );
    console.log(this.state.number); // 0
    this.setState(
      (prevState) => ({ number: prevState.number + 1 }),
      () => console.log(this.state) // 更新后触发的回调
    );
    console.log(this.state.number); // 0

    // 不受理异步更新管控
    // setTimeout(() => {
    //   this.setState({ number: this.state.number + 1 });
    //   console.log(this.state.number); // 2
    //   this.setState({ number: this.state.number + 1 });
    //   console.log(this.state.number); // 3
    // });

    // setState会合并状态
  }

  render() {
    return (
      <div>
        当前的时间是：
        <span>{this.state.date.toLocaleString()}</span>
        <br />
        <span>{this.state.number}</span>
        <button onClick={this.handleAdd}>+</button>
      </div>
    );
  }
}

export default Tick;

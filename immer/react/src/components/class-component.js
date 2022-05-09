import React from "../react";

/**
 * 类组件：
 *  1. new这个类组件，生成一个组件实例 => this.props = props;
 *  2. 调用实例的render方法，得到React元素 ! React元素 = React.createElement() = virtualDom
 *  3. 虚拟DOM转成真实DOM，挂载
 */
class Welcome extends React.Component {
  render() {
    return (
      <h3 className={this.props.className}>
        加油💪🏻
        <span style={this.props.style}>{this.props.name}</span>
        <World text="World" />
      </h3>
    );
  }
}

class World extends React.Component {
  render() {
    return <h4>Hello {this.props.text}</h4>;
  }
}

export default Welcome;

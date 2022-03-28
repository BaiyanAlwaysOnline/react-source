import Updater from "./Updater.js";
import { compareTwoVDom } from "./react-dom.js";

export default class Component {
  // 说明是一个React组件
  static isReactComponent = true;
  constructor(props) {
    this.props = props;
    this.state = {};
    this.updater = new Updater(this); // 每个组件对应一个更新器实例
  }

  /**
   * 更新状态
   * @param {*} partialState 部分状态
   */
  setState(partialState) {
    // 同步更新state
    this.updater.addState(partialState);
  }

  render() {
    console.error("组件必须实现render方法");
  }

  forceUpdate() {
    if (this.componentWillUpdate) this.componentWillUpdate();
    const newVdom = this.render();
    compareTwoVDom(
      this.oldVdom.dom.parentNode,
      this.oldVdom, // 初始化的时候挂载到组件实例上的老虚拟DOM
      newVdom // 此次更新产生的新虚拟Dom
    );
    // 更新真实DOM
    this.oldVdom = newVdom;
    if (this.componentDidUpdate) this.componentDidUpdate();
  }
}

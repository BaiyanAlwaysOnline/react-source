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
    // ownVdom组件的vdom，oldVdom是render返回的vdom
    if (this.ownVdom.type.getDerivedStateFromProps) {
      const derviedState = this.ownVdom.type.getDerivedStateFromProps(
        this.props,
        this.state
      );
      if (derviedState) this.state = derviedState;
    }
    const newVdom = this.render();
    const snapShot =
      this.getSnapshotBeforeUpdate &&
      this.getSnapshotBeforeUpdate(this.props, this.state);
    compareTwoVDom(
      this.oldVdom.dom.parentNode,
      this.oldVdom, // 初始化的时候挂载到组件实例上的老虚拟DOM
      newVdom // 此次更新产生的新虚拟Dom
    );
    // 更新真实DOM
    this.oldVdom = newVdom;
    if (this.componentDidUpdate)
      this.componentDidUpdate(this.props, this.state, snapShot);
  }
}

export class PureComponent extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (!isEqual(nextState, this.state)) {
      return true;
    }

    if (!isEqual(nextProps, this.props)) {
      return true;
    }
    return false;
  }
}

function isEqual(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  for (let k in a) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

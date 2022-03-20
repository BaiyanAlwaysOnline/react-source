import { createDom } from "./react-dom";
import { isFunction } from "./utils.js";
// {
//     "type": "h2",
//     "props": {
//       "className": "title",
//       "style": {
//         "color": "red"
//       },
//       "children": [
//         "title",
//         {
//           "type": "span",
//           "props": {
//             "className": "content",
//             "style": {
//               "color": "blue"
//             },
//             "children": "打工人！"
//           },
//         }
//       ]
//     },
//   }

/**
 * @param {*} type dom元素类型 字符串（dom元素 ）/组件
 * @param {*} config 属性对象
 * @param  {...any} children
 */
export const createElement = (type, config, ...children) => {
  if (config) {
    Reflect.deleteProperty(config, "_owner");
    Reflect.deleteProperty(config, "_store");
  }
  let props = { ...config };
  // children可能是数组（多个儿子），也可能是一个字符串或者数字，也可能是一个null
  if (children.length === 0) props.children = null;
  if (children.length === 1) props.children = children[0];
  if (children.length > 1) props.children = children;
  return {
    type,
    props,
  };
};

/**
 * @desc 单例，React所有组件公用
 */
export const updaterQueue = {
  updaters: new Set(), // 待更新的更新器队列
  isBatchingUpdate: false, // 是否正在批量更新
  add(updater) {
    this.updaters.add(updater);
  },
  batchUpdate() {
    this.updaters.forEach((updater) => {
      updater.updateComponent();
    });
    this.isBatchingUpdate = false;
    this.updaters.clear();
  },
};

/**
 * @desc 更新器类：批处理合并状态，更新组件
 */
class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance; // 类组件实例
    this.pendingStates = [];
  }

  addState(partialState) {
    // 先把setState的state放入pendingState中
    this.pendingStates.push(partialState);
    // 判断当前是否正在批量更新中（异步）
    updaterQueue.isBatchingUpdate
      ? updaterQueue.add(this)
      : this.updateComponent();
  }

  /**
   * @desc 用批处理的状态，更新组件
   */
  updateComponent() {
    const { classInstance, pendingStates } = this;
    if (pendingStates.length) {
      classInstance.state = this.getState();
      classInstance.forceUpdate();
    }
  }

  /**
   * @desc 合并状态，得到新的状态
   */
  getState() {
    let {
      pendingStates,
      classInstance: { state: oldState },
    } = this;
    let state = {};
    pendingStates.forEach((newState) => {
      if (isFunction(newState)) {
        newState = newState(oldState);
      }
      state = {
        ...oldState, // oldState
        ...newState,
      };
    });
    pendingStates.length = 0;
    return state;
  }
}

class Component {
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
    const newVdom = this.render();
    updateClassComponent(newVdom, this);
  }
}

const updateClassComponent = (newVdom, instance) => {
  const newDom = createDom(newVdom);
  instance._dom.parentNode.replaceChild(newDom, instance._dom);
  instance._dom = newDom;
};

const React = {
  createElement,
  Component,
};

export default React;

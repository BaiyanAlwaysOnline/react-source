import { isFunction } from "./utils.js";

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
export default class Updater {
  constructor(classInstance) {
    this.classInstance = classInstance; // 类组件实例
    this.pendingStates = [];
  }

  addState(partialState) {
    // 先把setState的state放入pendingState中
    this.pendingStates.push(partialState);
    this.emitUpdate();
  }

  /**
   * @desc 触发更新，传了props说明是触发了组件的更新渲染
   */
  emitUpdate(nextProps) {
    this.nextProps = nextProps;
    // 判断当前是否正在批量更新中（异步）
    !updaterQueue.isBatchingUpdate || nextProps
      ? this.updateComponent()
      : updaterQueue.add(this);
  }

  /**
   * @desc 用批处理的状态，更新组件
   */
  updateComponent() {
    const { classInstance, pendingStates, nextProps } = this;
    if (pendingStates.length || nextProps) {
      shouldComponentUpdate(classInstance, nextProps, this.getState());
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
        newState = newState(state);
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

/**
 * 判断是否渲染页面
 * @param {*} classInstance
 * @param {*} nextProps
 * @param {*} state
 */
const shouldComponentUpdate = (classInstance, nextProps, state) => {
  if (nextProps) classInstance.props = nextProps;
  // 不管视图是否更新，状态都要更新
  classInstance.state = state;
  // 如果这个生命周期返回false，视图不更新
  if (
    classInstance.shouldComponentUpdate &&
    !classInstance.shouldComponentUpdate(classInstance.props, state)
  ) {
    return;
  }
  // 更新视图
  classInstance.forceUpdate();
};

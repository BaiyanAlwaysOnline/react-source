import { updaterQueue } from "./Updater.js";

/**
 * @desc  合成事件，event是经过React封装的，不是原生事件，通过事件委托到document上（React17之前，17以后委托到了root上）
 *  1.可以实现React组件的异步批量更新
 *  2.可以及时释放合成事件event对象
 * @param {*} dom
 * @param {*} eventType
 * @param {*} listener
 */
export const addEvent = (dom, eventType, listener) => {
  dom._store || (dom._store = {});
  let store = dom._store;
  store[eventType] = listener;
  document[eventType] = dispatchEvent;
};

const dispatchEvent = (event) => {
  let { target, type } = event;
  const eventType = `on${type}`;
  updaterQueue.isBatchingUpdate = true;
  const synthesiticEvent = createSynthesiticEvent(event);
  // 实现冒泡
  while (target) {
    const listener = target._store?.[eventType];
    listener && listener(synthesiticEvent);
    target = target.parentNode;
  }
  synthesiticEvent.release();
  updaterQueue.batchUpdate();
};

const createSynthesiticEvent = (event) => {
  return new SyntheticBaseEvent(event);
};

/**
 * 合成事件对象，是一个单例
 */
class SyntheticBaseEvent {
  constructor(event) {
    for (let k in event) {
      this[k] = event[k];
    }
    if (this._instance) {
      return this;
    } else {
      this._instance = this;
    }
  }

  release() {
    for (let k in this) {
      this[k] = null;
    }
  }
}

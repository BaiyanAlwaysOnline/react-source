import * as is from "./is";

export const INTERNAL = Symbol("internal");

/**
 *
 * @param {*} baseState 原始状态 不可变
 * @param {*} producerß 处理器
 */
export function produce(baseState, producer) {
  const proxyState = toProxy(baseState);
  producer(proxyState);
  const { mutate, draftState, baseState: _baseState } = proxyState[INTERNAL];

  return mutate ? draftState : _baseState;
}

export function toProxy(baseState, callParentCopy) {
  const internal = {
    baseState,
    draftState: createDraftState(baseState), // 草稿
    mutate: false, // 是否修改了值（set）
    keyToProxy: {}, // 记录key是否被代理过
  };
  return new Proxy(baseState, {
    get(target, key) {
      if (key === INTERNAL) {
        return internal;
      }
      const value = Reflect.get(target, key);
      if (is.isArray(value) || is.isObject(value)) {
        // 判断是否代理过
        if (key in internal.keyToProxy) {
          return internal.keyToProxy[key];
        } else {
          internal.keyToProxy[key] = toProxy(value, () => {
            // 标记父state修改了
            internal.mutate = true;
            // { parent: { child: 3 } }
            const { draftState: childDraftState } =
              internal.keyToProxy[key][INTERNAL]; // 获取child internal   { child: 3 }
            // 修改父状态=子DraftState  因为set执行的是修改draftState
            internal.draftState[key] = childDraftState;
            // 有父亲的话还要在通知父亲
            callParentCopy && callParentCopy();
          });
        }
        return internal.keyToProxy[key];
      } else if (is.isFunction(value)) {
        // 如果是个方法，说明执行类似 [].push
        internal.mutate = true;
        // 有父亲的话还要在通知父亲
        callParentCopy && callParentCopy();
        return value.bind(internal.draftState);
      }
      return internal.mutate
        ? internal.draftState[key]
        : internal.baseState[key];
    },
    set(target, key, value) {
      internal.mutate = true;
      const { draftState } = internal;
      const boolean = Reflect.set(draftState, key, value);
      // { parent: { child: 2 } }   如果使用了parent.child = 3  则需要通知paranet mutate = true
      callParentCopy && callParentCopy();
      return boolean;
    },
  });
}

/**
 * 浅拷贝一份原始数据
 * @param {*} baseState
 */
function createDraftState(baseState) {
  if (is.isArray(baseState)) {
    return [...baseState];
  } else if (is.isObject(baseState)) {
    return { ...baseState };
  } else {
    return baseState;
  }
}

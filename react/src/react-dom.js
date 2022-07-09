import { addEvent } from "./event.js";
/**
 * 虚拟DOM => 真实DOM，然后挂载到root上
 * @param {*} vdom
 * @param {*} container
 */
const render = (vdom, container, mountIndex) => {
  const dom = createDom(vdom, mountIndex);
  dom && container.appendChild(dom);
};

/**
 * 虚拟DOM => 真实DOM
 * @param {*} vdom
 * @return dom
 */
export const createDom = (vdom, mountIndex) => {
  // 数字或者字符串 => 文本节点
  if (typeof vdom === "string" || typeof vdom === "number") {
    const dom = document.createTextNode(vdom);
    dom._mountIndex = mountIndex;
    return dom;
  }
  if (!vdom) {
    return "";
  }
  const {
    type, // ! 字符串/函数组件/类组件
    props,
    props: { children },
    ref,
  } = vdom;
  let dom;
  if (typeof type === "function") {
    if (type.isReactComponent) {
      // 是类组件 => babel编译完class就是一个function
      return mountClassComponent(vdom);
    } else {
      // 是函数组件
      return mountFunctionalComponent(vdom);
    }
  } else {
    dom = document.createElement(type);
  }
  updateProperties(dom, {}, props);
  if (typeof children === "string" || typeof children === "number") {
    // 儿子是字符串或者数字
    dom.textContent = children;
  } else if (typeof children === "object" && children.type) {
    // 说明是虚拟DOM节点
    render(children, dom);
  } else if (Array.isArray(children)) {
    // 说明有多个儿子
    reconcileChildren(children, dom);
  } else {
    // 兜底情况，可能是null
    dom.textContent = children ? children.toString() : "";
  }
  if (ref)
    // 如果传了ref，ref.current => 真实Dom
    ref.current = dom;

  vdom.dom = dom;
  dom._mountIndex = mountIndex;
  return dom;
};

/**
 * 更新DOM属性
 * @param {*} dom
 * @param {*} props
 */
const updateProperties = (dom, oldProps, newProps) => {
  for (const key in newProps) {
    if (key === "children") continue;
    if (key === "style") {
      const styleObj = newProps[key];
      for (const prop in styleObj) {
        dom.style[prop] = styleObj[prop];
      }
    } else if (key.startsWith("on")) {
      addEvent(dom, key.toLocaleLowerCase(), newProps[key]);
    } else {
      dom[key] = newProps[key];
    }
  }
};

/**
 * 挂载节点所有children
 * @param {*} children
 * @param {*} dom
 */
const reconcileChildren = (children, dom) => {
  children.forEach((child, index) => render(child, dom, index));
};

/**
 *
 * @param {*} oldVdom
 * @param {*} newVdom
 * @param {*} parentDom
 * @return {Object} currentNode
 */
export const compareTwoVDom = (parentDom, oldVdom, newVdom, nextDom) => {
  if (!oldVdom && !newVdom) return null;
  else if (oldVdom && !newVdom) {
    // 老有 新无 => 删除
    const currentDom = oldVdom.dom;
    // oldVdom如果是一个class组件类型的vdom，才会有实例属性，才会执行生命周期方法
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount)
      oldVdom.classInstance.componentWillUnmount();

    parentDom.removeChild(currentDom);
    return null;
  } else if (newVdom && !oldVdom) {
    // 老无 新有 -> 插入
    const currentDom = createDom(newVdom);
    newVdom.dom = currentDom;
    // ! 不能直接append，如果当前元素最后一个的话，直接append，否则应该insertBefore到下一个兄弟的前面
    if (nextDom) {
      parentDom.insertBefore(currentDom, nextDom);
    } else {
      parentDom.appendChild(currentDom);
    }
  } else if (newVdom && oldVdom && newVdom.type !== oldVdom.type) {
    const oldDom = oldVdom.dom;
    const newDom = createDom(newVdom);
    // 如果是类组件，执行生命周期方法
    if (oldVdom.classInstance && oldVdom.classInstance.componentWillUnmount)
      oldVdom.classInstance.componentWillUnmount();
    // 如果新老节点的type不同，也要删除重建
    parentDom.replaceChild(newDom, oldDom);
  } else {
    // 新有 老有 => domdiff
    updateElement(oldVdom, newVdom);
  }
};

/**
 * 更新元素
 * @param {*} oldVdom
 * @param {*} newVdom
 */
const updateElement = (oldVdom, newVdom) => {
  // 两种情况
  // 1.原生DOM
  if (typeof oldVdom.type === "string") {
    const currentDom = oldVdom.dom;
    newVdom.dom = currentDom;
    // 更新属性
    updateProperties(currentDom, oldVdom.props, newVdom.props);
    // 更新children
    updateChildren(currentDom, oldVdom.props.children, newVdom.props.children);
  }
  // 2.类组件或者函数组件
  else if (typeof oldVdom.type === "function") {
    if (oldVdom.type.isReactComponent) {
      newVdom.dom = oldVdom.dom;
      newVdom.classInstance = oldVdom.classInstance;
      // 是类组件
      updateClassInstance(oldVdom, newVdom);
    } else {
      // 是函数组件
      updateFunctionComponent(oldVdom, newVdom);
    }
  }
};

/**
 * diff children
 * @param {*} dom
 * @param {*} oldChildren
 * @param {*} newChildren
 */
const updateChildren = (dom, oldChildren, newChildren) => {
  // 如果新老儿子都是数字，字符串
  if (
    (typeof oldChildren === "string" || typeof oldChildren === "number") &&
    (typeof newChildren === "string" || typeof newChildren === "number")
  ) {
    if (oldChildren !== newChildren) {
      dom.textContent = newChildren;
    }
    return;
  }

  // 否则递归逐一比较
  oldChildren = Array.isArray(oldChildren) ? oldChildren : [oldChildren];
  newChildren = Array.isArray(newChildren) ? newChildren : [newChildren];
  const maxLen = Math.max(oldChildren.length, newChildren.length);
  for (let i = 0; i < maxLen; i++) {
    // newChildren上还没有挂载dom属性
    const nextDom = oldChildren.find(
      (child, index) => index > i && child && child.dom
    );
    // 如果儿子是文本节点的话 - 处理多个文本子节点的情况
    if (
      (typeof oldChildren[i] === "string" ||
        typeof oldChildren[i] === "number") &&
      (typeof newChildren[i] === "string" || typeof newChildren[i] === "number")
    ) {
      if (oldChildren[i] !== newChildren[i]) {
        dom.childNodes[i].textContent = newChildren[i];
      }
      continue;
    }
    compareTwoVDom(dom, oldChildren[i], newChildren[i], nextDom?.dom);
  }
};

const updateClassInstance = (oldVdom, newVdom) => {
  const classInstance = oldVdom.classInstance;
  if (classInstance?.componentWillReceiveProps)
    classInstance.componentWillReceiveProps();

  classInstance.updater.emitUpdate(newVdom.props);
};

const updateFunctionComponent = (oldVdom, newVdom) => {
  const { props, type: renderFunction } = newVdom;
  const newRenderVodm = renderFunction(props);
  createDom(newRenderVodm);
  newVdom.renderVdom = newRenderVodm;
  compareTwoVDom(
    oldVdom.renderVdom.dom.parentNode,
    oldVdom.renderVdom,
    newRenderVodm
  );
};

/**
 * 接收类组件，生成真实要渲染的VDOM
 * @param {*} vdom 只收class组件类型的vdom
 * @returns dom
 * ! 特别注意 vdom和renderDom的区别： vdom是类组件  renderVdom 是类组件的render执行返回的具体内容
 */
const mountClassComponent = (vdom) => {
  const { type: ClassComponent, props } = vdom;
  const classInstance = new ClassComponent(props);
  // 记录实例
  vdom.classInstance = classInstance;
  classInstance.ownVdom = vdom;
  if (classInstance.componentWillMount) classInstance.componentWillMount();
  // 生成新Vdom
  const renderVdom = classInstance.render();
  // 根据Vdom生成真实DOM
  const dom = createDom(renderVdom);
  // ? 这里没看懂要干什么用，因为classInstance上面就有dom
  vdom.dom = renderVdom.dom = dom;
  // TODO 先这么写
  if (classInstance.componentDidMount) classInstance.componentDidMount();
  // 记录真实DOM
  classInstance.dom = dom;
  // 记录Vdom
  classInstance.oldVdom = renderVdom;
  return dom;
};

/**
 * 接收函数组件，生成真实要渲染的VDOM
 * @param {*} vdom
 * @returns dom
 */
const mountFunctionalComponent = (vdom) => {
  const { type: functionalComponent, props } = vdom;
  const renderVdom = functionalComponent(props);
  vdom.renderVdom = renderVdom;
  // createDom执行会给renderVdom上面挂载它的真实dom
  return createDom(renderVdom);
};

const ReactDom = {
  render,
};

export default ReactDom;

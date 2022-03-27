import { addEvent } from "./event.js";
/**
 * 虚拟DOM => 真实DOM，然后挂载到root上
 * @param {*} vdom
 * @param {*} container
 */
const render = (vdom, container) => {
  const dom = createDom(vdom);
  dom && container.appendChild(dom);
};

/**
 * 虚拟DOM => 真实DOM
 * @param {*} vdom
 * @return dom
 */
export const createDom = (vdom) => {
  // 数字或者字符串 => 文本节点
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
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
      return updateClassComponent(vdom);
    } else {
      // 是函数组件
      return updateFunctionalComponent(vdom);
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
  children.forEach((child) => render(child, dom));
};

/**
 *
 * @param {*} oldVdom
 * @param {*} newVdom
 * @param {*} parentDom
 * @return {Object} currentNode
 */
export const compareTwoVDom = (oldVdom, newVdom, parentDom) => {
  if (oldVdom === null && newVdom === null) return null;
  else if (oldVdom && newVdom === null) {
    // 老有 新无 => 删除
    const currentDom = oldVdom.dom;

    if (oldVdom.componentInstance.componentWillUnmount)
      oldVdom.componentInstance.componentWillUnmount();

    parentDom.removeChild(currentDom);
    return null;
  } else if (newVdom && oldVdom === null) {
    // 老无 新有 -> 插入
    const currentDom = createDom(newVdom);
    newVdom.dom = currentDom;
    // FIXME 这里appendchild有问题
    parentDom.appendChild(currentDom);
    return newVdom;
  } else {
    // 新有 老有 => domdiff
    updateElement(oldVdom, newVdom);
    return newVdom;
  }
};

/**
 * 更新元素
 * @param {*} oldVdom
 * @param {*} newVdom
 */
const updateElement = (oldVdom, newVdom) => {
  const currentDom = oldVdom.dom;
  newVdom.dom = currentDom;
  newVdom.classInstance = oldVdom.classInstance;
  // 两种情况
  // 1.原生DOM
  if (typeof oldVdom.type === "string") {
    debugger;
    // 更新属性
    updateProperties(currentDom, oldVdom.props, newVdom.props);
    // 更新children
    updateChildren(currentDom, newVdom.props.children, oldVdom.props.children);
  }
  // 2.类组件或者函数组件
  else if (typeof oldVdom.type === "function") {
    updateClassInstance(oldVdom, newVdom);
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
    compareTwoVDom(oldChildren[i], newChildren[i], dom);
  }
};

const updateClassInstance = (oldVdom, newVdom) => {
  const classInstance = oldVdom.componentInstance;
  if (classInstance.componentWillReceiveProps)
    classInstance.componentWillReceiveProps();

  classInstance.updater.emitUpdate(newVdom.props);
};

/**
 * 接收类组件，生成真实要渲染的VDOM
 * @param {*} vdom
 * @returns dom
 * ! 特别注意 vdom和renderDom的区别： vdom是类组件  renderVdom 是类组件的render执行返回的具体内容
 */
const updateClassComponent = (vdom) => {
  const { type: ClassComponent, props } = vdom;
  const componentInstance = new ClassComponent(props);
  // 记录实例
  vdom.componentInstance = componentInstance;
  if (componentInstance.componentWillMount)
    componentInstance.componentWillMount();
  // 生成新Vdom
  const renderVdom = componentInstance.render();
  // 根据Vdom生成真实DOM
  const dom = createDom(renderVdom);
  // ? 这里没看懂要干什么用，因为componentInstance上面就有dom
  vdom.dom = renderVdom.dom = dom;
  // TODO 先这么写
  if (componentInstance.componentDidMount)
    componentInstance.componentDidMount();
  // 记录真实DOM
  componentInstance.dom = dom;
  // 记录Vdom
  componentInstance.oldVdom = renderVdom;
  return dom;
};

/**
 * 接收函数组件，生成真实要渲染的VDOM
 * @param {*} vdom
 * @returns dom
 */
const updateFunctionalComponent = (vdom) => {
  const { type: functionalComponent, props } = vdom;
  const renderVdom = functionalComponent(props);
  return createDom(renderVdom);
};

const ReactDom = {
  render,
};

export default ReactDom;

/**
 * 虚拟DOM => 真实DOM，然后挂载到root上
 * @param {*} vdom
 * @param {*} container
 */
const render = (vdom, container) => {
  const dom = createDom(vdom);
  container.appendChild(dom);
};

/**
 * 虚拟DOM => 真实DOM
 * @param {*} vdom
 */
const createDom = (vdom) => {
  if (!vdom) return "";
  // 数字或者字符串 => 文本节点
  if (typeof vdom === "string" || typeof vdom === "number") {
    return document.createTextNode(vdom);
  }
  const {
    type, // 字符串/组件
    props,
    props: { children },
  } = vdom;
  let dom;
  if (typeof type === "function") {
    return updateFunctionalComponent(vdom);
  } else {
    dom = document.createElement(type);
  }
  updateProperties(dom, props);
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
  return dom;
};

/**
 * 更新DOM属性
 * @param {*} dom
 * @param {*} props
 */
const updateProperties = (dom, props) => {
  for (const key in props) {
    if (key === "children") continue;
    if (key === "style") {
      const styleObj = props[key];
      for (const prop in styleObj) {
        dom.style[prop] = styleObj[prop];
      }
    } else {
      dom[key] = props[key];
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
 * 接收函数组件，生成真实要渲染的VDOM
 * @param {*} vdom
 * @returns
 */
const updateFunctionalComponent = (vdom) => {
  const { type, props } = vdom;
  const renderVdom = type(props);
  return createDom(renderVdom);
};

const ReactDom = {
  render,
};

export default ReactDom;

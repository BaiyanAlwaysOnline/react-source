import Component from "./Component.js";
/**
 * 创建一个虚拟DOM结构
 * @param {*} type dom元素类型 字符串（dom元素 ）/组件
 * @param {*} config 属性对象
 * @param  {...any} children
 */
export const createElement = (type, config, ...children) => {
  let ref;
  if (config) {
    Reflect.deleteProperty(config, "_owner");
    Reflect.deleteProperty(config, "_store");
    Reflect.deleteProperty(config, "__self");
    Reflect.deleteProperty(config, "__source");
    ref = config.ref; // ref babel编译的时候会放在config中，使用的时候和props同级
    Reflect.deleteProperty(config, "ref");
  }
  let props = { ...config };
  // children可能是数组（多个儿子），也可能是一个字符串或者数字，也可能是一个null
  if (children.length === 0) props.children = null;
  if (children.length === 1) props.children = children[0];
  if (children.length > 1) props.children = children;
  return {
    type,
    props,
    ref,
  };
};

/**
 * 创建一个obj
 * @returns {obj} { current: null }
 */
const createRef = () => {
  return { current: null };
};

const React = {
  createElement,
  Component,
  createRef,
};

export default React;

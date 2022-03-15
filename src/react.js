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

const React = {
  createElement,
};
export default React;

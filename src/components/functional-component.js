import React from "../react";

/**
 * 函数组件渲染过程：
 * 定义一个函数组件，首字母必须大写；
 * ? 1. 定义一个React元素，也就是虚拟DOM，它的type=Title
 * 2. render方法会执行这个函数组件，并传入props对象，得到生成好的虚拟DOM
 * 3. 把返回的虚拟DOM转成真实DOM插入到页面中
 * @param {*} props
 * @returns
 */
const Title = (props) => {
  return (
    <h3 className={props.className}>
      加油💪🏻
      <span style={props.style}>{props.name}</span>
    </h3>
  );
};

// export default React.createElement(Title, {
//   className: "title",
//   style: { color: "purple" },
// });

export default (
  <Title className="title" style={{ color: "purple" }} name="打工人！" />
);

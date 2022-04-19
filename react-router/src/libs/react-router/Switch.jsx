import React from "react";
import matchPath from "./matchPath";
import RouterContext from "./RouterContext";

/**
 * 1. 被Switch包裹的Route组件，匹配到第一个路径，就会终止，否则每个Route组件内部都会跑一遍matchPath的逻辑
 * 2. match到的组件还会将computedMatch复用
 * 提升性能
 */
class Switch extends React.Component {
  static contextType = RouterContext;
  render() {
    const { location } = this.context;
    const { children } = this.props;
    let element, match;
    console.log("一共", children.length);
    React.Children.forEach(children, (child) => {
      if (!match && React.isValidElement(child)) {
        console.log("匹配到了");
        const { path, ...restOpts } = child.props;
        match = matchPath(path, location.pathname, restOpts);
        if (match)
          element = React.cloneElement(child, {
            ...child.props,
            computedMatch: match, // 缓存匹配结果，Route拿到直接使用
          });
      }
    });
    return element ? element : null;
  }
}

export default Switch;

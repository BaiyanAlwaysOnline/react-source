import React from "react";
import RouterContext from "./RouterContext";

/**
 * Router容器干两件事
 * 1. 获取不同的history对象，将location通过context向下层级组件传递，Route可以通过Content获取到location，根据hash或者pathname跟自己的path做匹配,渲染对应的组件
 * 2. 监听路径变化，触发setState
 */
class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.history.location,
    };
    this.unListen = props.history.listen((location) => {
      // 监听路由变化，更新state，触发react重新渲染 Route 匹配到的组件
      this.setState({
        location,
      });
    });
  }
  componentWillUnmout() {
    this.unListen();
  }
  render() {
    const value = {
      location: this.state.location,
      history: this.props.history,
    };
    return (
      <RouterContext.Provider value={value}>
        {this.props.children}
      </RouterContext.Provider>
    );
  }
}

export default Router;

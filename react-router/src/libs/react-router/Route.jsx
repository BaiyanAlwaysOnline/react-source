import React from "react";
import matchPath from "./matchPath";
import RouterContext from "./RouterContext";

class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(ctx) => {
          const { history, location } = ctx;
          const { pathname } = location;
          const {
            path,
            component: Component,
            render,
            children,
            computedMatch,
            ...restProps
          } = this.props;
          console.log("Route render", computedMatch);
          const match = computedMatch || matchPath(path, pathname, restProps);
          const props = {
            history,
            location,
          };
          let element;
          if (match) {
            props.match = match;
            if (children) {
              element = children(props);
            } else if (Component) {
              element = <Component {...props} />;
            } else if (render) {
              element = render(props);
            } else {
              element = null;
            }
          } else if (children) {
            element = children(props);
          } else {
            element = null;
          }
          // ! tips: 这种写法是在每次路由渲染时，更新一下RouterContext.Provider的value
          return (
            <RouterContext.Provider value={props}>
              {element}
            </RouterContext.Provider>
          );
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;

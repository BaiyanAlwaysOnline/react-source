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
          if (match) {
            props.match = match;
            if (children) {
              return children(props);
            } else if (Component) {
              return <Component {...props} />;
            } else if (render) {
              return render(props);
            }
            return null;
          }
          if (children) {
            return children(props);
          }
          return null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;

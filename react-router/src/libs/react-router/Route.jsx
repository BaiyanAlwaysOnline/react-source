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
            return <Component {...props} />;
          }
          return null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;

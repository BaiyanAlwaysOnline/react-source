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
          const { path, component: Component, ...restProps } = this.props;
          const { keys, regexp } = matchPath(path, restProps);
          const match = regexp.exec(pathname);
          const props = {
            history,
            location,
          };
          if (match) {
            const [url, ...params] = match;
            props.match = {
              isExact: url === pathname,
              url,
              path,
              params: keys.reduce((prev, k, index) => {
                prev[k] = params[index];
                return prev;
              }, {}),
            };
            return <Component {...props} />;
          }
          return null;
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;

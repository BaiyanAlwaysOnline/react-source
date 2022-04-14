import React from "react";
import RouterContext from "./RouterContext";

class Route extends React.Component {
  render() {
    return (
      <RouterContext.Consumer>
        {(ctx) => {
          debugger;
          const { history, location } = ctx;
          const { path, component: Component } = this.props;
          const match = location.pathname === path;
          const props = {
            history,
            location,
            match: {},
          };
          if (match) {
            return <Component {...props} />;
          }
        }}
      </RouterContext.Consumer>
    );
  }
}

export default Route;

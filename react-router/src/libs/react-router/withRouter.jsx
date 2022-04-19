import React from "react";
import RouterContext from "./RouterContext";

// HOC 属性代理
const withRouter = (Old) => (props) =>
  (
    <RouterContext.Consumer>
      {(ctx) => {
        return <Old {...ctx} {...props} />;
      }}
    </RouterContext.Consumer>
  );

export default withRouter;

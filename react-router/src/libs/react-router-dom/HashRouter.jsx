import { createHashHistory } from "../history";
import React from "react";
import { Router } from "../react-router/index.js";

class HashRouter extends React.Component {
  history = createHashHistory();
  render() {
    return <Router history={this.history}>{this.props.children}</Router>;
  }
}

export default HashRouter;

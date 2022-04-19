import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route } from "./libs/react-router-dom";

// import Post from "./components/Post";
// import User from "./components/User";

// React.lazy的实现
const lazy = (load) => {
  return class extends React.Component {
    state = {
      Component: null,
    };
    componentDidMount() {
      // dynamic import 会返回 {default} || {xModule, yModule} ,取决于如何export
      load().then((res) => {
        this.setState({
          Component: res.default || res,
        });
      });
    }
    render() {
      const { Component } = this.state;
      return Component ? <Component /> : null;
    }
  };
};

const Post = lazy(() => import("./components/Post"));
const User = lazy(() => import("./components/User"));

ReactDOM.render(
  <Router>
    <React.Suspense fallback={<div>loading...</div>}>
      <div>
        <Route path="/post/:id/:title" component={Post} />
        <Route path="/" component={User} />
      </div>
    </React.Suspense>
  </Router>,
  document.getElementById("root")
);

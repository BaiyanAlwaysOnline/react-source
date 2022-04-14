import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route } from "./libs/react-router-dom";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import User from "./components/User";

ReactDOM.render(
  <Router>
    <Route path={"/"} component={Welcome} exact />
    <Route path={"/home"} component={Home} />
    <Route path={"/user"} component={User} />
  </Router>,
  document.getElementById("root")
);

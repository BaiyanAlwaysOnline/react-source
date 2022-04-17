import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Link } from "./libs/react-router-dom";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import User from "./components/User";

ReactDOM.render(
  <Router>
    <ul>
      <li>
        <Link to="/">Welcome</Link>
      </li>
      <li>
        <Link to="/home">Home</Link>
      </li>
      <li>
        <Link to="/user">User</Link>
      </li>
    </ul>
    <Route path={"/"} component={Welcome} exact />
    <Route path={"/home"} component={Home} />
    <Route path={"/user"} component={User} />
  </Router>,
  document.getElementById("root")
);

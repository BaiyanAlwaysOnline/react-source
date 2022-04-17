import React from "react";
import ReactDOM from "react-dom";
import { HashRouter as Router, Route, Link } from "./libs/react-router-dom";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import User from "./components/User";
import Post from "./components/Post";

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
      <li>
        {/* <Link to="/post/123">post</Link> */}
        <Link to={{ pathname: "/post/1", state: { title: "Post1的标题" } }}>
          post
        </Link>
      </li>
    </ul>
    <Route path={"/"} component={Welcome} />
    <Route path={"/home"} component={Home} />
    <Route path={"/user"} component={User} />
    <Route path={"/post/:id"} component={Post} />
  </Router>,
  document.getElementById("root")
);

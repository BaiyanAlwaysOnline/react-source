import React from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Link,
  Switch,
  NavLink,
  Redirect,
  Prompt,
} from "react-router-dom";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import User from "./components/User";
import Post from "./components/Post";

ReactDOM.render(
  <Router>
    <ul>
      <li>
        <NavLink exact activeStyle={{ color: "red" }} to="/">
          Welcome
        </NavLink>
      </li>
      <li>
        <NavLink to="/home">Home</NavLink>
      </li>
      <li>
        <NavLink to="/user">User</NavLink>
      </li>
      <li>
        <NavLink to="/render">Render</NavLink>
      </li>
      <li>
        <NavLink to="/children">children</NavLink>
      </li>
      <li>
        {/* <NavLink to="/post/123">post</NavLink> */}
        <NavLink to={{ pathname: "/post/1", state: { title: "Post1的标题" } }}>
          post
        </NavLink>
      </li>
    </ul>
    {/* <Switch>
      <Route path={"/home"} component={Home} />
      <Route path={"/user"} component={User} />
      <Route path={"/post/:id"} component={Post} />
      <Route path={"/"} component={Welcome} />
    </Switch> */}
    <Route path={"/"} component={Welcome} exact />
    <Route
      path={"/render"}
      render={(props) => {
        console.log(props);
        return <Redirect to="/" />;
      }}
    />
    <Route
      path={"/children"}
      children={(props) => {
        console.log(props);
        return <div>sth XXXX</div>;
      }}
    />
    <Route path={"/home"} component={Home} />
    <Route path={"/user"} component={User} />
    <Route path={"/post/:id"} component={Post} />
  </Router>,
  document.getElementById("root")
);

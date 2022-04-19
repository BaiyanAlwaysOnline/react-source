import React from "react";
import ReactDOM from "react-dom";
import {
  HashRouter as Router,
  Route,
  Link,
  useHistory,
  useLocation,
  useParams,
  useRouteMatch,
} from "./libs/react-router-dom";

const App = () => {
  const match = useRouteMatch({ path: "/app" });
  console.log("APP match", match);
  return match ? <div>App</div> : <div>Not Found</div>;
};

const Post = () => {
  const params = useParams();
  console.log("params", params);
  const location = useLocation();
  console.log("location", location);
  const history = useHistory();
  console.log("history", history);
  const match = useRouteMatch();
  console.log("match", match);
  return (
    <div>
      <div>Post</div>
      <div> id: {params.id}</div>
      <div>title: {params.title}</div>
    </div>
  );
};

ReactDOM.render(
  <Router>
    <Link to="/post/12/baiyan">Post</Link>
    <Link to="/app">App</Link>
    <Route path="/post/:id/:title" component={Post} />
    <App />
  </Router>,
  document.getElementById("root")
);

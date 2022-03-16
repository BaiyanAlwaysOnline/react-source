import ReactDOM from "./react-dom";
import Welcome from "./components/class-component";

console.log(JSON.stringify(Welcome, null, 2), Welcome.isReactComponent);
const root = document.getElementById("root");

ReactDOM.render(
  <Welcome className="title" style={{ color: "purple" }} name="打工人！" />,
  root
);

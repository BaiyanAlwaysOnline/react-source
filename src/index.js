import ReactDOM from "./react-dom";
import React from "./react.js";
// import Welcome from "./components/class-component";
// import Tick from "./components/setState";
// import Sum from "./components/createRef";
// import Counter from "./components/lifeCycle-base";
// import Counter from "./components/lifeCycle-new";
// import Context from "./components/context";
import PureComponent from "./components/pure-component";

const root = document.getElementById("root");
ReactDOM.render(
  // <Welcome className="title" style={{ color: "purple" }} name="打工人！" />,
  // <Tick />,
  // <Sum />,
  // <Context />,
  <PureComponent />,
  root
);

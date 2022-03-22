import ReactDOM from "./react-dom";
// import Welcome from "./components/class-component";
// import Tick from "./components/setState";
// import Sum from "./components/createRef";
import Counter from "./components/lifeCycle-base";

const root = document.getElementById("root");
ReactDOM.render(
  // <Welcome className="title" style={{ color: "purple" }} name="打工人！" />,
  // <Tick />,
  // <Sum />,
  <Counter />,
  root
);

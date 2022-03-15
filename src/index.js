import ReactDOM from "./react-dom";
import element from "./components/functional-component";

console.log(JSON.stringify(element, null, 2));
const root = document.getElementById("root");

ReactDOM.render(element, root);

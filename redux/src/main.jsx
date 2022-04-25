import React from "react";
import ReactDOM from "react-dom/client";
import Counter1 from "./components/Counter1.jsx";
import Counter2 from "./components/Counter2.jsx";
import ApplyMiddlewareDemo from "./components/ApplyMiddlewareDemo.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <div>
    <Counter1 />
    <Counter2 />
    <ApplyMiddlewareDemo />
  </div>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "./react-redux";
import store from "./store/index";

import Counter1 from "./components/Counter1.jsx";
import Counter2 from "./components/Counter2.jsx";
import ApplyMiddlewareDemo from "./components/ApplyMiddlewareDemo.jsx";
import ReactRedux from "./components/ReactRedux.jsx";
import ReactRedux1 from "./components/ReactRedux1.jsx";
import Counter3 from "./components/Counter3.jsx";
// import { Test1, Test2 } from "./components/test.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    {/* <Counter1 /> */}
    {/* <Counter2 /> */}
    {/* <ApplyMiddlewareDemo /> */}
    <ReactRedux />
    <ReactRedux1 />
    {/* <Counter3 /> */}
  </Provider>
);

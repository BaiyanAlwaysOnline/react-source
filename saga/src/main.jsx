import React from "react";
import ReactDOM from "react-dom/client";
import Counter from "./components/Counter.jsx";
import store from "./store";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Counter />
  </Provider>
);

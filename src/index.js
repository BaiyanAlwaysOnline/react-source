import React from "./react.js";
import ReactDOM from "./react-dom";

const element = React.createElement(
  "h2",
  {
    className: "title",
    style: {
      color: "red",
    },
  },
  "title",
  React.createElement(
    "span",
    {
      className: "content",
      style: {
        color: "blue",
      },
    },
    "打工人！"
  )
);

console.log(JSON.stringify(element, null, 2));
const root = document.getElementById("root");

ReactDOM.render(element, root);

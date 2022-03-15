import React from "../react.js";

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

export default element;

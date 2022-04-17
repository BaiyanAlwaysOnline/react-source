import React, { useContext } from "react";
import RouterContext from "../react-router/RouterContext";

export default function Link(props) {
  const { history } = useContext(RouterContext);

  return (
    <a
      href=""
      {...props}
      onClick={(e) => {
        e.preventDefault();
        if (typeof props.to === "string") {
          history.push(props.to);
        } else {
          history.push(props.to.pathname, props.to.state);
        }
      }}
    >
      {props.children}
    </a>
  );
}

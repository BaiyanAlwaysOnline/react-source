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
        history.push(props.to);
      }}
    >
      {props.children}
    </a>
  );
}

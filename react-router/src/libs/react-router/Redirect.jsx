import React, { useEffect, useContext } from "react";
import RouterContext from "./RouterContext.js";

const Redirect = ({ to }) => {
  const { history } = useContext(RouterContext);
  useEffect(() => {
    history.push(to);
  }, []);
  return null;
};

export default Redirect;

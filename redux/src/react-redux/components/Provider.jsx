import React from "react";
import ReactReduxContext from "../ReactReduxContext";

const Provider = ({ store, children }) => {
  return (
    <ReactReduxContext.Provider value={{ store }}>
      {children}
    </ReactReduxContext.Provider>
  );
};

export default Provider;

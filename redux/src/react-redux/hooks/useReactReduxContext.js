import { useContext } from "react";
import ReactReduxContext from "../ReactReduxContext";

const useReactReduxContext = () => {
  return useContext(ReactReduxContext);
};

export default useReactReduxContext;

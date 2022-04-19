import { useContext } from "react";
import RouterContext from "./RouterContext";
import matchPath from "./matchPath";

export const useParams = () => {
  const match = useContext(RouterContext).match;
  return match ? match.params : {};
};

export const useLocation = () => {
  return useContext(RouterContext).location;
};

export const useHistory = () => {
  return useContext(RouterContext).history;
};

// 如果传了初始match，就返回根据初始match计算后的match
// ! 作用： 组件可以根据自定义的match，渲染不同内容
export const useRouteMatch = (initMatch) => {
  const location = useLocation();
  const match = useContext(RouterContext).match;
  return initMatch
    ? matchPath(initMatch.path, location.pathname, initMatch)
    : match;
};

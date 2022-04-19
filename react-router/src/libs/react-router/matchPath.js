import { pathToRegexp } from "path-to-regexp";

const compilePath = (path, options) => {
  const keys = [];
  const regexp = pathToRegexp(path, keys, { end: !!options.exact });
  return {
    keys: keys.map((k) => k.name),
    regexp,
  };
};

/**
 *
 * @param {*} path Route的path属性 /post/:id
 * @param {*} pathname  真实路径 /post/1
 * @param {*} options
 * @returns
 */
export default function matchPath(path, pathname, options = { exact: false }) {
  debugger;
  const { keys, regexp } = compilePath(path, options);
  const match = regexp.exec(pathname);
  if (match) {
    const [url, ...params] = match;
    return {
      isExact: url === pathname,
      url,
      path,
      params: keys.reduce((prev, k, index) => {
        prev[k] = params[index];
        return prev;
      }, {}),
    };
  }
  return null;
}

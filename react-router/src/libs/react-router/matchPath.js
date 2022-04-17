import { pathToRegexp } from "path-to-regexp";

const compilePath = (path, options) => {
  const keys = [];
  const regexp = pathToRegexp(path, keys, { end: !!options.exact });
  return {
    keys: keys.map((k) => k.name),
    regexp,
  };
};

export default function matchPath(path, options = { exact: false }) {
  const { keys, regexp } = compilePath(path, options);
  return { keys, regexp };
}

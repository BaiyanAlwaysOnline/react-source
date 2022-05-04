import * as effectTypes from "./effectTypes.js";

// effect其实就是actionCreators

export function take(actionType) {
  return { type: effectTypes.TAKE, actionType };
}

export function put(action) {
  return { type: effectTypes.PUT, action };
}

export function delay(delay) {
  return { type: effectTypes.DELAY, delay };
}

import * as actionTypes from "../action-types.js";
const actionCreators = {
  add: () => ({
    type: actionTypes.COUNTER1_ADD,
  }),
  minus: () => ({
    type: actionTypes.COUNTER1_MINUS,
  }),
  set: (payload) => ({
    type: actionTypes.COUNTER1_SET,
    payload,
  }),
};
export default actionCreators;

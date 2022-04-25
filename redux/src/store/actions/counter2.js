import * as actionTypes from "../action-types.js";
const actionCreators = {
  add: () => ({
    type: actionTypes.COUNTER2_ADD,
  }),
  minus: () => ({
    type: actionTypes.COUNTER2_MINUS,
  }),
  set: (payload) => ({
    type: actionTypes.COUNTER2_SET,
    payload,
  }),
};
export default actionCreators;

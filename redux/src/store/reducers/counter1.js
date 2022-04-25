import * as actionTypes from "../action-types.js";
const counter1 = (state = { num: 0 }, action) => {
  switch (action.type) {
    case actionTypes.COUNTER1_ADD:
      return { num: state.num + 1 };
    case actionTypes.COUNTER1_MINUS:
      return { num: state.num - 1 };
    case actionTypes.COUNTER1_SET:
      return action.payload;
    default:
      return state;
  }
};

export default counter1;

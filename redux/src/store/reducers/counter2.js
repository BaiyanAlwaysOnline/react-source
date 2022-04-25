import * as actionTypes from "../action-types.js";
const counter2 = (state = { num: 0 }, action) => {
  switch (action.type) {
    case actionTypes.COUNTER2_ADD:
      return { num: state.num + 1 };
    case actionTypes.COUNTER2_MINUS:
      return { num: state.num - 1 };
    case actionTypes.COUNTER2_SET:
      return action.payload;
    default:
      return state;
  }
};

export default counter2;

import { CURRENT_ORDER_SET, USER_LEVEL_SET } from "./types";

const initialState = {
  userLevel: "CUSTOMER",
  currentOrder: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LEVEL_SET:
      return {
        ...state,
        userLevel: action.payload,
      };

    case CURRENT_ORDER_SET:
      return {
        ...state,
        currentOrder: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;

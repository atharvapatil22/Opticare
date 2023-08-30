import { USER_LEVEL_SET } from "./types";

const initialState = {
  userLevel: "CUSTOMER",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_LEVEL_SET:
      return {
        ...state,
        userLevel: action.payload,
      };

    default:
      return state;
  }
};

export default reducer;

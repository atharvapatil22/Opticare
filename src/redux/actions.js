import { CURRENT_ORDER_SET, USER_LEVEL_SET } from "./types";

export const setUserLevel = (userLevel) => {
  return {
    type: USER_LEVEL_SET,
    payload:
      userLevel === "CUSTOMER" || userLevel === "ADMIN"
        ? userLevel
        : "CUSTOMER",
  };
};

export const setCurrentOrder = (currentOrder) => {
  return {
    type: CURRENT_ORDER_SET,
    payload: currentOrder,
  };
};

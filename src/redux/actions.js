import { ADD_ORDER_ITEM, UPDATE_ITEM_QUANTITY, USER_LEVEL_SET } from "./types";

export const setUserLevel = (userLevel) => {
  return {
    type: USER_LEVEL_SET,
    payload:
      userLevel === "CUSTOMER" || userLevel === "ADMIN"
        ? userLevel
        : "CUSTOMER",
  };
};

export const addOrderItem = (itemData) => {
  return {
    type: ADD_ORDER_ITEM,
    payload: itemData,
  };
};

export const updateItemQuantity = (itemData) => {
  return {
    type: UPDATE_ITEM_QUANTITY,
    payload: itemData,
  };
};

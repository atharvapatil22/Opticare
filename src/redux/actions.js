import {
  ADD_CART_ITEM,
  CLEAR_CART2,
  UPDATE_ITEM_QUANTITY2,
  USER_LEVEL_SET,
} from "./types";

export const setUserLevel = (userLevel) => {
  return {
    type: USER_LEVEL_SET,
    payload:
      userLevel === "CUSTOMER" || userLevel === "ADMIN"
        ? userLevel
        : "CUSTOMER",
  };
};

export const addCartItem = (itemData) => {
  return {
    type: ADD_CART_ITEM,
    payload: itemData,
  };
};

export const updateItemQuantity2 = (itemData) => {
  return {
    type: UPDATE_ITEM_QUANTITY2,
    payload: itemData,
  };
};

export const clearCart2 = (payload) => {
  return {
    type: CLEAR_CART2,
    payload: payload,
  };
};

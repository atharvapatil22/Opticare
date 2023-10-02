import {
  ADD_CART_ITEM,
  ADD_COUPON_DISCOUNT,
  ADMIN_CREDS_SET,
  CLEAR_CART2,
  EDIT_LENS_POWER_AND_PRICE,
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

export const setAdminCreds = (adminCreds) => {
  return {
    type: ADMIN_CREDS_SET,
    payload: adminCreds,
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

export const editLensPowerandPrice = (payload) => {
  return {
    type: EDIT_LENS_POWER_AND_PRICE,
    payload: payload,
  };
};

export const addCouponDiscount = (payload) => {
  return {
    type: ADD_COUPON_DISCOUNT,
    payload: payload,
  };
};

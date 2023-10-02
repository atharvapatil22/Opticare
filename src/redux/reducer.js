import { productCategories } from "../constants";
import {
  ADD_CART_ITEM,
  ADD_COUPON_DISCOUNT,
  ADMIN_CREDS_SET,
  CLEAR_CART2,
  EDIT_LENS_POWER_AND_PRICE,
  UPDATE_ITEM_QUANTITY2,
  USER_LEVEL_SET,
} from "./types";

const initialState = {
  userLevel: "CUSTOMER",
  adminCreds: {},
  orderItems: [],
  couponDiscount: 0,
};

const reducer = (state = initialState, action) => {
  let new_state = { ...state };
  let product_id = null,
    item_to_update = null;

  switch (action.type) {
    case USER_LEVEL_SET:
      return {
        ...state,
        userLevel: action.payload,
      };
    case ADMIN_CREDS_SET:
      return {
        ...state,
        adminCreds: action.payload,
      };

    case ADD_CART_ITEM:
      new_state.orderItems.push(action.payload);
      return new_state;

    case UPDATE_ITEM_QUANTITY2:
      const { quantity } = action.payload;
      product_id = action.payload.product_id;

      // Find Index
      item_to_update = new_state.orderItems.findIndex(
        (obj) => obj.product_id == product_id
      );

      // When quantity is updated to 0, it means remove the item from current order
      if (quantity === 0) new_state.orderItems.splice(item_to_update, 1);
      else {
        const itemRef = new_state.orderItems[item_to_update];
        itemRef.quantity = quantity;

        // For Lenses
        if (!!itemRef["linkedLens"]) {
          if (
            itemRef.category === "spectacles" ||
            itemRef.category === "sunglasses"
          )
            itemRef["linkedLens"].quantity = quantity * 2;
          else itemRef["linkedLens"].quantity = quantity;
        }
      }
      return new_state;

    case CLEAR_CART2:
      return {
        ...state,
        orderItems: [],
        couponDiscount: 0,
      };

    case EDIT_LENS_POWER_AND_PRICE:
      const { power, new_price } = action.payload;

      product_id = action.payload.product_id;

      // Find Index
      item_to_update = new_state.orderItems.findIndex(
        (obj) => obj.product_id == product_id
      );
      new_state.orderItems[item_to_update].linkedLens.eye_power = power;
      if (!!new_price) {
        new_state.orderItems[item_to_update].linkedLens.price = new_price;
        if (
          new_state.orderItems[item_to_update].category ===
          productCategories.LENSES
        )
          new_state.orderItems[item_to_update].price = new_price;
      }
      return new_state;

    case ADD_COUPON_DISCOUNT:
      return { ...new_state, couponDiscount: parseInt(action.payload) };

    default:
      return state;
  }
};

export default reducer;

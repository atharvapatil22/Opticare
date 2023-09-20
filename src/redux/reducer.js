import {
  ADD_CART_ITEM,
  CLEAR_CART2,
  EDIT_LENS_POWER,
  UPDATE_ITEM_QUANTITY2,
  USER_LEVEL_SET,
} from "./types";

const initialState = {
  userLevel: "CUSTOMER",

  orderItems: [],
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
      };

    case EDIT_LENS_POWER:
      console.log("came here");
      const { power } = action.payload;
      product_id = action.payload.product_id;

      // Find Index
      item_to_update = new_state.orderItems.findIndex(
        (obj) => obj.product_id == product_id
      );
      new_state.orderItems[item_to_update].linkedLens.eye_power = power;
      console.log("finished opps", new_state);
      return new_state;

    default:
      return state;
  }
};

export default reducer;

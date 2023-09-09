import { ADD_ORDER_ITEM, UPDATE_ITEM_QUANTITY, USER_LEVEL_SET } from "./types";

const initialState = {
  userLevel: "CUSTOMER",
  currentOrder: {
    totalItems: 0,
    specs: [],
    sunglasses: [],
    lenses: [],
    accessories: [],
  },
};

const reducer = (state = initialState, action) => {
  let category;
  let new_state = { ...state };
  switch (action.type) {
    case USER_LEVEL_SET:
      return {
        ...state,
        userLevel: action.payload,
      };

    case ADD_ORDER_ITEM:
      category = action.payload.category;

      new_state.currentOrder[category].push(action.payload.item);
      new_state.currentOrder.totalItems += 1;

      return new_state;

    case UPDATE_ITEM_QUANTITY:
      category = action.payload.category;
      let id = action.payload.id;
      let quantity = action.payload.quantity;

      // Find Index
      const item_to_update = new_state.currentOrder[category].findIndex(
        (obj) => obj.id == id
      );

      // When quantity is updated to 0, it means remove the item from current order
      if (quantity === 0) {
        new_state.currentOrder[category].splice(item_to_update, 1);
        new_state.currentOrder.totalItems -= 1;
      } else
        new_state.currentOrder[category][item_to_update].quantity = quantity;
      return new_state;

    default:
      return state;
  }
};

export default reducer;

import thunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import mainReducer from "./reducer";

const store = createStore(
  combineReducers({
    globalData: mainReducer,
  }),
  applyMiddleware(thunk)
);

export default store;

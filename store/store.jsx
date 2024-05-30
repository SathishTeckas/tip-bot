import { configureStore, combineReducers } from "@reduxjs/toolkit";
import uiReducer from "./features/uiSlice";
import contractReducer from "./features/contractSlice";

const reducers = combineReducers({
  ui: uiReducer,
  contract: contractReducer,
});

const store = configureStore({
  reducer: reducers,
  devTools: true,
});

export default store;

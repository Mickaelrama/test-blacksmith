import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistReducer } from "redux-persist";

// reducers
import authReducer from "./slices/auth";
import userReducer from "./slices/user";
import parkingReducer from "./slices/parking";

export const persistConfigAuth = {
  key: "auth",
  storage: storage,
};

export const combinedReducer = combineReducers({
  auth: persistReducer(persistConfigAuth, authReducer), // persist store
  user: userReducer,
  parking: parkingReducer,
});

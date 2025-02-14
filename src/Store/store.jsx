import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Slices/userSlice";
import AddressReducer from "../Slices/addressSlice";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    address: AddressReducer,
  },
});

import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "../Slices/userSlice";
import AddressReducer from "../Slices/addressSlice";
import PaymentReducer from "../Slices/paymentSlice";
import ProviderReducer from "../Slices/paymentSlice";
import notificationReducer from "../Slices/notificationSlice";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    address: AddressReducer,
    payment: PaymentReducer,
    provider: ProviderReducer,
    notification: notificationReducer,
  },
});

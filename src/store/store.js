import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import dataReducer from './dataSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    data: dataReducer,
  },
});
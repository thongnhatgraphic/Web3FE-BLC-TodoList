import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import auth from "../features/auth/authSlice";
import market from "../features/market/marketSlice";
import assets from "../features/assets/assetsSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    auth: auth,
    market: market,
    assets: assets
  },
});

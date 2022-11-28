import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: null,
  balance: 0,
  isConnect: false,
};

export const Auth = createSlice({
  name: "auth",
  initialState,
  
  reducers: {
    login: (state, action) => {
      if (action.payload) {
        state.address = action.payload.address;
        state.balance = action.payload.balance
      }
    },
    logout: (state) => {
      state.address = initialState.address;
      state.balance = initialState.balance;
      state.isConnect = initialState.isConnect;
    },
  },

  extraReducers: {},
});

export const { login, logout } = Auth.actions;

export default Auth.reducer;

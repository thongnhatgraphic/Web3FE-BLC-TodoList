import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: null,
  balance: 0,
  isConnect: false
};

export const Auth = createSlice({
  name: 'auth',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    
    login: (state, action) => {
        if ( action.payload) {
            state.address = action.payload
        }
    },
    logout: (state) => {
      state.address = initialState.address
      state.balance = initialState.balance
      state.isConnect = initialState.isConnect
    }
  },
  
  extraReducers: {

  },
});

export const { login, logout } = Auth.actions;


export default Auth.reducer;

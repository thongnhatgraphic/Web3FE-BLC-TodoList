import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  address: null,
  balance: 0,
  isConnect: false
};

export const Auth = createSlice({
  name: 'counter',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    
    login: (state, action) => {
        if ( action.payload?.address) {
            state.address = action.payload.address
        }

    }
  },
  
  extraReducers: {

  },
});

export const { login } = Auth.actions;


export default Auth.reducer;

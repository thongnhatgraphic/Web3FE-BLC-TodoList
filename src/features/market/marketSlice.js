import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listListing: [],


  isConnect: false,
};

export const Market = createSlice({
  name: "market",
  initialState,
  
  reducers: {
    getListListing: (state, action) => {
      state.listListing = action.payload
    },
    
  },

  extraReducers: {},
});

export const { getListListing } = Market.actions;

export default Market.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listAssets: [],

  loadding: false,
  isConnect: false,
};

export const Assets = createSlice({
  name: "assets",
  initialState,
  
  reducers: {
    getListAssets: (state, action) => {
      state.listAssets = action.payload
    },
    openLoadding: state => {
      state.loadding = true
    },
    hideLoadding: state => {
      state.loadding = false
    }
  },

  extraReducers: {},
});

export const { getListAssets, openLoadding, hideLoadding } = Assets.actions;

export default Assets.reducer;

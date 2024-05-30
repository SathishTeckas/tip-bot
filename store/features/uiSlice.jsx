import { createSlice } from "@reduxjs/toolkit";

const uiState = {
  walletAddress: "",
  loading: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState: uiState,
  reducers: {
    setLoadingTrue: (state, action) => {
      state.loading = true;
    },
    setLoadingFalse: (state, action) => {
      state.loading = false;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
  },
});

const { reducer } = uiSlice;

export const { setWalletAddress, setLoadingFalse, setLoadingTrue } =
  uiSlice.actions;

export default reducer;

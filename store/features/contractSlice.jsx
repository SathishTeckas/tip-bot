import { createSlice } from "@reduxjs/toolkit";

const contractState = {
  contractAddress: "",
  tokenAddress: "",
  owner: "",
  balance: 0,
  depositedTokens: 0,
  withdrawnTokens: 0,
  totalTips: 0,
  userCount: 0,
};

export const contractSlice = createSlice({
  name: "contract",
  initialState: contractState,
  reducers: {
    setTotalUserCount: (state, action) => {
      state.userCount = action.payload;
    },
    setTotalWithdrawnAmount: (state, action) => {
      state.withdrawnTokens = action.payload;
    },
    setTotalDepositedAmount: (state, action) => {
      state.depositedTokens = action.payload;
    },
    setTotalTipAmount: (state, action) => {
      state.totalTips = action.payload;
    },
    setContractAddress: (state, action) => {
      state.contractAddress = action.payload;
    },
    setTokenAddress: (state, action) => {
      state.tokenAddress = action.payload;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setOwner: (state, action) => {
      state.owner = action.payload;
    },
  },
});

const { reducer } = contractSlice;

export const {
  setContractAddress,
  setBalance,
  setTokenAddress,
  setTotalDepositedAmount,
  setTotalTipAmount,
  setTotalUserCount,
  setTotalWithdrawnAmount,
  setOwner,
} = contractSlice.actions;

export default reducer;

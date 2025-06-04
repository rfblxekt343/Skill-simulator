import { createSlice } from '@reduxjs/toolkit';

const TOTAL_MISSILES = 10;

const initialState = {
  stock: TOTAL_MISSILES,  // Starting stock of interceptor missiles
  intercepted: 0,         // Successfully intercepted missiles
  missed: 0              // Missed missiles
};

const missileStockGameSlice = createSlice({
  name: 'missileStockGame',
  initialState,
  reducers: {
    interceptMissile: (state) => {
      if (state.stock > 0) {
        state.stock -= 1;
        state.intercepted += 1;
      }
    },
    missMissile: (state) => {
      if (state.stock > 0) {
        state.stock -= 1;
        state.missed += 1;
      }
    },
    resetGame: (state) => {
      state.stock = TOTAL_MISSILES;
      state.intercepted = 0;
      state.missed = 0;
    }
  }
});

export const { interceptMissile, missMissile, resetGame } = missileStockGameSlice.actions;
export default missileStockGameSlice.reducer;
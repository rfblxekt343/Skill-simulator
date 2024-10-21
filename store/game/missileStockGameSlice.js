import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stock: 25,        // Total missiles to intercept
  intercepted: 0,   // Missiles successfully intercepted by the player
  missed: 0         // Missiles missed by the player
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
      state.stock = 25;  // Reset stock to 25 (or a bigger number if needed)
      state.intercepted = 0;
      state.missed = 0;
    }
  }
});

export const { interceptMissile, missMissile, resetGame } = missileStockGameSlice.actions;
export default missileStockGameSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stock: 10, // Initial stock count
};

const missileStockSlice = createSlice({
  name: 'missileStock',
  initialState,
  reducers: {
    increment: (state) => {
      state.stock += 1;
    },
    decrement: (state) => {
      if (state.stock > 0) {
        state.stock -= 1; // Prevent going below zero
      }
    },
  },
});

export const { increment, decrement } = missileStockSlice.actions;
export default missileStockSlice.reducer;

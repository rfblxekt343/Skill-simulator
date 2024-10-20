import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stock: 50,  // Stock visible to the user
};

const missileStockGameSlice = createSlice({
  name: 'missileStockGame',
  initialState,
  reducers: {
    decrementStock: (state, action) => {
      const decrementValue = action.payload;  // Get the value to decrease by
      if (state.stock >= decrementValue) {  // Ensure stock does not go below 0
        state.stock -= decrementValue;
      } else {
        state.stock = 0;  // Set stock to 0 if decrement exceeds current stock
      }
    },
    resetStock: (state) => {
      state.stock = 10;  // Reset stock to 10
    },
  },
});

export const { decrementStock, resetStock } = missileStockGameSlice.actions;
export default missileStockGameSlice.reducer;

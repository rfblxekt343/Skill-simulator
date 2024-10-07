import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stockUI: 10,  // Stock visible to the user
  actualStock: 10, // Real missile stock (behind the scenes)
};

const missileStockSlice = createSlice({
  name: 'missileStock',
  initialState,
  reducers: {
    incrementStockUI: (state) => {
      if (state.stockUI < 10) {  // Ensure stock does not exceed 10
        state.stockUI += 1;
      }
    },
    decrementStockUI: (state) => {
      if (state.stockUI > 0) {  // Ensure stock does not go below 0
        state.stockUI -= 1;
      }
    },
    // Only change the actual stock behind the scenes
    decrementActualStock: (state) => {
      if (state.actualStock > 0) {
        state.actualStock -= 1;
      }
    },
    // Reset UI stock if necessary
    resetUIStock: (state) => {
      state.stockUI = state.actualStock;  // Sync UI stock with the actual stock
    },
  },
});

export const { 
  incrementStockUI, 
  decrementStockUI, 
  decrementActualStock, 
  incrementActualStock, 
  resetUIStock 
} = missileStockSlice.actions;

export default missileStockSlice.reducer;

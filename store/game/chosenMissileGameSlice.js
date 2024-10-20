// store/chosenMissileGameSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chosenMissile: null,    
}
const chosenMissileGameSlice = createSlice({
  name: 'chosenMissile',
  initialState,
  reducers: {
    setChosenMissile: (state, action) => {
      state.chosenMissile = action.payload;  // Set the selected missile's details
    },
    clearChosenMissile: (state) => {
      state.chosenMissile = null;  // Clear the selection
    },
  },
});

export const { setChosenMissile, clearChosenMissile } = chosenMissileGameSlice.actions;
export default chosenMissileGameSlice.reducer;

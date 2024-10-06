// store/chosenMissileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    chosenMissile: null,    
}
const chosenMissileSlice = createSlice({
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

export const { setChosenMissile, clearChosenMissile } = chosenMissileSlice.actions;
export default chosenMissileSlice.reducer;

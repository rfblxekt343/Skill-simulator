import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isInterceptionMode: false,
  interceptedMissiles: [],
};

const interceptionSlice = createSlice({
  name: 'interception',
  initialState,
  reducers: {
    setInterceptionMode: (state, action) => {
      state.isInterceptionMode = action.payload;
    },
    addInterceptedMissile: (state, action) => {
      state.interceptedMissiles.push(action.payload);
    },
    resetAllInterception: (state) => {
      return initialState;
    }
  },
});

export const { 
  setInterceptionMode, 
  addInterceptedMissile,
  resetAllInterception 
} = interceptionSlice.actions;

export default interceptionSlice.reducer;
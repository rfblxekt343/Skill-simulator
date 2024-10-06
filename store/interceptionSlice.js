import { createSlice } from '@reduxjs/toolkit';

const interceptionSlice = createSlice({
  name: 'interception',
  initialState: {
    isInterceptionMode: false,
    interceptedMissiles: [],
  },
  reducers: {
    setInterceptionMode: (state, action) => {
      state.isInterceptionMode = action.payload;
    },
    addInterceptedMissile: (state, action) => {
      state.interceptedMissiles.push(action.payload);
    },
  },
});

export const { setInterceptionMode, addInterceptedMissile } = interceptionSlice.actions;
export default interceptionSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';

const interceptionGameSlice = createSlice({
  name: 'interceptionGame',
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

export const { setInterceptionMode, addInterceptedMissile } = interceptionGameSlice.actions;
export default interceptionGameSlice.reducer;
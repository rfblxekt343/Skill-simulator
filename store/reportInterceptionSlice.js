import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reportInterception: false,
};

const reportInterceptionSlice = createSlice({
  name: "reportInterception",
  initialState,
  reducers: {
    setReportInterception: (state, action) => {
      state.reportInterception = action.payload;
    },
  },
});

export const { setReportInterception } = reportInterceptionSlice.actions;
export default reportInterceptionSlice.reducer;

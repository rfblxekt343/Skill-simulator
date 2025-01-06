import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    howManyIntercepted: 0,
    activeMissilesCount : 0,
    isStarted: false
  };

const howManyInterceptedSlice = createSlice({
    name: 'howManyIntercepted',
    initialState,
    reducers: {
      InterceptedCity: (state) => {
        state.howManyIntercepted += 1;
      },
      IncreaseActive : (state) => {
        state.activeMissilesCount +=1;
      },
      DecreaseActive : (state) => {
        state.activeMissilesCount -=1;
      },
      SetIsStarted : (state, action) =>{
        state.isStarted = action.payload;
      },
      resetAllHowMany: (state) => {
        // This will reset all values to initial state
        return initialState;
      }
    },
  });
  
  export const { 
    InterceptedCity,
    IncreaseActive,
    DecreaseActive ,
    SetIsStarted,
    resetAllHowMany
  } = howManyInterceptedSlice.actions;
  export default howManyInterceptedSlice.reducer;
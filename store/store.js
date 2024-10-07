import { configureStore } from '@reduxjs/toolkit';
import missileStockReducer from './missileStockSlice';
import chosenMissileReducer from './chosenMissileSlice';
import interceptionReducer from './interceptionSlice';
import reportInterceptionReducer from './reportInterceptionSlice';

const store = configureStore({
  reducer: {
    missileStock: missileStockReducer,
    chosenMissile: chosenMissileReducer,
    interception: interceptionReducer,
    reportInterception: reportInterceptionReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
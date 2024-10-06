import { configureStore } from '@reduxjs/toolkit';
import missileStockReducer from './missileStockSlice';
import chosenMissileReducer from './chosenMissileSlice';
import interceptionReducer from './interceptionSlice';

const store = configureStore({
  reducer: {
    missileStock: missileStockReducer,
    chosenMissile: chosenMissileReducer,
    interception: interceptionReducer,
  },
});

export default store;
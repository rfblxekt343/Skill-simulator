import { configureStore } from '@reduxjs/toolkit';
import missileStockReducer from './missileStockSlice';
import chosenMissileReducer from './chosenMissileSlice';
import interceptionReducer from './interceptionSlice';
import reportInterceptionReducer from './reportInterceptionSlice';
import howManyInterceptedReducer from './howManyInterceptedSlice';
//
import missileStockGameReducer from './game/missileStockGameSlice';
import interceptionGameReducer from './game/interceptionGameSlice';

const store = configureStore({
  reducer: {
    missileStock: missileStockReducer,
    chosenMissile: chosenMissileReducer,
    interception: interceptionReducer,
    howManyIntercepted:howManyInterceptedReducer,
    reportInterception: reportInterceptionReducer,
    missileStockGame: missileStockGameReducer,
    interceptionGame: interceptionGameReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
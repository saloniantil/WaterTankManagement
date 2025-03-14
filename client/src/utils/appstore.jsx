import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../utils/Slices/userSlice';
import freeTrialReducer from '../utils/Slices/freeTrialSlice';
export const appStore = configureStore({
  reducer: {
    user: userReducer,
    freeTrial: freeTrialReducer
  },
});
import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../utils/Slices/userSlice';

export const appStore = configureStore({
    reducer: {
        user: userReducer,
  },
})
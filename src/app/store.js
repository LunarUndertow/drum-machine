import { configureStore } from '@reduxjs/toolkit';
import stepsReducer from '../features/steps/stepsSlice';

export const store = configureStore({
    reducer: {
        steps: stepsReducer,
    },
});

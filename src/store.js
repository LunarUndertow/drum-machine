import { configureStore } from 'reduxjs/toolkit';
import sequencerReducer from './Redux/sequencerSlice';

const store = configureStore({
    reducer: {
        sequencer: sequencerReducer,
    }
});

export default store;

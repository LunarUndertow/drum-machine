import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tempo: 120,
    stepValues: [[true, false, false, false, true, false, false, false, false, false, true, false, true, false, false, false],
                 [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                 [true, false, true, false, true, false, true, false, true, false, true, false, false, false, true, false],
                 [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false]
                ],
};

export const stepsSlice = createSlice({
    name: 'steps',
    initialState,
    reducers: {
        setStep: (state, action) => {
            const {track, id} = action.payload;
            state.stepValues[track][id] = !state.stepValues[track][id];
        },

        setTempo: (state, action) => {
            state.tempo = action.payload;
        }
    }
});

export const { setStep } = stepsSlice.actions;
export const { setTempo } = stepsSlice.actions;

export default stepsSlice.reducer;

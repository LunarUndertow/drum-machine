import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tempo: 120,
    stepValues: [[true, false, false, false, true, false, false, false, false, false, true, false, true, false, false, false],
                 [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                 [true, false, true, false, true, false, true, false, true, false, true, false, false, false, true, false],
                 [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false]
                ],
    playing: [false, false, false, false],
    isPlaying: false,
    currentNote: 0,
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
        },

        togglePlaying: (state, action) => {
            const {track} = action.payload;
            state.playing[track] = !state.playing[track];
        },

        toggleIsPlaying: (state) => {
            state.isPlaying = !state.isPlaying;
        },

        advance: (state) => {
            state.currentNote = (state.currentNote + 1) % 16;
        }
    }
});

export const { setStep, setTempo, togglePlaying, toggleIsPlaying, advance } = stepsSlice.actions;

export default stepsSlice.reducer;

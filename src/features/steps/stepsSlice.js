import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    tempo: 120,
    // an example four track drum pattern. steps set to true are played, steps set to false are not
    stepValues: [[true, false, false, false, true, false, false, false, false, false, true, false, true, false, false, false],
                 [false, false, false, false, true, false, false, false, false, false, false, false, true, false, false, false],
                 [true, false, true, false, true, false, true, false, true, false, true, false, false, false, true, false],
                 [false, false, false, false, false, false, false, false, false, false, false, false, true, false, false, false]
                ],
    // on/off status for individual tracks
    playing: [false, false, false, false],
    // playing status for the whole drum machine
    isPlaying: false,
    // current note. initially set to -1 because execute order is advance a note then play, so at the start it advances to the first index
    currentNote: -1,
};

export const stepsSlice = createSlice({
    name: 'steps',
    initialState,
    reducers: {
        // toggle individual step on/off by track index and step index
        setStep: (state, action) => {
            const {track, id} = action.payload;
            state.stepValues[track][id] = !state.stepValues[track][id];
        },
        // set tempo. limits are set in app component as slider attributes
        setTempo: (state, action) => {
            state.tempo = action.payload;
        },
        // toggle individual track on/off
        togglePlaying: (state, action) => {
            const {track} = action.payload;
            state.playing[track] = !state.playing[track];
        },
        // toggle playback on off
        toggleIsPlaying: state => {
            state.isPlaying = !state.isPlaying;
        },
        // advance to the next note
        advance: state => {
            state.currentNote = (state.currentNote + 1) % 16;
        }
    }
});

export const { setStep, setTempo, togglePlaying, toggleIsPlaying, advance } = stepsSlice.actions;

export default stepsSlice.reducer;

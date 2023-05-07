import { createSlice } from "@reduxjs/toolkit";

export const sequencerSlice = createSlice({
    name: 'sequencer',
    initialState: {
        tempo: 120,
        tracks: [
            {
                id: 1,
                name: 'kick',
                // sample
                steps: [true, false, false, false,
                        true, false, false, false,
                        false, false, true, false,
                        true, false, false, false]
            },
            {
                id: 2,
                name: 'snare',
                // sample
                steps: [false, false, false, false,
                        true, false, false, false,
                        false, false, false, false, 
                        true, false, false, false]
            }

        ]
    },
    reducers: {
        setTempo: (state, action) => {
            state.tempo = action.payload;
        },
        toggleStep: (state, action) => {
            const { trackId, stepIndex} = action.payload;
            state.tracks.find(track => track.id === trackId).steps[stepIndex] = !state.tracks.find(track => track.id === trackId).steps[stepIndex];
        }
    }
});

export const { setTempo, toggleStep } = sequencerSlice.actions;

export default sequencerSlice.reducer;

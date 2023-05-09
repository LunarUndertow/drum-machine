import { useRef } from 'react';
import './App.css';
import SampleSequencer from './Components/SampleSequencer';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useDispatch } from 'react-redux';
import { setTempo } from './features/steps/stepsSlice';

function App() {
    let isPlaying = false;
    const audioCtx = useRef(new AudioContext());
    const dispatch = useDispatch();

    const play = () => {
        isPlaying = !isPlaying;
        if (isPlaying) audioCtx.current.resume();
        else audioCtx.current.suspend();
    }


    const changeTempo = (event, newValue) => {
        dispatch(setTempo(newValue));
    }


    return (
        <div className="App">
            <header className="App-header">
                <button onClick={play} id="playButton">Play</button>
                <Box sx={{width: 300}} className="tempo">
                    <Slider 
                        aria-label="tempo" 
                        defaultValue={120}
                        min={40}
                        max={260}
                        valueLabelDisplay='auto'
                        onChange={changeTempo}
                    />
                    <span className="tempoLabel">
                        {'tempo'}
                    </span>
                </Box>
                <SampleSequencer audioCtx={audioCtx.current} track={0} src={'./kick.mp3'} name={"kick"} />
                <SampleSequencer audioCtx={audioCtx.current} track={1} src={'./snare.mp3'} name={"snare"} />
                <SampleSequencer audioCtx={audioCtx.current} track={2} src={'./ch.mp3'} name={"closed hat"} />
                <SampleSequencer audioCtx={audioCtx.current} track={3} src={'./oh.mp3'} name={"open hat"} />
            </header>
        </div>
    );
}

export default App;
